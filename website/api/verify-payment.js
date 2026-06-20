import Stripe from "stripe";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function getStripeId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;

  return value.id || null;
}

async function finalizePaidOrder({ order, session }) {
  const now = new Date().toISOString();

  const { data: cartItems, error: itemError } = await supabaseAdmin
    .from("enrollment_cart_items")
    .select(
      "id, cart_id, person_id, program_id, locked, programs (academic_year)",
    )
    .eq("cart_id", order.cart_id)
    .eq("person_id", order.person_id);

  if (itemError) throw itemError;

  if (!cartItems?.length) {
    throw new Error("No purchased cart items found");
  }

  const programIds = [...new Set(cartItems.map((item) => item.program_id))];

  if (programIds.length !== cartItems.length) {
    throw new Error("Cart contains duplicate programs");
  }

  // if (programIds.length > 3) {
  //   throw new Error("Cart exceeds maximum program limit");
  // }

  const { data: existingEnrollments, error: existingError } =
    await supabaseAdmin
      .from("enrollments")
      .select("program_id, programs (academic_year, category)")
      .eq("student_id", order.person_id);

  if (existingError) throw existingError;

  const existingProgramIds = new Set(
    (existingEnrollments || []).map((enrollment) => enrollment.program_id),
  );

  const enrollmentRows = cartItems
    .filter((item) => !existingProgramIds.has(item.program_id))
    .map((item) => ({
      student_id: order.person_id,
      program_id: item.program_id,
      order_id: order.id,
      enrollment_status: "active",
      enrolled_at: now,
    }));

  const cartAcademicYear = cartItems[0]?.programs?.academic_year;
  // const existingThisYear = (existingEnrollments || []).filter(
  //   (enrollment) =>
  //     enrollment.programs?.academic_year === cartAcademicYear &&
  //     !programIds.includes(enrollment.program_id),
  // );

  const vocationalProgramIds = new Set(
    cartItems
      .filter((item) => item.programs?.category?.toLowerCase() === "vocational")
      .map((item) => item.program_id),
  );

  const existingVocationalThisYear = (existingEnrollments || []).filter(
    (enrollment) =>
      enrollment.programs?.academic_year === cartAcademicYear &&
      enrollment.programs?.category?.toLowerCase() === "vocational" &&
      !vocationalProgramIds.has(enrollment.program_id),
  );

  const newVocationalCount = cartItems.filter(
    (item) => item.programs?.category?.toLowerCase() === "vocational",
  ).length;

  if (existingVocationalThisYear.length + newVocationalCount > 3) {
    throw new Error("Maximum 3 vocational programs allowed per year");
  }

  if (enrollmentRows.length > 0) {
    const { error: enrollmentError } = await supabaseAdmin
      .from("enrollments")
      .insert(enrollmentRows);

    if (enrollmentError && enrollmentError.code !== "23505") {
      throw enrollmentError;
    }
  }

  const paymentIntentId = getStripeId(session.payment_intent);
  const customerId = getStripeId(session.customer);

  const { error: itemLockError } = await supabaseAdmin
    .from("enrollment_cart_items")
    .update({
      locked: true,
    })
    .eq("cart_id", order.cart_id);

  if (itemLockError) throw itemLockError;

  const { error: cartError } = await supabaseAdmin
    .from("enrollment_carts")
    .update({
      status: "completed",
      payment_status: "paid",
      stripe_session_id: session.id,
      order_id: order.id,
      finalized_at: now,
      updated_at: now,
    })
    .eq("id", order.cart_id);

  if (cartError) throw cartError;

  const { error: orderError } = await supabaseAdmin
    .from("enrollment_orders")
    .update({
      status: "completed",
      payment_status: "paid",
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId,
      stripe_customer_id: customerId,
      transaction_id: paymentIntentId,
      payment_method: "stripe",
      paid_at: order.paid_at || now,
      updated_at: now,
    })
    .eq("id", order.id);

  if (orderError) throw orderError;

  return {
    created_enrollments: enrollmentRows.length,
  };
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        error: "Stripe is not configured",
      });
    }

    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({
        error: "Missing session_id",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent", "customer"],
    });

    if (!session) {
      return res.status(404).json({
        error: "Stripe session not found",
      });
    }

    const paid = session.payment_status === "paid";
    const orderId = session.metadata?.order_id;
    const personId = session.metadata?.person_id;
    const cartId = session.metadata?.cart_id;

    if (!orderId || !personId || !cartId) {
      return res.status(400).json({
        error: "Stripe session is missing enrollment metadata",
      });
    }

    const { data: order, error: orderLoadError } = await supabaseAdmin
      .from("enrollment_orders")
      .select("*")
      .eq("id", orderId)
      .eq("person_id", personId)
      .eq("cart_id", cartId)
      .maybeSingle();

    if (orderLoadError) throw orderLoadError;

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    if (order.stripe_session_id && order.stripe_session_id !== session.id) {
      return res.status(409).json({
        error: "Stripe session does not match this order",
      });
    }

    if (!paid) {
      return res.status(200).json({
        paid: false,
        payment_status: session.payment_status,
        session_id: session.id,
        order_id: order.id,
        person_id: order.person_id,
        cart_id: order.cart_id,
      });
    }

    let orderForFinalization = order;
    let alreadyProcessed = order.payment_status === "paid";

    let claimedThisRequest = false;

    if (!alreadyProcessed) {
      const { data: claimedOrder, error: claimError } = await supabaseAdmin
        .from("enrollment_orders")
        .update({
          status: "processing",
          stripe_session_id: session.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)
        .eq("payment_status", "unpaid")
        .select()
        .maybeSingle();

      if (claimError) throw claimError;

      if (claimedOrder) {
        orderForFinalization = claimedOrder;
        claimedThisRequest = true;
      } else {
        const { data: refreshedOrder, error: refreshError } =
          await supabaseAdmin
            .from("enrollment_orders")
            .select("*")
            .eq("id", order.id)
            .single();

        if (refreshError) throw refreshError;

        orderForFinalization = refreshedOrder;
        alreadyProcessed = refreshedOrder.payment_status === "paid";
      }
    }

    if (!alreadyProcessed && !claimedThisRequest) {
      return res.status(409).json({
        error: "Order is currently being processed",
        paid: true,
        payment_status: session.payment_status,
        session_id: session.id,
        order_id: order.id,
        person_id: order.person_id,
        cart_id: order.cart_id,
      });
    }

    const finalization = await finalizePaidOrder({
      order: orderForFinalization,
      session,
    });

    return res.status(200).json({
      paid: true,
      already_processed: alreadyProcessed,
      payment_status: "paid",
      session_id: session.id,
      order_id: order.id,
      person_id: order.person_id,
      cart_id: order.cart_id,
      created_enrollments: finalization.created_enrollments,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}

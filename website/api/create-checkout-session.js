import Stripe from "stripe";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const DEFAULT_REGISTRATION_FEE = 50;

// function calculateSubtotal(count) {
//   if (count === 1) return 250;
//   if (count === 2) return 450;
//   if (count >= 3) return 600;

//   return 0;
// }

function calculateSubtotal(cartItems, cycle) {
  if (!cycle) return 0;

  const vocationalPrograms = cartItems.filter(
    (item) => item.programs?.category?.toLowerCase() === "vocational",
  );

  let total = 0;

  const vocationalCount = vocationalPrograms.length;

  if (vocationalCount === 1) {
    total += Number(cycle.vocational_1_price || 0);
  } else if (vocationalCount === 2) {
    total += Number(cycle.vocational_2_price || 0);
  } else if (vocationalCount >= 3) {
    total += Number(cycle.vocational_3_price || 0);
  }

  cartItems.forEach((item) => {
    const category = item.programs?.category?.toLowerCase();

    if (category === "employment_services") {
      total += Number(cycle.employment_services_price || 0);
    }

    if (category === "person_centered_services") {
      total += Number(cycle.person_centered_services_price || 0);
    }

    if (
      category === "academic_counseling" ||
      category === "vocational_counseling"
    ) {
      total += Number(cycle.counseling_intake_price || 0);
    }
  });

  return total;
}

function normalizeBaseUrl(value) {
  if (!value) return null;

  const normalized = String(value).trim().replace(/\/+$/, "");
  const withProtocol = /^https?:\/\//i.test(normalized)
    ? normalized
    : `https://${normalized}`;

  try {
    const url = new URL(withProtocol);

    if (url.hostname === "vercel.com") {
      return null;
    }

    return url.origin;
  } catch {
    return null;
  }
}

function getBaseUrl(req) {
  const configuredUrl = normalizeBaseUrl(process.env.PUBLIC_APP_URL);

  if (configuredUrl) return configuredUrl;

  const requestOrigin = normalizeBaseUrl(req.headers.origin);

  if (requestOrigin) return requestOrigin;

  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers.host;
  const requestHost = normalizeBaseUrl(host ? `${proto}://${host}` : null);

  if (requestHost) return requestHost;

  const vercelUrl = normalizeBaseUrl(process.env.VERCEL_URL);

  return vercelUrl || "http://localhost:5173";
}

function getRegistrationFee(cycle) {
  const configuredFee = Number(cycle?.registration_fee);

  if (Number.isFinite(configuredFee) && configuredFee >= 0) {
    return configuredFee;
  }

  return DEFAULT_REGISTRATION_FEE;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
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

    const { orderId, personId, cartId } = req.body || {};

    if (!orderId || !personId || !cartId) {
      return res.status(400).json({
        error: "Missing required checkout identifiers",
      });
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("enrollment_orders")
      .select("*")
      .eq("id", orderId)
      .eq("person_id", personId)
      .eq("cart_id", cartId)
      .maybeSingle();

    if (orderError) {
      console.error(orderError);
      return res.status(500).json({
        error: "Could not load order",
      });
    }

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    if (order.payment_status === "paid") {
      return res.status(409).json({
        error: "Order is already paid",
      });
    }

    const { data: cartRecord, error: cartError } = await supabaseAdmin
      .from("enrollment_carts")
      .select("id, person_id, registration_setting_id, status, payment_status")
      .eq("id", cartId)
      .eq("person_id", personId)
      .maybeSingle();

    if (cartError) {
      console.error(cartError);
      return res.status(500).json({
        error: "Could not load cart",
      });
    }

    if (!cartRecord) {
      return res.status(404).json({
        error: "Cart not found",
      });
    }

    if (cartRecord.status !== "draft") {
      return res.status(409).json({
        error: "Cart is no longer editable",
      });
    }

    const { data: cartItems, error: itemError } = await supabaseAdmin
      .from("enrollment_cart_items")
      .select(
        "id, program_id, locked, programs (course_title, academic_year, category)",
      )
      .eq("cart_id", cartId)
      .eq("person_id", personId);

    if (itemError) {
      console.error(itemError);
      return res.status(500).json({
        error: "Could not load cart items",
      });
    }

    const vocationalCartItems = cartItems.filter(
      (item) => item.programs?.category?.toLowerCase() === "vocational",
    );

    if (!cartItems?.length) {
      return res.status(400).json({
        error: "Your cart is empty",
      });
    }

    if (cartItems.some((item) => item.locked)) {
      return res.status(409).json({
        error: "Cart contains locked items",
      });
    }

    const programIds = [...new Set(cartItems.map((item) => item.program_id))];

    if (programIds.length !== cartItems.length) {
      return res.status(409).json({
        error: "Cart contains duplicate programs",
      });
    }

    const { data: existingEnrollments, error: enrollmentError } =
      await supabaseAdmin
        .from("enrollments")
        .select("program_id, programs (academic_year, category)")
        .eq("student_id", personId);

    if (enrollmentError) {
      console.error(enrollmentError);
      return res.status(500).json({
        error: "Could not validate existing enrollments",
      });
    }

    const existingProgramIds = new Set(
      (existingEnrollments || []).map((enrollment) => enrollment.program_id),
    );

    if (programIds.some((programId) => existingProgramIds.has(programId))) {
      return res.status(409).json({
        error: "You are already enrolled in one or more selected programs",
      });
    }

    const cartAcademicYear = cartItems[0]?.programs?.academic_year;
    const existingThisYear = (existingEnrollments || []).filter(
      (enrollment) =>
        enrollment.programs?.academic_year &&
        enrollment.programs.academic_year === cartAcademicYear,
    );

    // if (existingThisYear.length + cartItems.length > 3) {
    //   return res.status(400).json({
    //     error: "You can only register for a maximum of 3 classes per year",
    //   });
    // }

    const existingVocationalThisYear = existingThisYear.filter(
      (enrollment) =>
        enrollment.programs?.category?.toLowerCase() === "vocational",
    );

    if (existingVocationalThisYear.length + vocationalCartItems.length > 3) {
      return res.status(400).json({
        error:
          "You can only register for a maximum of 3 vocational programs per year",
      });
    }

    const { data: registrationCycle, error: cycleError } = await supabaseAdmin
      .from("registration_settings")
      .select("*")
      .eq("id", cartRecord.registration_setting_id)
      .maybeSingle();

    if (cycleError) {
      console.error(cycleError);
      return res.status(500).json({
        error: "Could not load registration fee",
      });
    }

    const configuredRegistrationFee = getRegistrationFee(registrationCycle);
    // const { data: paidFeeOrders, error: paidFeeError } = await supabaseAdmin
    //   .from("enrollment_orders")
    //   .select("id")
    //   .eq("person_id", personId)
    //   .eq("registration_setting_id", cartRecord.registration_setting_id)
    //   .eq("payment_status", "paid")
    //   .eq("status", "completed")
    //   .gt("registration_fee", 0)
    //   .limit(1);
    const { data: coveredFeeOrders, error: coveredFeeError } =
      await supabaseAdmin
        .from("enrollment_orders")
        .select("id")
        .eq("person_id", personId)
        .eq("registration_setting_id", cartRecord.registration_setting_id)
        .gt("registration_fee", 0)
        .or(
          "and(payment_status.eq.paid,status.eq.completed),payment_status.eq.override",
        )
        .limit(1);

    // if (paidFeeError) {
    //   console.error(paidFeeError);
    //   return res.status(500).json({
    //     error: "Could not validate registration fee",
    //   });
    // }
    if (coveredFeeError) {
      console.error(coveredFeeError);
      return res.status(500).json({
        error: "Could not validate registration fee",
      });
    }

    // const registrationFee = paidFeeOrders?.length
    //   ? 0
    //   : configuredRegistrationFee;
    const registrationFee = coveredFeeOrders?.length
      ? 0
      : configuredRegistrationFee;
    // const subtotal = calculateSubtotal(cartItems.length);
    // const total = subtotal + registrationFee;
    const subtotal = calculateSubtotal(cartItems, registrationCycle);

    const total = subtotal + registrationFee;

    console.log("STRIPE SUBTOTAL", subtotal);
    console.log("STRIPE REGISTRATION", registrationFee);
    console.log("STRIPE TOTAL", total);

    if (total <= 0) {
      return res.status(400).json({
        error: "There is no payment due for this checkout",
      });
    }

    const orderTotalMatches =
      Number(order.subtotal) === subtotal &&
      Number(order.registration_fee) === registrationFee &&
      Number(order.total_amount) === total;

    const { error: syncOrderError } = await supabaseAdmin
      .from("enrollment_orders")
      .update({
        subtotal,
        registration_fee: registrationFee,
        total_amount: total,
        registration_setting_id:
          order.registration_setting_id || cartRecord.registration_setting_id,
        status: "pending",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)
      .eq("payment_status", "unpaid");

    if (syncOrderError) {
      console.error(syncOrderError);
      return res.status(500).json({
        error: "Could not prepare order",
      });
    }

    if (order.stripe_session_id && orderTotalMatches) {
      const existingSession = await stripe.checkout.sessions.retrieve(
        order.stripe_session_id,
      );

      if (
        existingSession?.url &&
        ["open", "complete"].includes(existingSession.status)
      ) {
        return res.status(200).json({
          url: existingSession.url,
          session_id: existingSession.id,
          order_id: order.id,
        });
      }
    }

    const baseUrl = getBaseUrl(req);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      client_reference_id: order.id,
      metadata: {
        order_id: order.id,
        person_id: personId,
        cart_id: cartId,
        registration_setting_id: cartRecord.registration_setting_id || "",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Inclusive World Enrollment",
              metadata: {
                order_id: order.id,
                cart_id: cartId,
              },
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/one-portal/member/enrollment?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/one-portal/member/enrollment?canceled=true&order_id=${order.id}`,
    });

    const { error: updateError } = await supabaseAdmin
      .from("enrollment_orders")
      .update({
        stripe_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)
      .eq("payment_status", "unpaid");

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({
        error: "Could not save Stripe session",
      });
    }

    const { error: cartUpdateError } = await supabaseAdmin
      .from("enrollment_carts")
      .update({
        stripe_session_id: session.id,
        order_id: order.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cartId);

    if (cartUpdateError) {
      console.error(cartUpdateError);
      return res.status(500).json({
        error: "Could not update cart checkout state",
      });
    }

    return res.status(200).json({
      url: session.url,
      session_id: session.id,
      order_id: order.id,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}

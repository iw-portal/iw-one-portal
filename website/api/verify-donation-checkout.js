import Stripe from "stripe";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { sessionId } = req.body || {};

    if (!sessionId) {
      return res.status(400).json({ error: "Missing session ID" });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({ error: "Payment not completed" });
    }

    const donationOrderId = session.metadata?.donation_order_id;

    if (!donationOrderId) {
      return res.status(400).json({ error: "Missing donation order ID" });
    }

    const { data: donationOrder, error: fetchError } = await supabaseAdmin
      .from("donation_orders")
      .select("*")
      .eq("id", donationOrderId)
      .single();

    if (fetchError || !donationOrder) {
      return res.status(404).json({ error: "Donation order not found" });
    }

    if (donationOrder.payment_status === "paid") {
      return res.status(200).json({
        success: true,
        alreadyVerified: true,
        donorName: donationOrder.donor_name,
        donorEmail: donationOrder.donor_email,
        amount: donationOrder.amount,
      });
    }

    const { error: updateError } = await supabaseAdmin
      .from("donation_orders")
      .update({
        payment_status: "paid",
        status: "completed",
        stripe_payment_intent_id: session.payment_intent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", donationOrder.id);

    if (updateError) {
      return res.status(500).json({ error: "Could not update donation order" });
    }

    return res.status(200).json({
      success: true,
      alreadyVerified: false,
      donorName: donationOrder.donor_name,
      donorEmail: donationOrder.donor_email,
      amount: donationOrder.amount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

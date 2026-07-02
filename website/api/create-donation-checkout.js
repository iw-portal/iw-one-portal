import Stripe from "stripe";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

    const { amount, donorName, donorEmail } = req.body || {};

    const donationAmount = Number(amount);

    if (!donationAmount || donationAmount < 1) {
      return res.status(400).json({
        error: "Please enter a valid donation amount",
      });
    }

    const cleanDonorName = String(donorName || "").trim();
    const cleanDonorEmail = String(donorEmail || "")
      .trim()
      .toLowerCase();

    if (!cleanDonorName) {
      return res.status(400).json({ error: "Please enter your name" });
    }

    if (
      !cleanDonorEmail ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanDonorEmail)
    ) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address" });
    }

    const total = donationAmount;

    if (total <= 0) {
      return res.status(400).json({
        error: "There is no payment due for this checkout",
      });
    }

    const baseUrl = getBaseUrl(req);

    const { data: donationOrder, error: donationError } = await supabaseAdmin
      .from("donation_orders")
      .insert({
        amount: donationAmount,
        currency: "usd",
        donor_name: cleanDonorName,
        donor_email: cleanDonorEmail,
        payment_status: "unpaid",
        status: "pending",
      })
      .select("*")
      .single();

    if (donationError) {
      console.error(donationError);
      return res.status(500).json({
        error: "Could not create donation order",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      client_reference_id: donationOrder.id,
      customer_email: cleanDonorEmail,

      metadata: {
        donation_order_id: donationOrder.id,
        type: "donation",
        donor_name: cleanDonorName,
        donor_email: cleanDonorEmail,
      },

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Inclusive World Donation",
            },
            unit_amount: Math.round(donationAmount * 100),
          },
          quantity: 1,
        },
      ],

      success_url: `${baseUrl}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/donate/payment?canceled=true&donation_id=${donationOrder.id}`,
    });

    const { error: updateError } = await supabaseAdmin
      .from("donation_orders")
      .update({
        stripe_session_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", donationOrder.id);

    if (updateError) {
      console.error(updateError);
      return res.status(500).json({
        error: "Could not save Stripe session",
      });
    }

    return res.status(200).json({
      url: session.url,
      session_id: session.id,
      donation_order_id: donationOrder.id,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}

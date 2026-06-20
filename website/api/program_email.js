import { supabaseAdmin } from "../lib/supabaseAdmin.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    const { recipients, subject, htmlContent, senderName, receiverName } =
      req.body;

    if (!recipients?.length || !subject || !htmlContent) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        "api-key": BREVO_API_KEY,
      },

      body: JSON.stringify({
        sender: {
          name: senderName || "Inclusive World",

          email: "noreply@inclusiveworld.org",
        },

        to: [
          {
            email: "noreply@inclusiveworld.org",
            name: receiverName,
          },
        ],

        bcc: recipients,

        subject,

        htmlContent,
      }),
    });

    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = { message: text };
    }

    if (!response.ok) {
      return res.status(500).json(result);
    }

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}

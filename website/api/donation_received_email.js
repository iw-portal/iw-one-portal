// /api/program_emai.js
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

export default async function handler(req, res) {
  // =====================================================
  // CORS
  // =====================================================

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
    const API_BASE_URL = process.env.PUBLIC_APP_URL;

    const { email, donorName, amount } = req.body;

    if (!email || !donorName || !amount) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // =====================================================
    // SUBJECT
    // =====================================================

    const subject = "Thank You for Your Donation to Inclusive World";
    // =====================================================
    // HTML CONTENT
    // =====================================================

    const htmlContent = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f8f7">
  <tr>
    <td align="center" style="padding:40px 16px;">

  <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius:24px; overflow:hidden; border:1px solid #e4ece9; font-family:Arial,Helvetica,sans-serif;">

    <!-- HERO -->
<!-- HERO -->
<tr>
  <td bgcolor="#0c4f49" align="center" style="padding:50px 36px;">

    <img
      src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1779491649/Screenshot_2026-05-22_at_4.12.36_PM_qp5x6k-removebg-preview_nefqzi.png"
      width="72"
      style="display:block; margin-bottom:24px;"
    />

    <div style="color:#d7efeb; font-size:12px; font-weight:bold; letter-spacing:1.6px; margin-bottom:18px;">
      DONATION RECEIVED
    </div>

    <div style="color:#ffffff; font-size:36px; line-height:44px; font-weight:bold;">
      Thank You For<br />
      Your Generosity
    </div>

    <!--<div style="color:#d7efeb; font-size:16px; line-height:28px; margin-top:22px; max-width:470px;">-->
    <!--  Your Inclusive World One Portal account has been successfully created and is now ready to use. Sign in anytime using the username provided below to access your account, stay connected with Inclusive World, and receive important updates from our community.-->
    <!--</div>-->

  </td>
</tr>

<!-- BODY -->
<tr>
  <td style="padding:42px 36px;">

    <div style="color:#33423f; font-size:18px; line-height:30px; margin-bottom:24px;">
      Hello <strong style="color:#0c4f49;">${donorName}</strong>,
    </div>

    <div style="color:#5d6c69; font-size:16px; line-height:30px;">
      Thank you for your generous contribution to Inclusive World.

<br /><br />

We are deeply grateful for your support and commitment to our mission of empowering differently abled individuals to build meaningful, independent, and fulfilling lives.

<br /><br />

Your donation helps us continue developing inclusive programs, expanding opportunities, and creating a community where every individual can thrive. Every contribution, regardless of size, makes a meaningful difference and directly supports the people and families we serve.
    </div>

    <!-- USERNAME BOX -->
    <table
      role="presentation"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      bgcolor="#eef7f5"
      style="
        margin-top:34px;
        border-radius:18px;
        border:1px solid #d9ebe7;
      "
    >
      <tr>
        <td style="padding:28px;">

          <div
            style="
              color:#0c4f49;
              font-size:20px;
              font-weight:bold;
              margin-bottom:12px;
            "
          >
            Donation Summary
          </div>

          <div
            style="
              color:#61706d;
              font-size:15px;
              line-height:28px;
              margin-bottom:16px;
            "
          >
            Below is a summary of your donation. Please keep this email for your records.
          </div>

          <div
            style="
              background:#ffffff;
              border:1px solid #dbe7e4;
              border-radius:12px;
              padding:16px;
              text-align:center;
              font-size:24px;
              font-weight:bold;
              color:#0c4f49;
              letter-spacing:1px;
            "
          >
            <div style="font-size:24px;font-weight:bold;color:#0c4f49;">
  $${amount}
</div>

<div style="margin-top:8px;color:#7b8885;font-size:14px;">
  Donation Amount
</div>
          </div>

          <div
            style="
              margin-top:16px;
              color:#7b8885;
              font-size:13px;
              line-height:24px;
            "
          >
            This email serves as confirmation that your donation has been successfully received. If you have any questions regarding your contribution, please contact us at <a style="
                color:#0c4f49;
                line-height:22px;
                font-family:Arial, Helvetica, sans-serif;
              " href="mailto:donate@inclusiveworld.org">donate@inclusiveworld.org</a>.
          </div>

        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:38px;">
      <tr>
        <td align="center">

          <a
            href="https://inclusiveworld.org"
            style="
              display:inline-block;
              background:#0c4f49;
              color:#ffffff;
              text-decoration:none;
              padding:16px 32px;
              border-radius:12px;
              font-size:15px;
              font-weight:bold;
            "
          >
            Visit Inclusive World
          </a>

        </td>
      </tr>
    </table>

    <div style="margin-top:42px; color:#667572; font-size:15px; line-height:28px;">


      <!--Thank you for being part of the Inclusive World community.-->
    </div>

        <!-- SIGNATURE -->
<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  bgcolor="#f7fbfa"
  style="
    margin-top:12px;
    background:#f7fbfa;
    border-radius:24px;
    border:1px solid #e7efed;
  "
>
  <tr>
    <td style="padding:38px;">

      <div
        style="
          color:#556663;
          font-size:15px;
          line-height:30px;
          margin-bottom:18px;
          font-family:Arial, Helvetica, sans-serif;
        "
      >
       Thank you once again for supporting Inclusive World.

Your kindness and generosity help create opportunities, foster inclusion, and positively impact the lives of countless individuals and families.


      </div>

      <div
        style="
          color:#556663;
          font-size:15px;
          line-height:30px;
          font-family:Arial, Helvetica, sans-serif;
        "
      >
        We truly appreciate your support.
      </div>

      <!-- BRAND -->
      <table
        role="presentation"
        cellpadding="0"
        cellspacing="0"
        border="0"
        style="margin-top:34px;"
      >
        <tr>

          <!-- LOGO -->
          <td valign="middle" style="padding-right:16px;">

            <img
              src="https://res.cloudinary.com/dme3y0xo7/image/upload/v1779591371/inclusiveworld_logo_zkanmt.png"
              width="38"
              style="
                display:block;
                border:0;
              "
            />

          </td>

          <!-- TEXT -->
          <td valign="middle">

            <div
              style="
                color:#0c4f49;
                font-weight:bold;
                font-size:16px;
                line-height:22px;
                font-family:Arial, Helvetica, sans-serif;
              "
            >
              Inclusive World
            </div>

            <div
              style="
                color:#8a9895;
                font-size:12px;
                line-height:20px;
                margin-top:4px;
                font-family:cursive;
              "
            >
              Where Abilities Lead the Way
            </div>

          </td>

        </tr>
      </table>

    </td>
    <!-- FOOTER -->
<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    margin-top:36px;
    font-family:Arial, Helvetica, sans-serif;
  "
>
  <tr>
    <td align="center" style="padding:0 20px;">

      <div
        style="
          color:#9aa7a4;
          font-size:12px;
          line-height:24px;
          letter-spacing:0.25px;
          margin-top:10px
        "
      >
        This is an automated donation confirmation from Inclusive World.<br />
        For questions about your donation, please contact <a style="
                color:#0c4f49;
                line-height:22px;
                font-family:Arial, Helvetica, sans-serif;
              " href="mailto:donate@inclusiveworld.org">donate@inclusiveworld.org</a>.
      </div>

    </td>
  </tr>
</table>
  </tr>
</table>

      </td>
    </tr>

  </table>

</td>

  </tr>
</table>
    `;

    // =====================================================
    // SEND EMAIL
    // =====================================================

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },

      body: JSON.stringify({
        sender: {
          name: "Inclusive World",
          email: "noreply@inclusiveworld.org",
        },

        to: [
          {
            email,
            name: donorName,
          },
        ],

        subject,

        htmlContent,
      }),
    });

    // const data = await response.json();

    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      result = { message: text };
    }

    if (!response.ok) {
      return res.status(500).json({
        error: result,
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message,
    });
  }
}

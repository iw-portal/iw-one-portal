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
    const API_BASE_URL = import.meta.env.VITE_PUBLIC_APP_URL;

    const { email, fname, lname, username } = req.body;

    if (!email || !fname || !lname || !username) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // =====================================================
    // SUBJECT
    // =====================================================

    const subject = "Your Inclusive World One Portal Account Is Ready";
    // =====================================================
    // HTML CONTENT
    // =====================================================

    const htmlContent = `
    <!-- ===================================================== -->

<!-- MEMBER APPROVED EMAIL -->

<!-- ===================================================== -->

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
      ACCOUNT CREATED SUCCESSFULLY
    </div>

    <div style="color:#ffffff; font-size:36px; line-height:44px; font-weight:bold;">
      Your One Portal<br />
      Account Is Ready
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
      Hello <strong style="color:#0c4f49;">${fname} ${lname}</strong>,
    </div>

    <div style="color:#5d6c69; font-size:16px; line-height:30px;">
      Welcome to Inclusive World.

      <br /><br />

      Your One Portal account has been successfully created and activated. You can now sign in and begin using the portal to access your profile, stay informed about Inclusive World activities, view updates related to your participation, and receive important announcements from our team.

      <br /><br />

      The username below will be used whenever you sign in to your account. We recommend saving it somewhere safe for future reference.
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
            Your Portal Username
          </div>

          <div
            style="
              color:#61706d;
              font-size:15px;
              line-height:28px;
              margin-bottom:16px;
            "
          >
            Please use the username below whenever you sign in to the Inclusive World One Portal. This username is unique to your account and will be required each time you access the portal.
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
            ${username}
          </div>

          <div
            style="
              margin-top:16px;
              color:#7b8885;
              font-size:13px;
              line-height:24px;
            "
          >
            For security reasons, your password is not included in this email. If you ever forget your password, you can use the password reset option available on the sign-in page.
          </div>

        </td>
      </tr>
    </table>

    <!-- CTA -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:38px;">
      <tr>
        <td align="center">

          <a
            href="${API_BASE_URL}/one-portal/login"
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
            Access Your One Portal Account
          </a>

        </td>
      </tr>
    </table>

    <div style="margin-top:42px; color:#667572; font-size:15px; line-height:28px;">
      Your account is now active and ready to use. We look forward to supporting your journey with Inclusive World and helping you make the most of the opportunities available through the One Portal.

      <br /><br />

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
        Thank you for becoming part of Inclusive World.
        We look forward to growing and creating meaningful impact together.
      </div>

      <div
        style="
          color:#556663;
          font-size:15px;
          line-height:30px;
          font-family:Arial, Helvetica, sans-serif;
        "
      >
        We are excited to have you as part of our community.
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
                font-family:Arial, Helvetica, sans-serif;
              "
            >
              Enabling Opportunities for the Differently Abled
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
        "
      >
        This is an automated email from Inclusive World.<br />
        Please do not reply directly to this message.
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
            name: `${fname} ${lname}`,
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
        error: data,
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

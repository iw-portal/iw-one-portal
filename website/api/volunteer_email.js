// /api/email/volunteer_email.js
import { randomBytes } from "crypto";
import { supabaseAdmin } from "../lib/supabaseAdmin.js";

export default async function handler(req, res) {
  try {
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

      // const { email, fname, lname, decision, application_id } = req.body;
      const {
        email,
        fname,
        lname,
        decision,
        application_id,
        rejection_reason,
      } = req.body;

      const approved = decision === "approved";

      if (!approved && !rejection_reason?.trim()) {
        return res.status(400).json({
          error: "Missing rejection reason",
        });
      }

      if (!email || !fname || !decision) {
        return res.status(400).json({
          error: "Missing required fields",
        });
      }

      if (approved && !application_id) {
        return res.status(400).json({
          error: "Missing application ID",
        });
      }

      // =====================================================
      // TOKENIZED INVITE LINK
      // =====================================================

      let portalSignupLink = "";
      const API_BASE_URL = process.env.PUBLIC_APP_URL;

      if (approved) {
        // =========================================
        // Generate Secure Token
        // =========================================

        // const token = randomBytes(32).toString("hex");

        // // =========================================
        // // Invalidate Old Invites
        // // =========================================

        // await supabaseAdmin
        //   .from("signup_invites")
        //   .update({ used: true })
        //   .eq("email", email)
        //   .eq("used", false);

        // // =========================================
        // // Create Invite
        // // =========================================

        // const { error: inviteError } = await supabaseAdmin
        //   .from("signup_invites")
        //   .insert([
        //     {
        //       email,
        //       role: "volunteer",
        //       token,
        //       application_id,
        //       used: false,
        //       expires_at: new Date(
        //         Date.now() + 7 * 24 * 60 * 60 * 1000,
        //       ).toISOString(),
        //     },
        //   ]);

        // if (inviteError) {
        //   console.error("INVITE ERROR:", inviteError);

        //   return res.status(500).json({
        //     error: "Failed to create invite",
        //   });
        // }

        // // =========================================
        // // Final Signup URL
        // // =========================================

        // =========================================
        // Check Existing Active Invite
        // =========================================

        const { data: existingInvite } = await supabaseAdmin
          .from("signup_invites")
          .select("token")
          .eq("email", email)
          .eq("role", "volunteer")
          .eq("used", false)
          .gt("expires_at", new Date().toISOString())
          .maybeSingle();

        // =========================================
        // Reuse Existing Invite
        // =========================================

        if (existingInvite) {
          portalSignupLink = `${API_BASE_URL}/one-portal/signup?invite=${existingInvite.token}`;
        } else {
          // =========================================
          // Generate Secure Token
          // =========================================

          const token = randomBytes(32).toString("hex");

          // =========================================
          // Create Invite
          // =========================================

          const { error: inviteError } = await supabaseAdmin
            .from("signup_invites")
            .insert([
              {
                email,
                role: "volunteer",
                token,
                application_id,
                used: false,

                expires_at: new Date(
                  Date.now() + 7 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
            ]);

          if (inviteError) {
            console.error("INVITE ERROR:", inviteError);

            return res.status(500).json({
              error: "Failed to create invite",
            });
          }

          // =========================================
          // Final Signup URL
          // =========================================

          portalSignupLink = `${API_BASE_URL}/one-portal/signup?invite=${token}`;
        }
      }

      // =====================================================
      // SUBJECT
      // =====================================================

      const subject = approved
        ? `Inclusive World Volunteer Application Approved`
        : `Inclusive World Volunteer Application Update`;

      // =====================================================
      // HTML CONTENT
      // =====================================================

      const htmlContent = approved
        ? `
<!-- ===================================================== -->
<!-- VOLUNTEER APPROVED EMAIL -->
<!-- ===================================================== -->

<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  bgcolor="#f4f8f7"
>
  <tr>
    <td align="center" style="padding:40px 16px;">

      <!-- MAIN CONTAINER -->
      <table
        role="presentation"
        width="620"
        cellpadding="0"
        cellspacing="0"
        border="0"
        bgcolor="#ffffff"
        style="
          border-radius:24px;
          overflow:hidden;
          border:1px solid #e4ece9;
          font-family:Arial,Helvetica,sans-serif;
        "
      >

        <!-- HERO -->
        <tr>
          <td
            bgcolor="#0c4f49"
            align="center"
            style="padding:50px 36px;"
          >

            <img
              src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1779491649/Screenshot_2026-05-22_at_4.12.36_PM_qp5x6k-removebg-preview_nefqzi.png"
              width="72"
              style="
                display:block;
                margin-bottom:24px;
              "
            />

            <div
              style="
                color:#d7efeb;
                font-size:12px;
                font-weight:bold;
                letter-spacing:1.6px;
                margin-bottom:18px;
              "
            >
              VOLUNTEER APPLICATION APPROVED
            </div>

            <div
              style="
                color:#ffffff;
                font-size:36px;
                line-height:44px;
                font-weight:bold;
              "
            >
              Welcome to<br />
              Inclusive World
            </div>

            <div
              style="
                color:#d7efeb;
                font-size:16px;
                line-height:28px;
                margin-top:22px;
                max-width:470px;
              "
            >
              Your volunteer application has officially been approved and we are excited to welcome you into the Inclusive World volunteer community.
            </div>

          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:42px 36px;">

            <!-- GREETING -->
            <div
              style="
                color:#33423f;
                font-size:18px;
                line-height:30px;
                margin-bottom:24px;
              "
            >
              Hello
              <strong style="color:#0c4f49;">
                ${fname} ${lname}
              </strong>,
            </div>

            <!-- BODY TEXT -->
            <div
              style="
                color:#5d6c69;
                font-size:16px;
                line-height:30px;
              "
            >
              Congratulations on your successful volunteer application approval. We are grateful for your willingness to support Inclusive World and contribute toward our mission of accessibility, empowerment, and inclusion.
            </div>

            <!-- FEATURE BOX -->
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              bgcolor="#f8fbfa"
              style="
                margin-top:34px;
                border-radius:18px;
                border:1px solid #e5efec;
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
                    Your Volunteer Access Includes
                  </div>

                  <div
                    style="
                      color:#61706d;
                      font-size:15px;
                      line-height:30px;
                    "
                  >
                    • Volunteer schedules and coordination<br />
                    • Event participation opportunities<br />
                    • Community engagement activities<br />
                    • Volunteer announcements and updates<br />
                    • Future initiatives and organizational projects
                  </div>

                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              style="margin-top:38px;"
            >
              <tr>
                <td align="center">

                  <a
                    href="${portalSignupLink}"
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
                    Create Your Volunteer Portal Account
                  </a>

                </td>
              </tr>
            </table>

            <div
              style="
                margin-top:42px;
                color:#667572;
                font-size:15px;
                line-height:28px;
              "
            >
              Thank you for becoming part of Inclusive World. We are excited to have you as part of our volunteer community and look forward to creating meaningful impact together.
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
                margin-top:52px;
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
                    We are excited to have you as part of our volunteer community.
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
              </tr>
            </table>

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

          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
`
        : `
<!-- ===================================================== -->
<!-- VOLUNTEER REJECTED EMAIL -->
<!-- ===================================================== -->

<table
  role="presentation"
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  bgcolor="#f8f4f4"
>
  <tr>
    <td align="center" style="padding:40px 16px;">

      <!-- MAIN CONTAINER -->
      <table
        role="presentation"
        width="620"
        cellpadding="0"
        cellspacing="0"
        border="0"
        bgcolor="#ffffff"
        style="
          border-radius:24px;
          overflow:hidden;
          border:1px solid #eee2e2;
          font-family:Arial,Helvetica,sans-serif;
        "
      >

        <!-- HERO -->
        <tr>
          <td
            bgcolor="#6b1f2a"
            align="center"
            style="padding:50px 36px;"
          >

            <img
              src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1779491649/Screenshot_2026-05-22_at_4.12.36_PM_qp5x6k-removebg-preview_nefqzi.png"
              width="72"
              style="
                display:block;
                margin-bottom:24px;
              "
            />

            <div
              style="
                color:#f3d9de;
                font-size:12px;
                font-weight:bold;
                letter-spacing:1.6px;
                margin-bottom:18px;
              "
            >
              VOLUNTEER APPLICATION STATUS
            </div>

            <div
              style="
                color:#ffffff;
                font-size:36px;
                line-height:44px;
                font-weight:bold;
              "
            >
              Thank You for<br />
              Your Interest
            </div>

            <div
              style="
                color:#f3d9de;
                font-size:16px;
                line-height:28px;
                margin-top:22px;
                max-width:470px;
              "
            >
              We sincerely appreciate your interest in volunteering with Inclusive World.
            </div>

          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:42px 36px;">

            <!-- GREETING -->
            <div
              style="
                color:#433535;
                font-size:18px;
                line-height:30px;
                margin-bottom:24px;
              "
            >
              Hello
              <strong style="color:#6b1f2a;">
                ${fname} ${lname}
              </strong>,
            </div>

            <!-- BODY TEXT -->
            <div
              style="
                color:#665858;
                font-size:16px;
                line-height:30px;
              "
            >
              After careful consideration, we regret to inform you that we are unable to move forward with your volunteer application at this time.
            </div>

            <div
  style="
    margin-top:28px;
    background:#fbf7f7;
    border:1px solid #f0e6e6;
    border-radius:18px;
    padding:24px;
  "
>
  <div
    style="
      color:#6b1f2a;
      font-size:18px;
      font-weight:bold;
      margin-bottom:10px;
    "
  >
    Reason for Decision
  </div>

  <div
    style="
      color:#665858;
      font-size:15px;
      line-height:28px;
      white-space:pre-wrap;
    "
  >
    ${rejection_reason}
  </div>
</div>

            <div
              style="
                margin-top:24px;
                color:#665858;
                font-size:16px;
                line-height:30px;
              "
            >
              We sincerely appreciate your willingness to support Inclusive World and contribute your time and effort toward our mission of accessibility, empowerment, and inclusion.
            </div>

            <!-- FEATURE BOX -->
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              bgcolor="#fbf7f7"
              style="
                margin-top:34px;
                border-radius:18px;
                border:1px solid #f0e6e6;
              "
            >
              <tr>
                <td style="padding:28px;">

                  <div
                    style="
                      color:#6b1f2a;
                      font-size:20px;
                      font-weight:bold;
                      margin-bottom:12px;
                    "
                  >
                    Thank You for Your Interest
                  </div>

                  <div
                    style="
                      color:#736565;
                      font-size:15px;
                      line-height:30px;
                    "
                  >
                    Thank you for your interest in volunteering with Inclusive World. We encourage you to apply again in future volunteer cycles as additional opportunities become available.
                  </div>

                </td>
              </tr>
            </table>

            <!-- SIGNATURE -->
            <table
              role="presentation"
              width="100%"
              cellpadding="0"
              cellspacing="0"
              border="0"
              bgcolor="#faf6f6"
              style="
                margin-top:52px;
                background:#faf6f6;
                border-radius:24px;
                border:1px solid #f1e7e7;
              "
            >
              <tr>
                <td style="padding:38px;">

                  <div
                    style="
                      color:#6f6262;
                      font-size:15px;
                      line-height:30px;
                      margin-bottom:18px;
                      font-family:Arial, Helvetica, sans-serif;
                    "
                  >
                    We sincerely appreciate your willingness to support Inclusive World and thank you once again for your time and interest.
                  </div>

                  <div
                    style="
                      color:#6f6262;
                      font-size:15px;
                      line-height:30px;
                      font-family:Arial, Helvetica, sans-serif;
                    "
                  >
                    We wish you continued success and hope to connect again in the future.
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
                            color:#6b1f2a;
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
                            color:#9a8c8c;
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
              </tr>
            </table>

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
                      color:#aa9d9d;
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

      console.log(text);

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
  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
}

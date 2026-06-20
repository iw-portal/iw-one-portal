export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    const { email, fname, reviewUrl } = req.body;

    if (!email || !fname || !reviewUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const fullName = `${fname || ""}`.trim();

    const htmlContent = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f8f7">
  <tr>
    <td align="center" style="padding:40px 16px;">
      <table role="presentation" width="620" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius:24px;overflow:hidden;border:1px solid #e4ece9;font-family:Arial,Helvetica,sans-serif;">
        <tr>
          <td bgcolor="#0c4f49" align="center" style="padding:50px 36px;">
            <img
              src="https://res.cloudinary.com/ddcxejrmd/image/upload/v1779491649/Screenshot_2026-05-22_at_4.12.36_PM_qp5x6k-removebg-preview_nefqzi.png"
              width="72"
              style="display:block;margin-bottom:24px;"
            />

            <div style="color:#d7efeb;font-size:12px;font-weight:bold;letter-spacing:1.6px;margin-bottom:18px;">
              ONE PAGE DESCRIPTION REVIEW
            </div>

            <div style="color:#ffffff;font-size:34px;line-height:42px;font-weight:bold;">
              Your OPD is Ready<br />
              for Review
            </div>

            <div style="color:#d7efeb;font-size:16px;line-height:28px;margin-top:22px;max-width:470px;">
              Please review your One Page Description and share any comments or requested changes.
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:42px 36px;">
            <div style="color:#33423f;font-size:18px;line-height:30px;margin-bottom:24px;">
              Hello <strong style="color:#0c4f49;">${fullName}</strong>,
            </div>

            <div style="color:#5d6c69;font-size:16px;line-height:30px;">
              Your One Page Description has been prepared by the PCS team and is now ready for your review.
              Please log in to One Portal, review the information, and submit any comments if changes are needed.
            </div>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:38px;">
              <tr>
                <td align="center">
                  <a
                    href="${reviewUrl}"
                    style="display:inline-block;background:#0c4f49;color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:12px;font-size:15px;font-weight:bold;"
                  >
                    Review My OPD
                  </a>
                </td>
              </tr>
            </table>

            <div style="margin-top:10px;color:#667572;font-size:15px;line-height:12px;">
              Thank you,<br /><br />
              <strong>Inclusive World PCS Team</strong>
            </div>

            <div style="margin-top:36px;color:#9aa7a4;font-size:12px;line-height:24px;text-align:center;">
              This is an automated email from Inclusive World.<br />
              Please do not reply directly to this message.
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
    `;

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

            name: fullName,
          },
        ],

        subject: "Your One Page Description is ready for review",

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
      return res.status(500).json({ error: result });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({ error: err.message });
  }
}

// api/send-email.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, passcode, magicLink } = req.body;
  const safeLink = magicLink || "https://yagso.com";
  const BRAND = "#948179"; // YAGSO stone-gold
  const BG = "#fbfaf8";
  const INK = "#1f1b16";

  try {
    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Yagso <no-reply@yagso.com>",
        to: email,
        subject: "Welcome to Yagso — Your Exclusive Passcode",
        html: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Welcome to Yagso</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->

  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body, table, td, p, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; }

    .container { width:100%; max-width:600px; margin:0 auto; }
    .card { background:#ffffff; border:1px solid rgba(148,129,121,.18); border-radius:18px; overflow:hidden; }
    .p { padding:28px; }
    .muted { color:#6d625a; }
    .title { color:${INK}; font-weight:600; letter-spacing:-0.3px; }
    .brand { color:${BRAND}; }
    .button {
      display:inline-block;
      padding:14px 34px;
      background:${BRAND};
      color:#ffffff !important;
      text-decoration:none;
      border-radius:999px;
      font-weight:600;
      letter-spacing:.3px;
    }
    .codeBox {
      border:1px solid rgba(148,129,121,.25);
      border-radius:16px;
      background:linear-gradient(180deg, rgba(148,129,121,.10), rgba(148,129,121,.03));
      padding:22px 18px;
      text-align:center;
    }
    .code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size:24px;
      letter-spacing:8px;
      font-weight:800;
      color:${INK};
      margin-top:8px;
    }
    .pill {
      display:inline-block;
      font-size:11px;
      letter-spacing:.22em;
      text-transform:uppercase;
      padding:8px 12px;
      border-radius:999px;
      border:1px solid rgba(148,129,121,.25);
      background:rgba(148,129,121,.06);
      color:${INK};
    }

    @media (max-width:600px){
      .p { padding:18px !important; }
      .code { font-size:20px !important; letter-spacing:6px !important; }
      .button { padding:13px 26px !important; }
    }
  </style>
</head>

<body style="margin:0; padding:0; background:${BG};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BG};">
    <tr>
      <td align="center" style="padding:24px 10px;">
        <table role="presentation" class="container" cellpadding="0" cellspacing="0" border="0">

          <!-- Top subtle header -->
          <tr>
            <td align="center" style="padding-bottom:14px;">
              <img
                src="https://waitlist-bay-kappa.vercel.app/logo.png"
                alt="Yagso"
                width="120"
                style="display:block; margin:0 auto 10px; max-width:120px;"
              />
              <span class="pill">Handcrafted • Limited Drops • Premium Finish</span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td class="card">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <!-- hero -->
                <tr>
                  <td class="p" style="padding-bottom:10px;">
                    <h1 class="title" style="font-family: Helvetica, Arial, sans-serif; font-size:34px; line-height:1.15; margin:0;">
                      Welcome to <span class="brand">Yagso</span>
                    </h1>
                    <p class="muted" style="font-family: Helvetica, Arial, sans-serif; font-size:15px; line-height:1.7; margin:14px 0 0;">
                      Your early access is ready. Use the code below, or simply tap the button to enter the collection.
                    </p>
                  </td>
                </tr>

                <!-- code -->
                <tr>
                  <td class="p" style="padding-top:10px;">
                    <div class="codeBox">
                      <p style="font-family: Helvetica, Arial, sans-serif; font-size:12px; letter-spacing:.18em; text-transform:uppercase; color:${BRAND}; margin:0;">
                        Your Access Code
                      </p>
                      <div class="code">${passcode}</div>
                      <p class="muted" style="font-family: Helvetica, Arial, sans-serif; font-size:12px; line-height:1.6; margin:10px 0 0;">
                        Keep this code private. It unlocks exclusive access.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- CTA -->
                <tr>
                  <td align="center" class="p" style="padding-top:18px;">
                    <a href="${safeLink}" class="button">Enter Yagso</a>
                    <p class="muted" style="font-family: Helvetica, Arial, sans-serif; font-size:12px; line-height:1.6; margin:14px 0 0;">
                      If the button doesn’t work, copy and paste this link:
                      <br />
                      <span style="word-break:break-all; color:${INK};">${safeLink}</span>
                    </p>
                  </td>
                </tr>

                <!-- divider -->
                <tr>
                  <td style="padding:0 28px;">
                    <div style="height:1px; background:rgba(148,129,121,.18); width:100%;"></div>
                  </td>
                </tr>

                <!-- next steps -->
                <tr>
                  <td class="p">
                    <p class="title" style="font-family: Helvetica, Arial, sans-serif; font-size:14px; margin:0 0 12px;">
                      What happens next
                    </p>

                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="font-family: Helvetica, Arial, sans-serif; font-size:13px; line-height:1.65; color:${INK}; padding:6px 0;">
                          <span style="color:${BRAND}; font-weight:700;">1.</span>
                          Unlock exclusive pieces & early pricing.
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family: Helvetica, Arial, sans-serif; font-size:13px; line-height:1.65; color:${INK}; padding:6px 0;">
                          <span style="color:${BRAND}; font-weight:700;">2.</span>
                          Browse curated drops — limited quantities.
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family: Helvetica, Arial, sans-serif; font-size:13px; line-height:1.65; color:${INK}; padding:6px 0;">
                          <span style="color:${BRAND}; font-weight:700;">3.</span>
                          Get priority alerts for new arrivals.
                        </td>
                      </tr>
                    </table>

                    <p class="muted" style="font-family: Helvetica, Arial, sans-serif; font-size:12px; line-height:1.6; margin:16px 0 0;">
                      Need help? Reply to this email and we’ll assist you.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td align="center" style="padding:16px 10px;">
              <p class="muted" style="font-family: Helvetica, Arial, sans-serif; font-size:12px; line-height:1.6; margin:0;">
                © 2025 Yagso. All rights reserved.
                <br />
                You received this because you requested early access.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,

          "Content-Type": "application/json",
        },
      },
    );

    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res
      .status(500)
      .json({ error: "Failed to send email", message: error.message });
  }
}

// api/send-email.js
import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, passcode } = req.body;

  try {
    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Yagso <no-reply@yagso.com>",
        to: email,
        subject: "Welcome to Yagso — Your Exclusive Passcode",
        html: `
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
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
        /* Reset styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body, table, td, p, a, li, blockquote {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        
        table, td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        
        img {
            -ms-interpolation-mode: bicubic;
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }
        
        /* Mobile styles */
        @media screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                max-width: 100% !important;
                padding: 15px !important;
            }
            
            .header-title {
                font-size: 28px !important;
                line-height: 1.3 !important;
                margin-bottom: 16px !important;
            }
            
            .header-text {
                font-size: 14px !important;
                line-height: 1.6 !important;
                padding: 0 10px !important;
            }
            
            .passcode-container {
                margin: 25px auto !important;
                max-width: 280px !important;
            }
            
            .passcode-box {
                padding: 24px 16px !important;
                border-radius: 12px !important;
            }
            
            .passcode-code {
                font-size: 20px !important;
                letter-spacing: 4px !important;
            }
            
            .cta-button {
                padding: 12px 30px !important;
                font-size: 15px !important;
                border-radius: 15px !important;
            }
            
            .next-steps {
                padding: 16px !important;
                margin: 20px 10px !important;
            }
            
            .step-text {
                font-size: 11px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f9f9f9;">
    <!-- Main Table Container -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%); min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 20px 8px;">
                
                <!-- Content Container -->
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="container" style="width: 100%; max-width: 600px; margin: 0 auto;">
                    
                    <!-- Logo Section -->
                    <tr>
                        <td align="center" style="padding-bottom: 15px;">
                            <img src="https://waitlist-bay-kappa.vercel.app/logo.png" 
                                 alt="Yagso Logo" 
                                 style="max-width: 120px; height: auto; display: block; margin-bottom: 10px;" 
                                 width="120">
                            <div style="height: 2px; width: 80px; background: linear-gradient(90deg, #065f46, #047857); margin: 0 auto; border-radius: 1px; opacity: 0.7;"></div>
                        </td>
                    </tr>
                    
                    <!-- Welcome Message -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h1 class="header-title" style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 35px; font-weight: 300; color: #065f46; margin: 0 0 20px 0; line-height: 1.2; letter-spacing: -0.5px;">
                                Welcome to Yagso
                            </h1>
                            <p class="header-text" style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 15px; color: #6b7280; line-height: 1.7; margin: 0; max-width: 480px;">
                                Thank you for joining our exclusive collection launch. Your journey into luxury begins now with your personal access code.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Passcode Section -->
                    <tr>
                        <td align="center">
                            <div class="passcode-container" style="margin: 20px auto; max-width: 320px;">
                                <div class="passcode-box" style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 3px solid #065f46; border-radius: 16px; padding: 32px 24px; box-shadow: 0 10px 40px rgba(6, 95, 70, 0.15);">
                                    <p style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #065f46; margin: 0 0 8px 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                                        Your Access Code
                                    </p>
                                    <div class="passcode-code" style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: 700; color: #065f46; letter-spacing: 8px; margin: 6px 0;">
                                       ${passcode}
                                    </div>
                                    <p style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #6b7280; margin: 8px 0 0 0; font-style: italic;">
                                        Keep this code secure and accessible
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Call to Action -->
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <a href="https://waitlist-bay-kappa.vercel.app/" class="cta-button" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: #ffffff; text-decoration: none; border-radius: 20px; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; font-weight: 600; letter-spacing: 0.5px; box-shadow: 0 8px 32px rgba(6, 95, 70, 0.3);">
                                Enter Yagso Collection
                            </a>
                            <p style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #9ca3af; margin: 20px 0 0 0;">
                                Click above to access your exclusive jewelry collection
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Divider -->
                    <tr>
                        <td align="center" style="padding: 20px 0;">
                            <div style="height: 1px; background: linear-gradient(90deg, transparent, #d1d5db, transparent); width: 200px; margin: 0 auto;"></div>
                        </td>
                    </tr>
                    
                    <!-- What's Next Section -->
                    <tr>
                        <td align="center">
                            <div class="next-steps" style="background: rgba(6, 95, 70, 0.03); border: 1px solid rgba(6, 95, 70, 0.1); border-radius: 12px; padding: 20px; margin: 30px auto; max-width: 500px;">
                                <h3 style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 15px; color: #065f46; margin: 0 0 16px 0; font-weight: 600; text-align: center;">
                                    What Happens Next?
                                </h3>
                                
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                    <tr>
                                        <td style="padding: 4px 0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="padding-right: 12px; vertical-align: top;">
                                                        <span style="color: #065f46; font-size: 13px; font-weight: bold; font-family: 'Helvetica Neue', Arial, sans-serif;">1.</span>
                                                    </td>
                                                    <td>
                                                        <span class="step-text" style="color: #4b5563; font-size: 12px; line-height: 1.5; font-family: 'Helvetica Neue', Arial, sans-serif;">Use your access code to unlock exclusive collections</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 4px 0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="padding-right: 12px; vertical-align: top;">
                                                        <span style="color: #065f46; font-size: 13px; font-weight: bold; font-family: 'Helvetica Neue', Arial, sans-serif;">2.</span>
                                                    </td>
                                                    <td>
                                                        <span class="step-text" style="color: #4b5563; font-size: 12px; line-height: 1.5; font-family: 'Helvetica Neue', Arial, sans-serif;">Browse our curated luxury jewelry pieces</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 4px 0;">
                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="padding-right: 12px; vertical-align: top;">
                                                        <span style="color: #065f46; font-size: 13px; font-weight: bold; font-family: 'Helvetica Neue', Arial, sans-serif;">3.</span>
                                                    </td>
                                                    <td>
                                                        <span class="step-text" style="color: #4b5563; font-size: 12px; line-height: 1.5; font-family: 'Helvetica Neue', Arial, sans-serif;">Receive priority notifications for new arrivals</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top: 40px; border-top: 1px solid rgba(6, 95, 70, 0.1);">
                            <p style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #6b7280; margin: 0 0 8px 0;">
                                Thank you for choosing Yagso for your luxury jewelry needs
                            </p>
                            <p style="font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #9ca3af; margin: 0; line-height: 1.5;">
                                © 2025 Yagso. All rights reserved.<br>
                                You received this email because you requested exclusive access to our collection.
                            </p>
                            <div style="margin-top: 20px;">
                                <span style="color: #d1d5db; font-size: 12px; font-family: 'Helvetica Neue', Arial, sans-serif;">Follow us for updates</span>
                            </div>
                        </td>
                    </tr>
                    
                </table>
                
            </td>
        </tr>
    </table>
</body>
`,
      },
      {
        headers: {
          Authorization: `Bearer re_e6WEgfQT_PPyDpYPthCqxK72BTgFxKCg6`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    return res
      .status(500)
      .json({ error: "Failed to send email", message: error.message });
  }
}

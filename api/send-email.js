// api/send-email.js

import express from "express";
import cors from "cors";
import axios from "axios";


const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://www.yagso.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

app.post("/api/send-email", async (req, res) => {
  console.log("📩 Incoming request body:", req.body);
  const { recipientEmail, invoice, senderInfo } = req.body;

  if (!recipientEmail || !invoice) {
    return res.status(400).json({
      error: "Missing required fields: recipientEmail and invoice are required",
    });
  }

  try {
    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Yagso <info@yagso.com>",
        to: recipientEmail,
        subject: `Invoice ${invoice.id} from ${
          senderInfo?.companyName || "Yagso"
        }`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background: #f8fafc;
      padding: 20px;
    }
    .email-wrapper {
      max-width: 680px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
                  0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
    .email-header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
      padding: 40px 24px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .email-header::before {
      content: '';
      position: absolute;
      inset: 0;
      background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
      opacity: 0.2;
    }
    .email-header-content {
      position: relative;
      z-index: 1;
    }
    .email-header-content img {
      max-width: 160px;
  
    }
    .invoice-badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.15);
      padding: 6px 18px;
      border-radius: 20px;
      font-size: 0.813rem;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .email-header h1 {
      color: white;
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 6px;
    }
    .email-header p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1rem;
      font-weight: 500;
    }
    .email-body {
      padding: 32px;
    }
    .greeting {
      font-size: 1.125rem;
      margin-bottom: 20px;
      color: #0f172a;
      font-weight: 600;
    }
    .intro-text {
      color: #475569;
      margin-bottom: 28px;
      line-height: 1.7;
    }
    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin: 30px 0 16px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }
    .products-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .products-table thead {
      background: #1e293b;
    }
    .products-table th {
      padding: 14px;
      text-align: left;
      font-size: 0.813rem;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
    }
    .products-table td {
      padding: 14px;
      border-bottom: 1px solid #f1f5f9;
      color: #475569;
    }
    .products-table tbody tr:last-child td {
      border-bottom: none;
    }
    .product-name {
      font-weight: 600;
      color: #0f172a;
    }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .amount-box {
      margin: 32px 0;
      padding: 28px;
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      border-radius: 14px;
      text-align: center;
      color: white;
    }
    .amount-label {
      font-size: 1rem;
      margin-bottom: 6px;
      font-weight: 500;
    }
    .amount-value {
      font-size: 2.5rem;
      font-weight: 800;
    }
    .footer-note {
      margin-top: 28px;
      padding: 24px;
      background: #f8fafc;
      border-radius: 12px;
      text-align: center;
      border: 1px solid #e2e8f0;
    }
    .footer-note p {
      color: #64748b;
      margin: 6px 0;
    }
    .footer-note strong {
      color: #0f172a;
      font-size: 1rem;
    }
    .company-footer {
      background: #0f172a;
      padding: 32px;
      text-align: center;
      color: rgba(255, 255, 255, 0.85);
    }
    .company-name {
      color: white;
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .company-details {
      font-size: 0.9rem;
      line-height: 1.6;
    }
    @media (max-width: 600px) {
      .email-body { padding: 20px; }
      .products-table th, .products-table td { padding: 10px 6px; font-size: 0.875rem; }
      .amount-value { font-size: 2rem; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="email-header">
      <div class="email-header-content">
        <img src="https://yagso.com/logo.png" alt="Company Logo" />
      
        <h3>${invoice.id}</h3>
        <p>${senderInfo?.companyName || "Yagso"}</p>
      </div>
    </div>
    
    <div class="email-body">
      <div class="greeting">Dear ${recipientEmail || "Valued Customer"},</div>
      <p class="intro-text">
        Thank you for your business! Below are the details of your invoice.
      </p>
      
      ${
        invoice.products?.length > 0
          ? `
        <h2 class="section-title">Invoice Items</h2>
        <table class="products-table">
          <thead>
            <tr>
              <th>Item</th>
              <th class="text-center">Qty</th>
              <th class="text-right">Unit Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.products
              .map(
                (product) => `
              <tr>
                <td>
                  <div class="product-name">${product.name}</div>
                </td>
                <td class="text-center">${product.quantity}</td>
                <td class="text-right">${formatCurrency(product.price)}</td>
                <td class="text-right"><strong>${formatCurrency(
                  product.price * product.quantity
                )}</strong></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `
          : ""
      }
      
      <div class="amount-box">
        <div class="amount-label">Total Amount ${
          invoice.status === "paid" ? "Paid" : "Due"
        }</div>
        <div class="amount-value">
          ${formatCurrency(
            invoice.status === "paid"
              ? invoice.amount || invoice.amountDue || 0
              : invoice.amountDue || invoice.amount || 0
          )}
        </div>
      </div>
      
      <div class="footer-note">
        <p><strong>Thank you for choosing ${
          senderInfo?.companyName || "Yagso"
        }!</strong></p>
           

     Block 2 Shop 33 Aspamda Main Gate Tradefair, Ojo.<br>
        Phone: tel:+2348108042048 | Email: info@yagso.com
      </div>
    </div>
      </div>
    </div>
    
    <div class="company-footer">
 
  </div>
</body>
</html>
`,
      },
      {
        headers: {
           Authorization: `Bearer ${process.env.RESEND_API_KEY}`,

          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully:", response.data);
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(
      "❌ Error sending email:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      error: "Failed to send email",
      details: error.response?.data || error.message,
    });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});

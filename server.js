// api/send-email.js

import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors({ origin: "http://localhost:5174" }));
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
        from: "onboarding@resend.dev",
        to: recipientEmail,
        subject: `Invoice ${invoice.id} from ${
          senderInfo?.companyName || "Osondu Autos"
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
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          .email-header {
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
            padding: 48px 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .email-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
          }
          .email-header-content {
            position: relative;
            z-index: 1;
          }
          .invoice-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            padding: 8px 20px;
            border-radius: 24px;
            font-size: 0.875rem;
            font-weight: 600;
            color: white;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 16px;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
          .email-header h1 {
            color: white;
            font-size: 2.25rem;
            font-weight: 800;
            margin-bottom: 8px;
            letter-spacing: -0.025em;
          }
          .email-header p {
            color: rgba(255, 255, 255, 0.95);
            font-size: 1.125rem;
            font-weight: 500;
          }
          .email-body {
            padding: 40px;
          }
          .greeting {
            font-size: 1.125rem;
            margin-bottom: 24px;
            color: #0f172a;
            font-weight: 600;
          }
          .intro-text {
            color: #475569;
            margin-bottom: 32px;
            line-height: 1.7;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
            margin: 32px 0;
            padding: 28px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }
          .info-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .info-label {
            font-size: 0.813rem;
            font-weight: 600;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .info-value {
            font-size: 1rem;
            color: #0f172a;
            font-weight: 600;
          }
          .section-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #0f172a;
            margin: 40px 0 20px 0;
            padding-bottom: 12px;
            border-bottom: 2px solid #e2e8f0;
          }
          .products-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 24px 0;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
          }
          .products-table thead {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          }
          .products-table th {
            padding: 16px;
            text-align: left;
            font-weight: 600;
            font-size: 0.813rem;
            color: white;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .products-table td {
            padding: 16px;
            border-bottom: 1px solid #f1f5f9;
            color: #475569;
            vertical-align: top;
          }
          .products-table tbody tr {
            background: white;
            transition: background-color 0.2s;
          }
          .products-table tbody tr:hover {
            background: #f8fafc;
          }
          .products-table tbody tr:last-child td {
            border-bottom: none;
          }
          .product-name {
            font-weight: 600;
            color: #0f172a;
            margin-bottom: 4px;
          }
          .product-desc {
            font-size: 0.875rem;
            color: #64748b;
            line-height: 1.5;
          }
          .text-right {
            text-align: right;
          }
          .text-center {
            text-align: center;
          }
          .amount-box {
            margin: 40px 0;
            padding: 32px;
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
          }
          .amount-label {
            color: rgba(255, 255, 255, 0.9);
            font-size: 1rem;
            margin-bottom: 8px;
            font-weight: 500;
          }
          .amount-value {
            color: white;
            font-size: 3rem;
            font-weight: 800;
            letter-spacing: -0.025em;
          }
          .service-box {
            padding: 28px;
            background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
            border-radius: 12px;
            border-left: 4px solid #3b82f6;
            margin: 24px 0;
          }
          .service-title {
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 12px;
            font-size: 1.125rem;
          }
          .service-desc {
            color: #475569;
            line-height: 1.7;
          }
          .footer-note {
            margin-top: 40px;
            padding: 32px;
            background: #f8fafc;
            border-radius: 12px;
            text-align: center;
            border: 1px solid #e2e8f0;
          }
          .footer-note p {
            color: #64748b;
            margin: 8px 0;
            line-height: 1.7;
          }
          .footer-note strong {
            color: #0f172a;
            font-size: 1.125rem;
          }
          .company-footer {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            padding: 40px;
            text-align: center;
            color: rgba(255, 255, 255, 0.8);
          }
          .company-name {
            color: white;
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 16px;
          }
          .company-details {
            font-size: 0.938rem;
            line-height: 1.8;
          }
          .status-badge {
            display: inline-block;
            padding: 6px 16px;
            border-radius: 24px;
            font-size: 0.813rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .status-paid {
            background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
            color: #166534;
            border: 1px solid #86efac;
          }
          .status-unpaid {
            background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
            color: #991b1b;
            border: 1px solid #fecaca;
          }
          .status-overdue {
            background: linear-gradient(135deg, #fefce8 0%, #fef08a 100%);
            color: #854d0e;
            border: 1px solid #fde047;
          }
          @media (max-width: 600px) {
            .email-body { padding: 24px; }
            .email-header { padding: 32px 24px; }
            .email-header h1 { font-size: 1.75rem; }
            .info-grid { grid-template-columns: 1fr; gap: 16px; padding: 20px; }
            .amount-value { font-size: 2.25rem; }
            .products-table th, .products-table td { padding: 12px 8px; font-size: 0.875rem; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-header">
            <div class="email-header-content">
              <div class="invoice-badge">Invoice</div>
              <h1>${invoice.id}</h1>
              <p>${senderInfo?.companyName || "Osondu Autos"}</p>
            </div>
          </div>
          
          <div class="email-body">
            <div class="greeting">Dear ${
              invoice.customerId || "Valued Customer"
            },</div>
            
            <p class="intro-text">
              Thank you for your business! Please find the details of your invoice below. 
              This invoice was issued on <strong>${formatDate(
                invoice.createdAt || new Date()
              )}</strong>.
            </p>
            
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Invoice Number</span>
                <span class="info-value">${invoice.id}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Issue Date</span>
                <span class="info-value">${formatDate(
                  invoice.createdAt || new Date()
                )}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Payment Status</span>
                <span class="status-badge status-${invoice.status || "unpaid"}">
                  ${(invoice.status || "unpaid").toUpperCase()}
                </span>
              </div>
              ${
                invoice.customerEmail
                  ? `
              <div class="info-item">
                <span class="info-label">Customer Email</span>
                <span class="info-value">${invoice.customerEmail}</span>
              </div>
              `
                  : ""
              }
            </div>
            
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
                        ${
                          product.description
                            ? `<div class="product-desc">${product.description}</div>`
                            : ""
                        }
                      </td>
                      <td class="text-center">${product.quantity}</td>
                      <td class="text-right">${formatCurrency(
                        product.price
                      )}</td>
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
                : invoice.description
                ? `
              <h2 class="section-title">Service Description</h2>
              <div class="service-box">
                <div class="service-title">Service Details</div>
                <div class="service-desc">${invoice.description}</div>
              </div>
            `
                : ""
            }
            
            <div class="amount-box">
              <div class="amount-label">
                Total Amount ${invoice.status === "paid" ? "Paid" : "Due"}
              </div>
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
                senderInfo?.companyName || "Osondu Autos"
              }!</strong></p>
              <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
              ${
                invoice.status === "unpaid"
                  ? "<p>Payment is kindly requested within 30 days of the invoice date.</p>"
                  : ""
              }
            </div>
          </div>
          
          <div class="company-footer">
            <div class="company-name">${
              senderInfo?.companyName || "Osondu Autos"
            }</div>
            <div class="company-details">
              ${
                senderInfo?.address ||
                "Block 2 Shop 33 Aspamda Main Gate Tradefair, Ojo."
              }<br>
              Phone: ${senderInfo?.phone || "08108042048"} | Email: ${
          senderInfo?.email || "info@osonduautos.com"
        }
            </div>
          </div>
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

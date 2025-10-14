// Resend email service for sending invoices
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendInvoiceViaResend = async (invoice, recipientEmail, senderInfo) => {
  try {
    console.log("[v0] Sending invoice email via Resend to:", recipientEmail)
    console.log("[v0] Invoice details:", invoice)

    const formatCurrency = (amount) => `₦${amount.toLocaleString()}`
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }

    // Generate HTML email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice ${invoice.id}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
          }
          .email-container {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
          .email-header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .email-header h1 {
            margin: 0;
            font-size: 2rem;
            font-weight: 700;
          }
          .email-header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 1.1rem;
          }
          .email-content {
            padding: 30px;
          }
          .greeting {
            font-size: 1.1rem;
            margin-bottom: 20px;
            color: #1e293b;
          }
          .invoice-summary {
            background: #f8fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #2563eb;
          }
          .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
          }
          .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
          }
          .detail-label {
            font-weight: 600;
            color: #64748b;
          }
          .detail-value {
            color: #1e293b;
            font-weight: 500;
          }
          .amount-highlight {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 20px 0;
          }
          .amount-highlight .amount {
            font-size: 2rem;
            font-weight: 700;
            margin: 0;
          }
          .products-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .products-table th {
            background: #f1f5f9;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #475569;
            border-bottom: 2px solid #e2e8f0;
          }
          .products-table td {
            padding: 12px;
            border-bottom: 1px solid #e2e8f0;
          }
          .products-table tbody tr:hover {
            background: #f8fafc;
          }
          .footer-note {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
            text-align: center;
            color: #64748b;
          }
          .company-info {
            text-align: center;
            padding: 20px;
            background: #f8fafc;
            color: #64748b;
            font-size: 0.9rem;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-unpaid {
            background-color: #fef2f2;
            color: #991b1b;
          }
          .status-paid {
            background-color: #dcfce7;
            color: #166534;
          }
          .status-overdue {
            background-color: #fefce8;
            color: #a16207;
          }
          @media (max-width: 600px) {
            .invoice-details {
              grid-template-columns: 1fr;
            }
            .email-content {
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Invoice ${invoice.id}</h1>
            <p>From ${senderInfo.companyName || "Your Company"}</p>
          </div>
          
          <div class="email-content">
            <div class="greeting">
              Dear ${invoice.customerId},
            </div>
            
            <p>
              Thank you for your business! Please find your invoice details below. 
              This invoice is dated <strong>${formatDate(invoice.createdAt || new Date())}</strong>.
            </p>
            
            <div class="invoice-summary">
              <div class="invoice-details">
                <div class="detail-item">
                  <span class="detail-label">Invoice Number:</span>
                  <span class="detail-value">${invoice.id}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Issue Date:</span>
                  <span class="detail-value">${formatDate(invoice.createdAt || new Date())}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">
                    <span class="status-badge status-${invoice.status}">${invoice.status.toUpperCase()}</span>
                  </span>
                </div>
              </div>
            </div>
            
            ${
              invoice.products?.length > 0
                ? `
              <h3 style="color: #1e293b; margin-top: 30px;">Invoice Items</h3>
              <table class="products-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${invoice.products
                    .map(
                      (product) => `
                    <tr>
                      <td>
                        <strong>${product.name}</strong>
                        ${product.description ? `<br><small style="color: #64748b;">${product.description}</small>` : ""}
                      </td>
                      <td>${product.quantity}</td>
                      <td>${formatCurrency(product.price)}</td>
                      <td><strong>${formatCurrency(product.price * product.quantity)}</strong></td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            `
                : `
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1e293b;">Service Description:</h4>
                <p style="margin: 0; color: #64748b;">${invoice.description}</p>
              </div>
            `
            }
            
            <div class="amount-highlight">
              <p style="margin: 0 0 5px 0; font-size: 1.1rem;">Total Amount ${invoice.status === "paid" ? "Paid" : "Due"}</p>
              <p class="amount">${formatCurrency(invoice.status === "paid" ? invoice.amount : invoice.amountDue)}</p>
            </div>
            
            <div class="footer-note">
              <p><strong>Thank you for your business!</strong></p>
              <p>If you have any questions about this invoice, please contact us.</p>
            </div>
          </div>
          
          <div class="company-info">
            <h4 style="margin: 0 0 10px 0; color: #1e293b;">${senderInfo.companyName || "Osondu Autos"}</h4>
            <p style="margin: 5px 0;">${senderInfo.address || "Block 2 Shop 33 Aspamda Main Gate Tradefair, Ojo."}</p>
            <p style="margin: 5px 0;">Phone: ${senderInfo.phone || "08108042048"} | Email: ${senderInfo.email || "info@osonduautos.com"}</p>
          </div>
        </div>
      </body>
      </html>
    `

    const { data, error } = await resend.emails.send({
      from: senderInfo.email || "onboarding@resend.dev",
      to: [recipientEmail],
      subject: `Invoice ${invoice.id} from ${senderInfo.companyName || "Osondu Autos"}`,
      html: htmlContent,
    })

    if (error) {
      console.error("[v0] Resend error:", error)
      return {
        success: false,
        message: `Failed to send invoice email: ${error.message}`,
      }
    }

    console.log("[v0] Email sent successfully:", data)
    return {
      success: true,
      message: `Invoice ${invoice.id} has been sent to ${recipientEmail} successfully!`,
      data,
    }
  } catch (error) {
    console.error("[v0] Error sending email via Resend:", error)
    return {
      success: false,
      message: "Failed to send invoice email. Please try again later.",
    }
  }
}

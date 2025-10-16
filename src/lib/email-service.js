// Email service for sending invoices
// Email service for sending invoices
// email-service.js

import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || // from your .env file in production
  (window.location.hostname === "localhost" ? "http://localhost:5000" : ""); // fallback: same origin when deployed with backend

export const sendInvoiceEmail = async (recipientEmail, invoice, senderInfo) => {
  try {
    console.log("[v0] Sending invoice email to:", recipientEmail);

    await axios.post("/api/send-email", {
      recipientEmail,
      invoice,
      senderInfo,
    });
    // const emailRes = await axios(`${API_BASE_URL}/api/send-email`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: { recipientEmail, invoice, senderInfo },
    // );

    // if (!emailRes.ok) {
    //   throw new Error("Failed to send email");
    // }

    return {
      success: true,
      message: `Invoice ${invoice.id} has been sent to ${recipientEmail} successfully!`,
    };
  } catch (error) {
    console.error("[v0] Error sending email:", error);
    return {
      success: false,
      message: "Failed to send invoice email. Please try again later.",
    };
  }
};

export const sendAccountMail = async (userData) => {
  try {
    const recipients = [
      "welcome@yagso.com", // Admin email
      userData.email, // New user email
    ];

    await Promise.all(
      recipients.map((recipientEmail) =>
        axios.post("/api/send-account-mail", {
          recipientEmail,
          userData,
        })
      )
    );

    console.log("✅ Account creation emails sent successfully");
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending account creation email:", error);
    return { success: false, error: error.message };
  }
};

// Function to download invoice as PDF (placeholder for future implementation)
export const downloadInvoiceAsPDF = async (invoice) => {
  try {
    // This would typically use a library like jsPDF or html2pdf
    // For now, we'll trigger the browser's print dialog
    window.print();

    return {
      success: true,
      message: "Invoice download initiated",
    };
  } catch (error) {
    console.error("[v0] Error downloading invoice:", error);
    return {
      success: false,
      message: "Failed to download invoice",
    };
  }
};

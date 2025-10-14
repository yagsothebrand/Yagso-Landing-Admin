// server.js
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// API route for sending emails
app.post("/api/send-email", async (req, res) => {
  const { recipientEmail, invoice, senderInfo } = req.body;
  console.log(req.body);
  try {
    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "onboarding@resend.dev",
        to: recipientEmail,
        subject: `Invoice ${invoice.id}`,
        html: `<h1>Invoice ${invoice.id}</h1><p>From ${senderInfo.companyName}</p>`,
      },
      {
        headers: {
          Authorization: `Bearer ${
            process.env.RESEND_API_KEY || "YOUR_API_KEY_HERE"
          }`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});

import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

// ✅ CORS setup (safe and flexible)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://www.yagso.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Route to send account-related emails
app.post("/api/send-account-mail", async (req, res) => {
  const { recipientEmail, userData } = req.body;

  if (!recipientEmail || !userData) {
    return res
      .status(400)
      .json({ error: "Missing recipientEmail or userData" });
  }

  try {
    const isAdmin = recipientEmail === "welcome@yagso.com";

    // ✉️ Different subjects for admin and user
    const subject = isAdmin
      ? `New Account Created: ${userData.firstName} ${userData.lastName}`
      : `Welcome to Yagso, ${userData.firstName}!`;

    // 👨‍💼 Message for admin
    const messageForAdmin = `
      <div style="font-family:Arial,sans-serif;padding:20px;color:#1e293b;">
        <h2>New Account Created</h2>
        <p>A new user has registered on the platform.</p>
        <ul>
          <li><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</li>
          <li><strong>Email:</strong> ${userData.email}</li>
          <li><strong>Phone:</strong> ${userData.phone}</li>
          <li><strong>Department:</strong> ${userData.department}</li>
          <li><strong>Role:</strong> ${userData.role}</li>
        </ul>
        <p>Please log in to the admin dashboard to review and activate the account.</p>
      </div>
    `;

    // 👋 Message for new user
    const messageForUser = `
      <div style="font-family:Arial,sans-serif;padding:20px;color:#1e293b;">
        <h2>Welcome to Yagso 🎉</h2>
        <p>Hello ${userData.firstName},</p>
        <p>Your account has been successfully created. Our team will activate it shortly.</p>
        <p>Thank you for joining us!</p>
        <p><strong>Yagso Team</strong><br>
        <a href="mailto:info@yagso.com">info@yagso.com</a><br>
       Ibadan.</p>
      </div>
    `;

    const html = isAdmin ? messageForAdmin : messageForUser;

    // ✅ Send via Resend
    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Yagso <no-reply@yagso.com>", // must be a verified domain in Resend
        to: recipientEmail,
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`📩 Account email sent to ${recipientEmail}`);
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error(
      "❌ Failed to send account email:",
      error.response?.data || error.message
    );
    return res.status(500).json({
      error: "Failed to send account email",
      details: error.response?.data || error.message,
    });
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

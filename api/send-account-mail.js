import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5174",
      "https://www.osonduautos.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

app.post("/api/send-account-mail", async (req, res) => {
  const { recipientEmail, userData } = req.body;

  if (!recipientEmail || !userData) {
    return res.status(400).json({
      error: "Missing recipientEmail or userData",
    });
  }

  try {
    const isAdmin = recipientEmail === "osonduautos@gmail.com";

    const subject = isAdmin
      ? `New Account Created: ${userData.firstName} ${userData.lastName}`
      : `Welcome to Osondu Autos, ${userData.firstName}!`;

    const messageForAdmin = `
      <p>Hello Admin,</p>
      <p>A new user has just created an account on the platform.</p>
      <ul>
        <li><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</li>
        <li><strong>Email:</strong> ${userData.email}</li>
        <li><strong>Phone:</strong> ${userData.phone}</li>
        <li><strong>Department:</strong> ${userData.department}</li>
        <li><strong>Role:</strong> ${userData.role}</li>
      </ul>
      <p>Login to the admin dashboard to activate the account.</p>
    `;

    const messageForUser = `
      <p>Hello ${userData.firstName},</p>
      <p>Welcome to <strong>Osondu Autos</strong> 🎉</p>
      <p>Your account has been successfully created. Our team will activate your account shortly.</p>
      <p>Thank you for joining us!</p>
      <p><strong>Osondu Autos Team</strong><br/>
      <a href="mailto:info@osonduautos.com">info@osonduautos.com</a><br/>
      Block 2 Shop 33 Aspamda Main Gate Tradefair, Ojo.</p>
    `;

    const html = isAdmin ? messageForAdmin : messageForUser;

    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "Osondu Autos <no-reply@osonduautos.com>",
        to: recipientEmail,
        subject,
        html,
      },
      {
        headers: {
          Authorization: `Bearer re_9qpdZpdK_G2Mkz79beYf1yRkxDZDkuWNU`,
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

app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});

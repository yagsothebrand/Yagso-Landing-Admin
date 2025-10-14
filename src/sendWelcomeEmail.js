import axios from "axios";

async function sendWelcomeEmail(email, passcode) {
  try {
    const res = await axios.post(
      "https://api.resend.com/emails",
      {
        from: "welcome@yourdomain.com", // custom sender
        to: email,
        subject: "🎉 Welcome to the Waitlist",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h1>Welcome!</h1>
            <p>Thanks for joining our waitlist. Your unique passcode is:</p>
            <h2 style="color: #4F46E5;">${passcode}</h2>
            <p>Keep it safe — you’ll need it later!</p>
          </div>
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent:", res.data);
  } catch (error) {
    console.error("❌ Email failed:", error.response?.data || error.message);
  }
}

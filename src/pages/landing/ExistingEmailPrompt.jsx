"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function ExistingEmailPrompt({ emailData, onBack }) {
  const [passcode, setPasscode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = () => {
    if (passcode === emailData.passcode) {
    //   localStorage.setItem("accessGranted", "true");
      window.location.href = `/auth/${emailData.tokenId}`;
    } else {
      setMessage("Incorrect passcode. Try again.");
    }
  };

  const handleResend = async () => {
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: emailData.email,
        passcode: emailData.passcode,
        tokenId: emailData.tokenId,
      }),
    });
    setMessage("Email resent! Check your inbox.");
  };

  return (
    <div className="text-center p-8 bg-stone-900 rounded-2xl">
      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
      <h2 className="text-2xl text-green-700 mb-4">Welcome Back</h2>
      <p>Enter your passcode or resend the access email.</p>

      <input
        type="text"
        placeholder="Enter passcode"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        className="w-full p-3 rounded-md my-4 text-center"
      />

      <div className="flex justify-center space-x-4">
        <button
          onClick={handleVerify}
          className="px-4 py-2 bg-green-700 text-white rounded-md"
        >
          Verify
        </button>
        <button
          onClick={handleResend}
          className="px-4 py-2 bg-stone-700 text-white rounded-md"
        >
          Resend Email
        </button>
      </div>

      {message && <p className="mt-4 text-green-300">{message}</p>}
      <button onClick={onBack} className="mt-4 underline text-stone-300">
        Back
      </button>
    </div>
  );
}

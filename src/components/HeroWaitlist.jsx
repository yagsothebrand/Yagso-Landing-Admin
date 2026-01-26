import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

import { requestWaitlistAccess, sendWaitlistEmail } from "../utils/waitlistApi";
import { useLandingAuth } from "./auth/LandingAuthProvider";

const BRAND = "#948179";
const CREAM = "#fbfaf8";

export default function WaitlistPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const { setToken, setAccessGranted } = useLandingAuth();

  // Add this debugging version to see what's happening

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const clean = email.trim().toLowerCase();
    if (!clean) {
      setLoading(false);
      return;
    }

    try {
      console.log("1. Requesting waitlist access for:", clean);
      const result = await requestWaitlistAccess(clean);
      console.log("2. Waitlist access result:", result);

      // If user already verified before, skip email & allow forever
      if (result.grantForever) {
        console.log("3. User already verified, granting access");
        setToken(result.tokenId);
        setAccessGranted(true);
        navigate(`/`, { replace: true });
        return;
      }

      const tokenId = result.tokenId;
      const passcode = result.passcode;
      const magicLink = `https://yagso.com/${tokenId}`;

      console.log("4. Preparing to send email with:", {
        email: result.email || clean,
        tokenId,
        passcode,
        magicLink,
        isResend: result.isExisting,
      });

      const resp = await sendWaitlistEmail({
        email: result.email || clean,
        passcode,
        tokenId,
        magicLink,
        isResend: result.isExisting,
      });

      console.log("5. Email send response:", resp);

      if (!resp?.success) {
        console.error("6. Email send failed:", resp);
        throw new Error("Failed to send email.");
      }

      console.log("7. Email sent successfully, navigating to check-email page");
      navigate(`/check-your-email`, {
        state: { email: clean },
        replace: true,
      });
    } catch (err) {
      console.error("Error in handleSubmit:", err);
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="min-h-[calc(100vh-122px)] flex items-center">
        <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 text-[11px] tracking-[0.24em] uppercase font-medium px-5 py-2.5 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${BRAND}25 0%, ${BRAND}15 100%)`,
                  border: `1px solid ${BRAND}40`,
                  boxShadow: `0 4px 16px ${BRAND}20`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: CREAM,
                    boxShadow: `0 0 8px ${CREAM}80`,
                  }}
                />
                Now Launching • Limited Access • Get Early Entry
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-8 text-[46px] leading-[1.08] md:text-[64px] font-bold tracking-tight"
                style={{ color: CREAM }}
              >
                Jewelry that whispers{" "}
                <span
                  className="relative inline-block"
                  style={{ color: BRAND }}
                >
                  luxury
                  <span
                    className="absolute -bottom-2 left-0 w-full h-[2px] rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${BRAND} 0%, transparent 100%)`,
                    }}
                  />
                </span>
                .
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-6 max-w-xl text-[16px] md:text-[17px] leading-relaxed"
                style={{ color: `${CREAM}e6` }}
              >
                Meet YAGSO — timeless pieces designed for everyday elegance.
                We're opening our doors to a select few. Request access to shop
                our launch collection before anyone else.
              </motion.p>

              {/* Waitlist Form */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mt-10"
              >
                <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="h-14 px-5 rounded-full text-[15px] font-medium transition-all duration-200"
                    style={{
                      background: `${CREAM}12`,
                      border: `1px solid ${CREAM}25`,
                      color: CREAM,
                      boxShadow: `0 2px 8px ${BRAND}10`,
                    }}
                  />
                  <Button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="h-14 px-8 rounded-full font-semibold text-[15px] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND} 0%, ${BRAND}dd 100%)`,
                      color: CREAM,
                      border: `1px solid ${BRAND}40`,
                    }}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
                          style={{ borderTopColor: `${CREAM}30` }}
                        />
                        Sending...
                      </span>
                    ) : (
                      "Request Access"
                    )}
                  </Button>
                </div>

                <p
                  className="mt-4 text-[13px] flex items-center gap-2"
                  style={{ color: `${CREAM}b3` }}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Instant access for approved members. No spam, ever.
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 rounded-2xl px-5 py-4 flex items-start gap-3"
                    style={{
                      background: "rgba(220, 38, 38, 0.1)",
                      border: "1px solid rgba(220, 38, 38, 0.2)",
                    }}
                  >
                    <svg
                      className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-red-200 font-medium">{error}</p>
                  </motion.div>
                )}
              </motion.form>
            </div>

            {/* Right: Refined glass card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="hidden lg:block"
            >
              <div
                className="ml-auto max-w-md rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
                style={{
                  background: `linear-gradient(135deg, ${CREAM}08 0%, ${CREAM}03 100%)`,
                  border: `1px solid ${CREAM}15`,
                }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${BRAND}30 0%, ${BRAND}15 100%)`,
                      border: `1px solid ${BRAND}40`,
                    }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: BRAND }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      className="text-[11px] tracking-[0.2em] uppercase font-semibold"
                      style={{ color: `${CREAM}99` }}
                    >
                      Launch Collection
                    </p>
                    <p
                      className="text-xl font-bold mt-0.5"
                      style={{ color: CREAM }}
                    >
                      Now Available
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {[
                    { icon: "✦", text: "18K gold-plated essentials" },
                    { icon: "◆", text: "Hand-selected natural stones" },
                    { icon: "⬡", text: "Exclusive launch pricing" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.text}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                      className="flex items-center gap-3.5 group"
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-transform duration-200 group-hover:scale-110"
                        style={{
                          background: `${BRAND}20`,
                          color: BRAND,
                          border: `1px solid ${BRAND}30`,
                        }}
                      >
                        {item.icon}
                      </div>
                      <span
                        className="text-[15px] font-medium"
                        style={{ color: `${CREAM}e6` }}
                      >
                        {item.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div
                  className="my-6 h-[1px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${CREAM}20, transparent)`,
                  }}
                />

                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: `${BRAND}08`,
                    border: `1px solid ${BRAND}15`,
                  }}
                >
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: `${CREAM}cc` }}
                  >
                    <span className="font-semibold" style={{ color: BRAND }}>
                      Limited spots:
                    </span>{" "}
                    We're granting access to a select number of members to
                    ensure an intimate shopping experience. Request yours now.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="pb-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider px-4 py-2 rounded-full"
            style={{
              color: `${CREAM}80`,
              background: `${CREAM}05`,
              border: `1px solid ${CREAM}10`,
            }}
          >
            <span
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: BRAND }}
            />
            © 2025 YAGSO. Timeless luxury.
          </div>
        </div>
      </footer>
    </div>
  );
}

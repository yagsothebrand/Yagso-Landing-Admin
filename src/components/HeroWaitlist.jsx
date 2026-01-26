import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

import { requestWaitlistAccess, sendWaitlistEmail } from "../utils/waitlistApi";
import { useLandingAuth } from "./auth/LandingAuthProvider";

const BRAND = "#948179";
export default function WaitlistPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setToken, setAccessGranted } = useLandingAuth();

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
      const result = await requestWaitlistAccess(clean);

      // ✅ if user already verified before, skip email & allow forever
      if (result.grantForever) {
        setToken(result.tokenId);
        setAccessGranted(true);
        navigate(`/`, { replace: true });
        return;
      }

      const tokenId = result.tokenId;
      const passcode = result.passcode;
      const magicLink = `https://yagso.com/${tokenId}`;

      const resp = await sendWaitlistEmail({
        email: result.email || clean,
        passcode,
        tokenId,
        magicLink,
        isResend: result.isExisting,
      });

      if (!resp?.success) throw new Error("Failed to send email.");

      // ✅ optional: DO NOT grant access yet; wait for link click
      // (this matches your requirement)
      navigate(`/check-your-email`, { replace: true });
    } catch (err) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen ">
      <section className="min-h-[calc(100vh-122px)] flex items-center">
        <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left: Copy */}
            <div className="text-white">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 text-[12px] tracking-[0.22em] uppercase bg-white/10 border border-white/15 px-4 py-2 rounded-sm"
              >
                Handcrafted • Limited Drops • Premium Finish
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="mt-6 text-[42px] leading-[1.05] md:text-[56px] font-semibold"
              >
                Jewelry that whispers{" "}
                <span style={{ color: BRAND }}>luxury</span>.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="mt-5 max-w-xl text-white/85 text-[15px] md:text-[16px] leading-relaxed"
              >
                Meet YAGSO — timeless pieces designed for everyday elegance.
                Join the waitlist for early access, drop alerts, and exclusive
                pricing.
              </motion.p>

              {/* Waitlist */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.18 }}
                className="mt-8"
              >
                <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-12 bg-white/10 text-white placeholder:text-white/60 border-white/20 focus-visible:ring-0"
                  />
                  <Button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="h-12 rounded-sm text-white font-semibold disabled:opacity-60"
                    style={{ backgroundColor: BRAND }}
                  >
                    {loading ? "Sending..." : "Join the Waitlist"}
                  </Button>
                </div>

                <p className="mt-3 text-xs text-white/65">
                  No spam. Just drop dates + early access.
                </p>

                {error ? (
                  <p className="mt-3 text-sm text-red-300 bg-red-900/30 border border-red-500/20 rounded-sm px-4 py-3">
                    {error}
                  </p>
                ) : null}
              </motion.form>
            </div>

            {/* Right: Minimal “glass” card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="hidden lg:block"
            >
              <div className="ml-auto max-w-md rounded-sm border border-white/15 bg-white/10 backdrop-blur-md p-8">
                <p className="text-white/80 text-sm tracking-[0.14em] uppercase">
                  Next Drop
                </p>
                <p className="mt-2 text-white text-2xl font-semibold">
                  Signature Collection
                </p>

                <div className="mt-6 space-y-3">
                  {[
                    "Gold-tone essentials",
                    "Minimal stones, max shine",
                    "Limited quantities per drop",
                  ].map((t) => (
                    <div
                      key={t}
                      className="flex items-center gap-3 text-white/80"
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: BRAND }}
                      />
                      <span className="text-sm">{t}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8 h-[1px] bg-white/15" />
                <p className="mt-5 text-xs text-white/65 leading-relaxed">
                  Tip: keep this card subtle so the video remains the “luxury
                  mood” while the form stays readable.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="pb-8 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-stone-700 text-sm font-bold">
            © 2025 Yagso. Timeless luxury.
          </p>
        </div>
      </footer>
    </div>
  );
}

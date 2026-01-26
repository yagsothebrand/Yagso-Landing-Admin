import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, AlertCircle, CheckCircle } from "lucide-react";

import { requestWaitlistAccess, sendWaitlistEmail } from "../utils/waitlistApi";

const BRAND = "#948179";

function maskEmail(email = "") {
  const e = String(email || "").trim();
  if (!e.includes("@")) return e || "your email";
  const [name, domain] = e.split("@");
  const safeName =
    name.length <= 2 ? `${name[0] || "*"}*` : `${name.slice(0, 2)}***`;
  const parts = domain.split(".");
  const d0 = parts[0] || "";
  const safeDomain = d0.length <= 2 ? `${d0}*` : `${d0.slice(0, 2)}***`;
  const tld = parts.slice(1).join(".") || "";
  return `${safeName}@${safeDomain}${tld ? `.${tld}` : ""}`;
}

function getQueryEmail(search = "") {
  try {
    const sp = new URLSearchParams(search);
    return sp.get("email") || "";
  } catch {
    return "";
  }
}

export default function CheckYourEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const emailFromState = location?.state?.email || "";
  const emailFromQuery = getQueryEmail(location?.search || "");
  const email = (emailFromState || emailFromQuery || "").trim().toLowerCase();

  const masked = useMemo(() => maskEmail(email), [email]);

  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  useEffect(() => {
    setMsg("");
    setErr("");
  }, []);

  const goWaitlist = () => navigate("/waitlist", { replace: true });

  const handleResend = async () => {
    setErr("");
    setMsg("");

    if (!email) {
      setErr("We couldn't locate your email. Please go back and try again.");
      return;
    }
    if (cooldown > 0) return;

    setResending(true);
    try {
      const result = await requestWaitlistAccess(email);

      if (result?.grantForever) {
        navigate("/", { replace: true });
        return;
      }

      const tokenId = result.tokenId;
      const passcode = result.passcode;
      const magicLink = `https://yagso.com/${tokenId}`;

      const resp = await sendWaitlistEmail({
        email: result.email || email,
        passcode,
        tokenId,
        magicLink,
        isResend: true,
      });

      if (!resp?.success) throw new Error("Failed to resend email.");

      setMsg("New link sent successfully. Please check your inbox.");
      setCooldown(30);
    } catch (e) {
      setErr(e?.message || "Could not resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8]/40">
      {/* Top navigation bar */}
     

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-[12px] tracking-[0.18em] uppercase" style={{ color: BRAND }}>
            Email Verification
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Check Your Email</h1>
          <p className="text-slate-600 mt-2">
            We sent a secure access link to <span className="font-semibold">{masked}</span>
          </p>
        </div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/60 backdrop-blur border border-slate-200 rounded-none overflow-hidden mb-4"
        >
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white/70">
            <div className="flex items-center justify-between">
              <p className="text-sm tracking-[0.18em] uppercase font-bold text-slate-700">
                Next Steps
              </p>
              <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                Instructions
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-12 h-12 border bg-white rounded-none flex items-center justify-center shrink-0"
                style={{ borderColor: `${BRAND}26` }}
              >
                <Mail className="w-5 h-5" style={{ color: BRAND }} />
              </div>
              <div>
                <p className="text-slate-700 font-medium leading-relaxed">
                  Click the link in your email to verify and access YAGSO. If you don't see it within a minute,
                  check your <span className="font-bold" style={{ color: BRAND }}>Spam</span> or{" "}
                  <span className="font-bold" style={{ color: BRAND }}>Promotions</span> folder.
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  💡 Try searching for "YAGSO" or "access link"
                </p>
              </div>
            </div>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {msg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 border rounded-none flex items-start gap-3"
                  style={{
                    background: `${BRAND}10`,
                    borderColor: `${BRAND}40`,
                  }}
                >
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND }} />
                  <p className="text-sm text-slate-700 font-medium">{msg}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {err && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-4 border border-red-200 bg-red-50 rounded-none flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{err}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleResend}
                disabled={resending || cooldown > 0}
                className="flex-1 h-11 rounded-none text-white font-semibold tracking-wide hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: BRAND }}
              >
                {resending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Resending...
                  </span>
                ) : cooldown > 0 ? (
                  `Resend in ${cooldown}s`
                ) : (
                  "Resend Link"
                )}
              </Button>

              <Button
                variant="outline"
                onClick={goWaitlist}
                className="flex-1 h-11 rounded-none border-slate-200 bg-white hover:border-slate-300"
              >
                Change Email
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Security Notice */}
        <div className="mb-4 p-4 border border-slate-200 bg-white rounded-none">
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <span className="text-lg">🔒</span>
            This link is private and secure — don't forward it to anyone.
          </p>
        </div>

        {/* Troubleshooting Card */}
        <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-none overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-white/70">
            <p className="text-sm tracking-[0.18em] uppercase font-bold text-slate-700">
              Didn't Receive It?
            </p>
          </div>

          <div className="p-6">
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <span style={{ color: BRAND }}>•</span>
                <span>Check your spam, promotions, or junk folder</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: BRAND }}>•</span>
                <span>Make sure your inbox isn't full</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: BRAND }}>•</span>
                <span>If you used "Hide My Email", check that inbox</span>
              </li>
              <li className="flex items-start gap-3">
                <span style={{ color: BRAND }}>•</span>
                <span>Wait a few minutes — emails can be delayed</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs tracking-wider px-4 py-2 border border-slate-200 bg-white rounded-none">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: BRAND }} />
            <span className="text-slate-500 font-medium">
              © 2025 YAGSO • Timeless luxury
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
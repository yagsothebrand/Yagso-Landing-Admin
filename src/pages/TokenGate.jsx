import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getWaitlistByToken, markWaitlistLogin } from "../utils/waitlistApi";
import { useLandingAuth } from "@/components/auth/LandingAuthProvider";
import { ArrowLeft, ShieldCheck, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const BRAND = "#948179";

export default function TokenGate() {
  const { tokenId } = useParams();
  const navigate = useNavigate();
  const { setToken, setAccessGranted } = useLandingAuth();

  const [status, setStatus] = useState("loading"); // loading | error
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let alive = true;

    // Simulated progress for smoother UX
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 200);

    (async () => {
      try {
        if (!tokenId) throw new Error("Missing token.");

        const record = await getWaitlistByToken(tokenId);
        if (!record?.id) throw new Error("Invalid or expired link.");

        await markWaitlistLogin(tokenId);

        // Complete progress
        setProgress(100);
        
        // Grant access locally
        setToken(tokenId);
        setAccessGranted(true);

        // Small delay to show completion
        await new Promise((r) => setTimeout(r, 400));

        if (!alive) return;
        navigate("/", { replace: true });
      } catch (e) {
        clearInterval(progressInterval);
        if (!alive) return;
        setError(e?.message || "Invalid link.");
        setStatus("error");
      }
    })();

    return () => {
      alive = false;
      clearInterval(progressInterval);
    };
  }, [tokenId, navigate, setToken, setAccessGranted]);

  if (status === "error") {
    return (
      <div className="min-h-screen bg-[#fbfaf8]/30 pt-24">
        {/* Top navigation bar */}
       

        {/* Main content */}
        <div className="max-w-md mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-6 text-center">
            <p className="text-[12px] tracking-[0.18em] uppercase" style={{ color: BRAND }}>
              Access Verification
            </p>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Access Denied</h1>
          </div>

          {/* Error Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white/40 backdrop-blur border border-slate-200 rounded-none overflow-hidden mb-4"
          >
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-slate-200 bg-white/70">
              <div className="flex items-center justify-between">
                <p className="text-sm tracking-[0.18em] uppercase font-bold text-slate-700">
                  Error
                </p>
                <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                  Invalid Link
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-12 h-12 border bg-white rounded-none flex items-center justify-center shrink-0"
                  style={{ borderColor: "rgba(239, 68, 68, 0.3)" }}
                >
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-slate-700 font-semibold mb-2">
                    This link can't be verified
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => navigate("/waitlist", { replace: true })}
                  variant="outline"
                  className="flex-1 h-11 rounded-none border-slate-200 bg-white hover:border-slate-300"
                >
                  Back to Waitlist
                </Button>

                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 h-11 rounded-none text-white font-semibold tracking-wide hover:opacity-90"
                  style={{ backgroundColor: BRAND }}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Help text */}
          <div className="text-center">
            <p className="text-sm text-slate-500">
              Need help? Make sure you're using the link from your email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen bg-[#fbfaf8]/30 pt-20">
      {/* Top navigation bar */}
      {/* <div className="sticky top-0 z-20 bg-white/50 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4" style={{ color: BRAND }} />
            Verifying Access
          </div>
        </div>
      </div> */}

      {/* Main content */}
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-6 text-center">
          <p className="text-[12px] tracking-[0.18em] uppercase" style={{ color: BRAND }}>
            Access Verification
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">Verifying Access</h1>
          <p className="text-slate-600 mt-2">Please wait while we confirm your invitation</p>
        </div>

        {/* Loading Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/50 backdrop-blur border border-slate-200 rounded-none overflow-hidden mb-4"
        >
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white/70">
            <div className="flex items-center justify-between">
              <p className="text-sm tracking-[0.18em] uppercase font-bold text-slate-700">
                Authenticating
              </p>
              <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                In Progress
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {/* Loading spinner */}
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 border-4 border-slate-200 border-t-transparent rounded-full animate-spin"
                style={{ borderTopColor: BRAND }}
              />
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-500 font-medium">
                  Progress
                </span>
                <span className="text-xs font-semibold" style={{ color: BRAND }}>
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: BRAND,
                  }}
                />
              </div>
            </div>

            {/* Status indicators */}
            <div className="space-y-3">
              {[
                { label: "Validating token", done: progress > 30 },
                { label: "Checking permissions", done: progress > 60 },
                { label: "Granting access", done: progress > 90 },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      step.done
                        ? "border-current scale-100"
                        : "border-slate-300 scale-95 opacity-50"
                    }`}
                    style={{ 
                      color: step.done ? BRAND : "transparent",
                      borderColor: step.done ? BRAND : undefined
                    }}
                  >
                    {step.done && (
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm transition-all duration-300 ${
                      step.done ? "text-slate-700 font-medium" : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Info text */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            You'll be redirected automatically when verification is complete.
          </p>
        </div>
      </div>
    </div>
  );
}
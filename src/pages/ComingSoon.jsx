import React from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

// ComingSoon.jsx (no waitlist version)
export default function ComingSoon({
  title = "We're launching soon",
  subtitle = "Something awesome is on the way. Stay tuned.",
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100 overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Visual / Illustration area */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-sky-500 to-emerald-400 p-8">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-white text-center space-y-4"
            >
              <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-white/10 mx-auto">
                <Clock className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-semibold">Hang tight</h3>
              <p className="max-w-xs text-sm opacity-90">
                We\'re polishing the final details. Launch is just around the
                corner.
              </p>
            </motion.div>
          </div>

          {/* Right: Content area */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                {title}
              </h1>
              <p className="mt-3 text-slate-600 max-w-xl">{subtitle}</p>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                  🚀
                </div>
                <div>
                  <div className="font-medium">Feature-rich</div>
                  <div className="opacity-80">Fast, polished experience</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                  🔒
                </div>
                <div>
                  <div className="font-medium">Secure</div>
                  <div className="opacity-80">Privacy-focused</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                  ⚡
                </div>
                <div>
                  <div className="font-medium">Fast</div>
                  <div className="opacity-80">Optimized performance</div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t pt-6 text-xs text-slate-500">
              <p>
                Need help? Email us at{" "}
                <a href="info@osonduautos.com" className="underline">
                  info@osonduautos.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

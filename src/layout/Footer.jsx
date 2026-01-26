"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Check, Loader2, Heart } from "lucide-react";

const BRAND_GREEN = "#133827";
const BRAND_TAUPE = "#ffffff";
const BRAND_NUDE = "#debfad";
const BG = "#fbfaf8";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validEmail = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);
  const isValid = validEmail.test(email);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const handleSubscribe = async () => {
    if (!isValid || isLoading) return;
    setIsLoading(true);

    try {
      // Simulated API call - replace with your Firebase logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitted(true);
      setEmail("");

      setTimeout(() => {
        setSubmitted(false);
        setTouched(false);
      }, 2800);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer
      className="border-t bg-[#948179]/45"
      style={{
        borderColor: `${BRAND_TAUPE}26`,
        color: BRAND_GREEN,
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4  py-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10"
        >
          {/* Brand */}
          <motion.div variants={item} className="space-y-5">
            <img src="/logs.png" alt="YAGSO logo" className="w-28 h-auto" />

            <p
              className="text-[14px] leading-relaxed max-w-sm"
              style={{ color: BRAND_TAUPE }}
            >
              Experience the art of fine jewelry — timeless designs crafted to
              express elegance, intention, and individuality.
            </p>

            <div className="flex items-center gap-2.5">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/yagsobyfifii/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center border rounded-sm bg-white hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: `#948179`,
                  background: `#948179`,
                }}
              >
                <Instagram
                  className="w-[15px] h-[15px]"
                  style={{ color: BRAND_TAUPE }}
                />
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@yagsobyfifii"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="inline-flex h-9 w-9 items-center justify-center border rounded-sm bg-white hover:bg-gray-50 transition-colors"
                style={{
                  borderColor: `#948179`,
                        background:  `#948179`,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ color: BRAND_TAUPE }}
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Links */}
          <motion.div variants={item} className="space-y-5">
            <h3
              className="text-[12px] font-bold tracking-[0.14em] uppercase"
              style={{ color: `BRAND_GREEN` }}
            >
              Legal
            </h3>

            <div className="space-y-3 text-[14px]">
              <a
                href="/return-refund"
                className="block transition-colors hover:text-slate-900"
                style={{ color: BRAND_TAUPE }}
              >
                Return & Refund Policy
              </a>
              <a
                href="/terms"
                className="block transition-colors hover:text-slate-900"
                style={{ color: BRAND_TAUPE }}
              >
                Terms of Service
              </a>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={item} className="space-y-5">
            <h3
              className="text-[12px] font-bold tracking-[0.14em] uppercase"
              style={{ color: BRAND_GREEN }}
            >
              Contact
            </h3>

            <div className="space-y-3 text-[14px]">
              <a
                href="tel:09153480722"
                className="block transition-colors hover:text-slate-900"
                style={{ color: BRAND_TAUPE }}
              >
                0915 348 0722
              </a>
              <a
                href="mailto:support@yagso.com"
                className="block transition-colors hover:text-slate-900 break-all"
                style={{ color: BRAND_TAUPE }}
              >
                support@yagso.com
              </a>
            </div>

            <p className="text-xs" style={{ color: `#ffffff` }}>
              Lagos, Nigeria
            </p>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={item} className="space-y-5">
            <h3
              className="text-[12px] font-bold tracking-[0.14em] uppercase"
              style={{ color: BRAND_GREEN }}
            >
              Newsletter
            </h3>
            <p
              className="text-[14px] leading-relaxed"
              style={{ color: BRAND_TAUPE }}
            >
              Exclusive drops, private sales, and fine jewelry insights.
            </p>

            {!submitted ? (
              <div className="space-y-2.5">
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="Email address"
                    className="h-10 w-full px-3 text-[14px] bg-white border rounded-sm focus:outline-none transition-colors"
                    style={{
                      borderColor: touched
                        ? isValid
                          ? `#948179`
                          : "#dc2626"
                        : `#948179`,
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  />

                  <button
                    onClick={handleSubscribe}
                    disabled={!isValid || isLoading}
                    className="h-10 px-5 text-[14px] font-semibold border rounded-sm transition-all disabled:opacity-50 hover:opacity-90"
                    style={{
                      borderColor: `#948179`,
                      background: BRAND_TAUPE,
                 
                      cursor: !isValid || isLoading ? "not-allowed" : "pointer",
                    }}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                      </span>
                    ) : (
                      "Join"
                    )}
                  </button>
                </div>

                {touched && !isValid && email && (
                  <p className="text-[11px] text-red-600 font-medium">
                    Please enter a valid email.
                  </p>
                )}

                <p className="text-[11px]" style={{ color: `#ffffff` }}>
                  By subscribing, you agree to receive emails from YAGSO.
                </p>
              </div>
            ) : (
              <div
                className="border bg-white/70 p-4 rounded-sm"
                style={{
                  borderColor: `#948179`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-9 w-9 grid place-items-center border rounded-sm"
                    style={{
                      borderColor: `#948179`,
                      background: `${BRAND_TAUPE}08`,
                    }}
                  >
                    <Check size={16} style={{ color: BRAND_TAUPE }} />
                  </div>

                  <div className="min-w-0">
                    <p
                      className="text-sm font-semibold"
                      style={{ color: BRAND_GREEN }}
                    >
                      Subscribed
                    </p>
                    <p className="text-xs" style={{ color: BRAND_TAUPE }}>
                      Welcome — check your inbox soon.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Divider + Bottom */}
        <div
          className="mt-16 pt-8 border-t"
          style={{ borderColor: `${BRAND_TAUPE}26` }}
        >
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-4 text-[12px]"
            style={{ color: `#ffffff` }}
          >
            <p>© {new Date().getFullYear()} YAGSO. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

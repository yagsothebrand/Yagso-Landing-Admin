"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Check, Loader2 } from "lucide-react";

const BRAND_GREEN = "#133827";
const BRAND_TAUPE = "#ffffff";
const BRAND_NUDE = "#debfad";

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      setEmail("");

      setTimeout(() => {
        setSubmitted(false);
        setTouched(false);
      }, 2800);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="relative border-t overflow-hidden">
      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <video
          src="/cart.mp4"
          type="video/mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        ></video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#4c3e39]/60" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-10">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10"
        >
          {/* BRAND */}
          <motion.div variants={item} className="space-y-5">
            <img src="/logs.png" alt="YAGSO logo" className="w-28 h-auto" />

            <p className="text-[14px] leading-relaxed text-white max-w-sm">
              Experience the art of fine jewelry — timeless designs crafted to
              express elegance, intention, and individuality.
            </p>

            <div className="flex gap-2.5">
              <a
                href="https://www.instagram.com/yagsobyfifii/"
                target="_blank"
                className="h-9 w-9 grid place-items-center border rounded-sm bg-white/20"
              >
                <Instagram size={15} className="text-white" />
              </a>

              <a
                href="https://www.tiktok.com/@yagsobyfifii"
                target="_blank"
                className="h-9 w-9 grid place-items-center border rounded-sm bg-white/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-white"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* LEGAL */}
          <motion.div variants={item} className="space-y-5">
            <h3 className="text-[12px] font-bold tracking-[0.14em] uppercase text-white">
              Legal
            </h3>

            <div className="space-y-3 text-[14px] text-white/90">
              <a href="/privacy-policy"> Privacy Policy</a>
            </div>
            <div className="space-y-3 text-[14px] text-white/90">
              <a href="/terms-and-conditions">Terms of Service</a>
            </div>
          </motion.div>

          {/* CONTACT */}
          <motion.div variants={item} className="space-y-5">
            <h3 className="text-[12px] font-bold tracking-[0.14em] uppercase text-white">
              Contact
            </h3>

            <div className="space-y-3 text-[14px] text-white/90">
              <a href="tel:09153480722">0915 348 0722</a>
            </div>
            <div className="space-y-3 text-[14px] text-white/90">
              <a href="mailto:support@yagso.com">support@yagso.com</a>
            </div>
            <p className="text-xs text-white/70">Lagos, Nigeria</p>
          </motion.div>

          {/* NEWSLETTER */}
          <motion.div variants={item} className="space-y-5">
            <h3 className="text-[12px] font-bold tracking-[0.14em] uppercase text-white">
              Newsletter
            </h3>

            <p className="text-[14px] text-white/90">
              Exclusive drops, private sales, and fine jewelry insights.
            </p>

            {!submitted ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  placeholder="Email address"
                  className="h-10 w-full px-3 text-[14px] bg-white/90 rounded-sm"
                />

                <button
                  onClick={handleSubscribe}
                  disabled={!isValid || isLoading}
                  className="h-10 px-5 text-[14px] font-semibold bg-white rounded-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Join"
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-white/80 p-4 rounded-sm">
                <Check size={16} />
                <span className="text-sm font-semibold">
                  Subscribed successfully
                </span>
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* BOTTOM */}
        <div className="mt-16 pt-8 border-t border-white/20 text-white text-xs text-center">
          © {new Date().getFullYear()} YAGSO. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import { motion } from "framer-motion";

const BRAND = "#948179";
const BORDER = `${BRAND}26`;

/**
 * One-file "Logo Sticker" (Card + Ticker)
 * Usage:
 * <YagsoLogoSticker logos={["/Yagso-logo.png", ...]} speed={220} />
 */
export default function YagsoLogoSticker({ logos = [], speed = 220 }) {
  const items = Array.isArray(logos) ? logos.filter(Boolean) : [];
  const repeated = [...items, ...items]; // seamless loop

  if (items.length === 0) return null;

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Sticker card */}
        <div
          className="relative overflow-hidden border bg-[#fffdfb] shadow-sm"
          style={{ borderColor: BORDER }}
        >
          {/* soft taupe wash */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute -top-20 -right-20 w-[280px] h-[280px] rounded-full blur-3xl opacity-25"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, rgba(148,129,121,0.22), transparent 65%)",
              }}
            />
            <div
              className="absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full blur-3xl opacity-20"
              style={{
                background:
                  "radial-gradient(circle at 70% 70%, rgba(148,129,121,0.16), transparent 65%)",
              }}
            />
          </div>

          <div className="relative z-10 px-6 py-5">
            {/* Label row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: BRAND }}
                />
                <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-slate-600">
                  Yagso • Timeless Luxury
                </p>
              </div>

              <p className="text-xs text-slate-500">
                Handcrafted • Limited Drops • Premium Finish
              </p>
            </div>

            {/* Ticker strip */}
            <div
              className="relative overflow-hidden border bg-white"
              style={{ borderColor: BORDER }}
            >
              {/* Fade edges */}
              <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

              <div className="h-[64px] w-full">
                <motion.div
                  className="flex items-center whitespace-nowrap h-full"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{
                    repeat: Infinity,
                    ease: "linear",
                    duration: speed / 10,
                  }}
                >
                  {repeated.map((logo, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 mx-10 flex items-center justify-center"
                    >
                      <img
                        src={logo}
                        alt={`Yagso logo ${index + 1}`}
                        className="h-8 md:h-9 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                        style={{ filter: "grayscale(100%)" }}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Bottom note */}
            <div
              className="mt-4 pt-4 border-t text-xs text-slate-500"
              style={{ borderColor: BORDER }}
            >
              Subtle. Clean. Premium — designed to match the YAGSO taupe system.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

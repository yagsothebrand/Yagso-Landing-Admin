import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const BRAND = "#fffdfb";
const BORDER = `${BRAND}26`;

export default function CTAFooter() {
  const navigate = useNavigate();

  return (
    <footer className="max-w-4xl mx-auto px-4 mt-20 pb-20">
      <div
        className="relative overflow-hidden border bg-[#948179] shadow-sm"
        style={{ borderColor: BORDER }}
      >
        {/* subtle taupe wash */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-24 -right-24 h-[340px] w-[340px] rounded-sm blur-3xl opacity-25"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(148,129,121,0.25), transparent 65%)",
            }}
          />
          <div
            className="absolute -bottom-28 -left-28 h-[360px] w-[360px] rounded-sm blur-3xl opacity-20"
            style={{
              background:
                "radial-gradient(circle at 70% 70%, rgba(148,129,121,0.18), transparent 65%)",
            }}
          />
        </div>

        <div className="relative z-10 p-6 sm:p-10 md:p-12">
          {/* top label */}

          <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Ready for your next drop?
              </h3>
              <p className="mt-2 text-[#fffdfb] text-[15px] md:text-[16px] leading-relaxed max-w-2xl">
                Shop timeless essentials, limited releases, and premium finish
                pieces — curated for everyday elegance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:justify-end">
              <Button
                onClick={() => navigate("/shop")}
                className="h-11 text-[#948179] font-semibold"
                style={{ backgroundColor: BRAND }}
              >
                Visit the Shop →
              </Button>
            </div>
          </div>

          {/* bottom fine print */}
          <div
            className="my-2 border-t text-xs text-slate-500"
            style={{ borderColor: BORDER }}
          >
         
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BRAND = "#948179";

export default function HeroShopVisual({ products = [] }) {
  const navigate = useNavigate();

  const featured = useMemo(
    () =>
      (products || [])
        .filter((p) => p.isFeatured === true && p.images?.length)
        .slice(0, 5),
    [products],
  );

  return (
    <section className="min-h-[calc(100vh-122px)] flex items-center">
      <div className="w-full max-w-[1200px] mx-auto px-4 lg:px-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-14 items-center">
          {/* LEFT — Editorial copy */}
          <div className="text-white">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/70">
              YAGSO — Fine Jewelry
            </p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-6 text-[44px] md:text-[60px] leading-[1.02] font-semibold"
            >
              Jewelry designed to be worn,
              <br />
              <span className="opacity-90">not stored.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-5 max-w-xl text-white/85 text-[15px] md:text-[16px] leading-relaxed"
            >
              Thoughtfully crafted pieces that elevate everyday moments —
              refined, intentional, and timeless.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14 }}
              className="mt-8 flex items-center gap-4"
            >
              <Button
                className="h-12 px-8 rounded-sm text-white font-semibold shadow-lg"
                style={{ backgroundColor: BRAND }}
                onClick={() => navigate("/shop")}
              >
                Shop Collection
              </Button>

              <Button
                variant="secondary"
                className="h-12 px-8 rounded-sm bg-white/10 text-white border border-white/20 hover:bg-white/20"
                onClick={() => navigate("/shop?featured=true")}
              >
                Featured Pieces
              </Button>
            </motion.div>
          </div>

          {/* RIGHT — Floating product imagery (NO cards) */}
          <div className="relative hidden lg:block h-[520px]">
            <div className="absolute inset-0 rounded-sm bg-black/10 border border-white/15 backdrop-blur-[2px]" />

            {featured.map((p, i) => (
              <FloatingImage
                key={p.id}
                src={p.images[0]}
                alt={p.name}
                index={i}
                onClick={() => navigate(`/product/${p.slug || p.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Individual floating image */
function FloatingImage({ src, alt, index, onClick }) {
  const positions = [
    { top: 30, left: 40, size: 180 },
    { top: 110, left: 220, size: 160 },
    { top: 240, left: 80, size: 170 },
    { top: 300, left: 260, size: 150 },
    { top: 170, left: 360, size: 140 },
  ];

  const p = positions[index % positions.length];

  return (
    <motion.img
      src={src}
      alt={alt}
      onClick={onClick}
      className="absolute cursor-pointer object-contain rounded-sm shadow-xl"
      style={{
        top: p.top,
        left: p.left,
        width: p.size,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{
        opacity: 1,
        y: [0, -10, 0],
      }}
      transition={{
        opacity: { duration: 0.4, delay: index * 0.08 },
        y: {
          duration: 7 + index,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      whileHover={{ scale: 1.03 }}
    />
  );
}

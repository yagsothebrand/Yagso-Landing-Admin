import React, { useEffect, useMemo, useState } from "react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "./auth/ProductsProvider";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const BRAND = "#948179";
const cn = (...c) => c.filter(Boolean).join(" ");

export default function FeaturedWideShowcase({
  title = "Trending Jewels",
  subtitle = "Handcrafted pieces. Limited drops. Premium finish.",
  rotateMs = 4500, // ✅ change speed here
}) {
  const navigate = useNavigate();
  const { products, addToCart } = useProducts();

  const featuredList = useMemo(() => {
    // ✅ stable "shuffle" (so order doesn't change every render)
    // If you want truly random each visit, keep as-is.
    const seed = String(products.length);
    const hash = [...seed].reduce((a, c) => a + c.charCodeAt(0), 0);
    const sorted = [...products].sort((a, b) => {
      const av = (String(a?.id || "").charCodeAt(0) || 0) + hash;
      const bv = (String(b?.id || "").charCodeAt(0) || 0) + hash;
      return av - bv;
    });

    return sorted;
  }, [products]);

  const [heroIndex, setHeroIndex] = useState(0);

  // keep heroIndex valid when list changes
  useEffect(() => {
    if (!featuredList.length) return;
    setHeroIndex((i) => (i >= featuredList.length ? 0 : i));
  }, [featuredList.length]);

  // ✅ rotation
  useEffect(() => {
    if (!featuredList.length) return;
    if (featuredList.length === 1) return;

    const t = setInterval(() => {
      setHeroIndex((i) => (i + 1) % featuredList.length);
    }, rotateMs);

    return () => clearInterval(t);
  }, [featuredList.length, rotateMs]);

  const hero = featuredList[heroIndex];

  // ✅ MOVED BEFORE EARLY RETURN - show "next" items excluding current hero
  const rest = useMemo(() => {
    if (!featuredList.length) return [];
    const others = featuredList.filter((p) => p?.id !== hero?.id);
    return others.slice(0, 8);
  }, [featuredList, hero?.id]);

  // ✅ Early return AFTER all hooks
  if (!featuredList.length) return null;

  const handleAdd = (p) => {
    // match your provider signature
    addToCart?.(p, 1, null, {}, []);
  };

  const goShop = () => navigate("/shop");

  return (
    <>
      {/* HERO WIDE */}
      <div
        className="relative overflow-hidden rounded-sm border bg-white"
        style={{ borderColor: `${BRAND}26` }}
      >
        <div className="relative h-[320px] md:h-[420px]">
          <AnimatePresence mode="wait">
            <motion.img
              key={hero?.id || hero?.name}
              src={hero?.images?.[0] || hero?.image || "/placeholder.svg"}
              alt={hero?.name || "Featured"}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          </AnimatePresence>

          {/* overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

          {/* left content */}
          <div className="absolute left-6 bottom-6 md:left-10 md:bottom-10 max-w-xl text-white">
            <p className="text-[11px] tracking-[0.22em] uppercase text-white/80">
              {subtitle}
            </p>

            <h2 className="mt-3 text-3xl md:text-5xl font-semibold leading-[1.05]">
              {title}
            </h2>

            <AnimatePresence mode="wait">
              <motion.p
                key={hero?.id || hero?.name}
                className="mt-3 text-white/80 text-sm md:text-base line-clamp-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {hero?.name}
                {hero?.description ? ` — ${hero.description}` : ""}
              </motion.p>
            </AnimatePresence>

            <div className="mt-5 flex items-center gap-2">
              {/* ✅ Explore now -> /shop */}
              <Button
                onClick={goShop}
                className="rounded-sm h-11 px-5 text-white font-semibold"
                style={{ backgroundColor: BRAND }}
              >
                Explore Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <button
                onClick={() => handleAdd(hero)}
                className="h-11 px-4 rounded-sm border bg-white/10 text-white text-sm font-semibold backdrop-blur hover:bg-white/15 transition inline-flex items-center gap-2"
                style={{ borderColor: "rgba(255,255,255,0.25)" }}
                title="Quick add"
              >
                <ShoppingBag className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>

          {/* right-bottom price chip */}
          <div
            className="absolute right-4 bottom-4 md:right-8 md:bottom-8 px-3 py-2 rounded-sm border bg-white/85 backdrop-blur text-slate-900 text-sm font-semibold"
            style={{ borderColor: `${BRAND}26` }}
          >
            {hero?.price != null
              ? `₦${Number(hero.price).toLocaleString()}`
              : "Featured"}
          </div>
        </div>
      </div>

      {/* MINI FEATURED ROW */}
      {rest.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs tracking-[0.22em] uppercase text-slate-600">
              Featured Picks
            </p>
            <div className="h-[1px] flex-1 mx-4 bg-slate-200" />
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-4 pr-4">
              {rest.map((p) => (
                <div
                  key={p.id}
                  className="group shrink-0 w-[280px] md:w-[320px]"
                >
                  <div
                    className="relative overflow-hidden rounded-sm border bg-white"
                    style={{ borderColor: `${BRAND}26` }}
                  >
                    <div className="relative h-[170px]">
                      <img
                        src={p?.images?.[0] || p?.image || "/placeholder.svg"}
                        alt={p?.name || "Product"}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />

                      <button
                        onClick={() => handleAdd(p)}
                        className={cn(
                          "absolute right-3 top-3 h-9 px-3 rounded-sm border text-xs font-semibold backdrop-blur transition",
                          "bg-white/85 hover:bg-white",
                        )}
                        style={{ borderColor: `${BRAND}26` }}
                        title="Add to cart"
                      >
                        <span className="inline-flex items-center gap-2">
                          <ShoppingBag
                            className="w-4 h-4"
                            style={{ color: BRAND }}
                          />
                          Add
                        </span>
                      </button>

                      <div className="absolute left-3 right-3 bottom-3 text-white">
                        <p className="text-sm font-semibold line-clamp-1">
                          {p?.name || "Untitled"}
                        </p>
                        <p className="text-xs text-white/85">
                          {p?.price != null
                            ? `₦${Number(p.price).toLocaleString()}`
                            : ""}
                        </p>
                      </div>
                    </div>

                    <div className="p-3">
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {p?.description ||
                          "Minimal. Timeless. Everyday luxury."}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* optional: tiny "changing" hint
          {featuredList.length > 1 && (
            <p className="mt-3 text-[11px] tracking-[0.18em] uppercase text-slate-400">
              Rotating featured drops
            </p>
          )} */}
        </div>
      )}
    </>
  );
}

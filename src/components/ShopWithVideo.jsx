import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Eye, Sparkles, ArrowRight } from "lucide-react";
import { useProducts } from "./auth/ProductsProvider";
import { useNavigate } from "react-router-dom";

const BRAND = "#948179";
const WARM_CREAM = "#fbfaf8";
const cx = (...c) => c.filter(Boolean).join(" ");

// Luxury Product Card Component
function LuxuryProductCard({ product, index = 0 }) {
  const { addToCart, formatPrice } = useProducts();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(true);

  const images = Array.isArray(product?.images) ? product.images : [];
  const mainImage = images?.[0] || "/placeholder.svg";
  const hoverImage = images?.[1] || mainImage;

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;

  const basePrice = Number(product?.price || 0);
  const variantPrices = variants
    .map((v) => Number(v?.price || 0))
    .filter((n) => Number.isFinite(n));

  const minVariantPrice = variantPrices.length
    ? Math.min(...variantPrices)
    : basePrice;
  const showFrom = hasVariants && variantPrices.length > 0;
  const displayPrice = showFrom ? minVariantPrice : basePrice;

  const baseStock = Number(product?.stock || 0);
  const variantStockSum = variants.reduce(
    (sum, v) => sum + Number(v?.stock || 0),
    0,
  );
  const displayStock = hasVariants ? variantStockSum : baseStock;

  const hasCustomFields = product?.customFields?.length > 0;
  const hasExtras = product?.extras?.length > 0;
  const hasRequiredCustomFields =
    product?.customFields?.some((f) => !!f.required) || false;
  const hasRequiredTextExtra =
    product?.extras?.some((x) => x?.type === "text" && x?.requiredText) ||
    false;

  const isLowStock = displayStock > 0 && displayStock <= 5;
  const isPopular = product?.popularity && product.popularity >= 80;

  const goToDetails = () => navigate(`/product/${product.id}`);

  const handleQuickAdd = (e) => {
    e?.stopPropagation?.();
    if (displayStock === 0) return;

    if (hasRequiredCustomFields || hasRequiredTextExtra) {
      goToDetails();
      return;
    }

    if (hasVariants && variants.length > 1) {
      goToDetails();
      return;
    }

    const selectedVariant =
      hasVariants && variants[0]
        ? {
            id: variants[0].id,
            name: variants[0].name,
            price: Number(variants[0].price || 0),
            stock: Number(variants[0].stock || 0),
            description: variants[0].description || "",
          }
        : null;

    addToCart(product, 1, selectedVariant, {}, []);
  };

  return (
    <motion.article
      className="h-full group relative"
    //   onMouseEnter={() => setHovered(true)}
    //   onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-4 rounded-2xl opacity-0 blur-2xl transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at center, ${BRAND}15, transparent 70%)`,
        }}
        animate={{ opacity: 1 }}
      />

      <div className="relative h-full flex flex-col bg-white rounded-lg overflow-hidden transition-all duration-500 border border-slate-100/50 hover:border-slate-200">
        {/* Image Container */}
        <div
          onClick={goToDetails}
          className="relative aspect-[3/4] overflow-hidden cursor-pointer"
          style={{ backgroundColor: WARM_CREAM }}
        >
          {/* Image with Ken Burns Effect */}
          <AnimatePresence mode="wait">
            <motion.div
              key={hoverImage}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.img
                src={hoverImage}
                alt={product?.name || "Product"}
                className="w-full h-full object-cover"
                animate={{
                  scale: 1.08,
                }}
                transition={{
                  duration: 0.7,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>

          {/* Sophisticated Gradient Overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.03) 100%)",
            }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          {/* Refined Badges */}
          <div className="absolute top-1.5 md:top-2.5 left-1.5 md:left-2.5 flex flex-col gap-1 md:gap-1.5">
            {isPopular && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[9px] font-semibold tracking-wide text-white rounded-sm backdrop-blur-md shadow-lg"
                style={{
                  background: BRAND,
                }}
              >
                <Sparkles className="w-2 md:w-2.5 h-2 md:h-2.5" />
                HOT
              </motion.span>
            )}

            {isLowStock && displayStock > 0 && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center px-1.5 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[9px] font-semibold tracking-wide text-amber-900 bg-white/95 backdrop-blur-md rounded-sm shadow-sm"
              >
                {displayStock} left
              </motion.span>
            )}

            {displayStock === 0 && (
              <span className="inline-flex items-center px-1.5 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[9px] font-semibold tracking-wide text-slate-600 bg-white/95 backdrop-blur-md rounded-sm shadow-sm">
                OUT
              </span>
            )}
          </div>

          {/* Elegant Quick Actions - Desktop */}
          <motion.div
            className="hidden md:block absolute inset-x-0 bottom-0 p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetails();
                }}
                className="group/btn flex-1 h-11 rounded-lg bg-white/98 backdrop-blur-xl text-xs font-semibold tracking-wide inline-flex items-center justify-center gap-2 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl border border-slate-200/50"
                style={{ color: "#0f172a" }}
              >
                <Eye
                  className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110"
                  style={{ color: BRAND }}
                />
                <span>VIEW DETAILS</span>
              </button>

              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={displayStock === 0}
                className={cx(
                  "flex-1 h-11 rounded-lg text-xs font-bold tracking-wide inline-flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "hover:scale-[1.02] active:scale-[0.98] overflow-hidden relative group/add",
                )}
                style={{
                  background: displayStock === 0 ? "#cbd5e1" : BRAND,
                  color: "white",
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <ShoppingCart className="w-4 h-4 relative z-10" />
                <span className="relative z-10">ADD TO CART</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Product Info - Refined Typography */}
        <div className="p-2 md:p-3 lg:p-4 flex-1 flex flex-col">
          {/* Category */}
          {product?.category && (
            <span
              className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold mb-1 md:mb-1.5 opacity-70"
              style={{ color: BRAND }}
            >
              {product.category}
            </span>
          )}

          {/* Name with elegant hover */}
          <h3
            onClick={goToDetails}
            className="text-xs md:text-sm lg:text-base font-serif font-medium text-slate-900 leading-snug line-clamp-2 cursor-pointer transition-colors duration-300 mb-1.5 md:mb-2 group-hover:text-slate-700"
          >
            {product?.name || "Product Name"}
          </h3>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price - Sophisticated */}
          <div className="mb-1.5 md:mb-2">
            <div className="flex items-baseline gap-1 md:gap-1.5">
              {showFrom && (
                <span className="text-[9px] md:text-[11px] font-medium text-slate-400 tracking-wide">
                  FROM
                </span>
              )}
              <p className="text-sm md:text-lg lg:text-xl font-light tracking-tight text-slate-900">
                {formatPrice(displayPrice)}
              </p>
            </div>
          </div>

          {/* Mobile Actions - Refined */}
          <div className="flex gap-1 md:gap-1.5 md:hidden pt-1.5 md:pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={goToDetails}
              className="flex-1 h-7 md:h-9 rounded-md border border-slate-200 text-[9px] md:text-[10px] font-semibold tracking-wide inline-flex items-center justify-center gap-1 md:gap-1.5 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
              style={{ color: "#0f172a" }}
            >
              <Eye
                className="w-2.5 md:w-3.5 h-2.5 md:h-3.5"
                style={{ color: BRAND }}
              />
              <span>VIEW</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={displayStock === 0}
              className={cx(
                "flex-1 h-7 md:h-9 rounded-md text-[9px] md:text-[10px] font-bold tracking-wide inline-flex items-center justify-center gap-1 md:gap-1.5 transition-all duration-300",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "active:scale-95",
              )}
              style={{
                background: displayStock === 0 ? "#cbd5e1" : BRAND,
                color: "white",
              }}
            >
              <ShoppingCart className="w-2.5 md:w-3.5 h-2.5 md:h-3.5" />
              <span>ADD</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// Main Component with Luxury Design
export default function ShopWithVideo({
  products = [],
  title = "Shop the Collection",
  subtitle = "Thoughtfully curated necklaces, rings and bangles made for everyday elegance.",
}) {
  const navigate = useNavigate();
  const visibleProducts = useMemo(
    () => (products || []).slice(0, 4),
    [products],
  );

  if (!visibleProducts.length) return null;

  return (
    <section
      className="relative w-full py-6 md:py-10 lg:py-14 overflow-hidden"
      style={{
        background: `linear-gradient(to bottom, ${WARM_CREAM}, #ffffff, ${WARM_CREAM})`,
      }}
    >
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${BRAND} 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content Container */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section - Refined */}
        <div className="mb-6 md:mb-8 lg:mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-3 md:mb-4"
            >
              <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-slate-300" />
              <span
                className="text-[11px] tracking-[0.3em] uppercase font-semibold"
                style={{ color: BRAND }}
              >
                Curated Collection
              </span>
              <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-slate-300" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-xl md:text-3xl lg:text-5xl font-serif font-light text-slate-900 leading-tight mb-2 md:mb-4 lg:mb-5 tracking-tight"
            >
              {title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs md:text-sm lg:text-base text-slate-600 leading-relaxed font-light max-w-2xl mx-auto"
            >
              {subtitle}
            </motion.p>
          </div>
        </div>

        {/* Products Grid - Premium Layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-5"
        >
          {visibleProducts.map((product, index) => (
            <LuxuryProductCard
              key={product.id}
              product={product}
              index={index}
            />
          ))}
        </motion.div>

        {/* Call to Action - Elegant */}
      <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.8, duration: 0.6 }}
  className="mt-6 md:mt-10 lg:mt-12 text-center"
>
  <button
    type="button"
    onClick={() => navigate("/shop")}
    className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold tracking-wide transition-all duration-300 border-b-2"
    style={{
      borderColor: BRAND,
      color: BRAND,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = BRAND;
      e.currentTarget.style.borderColor = BRAND;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.color = BRAND;
      e.currentTarget.style.borderColor = BRAND;
    }}
  >
    <span>EXPLORE FULL COLLECTION</span>
    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
  </button>
</motion.div>
      </div>
    </section>
  );
}

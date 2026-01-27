import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Eye, Sparkles, Tag } from "lucide-react";
import { useProducts } from "./auth/ProductsProvider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const BRAND = "#948179";
const WARM_CREAM = "#fbfaf8";
const cx = (...c) => c.filter(Boolean).join(" ");

export default function ProductCard({
  product,
  showLimited = false,
  index = 0,
}) {
  const { addToCart, formatPrice } = useProducts();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  if (showLimited && index > 1) return null;

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
    0
  );
  const displayStock = hasVariants ? variantStockSum : baseStock;

  const hasCustomFields = product?.customFields?.length > 0;
  const hasExtras = product?.extras?.length > 0;
  const hasRequiredCustomFields =
    product?.customFields?.some((f) => !!f.required) || false;
  const hasRequiredTextExtra =
    product?.extras?.some((x) => x?.type === "text" && x?.requiredText) || false;

  const isLowStock = displayStock > 0 && displayStock <= 5;
  const isPopular = product?.popularity && product.popularity >= 80;
  const isFeatured = product?.isFeatured || false;
  const isDiscounted = product?.isDiscounted && product?.discountPercentage > 0;
  const discountPercent = product?.discountPercentage || 0;

  const originalPrice = isDiscounted && discountPercent > 0
    ? displayPrice / (1 - discountPercent / 100)
    : null;

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-3 rounded-xl opacity-0 blur-xl transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at center, ${BRAND}12, transparent 70%)`,
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
      />

      <div className="relative h-full flex flex-col bg-white rounded-md overflow-hidden transition-all duration-500 border border-slate-100/50 hover:border-slate-200 hover:shadow-lg">
        {/* Image Container */}
        <div
          onClick={goToDetails}
          className="relative aspect-[4/5] overflow-hidden cursor-pointer"
          style={{ backgroundColor: WARM_CREAM }}
        >
          {/* Image with Ken Burns Effect */}
          <AnimatePresence mode="wait">
            <motion.div
              key={hovered ? hoverImage : mainImage}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.img
                src={hovered ? hoverImage : mainImage}
                alt={product?.name || "Product"}
                className="w-full h-full object-cover"
                animate={{
                  scale: hovered ? 1.05 : 1,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                loading="lazy"
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient Overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.04) 100%)",
            }}
            animate={{ opacity: hovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {isFeatured && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] md:text-[9px] font-bold tracking-wide text-white rounded-full backdrop-blur-md shadow-md"
                style={{ background: BRAND }}
              >
                <Sparkles className="w-2 h-2" />
                FEATURED
              </motion.span>
            )}

            {isDiscounted && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[8px] md:text-[9px] font-bold tracking-wide text-white bg-red-600 rounded-full backdrop-blur-md shadow-md"
              >
                <Tag className="w-2 h-2" />
                {discountPercent}% OFF
              </motion.span>
            )}

            {isLowStock && displayStock > 0 && !isDiscounted && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center px-2 py-0.5 text-[8px] md:text-[9px] font-semibold tracking-wide text-amber-900 bg-white/95 backdrop-blur-md rounded-full shadow-sm"
              >
                {displayStock} left
              </motion.span>
            )}

            {displayStock === 0 && (
              <span className="inline-flex items-center px-2 py-0.5 text-[8px] md:text-[9px] font-semibold tracking-wide text-slate-600 bg-white/95 backdrop-blur-md rounded-full shadow-sm">
                SOLD OUT
              </span>
            )}
          </div>

          {/* Quick Actions - Desktop */}
          <motion.div
            className="hidden md:block absolute inset-x-0 bottom-0 p-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetails();
                }}
                className="flex-1 h-9 rounded-md bg-white/95 backdrop-blur-xl text-[10px] font-bold tracking-wide inline-flex items-center justify-center gap-1.5 hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg border border-slate-200/50"
                style={{ color: "#0f172a" }}
              >
                <Eye className="w-3.5 h-3.5" style={{ color: BRAND }} />
                VIEW
              </button>

              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={displayStock === 0}
                className={cx(
                  "flex-1 h-9 rounded-md text-[10px] font-bold tracking-wide inline-flex items-center justify-center gap-1.5 transition-all duration-300 shadow-md hover:shadow-lg",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "hover:scale-[1.02] active:scale-[0.98]"
                )}
                style={{
                  background: displayStock === 0 ? "#cbd5e1" : BRAND,
                  color: "white",
                }}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                ADD
              </button>
            </div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-2 md:p-2.5 flex-1 flex flex-col">
          {/* Category & SKU */}
          <div className="flex items-center justify-between gap-2 mb-1">
            {product?.category && (
              <span
                className="text-[8px] md:text-[9px] uppercase tracking-[0.15em] font-bold opacity-70"
                style={{ color: BRAND }}
              >
                {product.category}
              </span>
            )}
            {product?.sku && (
              <span className="text-[8px] text-slate-400 font-semibold">
                #{product.sku}
              </span>
            )}
          </div>

          {/* Name */}
          <h3
            onClick={goToDetails}
            className="text-[11px] md:text-xs font-semibold text-slate-900 leading-tight line-clamp-2 cursor-pointer transition-colors duration-300 mb-1 group-hover:text-slate-700"
          >
            {product?.name || "Product Name"}
          </h3>

          {/* Variants */}
          {hasVariants && variants.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {variants.slice(0, 3).map((variant) => (
                <span
                  key={variant.id}
                  className="text-[8px] px-1.5 py-0.5 border rounded-sm"
                  style={{ borderColor: `${BRAND}26`, color: BRAND }}
                >
                  {variant.name}
                </span>
              ))}
              {variants.length > 3 && (
                <span
                  className="text-[8px] px-1.5 py-0.5 border rounded-sm text-slate-500"
                  style={{ borderColor: `${BRAND}26` }}
                >
                  +{variants.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price */}
          <div className="mb-1.5">
            <div className="flex items-baseline gap-1.5">
              {showFrom && (
                <span className="text-[8px] font-medium text-slate-400 tracking-wide">
                  FROM
                </span>
              )}
              <div className="flex items-baseline gap-1.5">
                {isDiscounted && originalPrice && (
                  <p className="text-[10px] font-medium text-slate-400 line-through">
                    {formatPrice(originalPrice)}
                  </p>
                )}
                <p className={cx(
                  "font-bold text-slate-900",
                  isDiscounted ? "text-sm md:text-base" : "text-xs md:text-sm"
                )}>
                  {formatPrice(displayPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex gap-1 md:hidden pt-1.5 border-t border-slate-100">
            <button
              type="button"
              onClick={goToDetails}
              className="flex-1 h-7 rounded-md border border-slate-200 text-[9px] font-semibold tracking-wide inline-flex items-center justify-center gap-1 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
              style={{ color: "#0f172a" }}
            >
              <Eye className="w-2.5 h-2.5" style={{ color: BRAND }} />
              VIEW
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={displayStock === 0}
              className={cx(
                "flex-1 h-7 rounded-md text-[9px] font-bold tracking-wide inline-flex items-center justify-center gap-1 transition-all duration-300",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "active:scale-95"
              )}
              style={{
                background: displayStock === 0 ? "#cbd5e1" : BRAND,
                color: "white",
              }}
            >
              <ShoppingCart className="w-2.5 h-2.5" />
              ADD
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Package, Zap, ArrowRight, Eye } from "lucide-react";
import { useProducts } from "./auth/ProductsProvider";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const BRAND = "#948179";
const cx = (...c) => c.filter(Boolean).join(" ");

export default function PlayfulProductCard({
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

  const materials = variants.map((v) => (v?.name || "").trim()).filter(Boolean);

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

  const isPopular = product?.popularity && product.popularity >= 80;

  const hasCustomFields = product?.customFields?.length > 0;
  const hasExtras = product?.extras?.length > 0;

  const hasRequiredCustomFields =
    product?.customFields?.some((f) => !!f.required) || false;

  const hasRequiredTextExtra =
    product?.extras?.some((x) => x?.type === "text" && x?.requiredText) ||
    false;

  const goToDetails = () => navigate(`/product/${product.id}`);

  const handleQuickAdd = (e) => {
    e?.stopPropagation?.();
    if (displayStock === 0) return;

    // If anything needs user input, go to details
    if (hasRequiredCustomFields || hasRequiredTextExtra) {
      goToDetails();
      return;
    }

    // If multiple materials exist, force user to pick material on details page
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

  const subtitle = useMemo(() => {
    if (displayStock === 0) return "Sold out";
    if (hasVariants && variants.length > 1) return "Choose material";
    if (hasCustomFields || hasExtras) return "Personalize available";
    if (displayStock > 0 && displayStock <= 10)
      return `Only ${displayStock} left`;
    return "Ready to ship";
  }, [displayStock, hasVariants, variants.length, hasCustomFields, hasExtras]);

  return (
    <motion.article
      className="h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <button
        type="button"
        onClick={goToDetails}
        className={cx(
          "group w-full h-full text-left",
          "rounded-2xl bg-transparent",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        )}
        style={{
          WebkitTapHighlightColor: "transparent",
          outlineColor: BRAND,
        }}
      >
        {/* === playful media stage (NO borders) === */}
        <div className="relative">
          <div
            className="relative aspect-[4/5] rounded-2xl overflow-hidden"
            style={{
              background: `
                radial-gradient(520px 300px at 30% 25%, rgba(255,240,207,0.95), rgba(255,255,255,0.45)),
                radial-gradient(420px 240px at 80% 60%, rgba(148,129,121,0.10), transparent 60%)
              `,
              boxShadow: "0 18px 55px rgba(15, 23, 42, 0.08)",
            }}
          >
            {/* sticker-like image */}
            <div className="absolute inset-0 p-6 md:p-7">
              <div className="w-full h-full flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={hovered ? hoverImage : mainImage}
                    src={hovered ? hoverImage : mainImage}
                    alt={product?.name || "Product"}
                    className="w-full h-full object-contain drop-shadow-[0_12px_18px_rgba(0,0,0,0.10)]"
                    initial={{ opacity: 0.85, scale: 0.98 }}
                    animate={{ opacity: 1, scale: hovered ? 1.03 : 1 }}
                    exit={{ opacity: 0.25, scale: 0.98 }}
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    loading="lazy"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* badges (small + cute) */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {isPopular && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-white rounded-full"
                  style={{ backgroundColor: BRAND }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Trending
                </span>
              )}

              {displayStock === 0 && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    color: BRAND,
                  }}
                >
                  <Package className="w-3.5 h-3.5" />
                  Sold out
                </span>
              )}
            </div>

            {/* quick actions (tiny, playful, borderless) */}
            <div className="absolute inset-x-3 bottom-3">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-2"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToDetails();
                    }}
                    className="h-10 px-3 rounded-full bg-white/70 backdrop-blur text-xs font-semibold inline-flex items-center gap-2 hover:bg-white/85 transition"
                    style={{ color: "#0f172a" }}
                  >
                    <Eye className="w-4 h-4" style={{ color: BRAND }} />
                    View
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    type="button"
                    onClick={handleQuickAdd}
                    disabled={displayStock === 0}
                    className={cx(
                      "h-10 px-3 rounded-full text-xs font-semibold inline-flex items-center gap-2 transition",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                    style={{
                      background: BRAND,
                      color: "white",
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {hasVariants && variants.length > 1 ? "Choose" : "Add"}
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* === info area (minimal, borderless, rhythmic) === */}
        <div className="pt-3 px-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
              {product?.category || ""}
            </span>

            {product?.sku != null && String(product.sku).trim() !== "" && (
              <span className="text-[11px] text-slate-400 font-semibold">
                #{product.sku}
              </span>
            )}
          </div>

          <h3 className="mt-2 text-[15px] md:text-[16px] font-semibold text-slate-900 leading-snug line-clamp-2">
            {product?.name || "Product Name"}
          </h3>

          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>

          {/* materials = tiny chips (no borders) */}
          {materials.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {materials.slice(0, 2).map((m) => (
                <span
                  key={m}
                  className="text-[11px] px-2 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.65)",
                    color: BRAND,
                  }}
                >
                  {m}
                </span>
              ))}
              {materials.length > 2 && (
                <span
                  className="text-[11px] px-2 py-1 rounded-full text-slate-600"
                  style={{ background: "rgba(255,255,255,0.55)" }}
                >
                  +{materials.length - 2}
                </span>
              )}
            </div>
          )}

          {/* price row */}
          <div className="mt-3 flex items-end justify-between gap-3">
            <p className="text-base font-extrabold text-slate-900">
              {showFrom
                ? `From ${formatPrice(displayPrice)}`
                : formatPrice(displayPrice)}
            </p>

            <span
              className="text-[11px] font-semibold"
              style={{ color: BRAND }}
            >
              {displayStock === 0 ? "Unavailable" : "Tap actions ↑"}
            </span>
          </div>

          {/* mobile action row (simple + small) */}
          <div className="mt-3 flex gap-2 md:hidden">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToDetails();
              }}
              className="flex-1 h-10 rounded-full bg-white/70 backdrop-blur text-xs font-semibold inline-flex items-center justify-center gap-2"
            >
              View
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={displayStock === 0}
              className={cx(
                "h-10 px-3 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              style={{ background: BRAND, color: "white" }}
            >
              <ShoppingCart className="w-4 h-4" />
              {hasVariants && variants.length > 1 ? "Choose" : "Add"}
            </button>
          </div>
        </div>
      </button>
    </motion.article>
  );
}

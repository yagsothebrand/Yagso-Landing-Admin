import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Package, Zap, ArrowRight, Eye } from "lucide-react";
import { useProducts } from "./auth/ProductsProvider";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

const BRAND = "#948179";
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
    <motion.div
      className="h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <button
        type="button"
        onClick={goToDetails}
        className={cx(
          "group w-full h-full text-left bg-white border overflow-hidden",
          "transition-shadow hover:shadow-[0_18px_42px_rgba(0,0,0,0.08)]",
        )}
        style={{ borderColor: `${BRAND}1f` }}
      >
        {/* ===== Image area (Lorvae-ish: lots of white space + centered product) ===== */}
        <div className="relative">
          <div
            className="relative aspect-[4/5] bg-white"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.00) 0%, rgba(148,129,121,0.03) 100%)",
            }}
          >
            {/* centered inner padding so image doesn't touch edges */}
            <div className="absolute inset-0 p-8 md:p-10">
              <div className="w-full h-full flex items-center justify-center">
                {/* Main/hover image swap */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={hovered ? hoverImage : mainImage}
                    src={hovered ? hoverImage : mainImage}
                    alt={product?.name || "Product"}
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0.6, scale: 0.98 }}
                    animate={{ opacity: 1, scale: hovered ? 1.03 : 1 }}
                    exit={{ opacity: 0.3, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    loading="lazy"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Top badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {isPopular && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-white"
                  style={{ backgroundColor: BRAND }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Trending
                </span>
              )}

              {displayStock === 0 && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-white border"
                  style={{ borderColor: `${BRAND}26`, color: BRAND }}
                >
                  <Package className="w-3.5 h-3.5" />
                  Sold out
                </span>
              )}
            </div>

            {/* Quick actions (appear on hover, stay easy) */}
            <div className="absolute inset-x-3 bottom-3">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.22 }}
                  className="flex gap-2"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToDetails();
                    }}
                    className="flex-1 h-11 border bg-white/90 backdrop-blur font-semibold text-sm inline-flex items-center justify-center gap-2"
                    style={{ borderColor: `${BRAND}26`, color: "#0f172a" }}
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
                      "h-11 px-4 border font-semibold text-sm inline-flex items-center justify-center gap-2",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                    )}
                    style={{
                      borderColor: `${BRAND}26`,
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

        {/* ===== Bottom info (clean, spaced, Lorvae style) ===== */}
        <div className="px-4 pt-4 pb-5 md:px-5">
          {/* category + sku row */}
          <div className="flex items-center justify-between gap-3">
            {product?.category ? (
              <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                {product.category}
              </span>
            ) : (
              <span />
            )}

            {product?.sku != null && String(product.sku).trim() !== "" && (
              <span className="text-[11px] text-slate-400 font-semibold">
                #{product.sku}
              </span>
            )}
          </div>

          {/* name */}
          <h3 className="mt-2 text-[15px] md:text-[16px] font-semibold text-slate-900 leading-snug line-clamp-2">
            {product?.name || "Product Name"}
          </h3>

          {/* subtle meta line */}
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>

          {/* Materials: show only 2 (cleaner) */}
          {materials.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {materials.slice(0, 2).map((m) => (
                <span
                  key={m}
                  className="text-[11px] px-2 py-1 border bg-white"
                  style={{ borderColor: `${BRAND}26`, color: BRAND }}
                >
                  {m}
                </span>
              ))}
              {materials.length > 2 && (
                <span
                  className="text-[11px] px-2 py-1 border bg-white text-slate-500"
                  style={{ borderColor: `${BRAND}26` }}
                >
                  +{materials.length - 2}
                </span>
              )}
            </div>
          )}

          {/* price row */}
          <div className="mt-4 flex items-end justify-between gap-3">
            <p className="text-base md:text-lg font-bold text-slate-900">
              {showFrom
                ? `From ${formatPrice(displayPrice)}`
                : formatPrice(displayPrice)}
            </p>

            {/* small hint button for touch devices (hover isn’t reliable) */}
            <span
              className="text-[11px] font-semibold"
              style={{ color: `${BRAND}` }}
            >
              {displayStock === 0 ? "Unavailable" : "Quick actions ↑"}
            </span>
          </div>

          {/* On mobile, show a simple add row (because hover doesn’t exist) */}
          <div className="mt-3 flex gap-2 md:hidden">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToDetails();
              }}
              className="flex-1 h-11 border bg-white font-semibold text-sm inline-flex items-center justify-center gap-2"
              style={{ borderColor: `${BRAND}26` }}
            >
              View
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={displayStock === 0}
              className={cx(
                "h-11 px-4 border font-semibold text-sm inline-flex items-center justify-center gap-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
              )}
              style={{
                borderColor: `${BRAND}26`,
                background: BRAND,
                color: "white",
              }}
            >
              <ShoppingCart className="w-4 h-4" />
              {hasVariants && variants.length > 1 ? "Choose" : "Add"}
            </button>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

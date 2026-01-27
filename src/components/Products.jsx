import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Shield,
  Heart,
  Sparkles,
  Gift,
  Pencil,
  Trash2,
  Plus,
  ChevronRight,
  Eye,
  Search,
  X,
  ChevronDown,
  ShoppingCart,
  Tag,
} from "lucide-react";

import { useProducts } from "./auth/ProductsProvider";
import { ProductFormModal } from "./ProductFormModal";
import { useAuth } from "./auth/AuthProvider";

const BRAND = "#948179";
const WARM_CREAM = "#fbfaf8";

const cn = (...c) => c.filter(Boolean).join(" ");

const CATEGORIES = [
  { id: "all", label: "All Products", icon: Sparkles },
  { id: "Earrings", label: "Earrings", icon: Sparkles },
  { id: "Necklaces", label: "Necklaces", icon: Heart },
  { id: "Rings", label: "Rings", icon: Shield },
  { id: "Bracelets", label: "Bracelets", icon: Gift },
  { id: "Sets", label: "Sets", icon: Package },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "New Arrivals" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const PRICE_RANGES = [
  { label: "All Prices", min: "", max: "" },
  { label: "Under ₦10K", min: "", max: "10000" },
  { label: "₦10K - ₦25K", min: "10000", max: "25000" },
  { label: "₦25K - ₦50K", min: "25000", max: "50000" },
  { label: "₦50K - ₦100K", min: "50000", max: "100000" },
  { label: "Over ₦100K", min: "100000", max: "" },
];

const SHOP_PAGE_SIZE = 20;
const HOME_PREVIEW_COUNT = 6;

// Luxury Product Card Component (from ShopWithVideo)
function LuxuryProductCard({ product, index = 0, isAdmin, onEdit, onDelete, onView }) {
  const { addToCart, formatPrice } = useProducts();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const images = Array.isArray(product?.images) ? product.images : [];
  const mainImage = images?.[0] || "/placeholder.svg";
  const hoverImage = images?.[1] || mainImage;

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;

  const basePrice = Number(product?.price || 0);
  const variantPrices = variants
    .map((v) => Number(v?.price || 0))
    .filter((n) => Number.isFinite(n));

  const minVariantPrice = variantPrices.length ? Math.min(...variantPrices) : basePrice;
  const showFrom = hasVariants && variantPrices.length > 0;
  const displayPrice = showFrom ? minVariantPrice : basePrice;

  const baseStock = Number(product?.stock || 0);
  const variantStockSum = variants.reduce((sum, v) => sum + Number(v?.stock || 0), 0);
  const displayStock = hasVariants ? variantStockSum : baseStock;

  const hasCustomFields = product?.customFields?.length > 0;
  const hasRequiredCustomFields = product?.customFields?.some((f) => !!f.required) || false;
  const hasRequiredTextExtra = product?.extras?.some((x) => x?.type === "text" && x?.requiredText) || false;

  const isLowStock = displayStock > 0 && displayStock <= 5;
  const isFeatured = product?.isFeatured || false;
  const isDiscounted = product?.isDiscounted && product?.discountPercentage > 0;
  const discountPercent = product?.discountPercentage || 0;

  const originalPrice = isDiscounted && discountPercent > 0 ? displayPrice / (1 - discountPercent / 100) : null;

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

    const selectedVariant = hasVariants && variants[0]
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
        delay: index * 0.04,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-2 md:-inset-3 rounded-sm opacity-0 blur-xl transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at center, ${BRAND}12, transparent 70%)`,
        }}
        animate={{ opacity: hovered ? 1 : 0 }}
      />

      <div className="relative h-full flex flex-col bg-white rounded-sm overflow-hidden transition-all duration-500 border border-slate-100/50 hover:border-slate-200 hover:shadow-lg">
        {/* Image Container */}
        <div
          onClick={goToDetails}
          className="relative aspect-[3/4] overflow-hidden cursor-pointer"
          style={{ backgroundColor: WARM_CREAM }}
        >
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
              background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.04) 100%)",
            }}
            animate={{ opacity: hovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          />

          {/* Badges */}
          <div className="absolute top-1.5 md:top-2 left-1.5 md:left-2 flex flex-col gap-1">
            {isFeatured && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 text-[8px] md:text-[9px] font-bold tracking-wide text-white rounded-sm backdrop-blur-md shadow-md"
                style={{ background: BRAND }}
              >
                <Sparkles className="w-2 h-2" />
                HOT
              </motion.span>
            )}

            {isDiscounted && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 text-[8px] md:text-[9px] font-bold tracking-wide text-white bg-red-600 rounded-sm backdrop-blur-md shadow-md"
              >
                <Tag className="w-2 h-2" />
                {discountPercent}% OFF
              </motion.span>
            )}

            {isLowStock && displayStock > 0 && !isDiscounted && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center px-1.5 md:px-2 py-0.5 text-[8px] md:text-[9px] font-semibold tracking-wide text-amber-900 bg-white/95 backdrop-blur-md rounded-sm shadow-sm"
              >
                {displayStock} left
              </motion.span>
            )}

            {displayStock === 0 && (
              <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 text-[8px] md:text-[9px] font-semibold tracking-wide text-slate-600 bg-white/95 backdrop-blur-md rounded-sm shadow-sm">
                OUT
              </span>
            )}
          </div>

          {/* Admin Controls */}
          {isAdmin && (
            <div className="absolute top-1.5 md:top-2 right-1.5 md:right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="p-1.5 rounded-sm border bg-white/95 backdrop-blur hover:bg-white shadow-lg"
                style={{ borderColor: `${BRAND}20` }}
              >
                <Pencil className="w-3 h-3" style={{ color: BRAND }} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product.id);
                }}
                className="p-1.5 rounded-sm border bg-white/95 backdrop-blur hover:bg-white shadow-lg"
                style={{ borderColor: `${BRAND}20` }}
              >
                <Trash2 className="w-3 h-3 text-red-600" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onView(product.id);
                }}
                className="p-1.5 rounded-sm border bg-white/95 backdrop-blur hover:bg-white shadow-lg"
                style={{ borderColor: `${BRAND}20` }}
              >
                <Eye className="w-3 h-3" style={{ color: BRAND }} />
              </motion.button>
            </div>
          )}

          {/* Quick Actions - Desktop */}
          <motion.div
            className="hidden md:block absolute inset-x-0 bottom-0 p-2 md:p-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToDetails();
                }}
                className="flex-1 h-9 rounded-sm bg-white/95 backdrop-blur-xl text-[10px] font-bold tracking-wide inline-flex items-center justify-center gap-1 hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg border border-slate-200/50"
                style={{ color: "#0f172a" }}
              >
                <Eye className="w-3.5 h-3.5" style={{ color: BRAND }} />
                <span className="hidden sm:inline">VIEW</span>
              </button>

              <button
                type="button"
                onClick={handleQuickAdd}
                disabled={displayStock === 0}
                className={cn(
                  "flex-1 h-9 rounded-sm text-[10px] font-bold tracking-wide inline-flex items-center justify-center gap-1 transition-all duration-300 shadow-md hover:shadow-lg",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  "hover:scale-[1.02] active:scale-[0.98]"
                )}
                style={{
                  background: displayStock === 0 ? "#cbd5e1" : BRAND,
                  color: "white",
                }}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ADD</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Product Info */}
        <div className="p-2 md:p-2.5 flex-1 flex flex-col">
          {/* Category & SKU */}
          <div className="flex items-center justify-between gap-2 mb-0.5 md:mb-1">
            {product?.category && (
              <span
                className="text-[8px] md:text-[9px] uppercase tracking-[0.15em] font-bold opacity-70"
                style={{ color: BRAND }}
              >
                {product.category}
              </span>
            )}
            {product?.sku && (
              <span className="text-[8px] text-slate-400 font-semibold">#{product.sku}</span>
            )}
          </div>

          {/* Name */}
          <h3
            onClick={goToDetails}
            className="text-[10px] md:text-xs font-semibold text-slate-900 leading-tight line-clamp-2 cursor-pointer transition-colors duration-300 mb-1 group-hover:text-slate-700"
          >
            {product?.name || "Product Name"}
          </h3>

          {/* Variants */}
          {hasVariants && variants.length > 0 && (
            <div className="flex flex-wrap gap-0.5 md:gap-1 mb-1">
              {variants.slice(0, 2).map((variant) => (
                <span
                  key={variant.id}
                  className="text-[7px] md:text-[8px] px-1 md:px-1.5 py-0.5 border rounded-sm"
                  style={{ borderColor: `${BRAND}26`, color: BRAND }}
                >
                  {variant.name}
                </span>
              ))}
              {variants.length > 2 && (
                <span
                  className="text-[7px] md:text-[8px] px-1 md:px-1.5 py-0.5 border rounded-sm text-slate-500"
                  style={{ borderColor: `${BRAND}26` }}
                >
                  +{variants.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price */}
          <div className="mb-1 md:mb-1.5">
            <div className="flex items-baseline gap-1">
              {showFrom && (
                <span className="text-[7px] md:text-[8px] font-medium text-slate-400 tracking-wide">
                  FROM
                </span>
              )}
              <div className="flex items-baseline gap-1">
                {isDiscounted && originalPrice && (
                  <p className="text-[9px] md:text-[10px] font-medium text-slate-400 line-through">
                    {formatPrice(originalPrice)}
                  </p>
                )}
                <p
                  className={cn(
                    "font-bold text-slate-900",
                    isDiscounted ? "text-xs md:text-sm" : "text-[11px] md:text-xs"
                  )}
                >
                  {formatPrice(displayPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex gap-1 md:hidden pt-1 border-t border-slate-100">
            <button
              type="button"
              onClick={goToDetails}
              className="flex-1 h-7 rounded-sm border border-slate-200 text-[9px] font-semibold tracking-wide inline-flex items-center justify-center gap-0.5 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300"
              style={{ color: "#0f172a" }}
            >
              <Eye className="w-2.5 h-2.5" style={{ color: BRAND }} />
              <span>VIEW</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={displayStock === 0}
              className={cn(
                "flex-1 h-7 rounded-sm text-[9px] font-bold tracking-wide inline-flex items-center justify-center gap-0.5 transition-all duration-300",
                "disabled:opacity-40 disabled:cursor-not-allowed",
                "active:scale-95"
              )}
              style={{
                background: displayStock === 0 ? "#cbd5e1" : BRAND,
                color: "white",
              }}
            >
              <ShoppingCart className="w-2.5 h-2.5" />
              <span>ADD</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* -------------------- Page -------------------- */
export default function ShopPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isShopRoute = pathname === "/shop";
  const isHomePreviewRoute = ["/", "/home"].includes(pathname);
  const isPreviewMode = !isShopRoute && isHomePreviewRoute;

  const { isAdmin } = useAuth();
  const { products, loading, deleteProduct } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("popular");

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [page, setPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (priceRange.min) {
      filtered = filtered.filter((p) => Number(p.price) >= Number(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter((p) => Number(p.price) <= Number(priceRange.max));
    }

    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "price-low":
        filtered.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchQuery, selectedCategory, priceRange, sortBy]);

  useEffect(() => {
    if (isShopRoute) setPage(1);
  }, [isShopRoute, searchQuery, selectedCategory, priceRange, sortBy]);

  const totalPages = useMemo(() => {
    if (!isShopRoute) return 1;
    return Math.max(1, Math.ceil(filteredProducts.length / SHOP_PAGE_SIZE));
  }, [filteredProducts.length, isShopRoute]);

  const visibleProducts = useMemo(() => {
    if (isPreviewMode) return filteredProducts.slice(0, HOME_PREVIEW_COUNT);
    if (!isShopRoute) return filteredProducts;

    const start = (page - 1) * SHOP_PAGE_SIZE;
    return filteredProducts.slice(start, start + SHOP_PAGE_SIZE);
  }, [filteredProducts, isPreviewMode, isShopRoute, page]);

  const goToPage = (next) => {
    const safe = Math.min(Math.max(1, next), totalPages);
    setPage(safe);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openCreate = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    setSortBy("popular");
    setSelectedCategory("all");
  };

  const hasActiveFilters = !!(
    searchQuery ||
    priceRange.min ||
    priceRange.max ||
    sortBy !== "popular" ||
    selectedCategory !== "all"
  );

  return (
    <>
      <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, ${WARM_CREAM}, #ffffff)` }}>
        {/* Subtle decorative elements */}
        <div className="pointer-events-none fixed inset-0 opacity-[0.015]">
          <div
            className="absolute -top-32 -right-32 h-96 w-96 rounded-sm blur-3xl"
            style={{ backgroundColor: BRAND }}
          />
          <div
            className="absolute -bottom-32 -left-32 h-96 w-96 rounded-sm blur-3xl"
            style={{ backgroundColor: BRAND }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-6 pb-8 md:pb-12">
          {/* Premium Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-4">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 mb-2 md:mb-3"
                >
                  <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                  <span className="text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-bold" style={{ color: BRAND }}>
                    Discover
                  </span>
                  <div className="h-[1px] w-8 md:w-12 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                </motion.div>

                <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-light text-slate-900 tracking-tight">
                  Our Collection
                </h1>
                <p className="text-xs md:text-sm text-slate-600 mt-1 md:mt-2 font-light">
                  Handcrafted jewelry for every moment
                </p>
              </div>

              <div className="flex items-center gap-2 md:gap-3">
                {!isPreviewMode && isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={openCreate}
                    className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-sm text-xs md:text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    style={{ backgroundColor: BRAND }}
                  >
                    <Plus className="w-3.5 md:w-4 h-3.5 md:h-4" />
                    <span className="hidden sm:inline">Add Product</span>
                    <span className="sm:hidden">Add</span>
                  </motion.button>
                )}

                <div className="text-xs md:text-sm">
                  <span className="font-semibold text-slate-900">{filteredProducts.length}</span>
                  <span className="text-slate-500 ml-1">{filteredProducts.length === 1 ? "item" : "items"}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Advanced Filter Bar */}
          {!isPreviewMode && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-4 md:mb-6">
              <div className="bg-white/80 backdrop-blur-lg border rounded-sm md:rounded-sm shadow-lg p-3 md:p-4 lg:p-5" style={{ borderColor: `${BRAND}20` }}>
                {/* Top Row: Search + Sort */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 mb-3 md:mb-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 md:w-4 h-3.5 md:h-4 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="w-full h-10 md:h-11 pl-9 md:pl-11 pr-3 md:pr-4 rounded-sm md:rounded-sm border bg-white/50 text-xs md:text-sm outline-none focus:border-slate-300 transition-colors"
                      style={{ borderColor: `${BRAND}20` }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-sm transition"
                      >
                        <X className="w-3.5 md:w-4 h-3.5 md:h-4 text-slate-400" />
                      </button>
                    )}
                  </div>

                  {/* Sort */}
                  <div className="relative w-full sm:min-w-[180px] sm:max-w-[200px]">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-10 md:h-11 pl-3 md:pl-4 pr-8 md:pr-10 rounded-sm md:rounded-sm border bg-white/50 text-xs md:text-sm font-medium outline-none focus:border-slate-300 transition-colors appearance-none cursor-pointer"
                      style={{ borderColor: `${BRAND}20` }}
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-3.5 md:w-4 h-3.5 md:h-4 text-slate-400 pointer-events-none" />
                  </div>

                  {/* Clear Filters */}
                  <AnimatePresence>
                    {hasActiveFilters && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={clearFilters}
                        className="inline-flex items-center justify-center gap-1.5 md:gap-2 h-10 md:h-11 px-3 md:px-4 rounded-sm md:rounded-sm border bg-white/50 text-xs md:text-sm font-semibold hover:bg-white transition-all"
                        style={{ borderColor: `${BRAND}20`, color: BRAND }}
                      >
                        <X className="w-3.5 md:w-4 h-3.5 md:h-4" />
                        <span className="hidden sm:inline">Clear All</span>
                        <span className="sm:hidden">Clear</span>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const active = selectedCategory === cat.id;

                    return (
                      <motion.button
                        key={cat.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "inline-flex items-center gap-1 md:gap-1.5 px-2.5 md:px-3 lg:px-4 py-1.5 md:py-2 rounded-sm text-[10px] md:text-xs font-bold tracking-wide border transition-all duration-300",
                          active ? "text-white shadow-lg" : "text-slate-700 bg-white/50 hover:bg-white hover:shadow-md"
                        )}
                        style={{
                          backgroundColor: active ? BRAND : undefined,
                          borderColor: active ? BRAND : `${BRAND}20`,
                        }}
                      >
                        <Icon className="w-3 md:w-3.5 h-3 md:h-3.5" />
                        <span className="hidden sm:inline">{cat.label}</span>
                        <span className="sm:hidden">{cat.label.split(" ")[0]}</span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Price Range Pills */}
                <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                  <span className="text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Price:</span>
                  {PRICE_RANGES.map((range) => {
                    const active = range.min === priceRange.min && range.max === priceRange.max;

                    return (
                      <motion.button
                        key={range.label}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPriceRange({ min: range.min, max: range.max })}
                        className={cn(
                          "px-2 md:px-3 py-1 md:py-1.5 rounded-sm text-[10px] md:text-xs font-semibold border transition-all duration-300",
                          active ? "text-white shadow-md" : "text-slate-600 bg-white/50 hover:bg-white hover:shadow-sm"
                        )}
                        style={{
                          backgroundColor: active ? BRAND : undefined,
                          borderColor: active ? BRAND : `${BRAND}20`,
                        }}
                      >
                        {range.label}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          <main>
            {!loading && !isPreviewMode && isShopRoute && totalPages > 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3 md:mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs md:text-sm">
                <div className="text-slate-600">
                  Showing{" "}
                  <span className="font-semibold text-slate-900">
                    {(page - 1) * SHOP_PAGE_SIZE + 1}–{Math.min(page * SHOP_PAGE_SIZE, filteredProducts.length)}
                  </span>{" "}
                  of <span className="font-semibold text-slate-900">{filteredProducts.length}</span>
                </div>

                <div className="text-slate-600">
                  Page <span className="font-semibold text-slate-900">{page}</span> of{" "}
                  <span className="font-semibold text-slate-900">{totalPages}</span>
                </div>
              </motion.div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-slate-100 rounded-sm animate-pulse" />
                ))}
              </div>
            ) : visibleProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border bg-white/50 backdrop-blur rounded-sm md:rounded-sm p-8 md:p-12 text-center"
                style={{ borderColor: `${BRAND}20` }}
              >
                <div
                  className="w-12 md:w-16 h-12 md:h-16 mx-auto rounded-sm md:rounded-sm border-2 flex items-center justify-center mb-3 md:mb-4"
                  style={{ borderColor: `${BRAND}30`, backgroundColor: `${BRAND}08` }}
                >
                  <Package className="w-6 md:w-8 h-6 md:h-8" style={{ color: BRAND }} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                <p className="text-xs md:text-sm text-slate-600 mb-4 md:mb-6">Try adjusting your filters or search terms</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-sm text-xs md:text-sm font-semibold text-white transition-all hover:shadow-lg"
                    style={{ backgroundColor: BRAND }}
                  >
                    <X className="w-3.5 md:w-4 h-3.5 md:h-4" />
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={
                    isPreviewMode
                      ? "grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4"
                      : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4"
                  }
                >
                  {visibleProducts.map((product, index) => (
                    <LuxuryProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      isAdmin={isAdmin && !isPreviewMode}
                      onEdit={(p) => {
                        setEditProduct(p);
                        setModalOpen(true);
                      }}
                      onDelete={deleteProduct}
                      onView={(id) => navigate(`/product/${id}`)}
                    />
                  ))}
                </motion.div>

                {/* Preview CTA */}
                {isPreviewMode && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex justify-center mt-6 md:mt-10">
                    <a
                      href="/shop"
                      className="group inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 rounded-sm text-xs md:text-sm font-bold tracking-wide border-2 transition-all duration-300 hover:shadow-xl"
                      style={{
                        borderColor: BRAND,
                        color: BRAND,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = BRAND;
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.borderColor = "transparent";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = BRAND;
                        e.currentTarget.style.borderColor = BRAND;
                      }}
                    >
                      <span>Explore Full Collection</span>
                      <ChevronRight className="w-4 md:w-5 h-4 md:h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </motion.div>
                )}

                {/* Premium Pagination */}
                {isShopRoute && totalPages > 1 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 md:mt-12 flex items-center justify-center gap-1.5 md:gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                      className="px-3 md:px-5 py-2 md:py-2.5 rounded-sm md:rounded-sm border bg-white text-xs md:text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-md"
                      style={{ borderColor: `${BRAND}20` }}
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </motion.button>

                    <div className="flex items-center gap-1 md:gap-1.5">
                      {Array.from({ length: totalPages }).map((_, idx) => {
                        const p = idx + 1;
                        const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;

                        if (!show && Math.abs(p - page) === 2) {
                          return (
                            <span key={p} className="px-1 md:px-2 text-slate-400 text-xs md:text-sm">
                              •••
                            </span>
                          );
                        }

                        if (!show) return null;

                        return (
                          <motion.button
                            key={p}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => goToPage(p)}
                            className="w-8 md:w-10 h-8 md:h-10 rounded-sm md:rounded-sm border text-xs md:text-sm font-bold transition-all"
                            style={{
                              backgroundColor: p === page ? BRAND : "white",
                              color: p === page ? "white" : "#334155",
                              borderColor: p === page ? BRAND : `${BRAND}20`,
                              boxShadow: p === page ? "0 4px 12px rgba(148, 129, 121, 0.3)" : undefined,
                            }}
                          >
                            {p}
                          </motion.button>
                        );
                      })}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 md:px-5 py-2 md:py-2.5 rounded-sm md:rounded-sm border bg-white text-xs md:text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-md"
                      style={{ borderColor: `${BRAND}20` }}
                    >
                      Next
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {!isPreviewMode && <ProductFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} product={editProduct} />}
    </>
  );
}
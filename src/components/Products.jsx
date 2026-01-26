import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  SlidersHorizontal,
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
} from "lucide-react";

import { useProducts } from "./auth/ProductsProvider";
import ProductCard from "./ProductCard";
import { ProductFormModal } from "./ProductFormModal";
import ShopFilters from "./ShopFilters";
import { useAuth } from "./auth/AuthProvider";

const BRAND = "#948179";

const cn = (...c) => c.filter(Boolean).join(" ");

const CATEGORIES = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "Care Packages", label: "Care Packages", icon: Heart },
  { id: "Packages", label: "Packages", icon: Gift },
  { id: "Add-ons", label: "Add-ons", icon: Package },
  { id: "Protection", label: "Protection", icon: Shield },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "newest", label: "Newest" },
];

const SHOP_PAGE_SIZE = 9;
const HOME_PREVIEW_COUNT = 6;

/* -------------------- Skeletons -------------------- */
function ProductCardSkeleton({ showAdmin = false, isPreviewMode = false }) {
  return (
    <div className="relative">
      <div className="overflow-hidden bg-white rounded-sm border border-slate-200 h-full flex flex-col">
        <div className="relative aspect-square bg-slate-50">
          <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: `${BRAND}10` }} />
          <div className="absolute top-3 left-3">
            <div className="h-6 w-20 rounded-sm animate-pulse" style={{ backgroundColor: `${BRAND}18` }} />
          </div>
        </div>

        <div className="p-3">
          <div className="h-5 w-24 rounded-sm bg-slate-100 animate-pulse" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-4/5 rounded-sm bg-slate-100 animate-pulse" />
            <div className="h-4 w-3/5 rounded-sm bg-slate-100 animate-pulse" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full rounded-sm bg-slate-100 animate-pulse" />
            <div className="h-3 w-2/3 rounded-sm bg-slate-100 animate-pulse" />
          </div>
        </div>

        <div className="px-3 pb-3 mt-auto">
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <div className="space-y-2">
              <div className="h-6 w-24 rounded-sm bg-slate-100 animate-pulse" />
              <div className="h-3 w-20 rounded-sm bg-slate-100 animate-pulse" />
            </div>
            <div className="h-10 w-10 md:w-28 rounded-sm bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>

      {showAdmin && !isPreviewMode && (
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="w-9 h-9 rounded-sm bg-slate-100 animate-pulse" />
          <div className="w-9 h-9 rounded-sm bg-slate-100 animate-pulse" />
          <div className="w-9 h-9 rounded-sm bg-slate-100 animate-pulse" />
        </div>
      )}
    </div>
  );
}

function ProductsGridSkeleton({ isPreviewMode = false, count = 9 }) {
  const gridClass = isPreviewMode
    ? "grid grid-cols-2 sm:grid-cols-3 gap-4"
    : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={gridClass}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
        >
          <ProductCardSkeleton isPreviewMode={isPreviewMode} showAdmin />
        </motion.div>
      ))}
    </motion.div>
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
  const [showFilters, setShowFilters] = useState(false);

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
          p.category?.toLowerCase().includes(q),
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
  };

  const openCreate = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-white pt-6">
        {/* subtle background wash */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute -top-48 -right-48 h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: BRAND }}
          />
          <div
            className="absolute -bottom-48 -left-48 h-[520px] w-[520px] rounded-full blur-3xl opacity-15"
            style={{ backgroundColor: BRAND }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="border border-slate-200 rounded-sm bg-white p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border bg-white"
                  style={{ borderColor: `${BRAND}26` }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: BRAND }} />
                  <span className="text-xs font-semibold tracking-[0.18em] uppercase text-slate-600">
                    Yagso Shop
                  </span>
                </div>

                <h1 className="mt-3 text-2xl md:text-4xl font-semibold text-slate-900">
                  Shop our collection
                </h1>
                <p className="mt-2 text-slate-600 max-w-xl">
                  Curated essentials and thoughtful add-ons — delivered with care.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {!isPreviewMode && isAdmin && (
                  <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-sm text-sm font-semibold text-white"
                    style={{ backgroundColor: BRAND }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Product
                  </button>
                )}

                <div className="text-sm text-slate-600">
                  <span className="font-semibold text-slate-900">{filteredProducts.length}</span>{" "}
                  item(s)
                </div>
              </div>
            </div>

            {/* Controls Row */}
       <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_160px]">
  {/* Search (hide on lg because sidebar has it) */}
  <div className="relative lg:hidden">
    </div>


              {/* Mobile filter button */}
              <button
                onClick={() => setShowFilters(true)}
                className="h-11 rounded-sm border bg-white text-sm font-semibold inline-flex items-center justify-center gap-2 md:hidden"
                style={{ borderColor: `${BRAND}26` }}
              >
                <SlidersHorizontal className="w-4 h-4" style={{ color: BRAND }} />
                Filters
              </button>
            </div>

            {/* Category Pills */}
            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = selectedCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-semibold border whitespace-nowrap transition",
                      active ? "text-white" : "text-slate-700 bg-white hover:bg-slate-50",
                    )}
                    style={{
                      backgroundColor: active ? BRAND : "white",
                      borderColor: active ? BRAND : `${BRAND}26`,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body */}
          <div className={cn("mt-6 grid gap-6", isPreviewMode ? "" : "lg:grid-cols-[280px_1fr]")}>
            {/* Desktop Filters */}
            {!isPreviewMode && (
              <aside className="hidden lg:block">
                <div className="sticky top-24">
                  <div className="rounded-sm border bg-white p-4" style={{ borderColor: `${BRAND}26` }}>
                    <ShopFilters
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                    />
                  </div>
                </div>
              </aside>
            )}

            {/* Grid */}
            <main>
              {!loading && !isPreviewMode && isShopRoute && totalPages > 1 && (
                <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
                  <div>
                    Page{" "}
                    <span className="font-semibold text-slate-900">{page}</span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-900">{totalPages}</span>
                  </div>
                  <div>
                    Showing{" "}
                    <span className="font-semibold text-slate-900">
                      {(page - 1) * SHOP_PAGE_SIZE + 1}
                    </span>
                    {" - "}
                    <span className="font-semibold text-slate-900">
                      {Math.min(page * SHOP_PAGE_SIZE, filteredProducts.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-900">
                      {filteredProducts.length}
                    </span>
                  </div>
                </div>
              )}

              {loading ? (
                <ProductsGridSkeleton isPreviewMode={isPreviewMode} count={9} />
              ) : visibleProducts.length === 0 ? (
                <div className="border border-slate-200 bg-white rounded-sm p-10 text-center">
                  <div
                    className="w-14 h-14 mx-auto rounded-sm border flex items-center justify-center"
                    style={{ borderColor: `${BRAND}26` }}
                  >
                    <Package className="w-7 h-7" style={{ color: BRAND }} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">No products found</h3>
                  <p className="mt-2 text-sm text-slate-600">Try changing your filters.</p>
                </div>
              ) : (
                <>
                  <div
                    className={
                      isPreviewMode
                        ? "grid grid-cols-2 sm:grid-cols-3 gap-4"
                        : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4"
                    }
                  >
                    {visibleProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="relative group"
                      >
                        <ProductCard product={product} />

                        {!isPreviewMode && isAdmin && (
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={() => {
                                setEditProduct(product);
                                setModalOpen(true);
                              }}
                              className="p-2 rounded-sm border bg-white hover:bg-slate-50"
                              style={{ borderColor: `${BRAND}26` }}
                              aria-label="Edit product"
                            >
                              <Pencil className="w-4 h-4" style={{ color: BRAND }} />
                            </button>

                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-2 rounded-sm border bg-white hover:bg-slate-50"
                              style={{ borderColor: `${BRAND}26` }}
                              aria-label="Delete product"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>

                            <button
                              onClick={() => navigate(`/product/${product.id}`)}
                              className="p-2 rounded-sm border bg-white hover:bg-slate-50"
                              style={{ borderColor: `${BRAND}26` }}
                              aria-label="See product"
                            >
                              <Eye className="w-4 h-4" style={{ color: BRAND }} />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Preview CTA */}
                  {isPreviewMode && (
                    <div className="flex justify-center mt-8">
                      <a
                        href="/shop"
                        className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase"
                        style={{ color: BRAND }}
                      >
                        View full shop
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  {/* Pagination */}
                  {isShopRoute && totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-2">
                      <button
                        onClick={() => goToPage(page - 1)}
                        disabled={page === 1}
                        className="px-4 py-2 rounded-sm border bg-white text-slate-700 disabled:opacity-50"
                        style={{ borderColor: `${BRAND}26` }}
                      >
                        Prev
                      </button>

                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }).map((_, idx) => {
                          const p = idx + 1;
                          const show = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                          if (!show) return null;

                          return (
                            <button
                              key={p}
                              onClick={() => goToPage(p)}
                              className="w-10 h-10 rounded-sm border text-sm font-semibold"
                              style={{
                                backgroundColor: p === page ? BRAND : "white",
                                color: p === page ? "white" : "#334155",
                                borderColor: p === page ? BRAND : `${BRAND}26`,
                              }}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => goToPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-4 py-2 rounded-sm border bg-white text-slate-700 disabled:opacity-50"
                        style={{ borderColor: `${BRAND}26` }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>

        {/* Mobile filters sheet */}
        {!isPreviewMode && (
          <AnimatePresence>
            {showFilters && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowFilters(false)}
                  className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                />
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-sm shadow-2xl max-h-[85vh] overflow-y-auto lg:hidden"
                  style={{ borderTop: `1px solid ${BRAND}26` }}
                >
                  <div
                    className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between"
                    style={{ borderColor: `${BRAND}26` }}
                  >
                    <div className="text-sm font-semibold text-slate-900">Filters</div>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-sm font-semibold"
                      style={{ color: BRAND }}
                    >
                      Close
                    </button>
                  </div>

                  <div className="p-4">
                    <ShopFilters
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                      sortBy={sortBy}
                      setSortBy={setSortBy}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        )}
      </div>

      {!isPreviewMode && (
        <ProductFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          product={editProduct}
        />
      )}
    </>
  );
}

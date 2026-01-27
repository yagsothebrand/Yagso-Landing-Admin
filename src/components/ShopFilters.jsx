import { motion } from "framer-motion";
import { X, Search, SlidersHorizontal } from "lucide-react";

const BRAND = "#948179";
const cn = (...c) => c.filter(Boolean).join(" ");

const QUICK_RANGES = [
  { label: "Under 10K", min: "", max: "10000" },
  { label: "10K – 25K", min: "10000", max: "25000" },
  { label: "25K – 50K", min: "25000", max: "50000" },
  { label: "50K+", min: "50000", max: "" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "price-low", label: "Price: Low → High" },
  { value: "price-high", label: "Price: High → Low" },
  { value: "newest", label: "Newest" },
];

export default function ShopFilters({
  searchQuery,
  setSearchQuery,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
}) {
  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange({ min: "", max: "" });
    setSortBy("popular");
  };

  const hasActiveFilters = !!(searchQuery || priceRange.min || priceRange.max || sortBy !== "popular");

  const isRangeActive = (r) => priceRange.min === r.min && priceRange.max === r.max;

  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-sm border grid place-items-center bg-white"
            style={{ borderColor: `${BRAND}26` }}
          >
            <SlidersHorizontal className="w-4 h-4" style={{ color: BRAND }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Filters</p>
            <p className="text-[11px] text-slate-500">Refine your selection</p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 border rounded-sm bg-white hover:bg-slate-50 transition"
            style={{ borderColor: `${BRAND}26`, color: BRAND }}
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full h-11 pl-9 pr-3 rounded-sm border bg-white text-sm outline-none"
            style={{
              borderColor: `${BRAND}26`,
              boxShadow: "none",
            }}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Sort</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full h-11 rounded-sm border bg-white text-sm px-3 outline-none"
          style={{ borderColor: `${BRAND}26` }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700">Price Range (NGN)</label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => setPriceRange((p) => ({ ...p, min: e.target.value }))}
            placeholder="Min"
            className="h-11 rounded-sm border bg-white text-sm px-3 outline-none"
            style={{ borderColor: `${BRAND}26` }}
          />
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => setPriceRange((p) => ({ ...p, max: e.target.value }))}
            placeholder="Max"
            className="h-11 rounded-sm border bg-white text-sm px-3 outline-none"
            style={{ borderColor: `${BRAND}26` }}
          />
        </div>
      </div>

      {/* Quick ranges (clean chips) */}
      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-[0.14em]">
          Quick select
        </p>

        <div className="flex flex-wrap gap-2">
          {QUICK_RANGES.map((r) => {
            const active = isRangeActive(r);
            return (
              <button
                key={r.label}
                onClick={() => setPriceRange({ min: r.min, max: r.max })}
                className={cn(
                  "text-xs font-semibold px-3 py-2 border rounded-sm transition",
                  active ? "text-white" : "bg-white text-slate-700 hover:bg-slate-50"
                )}
                style={{
                  backgroundColor: active ? BRAND : "white",
                  borderColor: active ? BRAND : `${BRAND}26`,
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Small brand note (optional, subtle) */}
      <div
        className="rounded-sm border p-3 bg-white"
        style={{ borderColor: `${BRAND}26`, background: `${BRAND}08` }}
      >
        <p className="text-sm font-semibold text-slate-900">Need help choosing?</p>
        <p className="text-xs text-slate-600 mt-1">
          Tap any product to view details and material options.
        </p>
      </div>
    </motion.div>
  );
}
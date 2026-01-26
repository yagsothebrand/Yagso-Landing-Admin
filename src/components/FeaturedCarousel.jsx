import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";

const BRAND = "#948179";
const BORDER = `${BRAND}26`;
const cx = (...c) => c.filter(Boolean).join(" ");

export default function FeaturedCarousel({
  products = [],
  itemsPerView = 3, // desktop
  mobileItemsPerView = 2, // mobile
  autoPlay = true,
  autoPlayMs = 4800,
}) {
  const featured = useMemo(
    () => (products || []).filter((p) => p.isFeatured === true),
    [products],
  );

  const total = featured.length;

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 639px)").matches
      : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 639px)");
    const onChange = (e) => setIsMobile(e.matches);

    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);

    setIsMobile(mq.matches);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  const perView = Math.max(1, isMobile ? mobileItemsPerView : itemsPerView);
  const pages = Math.max(1, Math.ceil(total / perView));
  const canSlide = total > perView;

  const [page, setPage] = useState(0);
  const clamp = (p) => Math.max(0, Math.min(pages - 1, p));
  const goPrev = () => setPage((p) => clamp(p - 1));
  const goNext = () => setPage((p) => clamp(p + 1));

  useEffect(() => {
    setPage(0);
  }, [total, perView]);

  // autoplay only desktop
  useEffect(() => {
    if (isMobile) return;
    if (!autoPlay) return;
    if (!canSlide) return;

    const t = setInterval(() => {
      setPage((p) => (p >= pages - 1 ? 0 : p + 1));
    }, autoPlayMs);

    return () => clearInterval(t);
  }, [autoPlay, autoPlayMs, canSlide, pages, isMobile]);

  if (!featured.length) return null;

  // MOBILE: luxe horizontal rail
  if (isMobile) {
    return (
      <section className="relative">
        {/* header */}
        <div className="flex items-end justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 border bg-white rounded-sm"
              style={{ borderColor: BORDER }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: BRAND }}
              />
              <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-slate-600">
                Featured
              </span>
            </div>

            <h3 className="mt-2 text-xl font-extrabold text-slate-900">
              Signature picks
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Handpicked pieces — limited quantities.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-600">
            <span className="text-slate-900">{total}</span> items
          </div>
        </div>

        {/* rail */}
        <div
          className="border bg-white rounded-sm overflow-hidden"
          style={{ borderColor: BORDER }}
        >
          <div className="overflow-x-auto no-scrollbar">
            <div className="flex gap-4 p-4 pr-6 snap-x snap-mandatory">
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="snap-start shrink-0"
                  style={{
                    width: `calc((100% - 16px) / ${mobileItemsPerView})`, // gap-4
                  }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>

          {/* tiny hint */}
          <div
            className="px-4 py-2 border-t text-[11px] text-slate-500 flex items-center justify-between"
            style={{ borderColor: BORDER }}
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" style={{ color: BRAND }} />
              Swipe to explore
            </span>
            <span className="font-semibold" style={{ color: BRAND }}>
              YAGSO
            </span>
          </div>
        </div>
      </section>
    );
  }

  // DESKTOP/TABLET: editorial grid + simple pagination (no framer)
  const start = page * perView;
  const current = featured.slice(start, start + perView);

  return (
    <section className="relative">
      {/* soft taupe wash */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: BRAND }}
      />
      <div className="pointer-events-none absolute -bottom-28 -left-28 h-80 w-80 rounded-full blur-3xl opacity-20"
        style={{ backgroundColor: BRAND }}
      />

      {/* header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-4">
        <div className="min-w-0">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 border bg-white rounded-sm"
            style={{ borderColor: BORDER }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: BRAND }}
            />
            <span className="text-[10px] tracking-[0.22em] uppercase font-semibold text-slate-600">
              Featured Collection
            </span>
          </div>

          <h3 className="mt-2 text-2xl md:text-3xl font-extrabold text-slate-900">
            Jewelry that whispers{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${BRAND}, #b9a89a)`,
              }}
            >
              luxury
            </span>
            .
          </h3>

          <p className="text-sm text-slate-600 mt-2 max-w-2xl">
            A refined edit of our most-loved pieces — designed to layer, gift,
            and keep.
          </p>
        </div>

        {/* controls */}
        <div className="flex items-center gap-3">
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-2 border bg-white rounded-sm text-xs text-slate-600"
            style={{ borderColor: BORDER }}
          >
            <span>
              Page <span className="font-semibold text-slate-900">{page + 1}</span> /{" "}
              <span className="font-semibold text-slate-900">{pages}</span>
            </span>
            <span className="h-3 w-[1px]" style={{ backgroundColor: BORDER }} />
            <span>
              <span className="font-semibold text-slate-900">{total}</span> items
            </span>
          </div>

          {canSlide && (
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                disabled={page === 0}
                className="w-10 h-10 rounded-sm border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#fffdfb] grid place-items-center"
                style={{ borderColor: BORDER }}
                aria-label="Previous"
                title="Previous"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: BRAND }} />
              </button>

              <button
                onClick={goNext}
                disabled={page >= pages - 1}
                className="w-10 h-10 rounded-sm border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#fffdfb] grid place-items-center"
                style={{ borderColor: BORDER }}
                aria-label="Next"
                title="Next"
              >
                <ChevronRight className="w-5 h-5" style={{ color: BRAND }} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* frame */}
      <div
        className="border bg-white rounded-sm overflow-hidden"
        style={{ borderColor: BORDER }}
      >
        {/* grid */}
        <div className={cx("p-4 md:p-6", perView === 2 ? "grid grid-cols-2 gap-4 md:gap-6" : "grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6")}>
          {current.map((p) => (
            <div key={p.id} className="relative">
              <ProductCard product={p} />
            </div>
          ))}
        </div>

        {/* footer row */}
        {canSlide && (
          <div
            className="px-4 md:px-6 py-3 border-t flex items-center justify-between"
            style={{ borderColor: BORDER }}
          >
            <div className="text-xs text-slate-600">
              Showing{" "}
              <span className="font-semibold text-slate-900">{start + 1}</span>
              {" - "}
              <span className="font-semibold text-slate-900">
                {Math.min(start + perView, total)}
              </span>{" "}
              of <span className="font-semibold text-slate-900">{total}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: pages }).map((_, i) => {
                const active = i === page;
                return (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className="h-2 w-2 rounded-full transition"
                    style={{
                      backgroundColor: active ? BRAND : "#cbd5e1",
                      opacity: active ? 1 : 0.8,
                    }}
                    aria-label={`Go to page ${i + 1}`}
                    title={`Page ${i + 1}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

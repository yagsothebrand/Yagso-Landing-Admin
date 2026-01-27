import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useBlog } from "./auth/BlogProvider";
import { useNavigate } from "react-router-dom";

const BRAND = "#948179";
const BRAND_LIGHT = "#f5f2ef";
const BORDER = `${BRAND}26`;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-sm bg-slate-200 ${className}`}
      aria-hidden="true"
    />
  );
}

function BlogCardSkeleton() {
  return (
    <div className="h-full">
      <div className="h-full overflow-hidden rounded-sm border border-slate-200 bg-white/80 backdrop-blur flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Skeleton className="absolute inset-0" />
          <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between">
            <Skeleton className="h-5 w-16 rounded-sm bg-white/70" />
            <Skeleton className="h-5 w-20 rounded-sm bg-white/70" />
          </div>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-2/3 mt-2" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-11/12" />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-9 w-full mt-4 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export default function FeaturedBlogs({
  title = "Latest Insights",
  subtitle = "Thoughtful articles on sexual wellness, aftercare, and informed choices.",
  showViewAll = true,
}) {
  const { blogs, loading } = useBlog();
  const navigate = useNavigate();

  // Get first 3 blogs for desktop, 2 for mobile
  const featuredBlogs = useMemo(() => {
    return (blogs || []).slice(0, 3);
  }, [blogs]);

  if (!loading && featuredBlogs.length === 0) {
    return null;
  }

  return (
    <section
      className="relative py-12 md:py-16"
      style={{ backgroundColor: BRAND_LIGHT }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={headerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-8 md:mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <motion.div
              className="h-[1px] w-8"
              style={{ backgroundColor: BRAND }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <p
              className="text-[11px] tracking-[0.24em] uppercase font-semibold"
              style={{ color: BRAND }}
            >
              From the Journal
            </p>
            <motion.div
              className="h-[1px] w-8"
              style={{ backgroundColor: BRAND }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </div>

          <motion.h2
            className="mt-3 text-2xl md:text-4xl font-serif font-light text-slate-900"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="mt-3 text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* Blog Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <div className="hidden lg:block">
              <BlogCardSkeleton />
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {featuredBlogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                variants={itemVariants}
                className={index === 2 ? "hidden lg:block" : ""}
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                  className="h-full"
                >
                  <a href={`/blog/${blog.id}`} className="block h-full">
                    <Card
                      className="h-full overflow-hidden border bg-white shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group rounded-sm"
                      style={{ borderColor: BORDER }}
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        {blog.image ? (
                          <motion.img
                            src={blog.image}
                            alt={blog.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.6 }}
                          />
                        ) : (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ backgroundColor: BRAND_LIGHT }}
                          >
                            <p className="text-sm" style={{ color: BRAND }}>
                              No cover image
                            </p>
                          </div>
                        )}

                        {/* Gradient overlay */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />

                        {/* Top badges */}
                        <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between gap-2">
                          {blog.category ? (
                            <motion.span
                              className="text-[10px] tracking-[0.18em] uppercase font-bold px-2.5 py-1 border backdrop-blur-sm rounded-sm"
                              style={{
                                borderColor: "rgba(255,255,255,0.3)",
                                backgroundColor: BRAND,
                                color: "white",
                              }}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            >
                              {blog.category}
                            </motion.span>
                          ) : (
                            <span />
                          )}

                          <motion.span
                            className="text-[10px] px-2.5 py-1 border backdrop-blur-md rounded-sm"
                            style={{
                              borderColor: "rgba(255,255,255,0.3)",
                              backgroundColor: "rgba(255,255,255,0.9)",
                              color: "#334155",
                            }}
                            initial={{ opacity: 0, x: 10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                          >
                            {blog.date}
                          </motion.span>
                        </div>

                        {/* Bottom accent */}
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-[2px]"
                          style={{ backgroundColor: BRAND }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.6,
                            delay: index * 0.1 + 0.5,
                          }}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:opacity-80 transition-opacity duration-300">
                          {blog.title}
                        </h3>

                        <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-2">
                          {blog.description}
                        </p>

                        <div className="mt-4 flex items-center justify-between text-xs">
                          <span
                            className="font-semibold"
                            style={{ color: BRAND }}
                          >
                            {blog.author || "Anonymous"}
                          </span>

                          <span className="inline-flex items-center gap-1.5">
                            <span
                              className="h-1 w-1 rounded-full"
                              style={{ backgroundColor: BRAND }}
                            />
                            <span
                              className="tracking-[0.16em] uppercase text-[10px] font-semibold"
                              style={{ color: BRAND }}
                            >
                              YAGSO
                            </span>
                          </span>
                        </div>

                        {/* Read More Button */}
                        <motion.div
                          className="mt-4"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + 0.6 }}
                        >
                          <div
                            className="inline-flex items-center justify-center w-full border text-xs font-semibold text-white hover:opacity-90 transition-all duration-300 px-3 h-9 rounded-sm group/btn"
                            style={{
                              backgroundColor: BRAND,
                              borderColor: BRAND,
                            }}
                          >
                            Read Article
                            <ArrowRight className="w-3 h-3 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1" />
                          </div>
                        </motion.div>
                      </div>
                    </Card>
                  </a>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        {showViewAll && !loading && featuredBlogs.length > 0 && (
          <motion.div
            className="mt-8 md:mt-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.button
              type="button"
              onClick={() => navigate("/blog")}
              className="group inline-flex items-center gap-3 px-8 py-3 text-sm font-semibold tracking-wide transition-all duration-300 border-b-2"
              style={{
                borderColor: BRAND,
                color: BRAND,
              }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>VIEW ALL ARTICLES</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

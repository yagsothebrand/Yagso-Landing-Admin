import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Edit2, Plus, Trash2 } from "lucide-react";
import BlogForm from "./BlogForm";
import { useBlog } from "./auth/BlogProvider";
import { useAuth } from "./auth/AuthProvider";

const BRAND = "#948179";
const BRAND_LIGHT = "#f5f2ef";
const BORDER = `${BRAND}26`;

const sectionVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
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

export function BlogGridSkeleton({ count = 6 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-full">
          <div className="h-full overflow-hidden rounded-sm border border-slate-200 bg-white/80 backdrop-blur flex flex-col">
            {/* Image skeleton */}
            <div className="relative h-44 overflow-hidden">
              <Skeleton className="absolute inset-0" />
              <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between">
                <Skeleton className="h-5 w-16 rounded-sm bg-white/70" />
                <Skeleton className="h-5 w-20 rounded-sm bg-white/70" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="p-4 flex-1 flex flex-col">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/3 mt-2" />
              <div className="mt-3 space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-4/5" />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Skeleton className="h-8 rounded-sm" />
                <Skeleton className="h-8 rounded-sm" />
                <Skeleton className="h-8 rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export default function BlogSection() {
  const { blogs, loading, createBlog, updateBlog, deleteBlog } = useBlog();
  const [editingBlog, setEditingBlog] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const { isAdmin } = useAuth();

  const handleSave = async (blogData) => {
    if (editingBlog) {
      await updateBlog(editingBlog.id, blogData);
      setEditingBlog(null);
    } else {
      await createBlog(blogData);
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteBlog(id);
  };

  if (editingBlog || isCreating) {
    return (
      <BlogForm
        editingBlog={editingBlog}
        onSave={handleSave}
        onCancel={() => {
          setEditingBlog(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <>
      <section
        id="blog"
        className="relative py-12 md:py-16"
        style={{ backgroundColor: BRAND_LIGHT }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-10"
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <div
                className="h-[1px] w-8 bg-gradient-to-r from-transparent"
                style={{ backgroundColor: BRAND }}
              />
              <p
                className="text-[11px] tracking-[0.24em] uppercase font-semibold"
                style={{ color: BRAND }}
              >
                From the Journal
              </p>
              <div
                className="h-[1px] w-8 bg-gradient-to-l from-transparent"
                style={{ backgroundColor: BRAND }}
              />
            </div>

            <h3 className="mt-3 text-2xl md:text-4xl font-serif font-light text-slate-900">
              Wellness Insights
            </h3>

            <p className="mt-3 text-sm md:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              Thoughtful articles on sexual wellness, aftercare, and informed
              choices — written to support you, discreetly.
            </p>

            {isAdmin && (
              <div className="mt-6 flex items-center justify-center">
                <Button
                  onClick={() => setIsCreating(true)}
                  className="h-10 rounded-sm text-white font-semibold tracking-wide hover:opacity-90 transition-all"
                  style={{ backgroundColor: BRAND }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              </div>
            )}
          </motion.div>

          {/* Body */}
          {loading ? (
            <BlogGridSkeleton count={6} />
          ) : blogs.length === 0 ? (
            <div className="text-center py-16">
              <div
                className="max-w-md mx-auto rounded-sm border p-8"
                style={{
                  borderColor: BORDER,
                  backgroundColor: "white",
                }}
              >
                <p className="text-slate-900 font-semibold text-lg">
                  No blog posts yet
                </p>
                <p className="text-slate-600 mt-2 text-sm">
                  Create your first post to start sharing helpful insights.
                </p>

                {isAdmin && (
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="mt-5 h-10 rounded-sm text-white font-semibold tracking-wide hover:opacity-90"
                    style={{ backgroundColor: BRAND }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first post
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {blogs.map((blog) => (
                <motion.div key={blog.id} variants={itemVariants}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="h-full"
                  >
                    <a href={`/blog/${blog.id}`}>
                      <Card
                        className="h-full overflow-hidden border bg-white shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group rounded-sm"
                        style={{ borderColor: BORDER }}
                      >
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          {blog.image ? (
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700"
                              loading="lazy"
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                          {/* Top badges */}
                          <div className="absolute inset-x-0 top-0 p-3 flex items-center justify-between gap-2">
                            {blog.category ? (
                              <span
                                className="text-[10px] tracking-[0.18em] uppercase font-bold px-2.5 py-1 border backdrop-blur-sm rounded-sm"
                                style={{
                                  borderColor: "rgba(255,255,255,0.3)",
                                  backgroundColor: BRAND,
                                  color: "white",
                                }}
                              >
                                {blog.category}
                              </span>
                            ) : (
                              <span />
                            )}

                            <span
                              className="text-[10px] px-2.5 py-1 border backdrop-blur-md rounded-sm"
                              style={{
                                borderColor: "rgba(255,255,255,0.3)",
                                backgroundColor: "rgba(255,255,255,0.9)",
                                color: "#334155",
                              }}
                            >
                              {blog.date}
                            </span>
                          </div>

                          {/* Bottom accent */}
                          <div
                            className="absolute bottom-0 left-0 right-0 h-[2px]"
                            style={{ backgroundColor: BRAND }}
                          />
                        </div>

                        {/* Content */}
                        <div className="p-4 flex-1 flex flex-col">
                          <h3 className="text-lg font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:opacity-80 transition">
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

                          {/* Actions */}
                          <div
                            className={`mt-4 grid gap-2 ${isAdmin ? "grid-cols-3" : "grid-cols-1"}`}
                          >
                            {isAdmin && (
                              <>
                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setEditingBlog(blog);
                                  }}
                                  variant="outline"
                                  className="text-xs h-9 bg-white hover:bg-opacity-80 rounded-sm"
                                  style={{
                                    borderColor: BORDER,
                                    color: BRAND,
                                  }}
                                >
                                  <Edit2 className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>

                                <Button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(blog.id);
                                  }}
                                  variant="outline"
                                  className="text-xs h-9 bg-white hover:bg-red-50 rounded-sm"
                                  style={{
                                    borderColor: BORDER,
                                    color: "#b91c1c",
                                  }}
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Delete
                                </Button>
                              </>
                            )}

                            <a
                              href={`/blog/${blog.id}`}
                              className="inline-flex items-center justify-center border text-xs font-semibold text-white hover:opacity-90 transition px-3 h-9 rounded-sm"
                              style={{
                                backgroundColor: BRAND,
                                borderColor: BRAND,
                              }}
                            >
                              Read
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      </Card>
                    </a>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

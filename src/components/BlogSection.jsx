import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Edit2, Plus, Trash2 } from "lucide-react";
import BlogForm from "./BlogForm";
import { useBlog } from "./auth/BlogProvider";
import { useAuth } from "./auth/AuthProvider";
import CTAFooter from "./CTAFooter";

const BRAND = "#948179";

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
      className={`animate-pulse rounded-none bg-slate-200 ${className}`}
      aria-hidden="true"
    />
  );
}

export function BlogGridSkeleton({ count = 6 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-full">
          <div className="h-full overflow-hidden rounded-none border border-slate-200 bg-white/80 backdrop-blur flex flex-col">
            {/* Image skeleton */}
            <div className="relative h-52 overflow-hidden">
              <Skeleton className="absolute inset-0" />
              <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded-none bg-white/70" />
                <Skeleton className="h-6 w-24 rounded-none bg-white/70" />
              </div>
            </div>

            {/* Content skeleton */}
            <div className="p-6 flex-1 flex flex-col">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-2/3 mt-2" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <div className="mt-5 flex items-center justify-between">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-2">
                <Skeleton className="h-9 rounded-none" />
                <Skeleton className="h-9 rounded-none" />
                <Skeleton className="h-9 rounded-none" />
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
      <section id="blog" className="relative py-16  bg-[#fbfaf8]">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-14"
          >
            <p
              className="text-[12px] tracking-[0.18em] uppercase"
              style={{ color: BRAND }}
            >
              From the Journal
            </p>

            <h3 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900">
              Wellness Insights
            </h3>

            <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
              Thoughtful articles on sexual wellness, aftercare, and informed
              choices — written to support you, discreetly.
            </p>

            {isAdmin && (
              <div className="mt-7 flex items-center justify-center">
                <Button
                  onClick={() => setIsCreating(true)}
                  className="h-11 rounded-none text-white font-semibold tracking-wide hover:opacity-90"
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
            <div className="text-center py-20">
              <div className="max-w-lg mx-auto rounded-none border border-slate-200 bg-white/50 backdrop-blur p-10">
                <p className="text-slate-900 font-semibold text-lg">
                  No blog posts yet
                </p>
                <p className="text-slate-600 mt-2">
                  Create your first post to start sharing helpful insights.
                </p>

                {isAdmin && (
                  <Button
                    onClick={() => setIsCreating(true)}
                    className="mt-6 h-11 rounded-none text-white font-semibold tracking-wide hover:opacity-90"
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
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {blogs.map((blog) => (
                <motion.div key={blog.id} variants={itemVariants}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className="h-full"
                  >
                    <a href={`/blog/${blog.id}`}>
                      <Card
                        className="h-full overflow-hidden border bg-[#fffdfb] shadow-sm hover:shadow-xl transition flex flex-col group"
                        style={{ borderColor: BORDER }}
                      >
                        {/* Image */}
                        <div className="relative h-56 overflow-hidden">
                          {blog.image ? (
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition duration-700"
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-[#f6f3ef] flex items-center justify-center">
                              <p className="text-sm text-slate-500">
                                No cover image
                              </p>
                            </div>
                          )}

                          {/* subtle luxury gradient for readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                          {/* Top overlay */}
                          <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between gap-3">
                            {blog.category ? (
                              <span
                                className="text-[11px] tracking-[0.18em] uppercase font-semibold px-3 py-1 border bg-white/75 backdrop-blur"
                                style={{
                                  borderColor: BORDER,
                                  color: "#0f172a",
                                }}
                              >
                                {blog.category}
                              </span>
                            ) : (
                              <span />
                            )}

                            <span
                              className="text-[11px] px-3 py-1 border bg-white/75 backdrop-blur"
                              style={{ borderColor: BORDER, color: "#334155" }}
                            >
                              {blog.date}
                            </span>
                          </div>

                          {/* bottom accent line */}
                          <div
                            className="absolute bottom-0 left-0 right-0 h-[2px]"
                            style={{
                              background:
                                "linear-gradient(90deg, rgba(148,129,121,0), rgba(148,129,121,0.95), rgba(148,129,121,0))",
                            }}
                          />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-semibold text-slate-900 leading-snug line-clamp-2 group-hover:opacity-90 transition">
                            {blog.title}
                          </h3>

                          <p className="text-slate-600 text-sm mt-3 leading-relaxed line-clamp-3">
                            {blog.description}
                          </p>

                          <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
                            <span className="font-semibold text-slate-800">
                              {blog.author || "Anonymous"}
                            </span>

                            <span className="inline-flex items-center gap-2">
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: BRAND }}
                              />
                              <span className="tracking-[0.14em] uppercase text-[11px]">
                                YAGSO
                              </span>
                            </span>
                          </div>

                          {/* Actions */}
                          <div
                            className={`mt-6 grid gap-2 ${isAdmin ? "grid-cols-3" : "grid-cols-1"}`}
                          >
                            {isAdmin && (
                              <>
                                <Button
                                  onClick={() => setEditingBlog(blog)}
                                  variant="outline"
                                  className="text-xs h-10 bg-white hover:bg-[#f6f3ef]"
                                  style={{ borderColor: BORDER }}
                                >
                                  <Edit2 className="w-3.5 h-3.5 mr-1" />
                                  Edit
                                </Button>

                                <Button
                                  onClick={() => handleDelete(blog.id)}
                                  variant="outline"
                                  className="text-xs h-10 bg-white hover:bg-red-50"
                                  style={{
                                    borderColor: BORDER,
                                    color: "#b91c1c",
                                  }}
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                                  Delete
                                </Button>
                              </>
                            )}

                            <a
                              href={`/blog/${blog.id}`}
                              className="inline-flex items-center justify-center border bg-white text-xs font-semibold text-slate-800 hover:bg-[#f6f3ef] transition px-3 h-10"
                              style={{ borderColor: BORDER }}
                            >
                              Read Article
                              <ArrowRight
                                className="w-3.5 h-3.5 ml-1"
                                style={{ color: BRAND }}
                              />
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
        <CTAFooter />
      </section>
    </>
  );
}

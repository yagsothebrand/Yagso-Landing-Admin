import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Edit2, Plus, Loader2, Trash2 } from "lucide-react";
import BlogForm from "./BlogForm";
import { useBlog } from "./auth/BlogProvider";
import { useAuth } from "./auth/AuthProvider";

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
      className={`animate-pulse rounded-md bg-gray-200/80 ${className}`}
      aria-hidden="true"
    />
  );
}

export function BlogGridSkeleton({ count = 6 }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-full">
          <div
            className="
              h-full overflow-hidden rounded-2xl
              border border-gray-200 bg-white/85 backdrop-blur
              shadow-[0_18px_45px_rgba(0,0,0,0.06)]
              flex flex-col
            "
          >
            {/* Image skeleton */}
            <div className="relative h-52 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2b6f99]/10 to-[#fc7182]/10" />
              <Skeleton className="absolute inset-0" />

              {/* top pills */}
              <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between">
                <Skeleton className="h-6 w-20 rounded-full bg-white/70" />
                <Skeleton className="h-6 w-24 rounded-full bg-white/70" />
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

              {/* Actions skeleton */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                <Skeleton className="h-9 rounded-xl" />
                <Skeleton className="h-9 rounded-xl" />
                <Skeleton className="h-9 rounded-xl" />
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
    <section
      id="blog"
      className="
        relative py-16 md:py-24 overflow-hidden
        bg-gradient-to-br from-white via-[#f7fbff] to-[#fff5f7]
      "
    >
      {/* Soft brand blobs */}
      <div className="pointer-events-none absolute -top-28 -left-28 h-80 w-80 rounded-full bg-[#2b6f99]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-[#fc7182]/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[#fc7182]" />
            <span className="bg-gradient-to-r from-[#fc7182] to-[#2b6f99] bg-clip-text text-transparent text-xs font-semibold tracking-wider uppercase">
              From the Journal
            </span>
          </div>

          <h3 className="mt-5 text-3xl md:text-5xl font-semibold text-gray-900 text-balance">
            Wellness insights — with privacy, clarity, and care.
          </h3>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Thoughtful articles on sexual wellness, aftercare, and informed
            choices — written to support you, discreetly.
          </p>
          {isAdmin && (
            <div className="mt-7 flex items-center justify-center">
              <Button
                onClick={() => setIsCreating(true)}
                className="
                rounded-full px-6 py-6 text-sm font-medium text-white
                bg-gradient-to-r from-[#2b6f99] to-[#fc7182]
                shadow-lg hover:opacity-95 transition
              "
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
            <div className="max-w-lg mx-auto rounded-2xl border border-gray-200 bg-white/70 backdrop-blur p-10 shadow-sm">
              <p className="text-gray-900 font-semibold text-lg">
                No blog posts yet
              </p>
              <p className="text-gray-600 mt-2">
                Create your first post to start sharing helpful insights.
              </p>

              <Button
                onClick={() => setIsCreating(true)}
                className="
                  mt-6 rounded-full px-6 py-6 text-sm font-medium text-white
                  bg-gradient-to-r from-[#2b6f99] to-[#fc7182]
                  shadow-lg hover:opacity-95 transition
                "
              >
                <Plus className="w-4 h-4 mr-2" />
                Create your first post
              </Button>
            </div>
          </div>
        ) : (
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {blogs.map((blog) => (
              <motion.div key={blog.id} variants={itemVariants}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="h-full"
                >
                  <Card
                    className="
                      h-full overflow-hidden rounded-2xl
                      border border-gray-200 bg-white/85 backdrop-blur
                      shadow-[0_18px_45px_rgba(0,0,0,0.06)]
                      hover:shadow-[0_26px_70px_rgba(0,0,0,0.10)]
                      transition
                      flex flex-col
                      group
                    "
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      {/* gradient fallback */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2b6f99]/20 to-[#fc7182]/20" />

                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="absolute inset-0 w-full h-full object-cover
                                     group-hover:scale-110 transition duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-sm text-gray-600">
                            No cover image
                          </p>
                        </div>
                      )}

                      {/* Top overlay */}
                      <div className="absolute inset-x-0 top-0 p-4 flex items-center justify-between">
                        {blog.category ? (
                          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/80 backdrop-blur border border-gray-200 text-gray-800">
                            {blog.category}
                          </span>
                        ) : (
                          <span />
                        )}

                        <span className="text-xs px-3 py-1 rounded-full bg-white/80 backdrop-blur border border-gray-200 text-gray-600">
                          {blog.date}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#2b6f99] transition">
                        {blog.title}
                      </h3>

                      <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                        {blog.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium text-gray-700">
                          {blog.author || "Anonymous"}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <span>Just Pills</span>
                        </span>
                      </div>

                      {/* Actions */}

                      <div className="mt-6 grid grid-cols-3 gap-2">
                        {isAdmin && (
                          <>
                            <Button
                              onClick={() => setEditingBlog(blog)}
                              variant="outline"
                              className="rounded-xl text-xs border-gray-200"
                            >
                              <Edit2 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(blog.id)}
                              variant="outline"
                              className="rounded-xl text-xs border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </>
                        )}
                        {/* Don't nest <a> inside Button; style the link as a button */}
                        <a
                          href={`/blog/${blog.id}`}
                          className="
                            inline-flex items-center justify-center rounded-xl
                            border border-gray-200 bg-white
                            text-xs font-medium text-[#2b6f99]
                            hover:text-[#fc7182] hover:bg-gray-50 transition
                            px-3 py-2
                          "
                        >
                          Read
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

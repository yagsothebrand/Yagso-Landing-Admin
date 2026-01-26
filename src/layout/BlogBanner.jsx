import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Sparkles, Clock, User, Share } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BlogBanner({ blog }) {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };
  return (
    <motion.section
      style={{ opacity, scale }}
      className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-50"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-100/40 to-pink-100/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-100/40 to-cyan-100/40 rounded-full blur-3xl"
        />
      </div>

      <header className="relative max-w-4xl mx-auto px-6 pt-10 pb-8">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">
              {blog.category}
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto px-6 mb-3 flex justify-end"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="
      flex items-center gap-2 px-5 py-3
      bg-[#2b6f99] 
      text-sm font-medium text-white
      rounded-full shadow-lg
    "
            >
              <Share className="w-4 h-4 text-white" />
            </motion.button>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight mb-6"
          >
            {blog.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-xl text-gray-700 leading-relaxed mb-8 font-light"
          >
            {blog.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="font-medium">{blog.author}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-gray-400" />
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{blog.date}</span>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mt-10 origin-left"
        />
      </header>
    </motion.section>
  );
}

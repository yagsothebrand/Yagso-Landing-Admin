import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Share,
} from "lucide-react";
import { useState, useEffect } from "react";

import { toast } from "sonner";
import { db, doc } from "./firebase";
import { getDoc } from "firebase/firestore";
import BlogBanner from "@/layout/BlogBanner";

import { AnimatePresence, motion } from "framer-motion";
import CTAFooter from "./CTAFooter";

function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          key="scrollTop"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full shadow-2xl hover:shadow-purple-500/50"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

// Image Gallery Component
function ImageGallery({ images, currentIndex, setCurrentIndex }) {
  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="max-w-4xl mx-auto px-6"
    >
      <div className="relative group">
        {/* Main Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl shadow-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="w-full h-[500px] object-cover"
          />
        </motion.div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </motion.button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? "border-purple-600 shadow-lg"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default function BlogDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch single blog by ID
  const fetchBlog = async () => {
    try {
      const docRef = doc(db, "blogs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBlog(docSnap.data());
      } else {
        toast.error("Blog not found");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-purple-600" />
        </motion.div>
      </div>
    );
  }

  if (!blog) return <div className="py-20 text-center">Blog not found</div>;

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white min-h-screen"
    >
      <BlogBanner blog={blog} />

      {/* Image Gallery - handles both single image and multiple images */}
      <ImageGallery
        images={
          blog.images && blog.images.length > 0
            ? blog.images
            : blog.image
              ? [blog.image]
              : []
        }
        currentIndex={currentImageIndex}
        setCurrentIndex={setCurrentImageIndex}
      />

      {/* Content */}
      <section className="max-w-3xl mx-auto px-6 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="space-y-8 text-gray-800 leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </section>

      {/* Footer CTA */}
      <CTAFooter />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </motion.article>
  );
}

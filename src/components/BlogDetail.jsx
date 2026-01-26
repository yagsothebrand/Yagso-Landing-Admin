import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowUp, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { db, doc } from "./firebase";
import { getDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

const BRAND = "#948179";

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
          className="fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl text-white"
          style={{ backgroundColor: BRAND }}
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="relative group bg-white/80 backdrop-blur border border-slate-200 rounded-none overflow-hidden">
        {/* Main Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="w-full h-[500px] object-cover"
          />
        </motion.div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white border border-slate-200 rounded-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white border border-slate-200 rounded-none shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-2 bg-white/90 backdrop-blur border border-slate-200 rounded-none text-slate-700 text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`flex-shrink-0 w-20 h-20 rounded-none overflow-hidden border-2 transition-all ${
                idx === currentIndex
                  ? "border-slate-400"
                  : "border-slate-200 opacity-60 hover:opacity-100"
              }`}
              style={{ borderColor: idx === currentIndex ? BRAND : undefined }}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
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
      <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-14 h-14 border-4 border-slate-200 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            style={{ borderTopColor: BRAND }}
          />
          <p className="text-slate-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-900 font-semibold text-lg">Blog not found</p>
          <Button
            onClick={() => navigate("/blog")}
            className="mt-4 h-11 rounded-none text-white font-semibold"
            style={{ backgroundColor: BRAND }}
          >
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      {/* Top navigation bar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" style={{ color: BRAND }} />
            Back to Blog
          </button>
        </div>
      </div>

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-[12px] tracking-[0.18em] uppercase" style={{ color: BRAND }}>
            {blog.category || "Blog Post"}
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-slate-600">
            <span className="font-medium">{blog.author || "Anonymous"}</span>
            <span>•</span>
            <span>{blog.date}</span>
          </div>
          {blog.description && (
            <p className="text-slate-600 mt-4 text-lg leading-relaxed">
              {blog.description}
            </p>
          )}
        </div>

        {/* Image Gallery */}
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
        <div className="max-w-4xl mx-auto px-4 mt-12">
          <div className="bg-white/80 backdrop-blur border border-slate-200 rounded-none overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-white/70">
              <p className="text-sm tracking-[0.18em] uppercase font-bold text-slate-700">
                Article Content
              </p>
            </div>
            <div className="p-6 md:p-10">
              <div
                className="prose prose-slate max-w-none
                  prose-headings:text-slate-900 prose-headings:font-bold
                  prose-p:text-slate-700 prose-p:leading-relaxed
                  prose-a:text-slate-900 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-slate-900 prose-strong:font-semibold
                  prose-ul:text-slate-700 prose-ol:text-slate-700
                  prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic
                  prose-img:rounded-none prose-img:border prose-img:border-slate-200"
                style={{ "--tw-prose-links": BRAND }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <Button
            onClick={() => navigate("/blog")}
            variant="outline"
            className="h-11 rounded-none border-slate-200 bg-white hover:border-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Posts
          </Button>
        </div>
      </motion.article>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}
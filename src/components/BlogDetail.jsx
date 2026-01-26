import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowLeft,
  Share2,
  Copy,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { db, doc } from "./firebase";
import { getDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";

const BRAND = "#948179";
const BORDER = `${BRAND}26`;

function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShow(window.scrollY > 500);
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
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 16 }}
          transition={{ duration: 0.2 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={scrollToTop}
          className="fixed bottom-7 right-6 z-50 h-12 w-12 bg-white/85 backdrop-blur border shadow-lg"
          style={{ borderColor: BORDER }}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 mx-auto" style={{ color: BRAND }} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function ImageGallery({ images, currentIndex, setCurrentIndex }) {
  if (!images || images.length === 0) return null;

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div
        className="relative group bg-[#fffdfb] border overflow-hidden shadow-sm"
        style={{ borderColor: BORDER }}
      >
        {/* Main Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent z-10" />
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="w-full h-[360px] sm:h-[460px] md:h-[520px] object-cover"
            loading="lazy"
          />
        </motion.div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 bg-white/90 backdrop-blur border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ borderColor: BORDER }}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 mx-auto" style={{ color: BRAND }} />
            </button>

            <button
              onClick={nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-11 w-11 bg-white/90 backdrop-blur border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ borderColor: BORDER }}
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 mx-auto" style={{ color: BRAND }} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1.5 bg-white/80 backdrop-blur border text-slate-800 text-xs font-semibold"
            style={{ borderColor: BORDER }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {images.map((img, idx) => {
            const active = idx === currentIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className="flex-shrink-0 w-20 h-20 border overflow-hidden bg-white"
                style={{ borderColor: active ? BRAND : BORDER, opacity: active ? 1 : 0.7 }}
                aria-label={`View image ${idx + 1}`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BlogDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = useMemo(() => {
    if (blog?.images?.length) return blog.images;
    if (blog?.image) return [blog.image];
    return [];
  }, [blog]);

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
    setLoading(true);
    setCurrentImageIndex(0);
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = blog?.title ? `YAGSO — ${blog.title}` : "YAGSO Blog";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: blog?.description || "Read this article on YAGSO.",
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied");
    } catch (e) {
      // Share can be cancelled by user; clipboard can fail on some browsers
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied");
      } catch {
        toast.error("Could not share link");
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  };

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
            className="mt-4 h-11 text-white font-semibold"
            style={{ backgroundColor: BRAND }}
          >
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf8] relative">
      {/* soft taupe wash */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-44 -right-44 h-[520px] w-[520px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(148,129,121,0.22), transparent 62%)",
          }}
        />
        <div
          className="absolute -bottom-44 -left-44 h-[520px] w-[520px] rounded-full blur-3xl opacity-15"
          style={{
            background:
              "radial-gradient(circle at 70% 70%, rgba(148,129,121,0.16), transparent 62%)",
          }}
        />
      </div>

      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b" style={{ borderColor: BORDER }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate("/blog")}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" style={{ color: BRAND }} />
            Back to Blog
          </button>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="bg-white h-10 border"
              style={{ borderColor: BORDER }}
            >
              <Copy className="w-4 h-4 mr-2" style={{ color: BRAND }} />
              Copy Link
            </Button>

            <Button
              onClick={handleShare}
              className="h-10 text-white"
              style={{ backgroundColor: BRAND }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <motion.article
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="max-w-6xl mx-auto px-4 py-10 md:py-12"
      >
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <p className="text-[11px] tracking-[0.22em] uppercase font-semibold" style={{ color: BRAND }}>
            {blog.category || "Blog Post"}
          </p>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-2 leading-[1.06]">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-slate-600">
            <span className="font-semibold text-slate-800">{blog.author || "Anonymous"}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>{blog.date}</span>
          </div>

          {blog.description && (
            <div
              className="mt-5 border bg-white/80 backdrop-blur p-5"
              style={{ borderColor: BORDER }}
            >
              <p className="text-slate-700 leading-relaxed text-[15px] md:text-[16px]">
                {blog.description}
              </p>
            </div>
          )}
        </div>

        {/* Gallery */}
        <ImageGallery images={images} currentIndex={currentImageIndex} setCurrentIndex={setCurrentImageIndex} />

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 mt-12">
          <div className="border bg-[#fffdfb] shadow-sm" style={{ borderColor: BORDER }}>
            <div className="px-6 py-4 border-b bg-white" style={{ borderColor: BORDER }}>
              <p className="text-[11px] tracking-[0.22em] uppercase font-semibold text-slate-700">
                Article
              </p>
            </div>

            <div className="p-6 md:p-10">
              <div
                className="
                  prose prose-slate max-w-none
                  prose-headings:text-slate-900 prose-headings:font-extrabold
                  prose-h2:mt-10 prose-h2:mb-3
                  prose-h3:mt-8 prose-h3:mb-2
                  prose-p:text-slate-700 prose-p:leading-[1.85]
                  prose-li:text-slate-700
                  prose-strong:text-slate-900 prose-strong:font-semibold
                  prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:text-slate-700 prose-blockquote:italic
                  prose-img:border prose-img:shadow-sm
                "
                style={{
                  "--tw-prose-links": BRAND,
                }}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>

         
        </div>
      </motion.article>

      <ScrollToTop />
    </div>
  );
}

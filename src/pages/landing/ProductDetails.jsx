"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import video from "../../assets/3d.mp4";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  HeartOff,
  Plus,
  Minus,
  ArrowLeft,
  Share2,
  Loader2,
  Shield,
  Truck,
  RefreshCw,
  Star,
  ChevronDown,
} from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";
import RelatedProducts from "../../components/cards/RelatedProducts";
import YagsoTicker from "../../components/home/YagsoTicker";
import ToastPopup from "../../components/ui/ToastPopup";
import Accordion from "@/components/ui/accordion";
import { useProducts } from "@/components/products/ProductsProvider";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useLandingAuth();
  const { addToCart, cart } = useCart();
  const { products, loading: productsLoading } = useProducts();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(null);
  const [wishlist, setWishlist] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const formatPrice = (amount) => {
    return new Intl.NumberFormat("en-NG").format(amount);
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  useEffect(() => {
    if (!id || !products.length) return;

    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    setProduct(prod);
    setSelectedImage(prod.images?.[0] || null);
    setColor(prod?.colors?.[0] || null);
    setWishlist(prod.wishlist?.includes(token) || false);
  }, [id, products, token]);

  const toggleWishlist = () => {
    if (!product) return;

    const newWishlistState = !wishlist;
    setWishlist(newWishlistState);

    if (newWishlistState) {
      product.wishlist = product.wishlist
        ? [...product.wishlist, token]
        : [token];
      triggerToast("Added to wishlist 💚");
    } else {
      product.wishlist = product.wishlist.filter((t) => t !== token);
      triggerToast("Removed from wishlist 💔");
    }
  };

  const increaseQty = () => {
    if (product.stock && quantity >= product.stock) {
      triggerToast(`Only ${product.stock} available in stock`);
      return;
    }
    setQuantity((q) => q + 1);
  };

  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const variants = product?.colors || product?.sizes || product?.variants || [];
  const selectedVariant = variants.length > 0 ? color : null;
  const isProductInCart = cart?.some((item) => item.id === product?.id);
  const isOutOfStock = product?.stock !== undefined && product?.stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      triggerToast("Out of stock 😞");
      return;
    }

    if (variants.length > 0 && !selectedVariant) {
      triggerToast("Please select a variant");
      return;
    }

    setIsAddingToCart(true);

    try {
      const productToAdd = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock || 50,
        discountPercentage: product.discountPercentage || 0,
        category: product.category,
      };

      addToCart(productToAdd, quantity, selectedVariant);
      triggerToast("Added to cart ✅");
      setQuantity(1);
    } catch (error) {
      triggerToast("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      triggerToast("Link copied to clipboard! 📋");
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/shop");
    }
  };

  if (productsLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white/60">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="text-[#debfad]" size={48} />
        </motion.div>
      </div>
    );

  if (!product)
    return (
      <div className="min-h-screen bg-[#0a0f0d] relative flex items-center justify-center overflow-hidden">
        {/* Video Background - Enhanced */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105"
          >
            <source src={video} type="video/mp4" />
          </video>

          {/* Vignette effect */}

          {/* Subtle animated overlay */}
          <motion.div
            className="absolute inset-0 "
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Gradient Overlay - Refined */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff]/60 via-[#0a0f0d]/40 to-[#0a0f0d]/60" />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Heading */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-[#debfad] mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Product Not Found
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-[#debfad]/90 max-w-2xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              The item you're looking for may have been sold out, removed, or
              doesn't exist. Explore our collection to discover something
              extraordinary.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="pt-4"
            >
              <motion.button
                onClick={() => navigate("/shop")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-[#254331] text-[#debfad] font-semibold shadow-2xl hover:bg-[#0e4132] transition-all duration-300 overflow-hidden"
              >
                {/* Button glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#debfad]/0 via-[#debfad]/20 to-[#debfad]/0"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <span className="relative flex items-center gap-2">
                  Explore the Shop
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </motion.svg>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white/60 relative overflow-hidden">
      {/* Sophisticated ambient lighting with your colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.35, 0.2],
            x: [0, 150, 0],
            y: [0, -100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-64 -left-64 w-[600px] h-[600px] bg-[#debfad]/30 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, -120, 0],
            y: [0, 120, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-64 w-[700px] h-[700px] bg-[#254331]/25 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.18, 0.3, 0.18],
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/4 w-[550px] h-[550px] bg-[#debfad]/20 rounded-full blur-[140px]"
        />
      </div>

      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]" />

      <ToastPopup message={toastMsg} visible={toastVisible} />

      {/* Premium Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-8 px-4 md:px-8 lg:px-16 relative z-10"
      >
        <div className="max-w-7xl mx-auto">
          <motion.button
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoBack}
            className="group flex items-center gap-2 text-[#254331]/70 hover:text-[#254331] mb-6 transition-colors duration-300"
          >
            <motion.div
              whileHover={{ x: -3 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <ArrowLeft size={20} />
            </motion.div>
            <span className="font-medium">Back to Shopping</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="px-4 md:px-8 lg:px-16 py-8 max-w-7xl mx-auto relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Premium Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col"
          >
            {isOutOfStock && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full text-center mb-6"
              >
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-red-500/30">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Out of Stock
                </span>
              </motion.div>
            )}

            <motion.div
              className="relative group"
              onHoverStart={() => setImageLoaded(true)}
            >
              <div className="relative w-full aspect-square backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-[#debfad]/30 shadow-2xl overflow-hidden">
                {/* Animated border glow */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-gradient-to-r from-[#debfad]/20 via-[#debfad]/30 to-[#debfad]/20 rounded-3xl blur-xl"
                />

                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    src={selectedImage}
                    alt={product.name}
                    initial={{ opacity: 0, scale: 0.95, rotateY: -15 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.95, rotateY: 15 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full h-full object-contain rounded-2xl"
                  />
                </AnimatePresence>

                {isOutOfStock && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-[#0a1f15]/60 backdrop-blur-sm rounded-3xl flex items-center justify-center"
                  >
                    <span className="text-white text-3xl font-bold tracking-wide">
                      SOLD OUT
                    </span>
                  </motion.div>
                )}

                {/* Premium reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent rounded-3xl pointer-events-none" />
              </div>
            </motion.div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-4 mt-6 overflow-x-auto pb-2">
              {product.images?.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex-shrink-0"
                >
                  <motion.button
                    onClick={() => setSelectedImage(img)}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-24 h-24 rounded-2xl overflow-hidden transition-all duration-300 ${
                      img === selectedImage
                        ? "ring-2 ring-[#debfad] ring-offset-2 ring-offset-white/60"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />
                    <img
                      src={img}
                      alt=""
                      className="relative w-full h-full object-contain p-2"
                    />
                    {img === selectedImage && (
                      <motion.div
                        layoutId="activeThumb"
                        className="absolute inset-0 border-2 border-[#debfad] rounded-2xl"
                      />
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col"
          >
            {/* Header with actions */}
            <div className="flex items-start justify-between gap-6 mb-4">
              <div className="flex-1">
                {/* <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="inline-block px-4 py-1.5 bg-[#debfad]/20 border border-[#debfad]/40 rounded-full mb-4"
                >
                  <span className="text-[#254331] text-sm font-medium capitalize">
                    {product.category}
                  </span>
                </motion.div> */}

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="text-3xl md:text-3xl lg:text-4xl font-bold text-[#254331] leading-tight mb-4 tracking-tight"
                >
                  {product.name}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-3"
                ></motion.div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/40 backdrop-blur-sm hover:bg-white/60 border border-[#debfad]/30 transition-all duration-300"
                >
                  <Share2 size={20} className="text-[#254331]/70" />
                </motion.button>
              </div>
            </div>

            {/* Price Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="flex items-baseline gap-4 mb-6 p-6 bg-white/30 backdrop-blur-sm rounded-2xl border border-[#debfad]/30"
            >
              <p className="text-3xl md:text-5xl font-bold text-[#254331]">
                ₦{formatPrice(product.price)}
              </p>
              {product.discountPercentage > 0 && (
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.7 }}
                  className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg shadow-red-500/30"
                >
                  <span className="text-white text-sm font-bold">
                    -{product.discountPercentage}% OFF
                  </span>
                </motion.div>
              )}
            </motion.div>

            {/* Stock Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mb-6"
            >
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                  isOutOfStock
                    ? "bg-red-500/20 border border-red-500/30"
                    : "bg-green-500/20 border border-green-500/30"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isOutOfStock ? "bg-red-400" : "bg-green-400"
                  } animate-pulse`}
                />
                <span
                  className={`text-sm font-medium ${
                    isOutOfStock ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {isOutOfStock
                    ? "Currently unavailable"
                    : `${product.stock || "Many"} in stock`}
                </span>
              </div>
            </motion.div>

            {/* Color Selector */}
            {product?.colors && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 }}
                className="mb-8"
              >
                <p className="text-[#254331] font-medium mb-3">Select Color</p>
                <div className="flex gap-3 flex-wrap">
                  {product?.colors.map((c, idx) => (
                    <motion.button
                      key={c}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + idx * 0.05, type: "spring" }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setColor(c)}
                      className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        color === c
                          ? "bg-[#debfad] text-[#254331] shadow-lg shadow-[#debfad]/40"
                          : "bg-white/40 backdrop-blur-sm hover:bg-white/60 text-[#254331] border border-[#debfad]/30"
                      }`}
                    >
                      {color === c && (
                        <motion.div
                          layoutId="activeColor"
                          className="absolute inset-0 bg-[#debfad] rounded-xl"
                          style={{ zIndex: -1 }}
                        />
                      )}
                      <span className="relative">{c}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quantity Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="mb-8"
            >
              <p className="text-[#254331] font-medium mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={decreaseQty}
                  disabled={isOutOfStock}
                  className="w-14 h-14 rounded-xl bg-[#debfad] hover:bg-[#debfad]/90 border border-[#debfad] flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus size={20} className="text-[#254331]" />
                </motion.button>

                <motion.div
                  key={quantity}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-14 rounded-xl bg-white/40 backdrop-blur-sm border border-[#debfad]/30 flex items-center justify-center"
                >
                  <p className="text-2xl font-bold text-[#254331]">
                    {quantity}
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={increaseQty}
                  disabled={isOutOfStock}
                  className="w-14 h-14 rounded-xl bg-[#debfad] hover:bg-[#debfad]/90 border border-[#debfad] flex items-center justify-center transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus size={20} className="text-[#254331]" />
                </motion.button>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
                whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
                onClick={handleAddToCart}
                disabled={
                  isOutOfStock ||
                  isAddingToCart ||
                  (variants.length > 0 && !selectedVariant)
                }
                className={`w-full py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
                  isOutOfStock || (variants.length > 0 && !selectedVariant)
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-[#debfad] hover:bg-[#debfad]/90 text-[#254331] shadow-lg shadow-[#debfad]/40"
                }`}
              >
                {isAddingToCart && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Loader2 size={22} />
                  </motion.div>
                )}
                <span>
                  {isOutOfStock
                    ? "Out of Stock"
                    : isProductInCart
                    ? "In Cart ✓"
                    : "Add to Cart"}
                </span>
              </motion.button>

              {variants.length > 0 && !selectedVariant && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-red-500 text-sm"
                >
                  Please select a variant to add to cart
                </motion.p>
              )}
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.95 }}
              className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#debfad]/30"
            >
              <div className="flex flex-col items-center gap-2 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-[#debfad]/20">
                <Shield size={24} className="text-[#254331]" />
                <span className="text-xs text-[#254331]/70 text-center">
                  Secure Payment
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-[#debfad]/20">
                <Truck size={24} className="text-[#254331]" />
                <span className="text-xs text-[#254331]/70 text-center">
                  Fast Delivery
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-[#debfad]/20">
                <RefreshCw size={24} className="text-[#254331]" />
                <span className="text-xs text-[#254331]/70 text-center">
                  Easy Returns
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <YagsoTicker />

      {/* Related Products */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-16"
      >
        <RelatedProducts currentProduct={product} />
      </motion.div>
    </div>
  );
};

export default ProductDetails;

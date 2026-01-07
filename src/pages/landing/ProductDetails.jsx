"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, HeartOff, Plus, Minus, ArrowLeft, Share2, Loader2 } from "lucide-react";

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

  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  // Format price with comma separators
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-NG').format(amount);
  };

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  // Load product from useProducts
  useEffect(() => {
    if (!id || !products.length) return;

    const prod = products.find((p) => p.id === id);
    if (!prod) return;

    setProduct(prod);
    setSelectedImage(prod.images?.[0] || null);
    setColor(prod?.colors?.[0] || null);

    // Set wishlist state based on product data
    setWishlist(prod.wishlist?.includes(token) || false);
  }, [id, products, token]);

  const toggleWishlist = () => {
    if (!product) return;

    // Update wishlist locally
    const newWishlistState = !wishlist;
    setWishlist(newWishlistState);

    // Update the product's wishlist in useProducts
    if (newWishlistState) {
      // Add token to wishlist array
      product.wishlist = product.wishlist
        ? [...product.wishlist, token]
        : [token];
      triggerToast("Added to wishlist 💚");
    } else {
      // Remove token from wishlist array
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

  // Detect available variants dynamically
  const variants = product?.colors || product?.sizes || product?.variants || [];

  // Pick selected variant or fallback to null
  const selectedVariant = variants.length > 0 ? color : null;

  // Check if product is in cart
  const isProductInCart = cart?.some((item) => item.id === product?.id);

  // Check if out of stock
  const isOutOfStock = product?.stock !== undefined && product?.stock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      triggerToast("Out of stock 😞");
      return;
    }

    // If variants exist but user did not select one
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
      navigator.share({
        title: product.name,
        text: `Check out ${product.name}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      triggerToast("Link copied to clipboard! 📋");
    }
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/shop');
    }
  };

  if (productsLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0a1f15] via-[#133827] to-[#0d2419]">
        <Loader2 className="animate-spin text-[#debfad]" size={48} />
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-12 min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1f15] via-[#133827] to-[#0d2419]">
        <p className="text-xl text-[#debfad]/70 mb-4">Product not found</p>
        <button 
          onClick={() => navigate('/shop')}
          className="text-[#debfad] hover:text-[#debfad]/80 transition"
        >
          Go to Shop
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f15] via-[#133827] to-[#0d2419] relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-48 -left-48 w-96 h-96 bg-[#debfad]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-48 w-[500px] h-[500px] bg-[#debfad]/15 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.25, 0.45, 0.25],
            x: [0, 50, 0],
            y: [0, -80, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-[#debfad]/10 rounded-full blur-3xl"
        />
      </div>

      <ToastPopup message={toastMsg} visible={toastVisible} />

      {/* Back Button & Breadcrumbs */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" pt-[2rem] px-4 md:px-8 lg:px-16 relative z-10"
      >
        <motion.button
          whileHover={{ x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          className="flex items-center gap-2 text-[#debfad]/75 hover:text-[#debfad] mb-4 transition"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </motion.button>

       
      </motion.div>

      {/* Main */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="px-4 md:px-8 lg:px-16 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:max-w-[1200px] mx-auto relative z-10"
      >
        {/* Left: Images */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col items-center md:items-start"
        >
          {isOutOfStock && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full text-center mb-4"
            >
              <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                Out of Stock
              </span>
            </motion.div>
          )}

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative w-full max-w-[400px] backdrop-blur-sm bg-white/5 rounded-2xl p-4 border border-[#debfad]/20 shadow-2xl"
          >
            <motion.img
              key={selectedImage}
              src={selectedImage}
              alt={product.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-[400px] object-contain rounded-xl"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">Out of Stock</span>
              </div>
            )}
          </motion.div>

          <div className="flex gap-3 mt-4 flex-wrap justify-center md:justify-start">
            {product.images?.map((img, i) => (
              <motion.img
                key={i}
                src={img}
                alt=""
                onClick={() => setSelectedImage(img)}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`w-20 h-20 object-contain rounded-lg cursor-pointer transition-all duration-300 backdrop-blur-sm border ${
                  img === selectedImage
                    ? "opacity-100 border-2 border-[#debfad] bg-white/10 shadow-lg shadow-[#debfad]/30"
                    : "opacity-50 hover:opacity-80 border-[#debfad]/30 bg-white/5"
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* Right Info */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col justify-center"
        >
          <div className="flex items-start justify-between gap-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-2xl md:text-3xl font-semibold text-[#debfad]"
            >
              {product.name}
            </motion.h1>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="text-[#debfad]/70 hover:text-[#debfad] transition"
              title="Share product"
            >
              <Share2 size={20} />
            </motion.button>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="capitalize text-[#debfad]/70 mt-2"
          >
            Category: {product.category}
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="text-yellow-500 mt-1"
          >
            ⭐ {product.rating || 4} / 5
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-baseline gap-2 mt-4"
          >
            <p className="text-3xl font-bold text-[#debfad]">
              ₦{formatPrice(product.price)}
            </p>
            {product.discountPercentage > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.8 }}
                className="text-sm text-red-500 bg-red-500/10 px-2 py-1 rounded"
              >
                -{product.discountPercentage}% OFF
              </motion.span>
            )}
          </motion.div>

          {/* Stock Info */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="mt-3"
          >
            <span className={`text-sm ${isOutOfStock ? 'text-red-400' : 'text-green-400'}`}>
              {isOutOfStock 
                ? 'Currently unavailable' 
                : `${product.stock || 'Many'} in stock`
              }
            </span>
          </motion.div>

          {/* Color Selector */}
          {product?.colors && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6"
            >
              <p className="text-sm text-[#debfad]/80 mb-2">Select Color:</p>
              <div className="flex gap-3 flex-wrap">
                {product?.colors.map((c, idx) => (
                  <motion.button
                    key={c}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.85 + idx * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setColor(c)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      color === c
                        ? "bg-[#debfad] text-[#133827] border-[#debfad]"
                        : "border-[#debfad]/40 hover:border-[#debfad] text-[#debfad]/80"
                    }`}
                  >
                    {c}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quantity */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-6"
          >
            <p className="text-sm text-[#debfad]/80 mb-2">Quantity:</p>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={decreaseQty}
                disabled={isOutOfStock}
                className="bg-[#debfad] text-[#133827] w-10 h-10 rounded-full flex justify-center items-center hover:bg-[#debfad]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Minus size={18} />
              </motion.button>
              <motion.p 
                key={quantity}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-xl font-semibold min-w-[40px] text-center text-[#debfad]"
              >
                {quantity}
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={increaseQty}
                disabled={isOutOfStock}
                className="bg-[#debfad] text-[#133827] w-10 h-10 rounded-full flex justify-center items-center hover:bg-[#debfad]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={18} />
              </motion.button>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95 }}
            className="flex gap-3 mt-6"
          >
            <motion.button
              whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
              whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAddingToCart || (variants.length > 0 && !selectedVariant)}
              className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition ${
                isOutOfStock || (variants.length > 0 && !selectedVariant)
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-[#debfad] text-[#133827] hover:bg-[#debfad]/90"
              }`}
            >
              {isAddingToCart && <Loader2 size={18} className="animate-spin" />}
              {isOutOfStock 
                ? "Out of Stock" 
                : isProductInCart 
                ? "In Cart ✓" 
                : "Add to Cart"
              }
            </motion.button>

        
          </motion.div>

          {variants.length > 0 && !selectedVariant && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-red-400 mt-2"
            >
              Please select a variant to add to cart
            </motion.p>
          )}

          {/* Accordion */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 w-full"
          >
            <Accordion
              title="Description"
              content={product.description || "No description available."}
              isOpen={openIndex === 0}
              onClick={() => setOpenIndex(openIndex === 0 ? null : 0)}
            />
            <Accordion
              title="FAQs"
              content={product.faqs || "No FAQs available."}
              isOpen={openIndex === 1}
              onClick={() => setOpenIndex(openIndex === 1 ? null : 1)}
            />
            <Accordion
              title="Shipping"
              content={product.shipping || "Standard shipping applies."}
              isOpen={openIndex === 2}
              onClick={() => setOpenIndex(openIndex === 2 ? null : 2)}
            />
            {product.sizeGuide && (
              <Accordion
                title="Size Guide"
                content={product.sizeGuide}
                isOpen={openIndex === 3}
                onClick={() => setOpenIndex(openIndex === 3 ? null : 3)}
              />
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      <YagsoTicker />

      {/* Related */}
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
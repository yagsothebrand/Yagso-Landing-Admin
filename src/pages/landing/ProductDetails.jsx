"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, HeartOff, Plus, Minus } from "lucide-react";

import { useCart } from "@/components/cart/CartProvider";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";
import RelatedProducts from "../../components/cards/RelatedProducts";
import YagsoTicker from "../../components/home/YagsoTicker";
import ToastPopup from "../../components/ui/ToastPopup";
import Accordion from "@/components/ui/accordion";
import { useProducts } from "@/components/products/ProductsProvider";

const ProductDetails = () => {
  const { id } = useParams();
  const { token } = useLandingAuth();
  const { addToCart } = useCart();
  const { products, loading: productsLoading } = useProducts();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(null);
  const [wishlist, setWishlist] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

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

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Detect available variants dynamically
  const variants = product?.colors || product?.sizes || product?.variants || [];

  // Pick selected variant or fallback to null
  const selectedVariant = variants.length > 0 ? color : null;

  const handleAddToCart = () => {
    // If variants exist but user did not select one
    if (variants.length > 0 && !selectedVariant) {
      triggerToast("Please select a variant");
      return;
    }

    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price,
      images: product.images,
      stock: product.stock || 50,
      discountPercentage: product.discountPercentage || 0,
    };

    addToCart(productToAdd, quantity, selectedVariant);
    triggerToast("Added to cart ✅");

    setQuantity(1);
  };

  if (productsLoading)
    return <div className="text-center py-12">Loading product...</div>;
  if (!product)
    return <div className="text-center py-12">Product not found</div>;

  return (
    <div>
      <ToastPopup message={toastMsg} visible={toastVisible} />

      {/* Breadcrumbs */}
      <div className="mt-[5rem] lg:mt-[8rem] pt-[2rem] px-4 md:px-8 lg:px-16 text-sm text-[#debfad]/75 flex items-center gap-1">
        <Link to="/" className="hover:text-[#debfad]">
          Home
        </Link>{" "}
        /{" "}
        <Link to="/shop" className="hover:text-[#debfad]">
          Shop
        </Link>{" "}
        / <span className="text-[#debfad] capitalize">{product.name}</span>
      </div>

      {/* Main */}
      <div className="px-4 md:px-8 lg:px-16 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:max-w-[1200px] mx-auto">
        {/* Left: Images */}
        <div className="flex flex-col items-center md:items-start">
          <motion.img
            key={selectedImage}
            src={selectedImage}
            alt={product.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-[350px] h-[350px] object-contain rounded-lg shadow-md bg-[#debfad]/90"
          />
          <div className="flex gap-3 mt-4">
            {product.images?.map((img, i) => (
              <motion.img
                key={i}
                src={img}
                alt=""
                onClick={() => setSelectedImage(img)}
                whileHover={{ scale: 1.05 }}
                className={`w-20 h-20 object-contain rounded-md cursor-pointer transition-all duration-300 ${
                  img === selectedImage
                    ? "opacity-100 border-2 border-[#debfad]"
                    : "opacity-50 hover:opacity-80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Info */}
        <div className="flex flex-col justify-center">
          <h1 className="text-2xl md:text-3xl font-semibold">{product.name}</h1>
          <p className="capitalize text-[#debfad]/70 mt-1">
            Category: {product.category}
          </p>
          <p className="text-yellow-500 mt-1">⭐ {product.rating || 4} / 5</p>
          <p className="text-3xl font-bold mt-4">${product.price}</p>

          {/* Color Selector */}
          {product?.colors && (
            <div className="mt-4">
              <p className="text-sm text-[#debfad]/80">Color:</p>
              <div className="flex gap-3 mt-2">
                {product?.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`px-3 py-1 rounded-full border text-sm transition ${
                      color === c
                        ? "bg-[#debfad] text-[#133827]"
                        : "border-[#debfad]/40 hover:border-[#debfad]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={decreaseQty}
              className="bg-[#debfad] text-[#133827] w-8 h-8 rounded-full flex justify-center items-center"
            >
              <Minus size={16} />
            </button>
            <p>{quantity}</p>
            <button
              onClick={increaseQty}
              className="bg-[#debfad] text-[#133827] w-8 h-8 rounded-full flex justify-center items-center"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Wishlist */}
          <button
            className="flex items-center gap-2 mt-4 text-sm text-[#debfad]/80 hover:text-[#debfad]"
            onClick={toggleWishlist}
          >
            {wishlist ? <HeartOff size={18} /> : <Heart size={18} />}
            {wishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={variants.length > 0 && !selectedVariant}
            className={`btn-primary w-full ${
              variants.length > 0 && !selectedVariant
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            Add to Cart
          </button>

          {/* Accordion */}
          <div className="mt-8 w-full">
            <Accordion
              title="Description"
              content={product.description}
              isOpen={openIndex === 0}
              onClick={() => setOpenIndex(openIndex === 0 ? null : 0)}
            />
            <Accordion
              title="FAQs"
              content={product.faqs}
              isOpen={openIndex === 1}
              onClick={() => setOpenIndex(openIndex === 1 ? null : 1)}
            />
            <Accordion
              title="Shipping"
              content={product.shipping}
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
          </div>
        </div>
      </div>

      <YagsoTicker />

      {/* Related */}
      <div className="mt-16">
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  );
};

export default ProductDetails;

import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, HeartOff, Plus, Minus } from "lucide-react";

import RelatedProducts from "../../components/cards/RelatedProducts";
import YagsoTicker from "../../components/home/YagsoTicker";
import ToastPopup from "../../components/ui/ToastPopup";
import Accordion from "@/components/ui/accordion";

const sampleProduct = {
  title: "Graceful Links Necklace",
  category: "Necklaces",
  price: 150,
  rating: 4.5,
  description:
    "The Graceful Links necklace blends elegance and durability, hand-crafted with premium materials.",
  faqs: [
    {
      q: "Is it water-resistant?",
      a: "Yes, it’s designed to resist daily moisture exposure like light rain and sweat.",
    },
    {
      q: "Materials?",
      a: "Made from stainless steel with a 24k gold finish.",
    },
  ],
  shipping:
    "Orders ship within 2–4 business days. Free shipping on orders above $200.",
  sizeGuide: "Standard necklace length: 18 inches. Adjustable up to +2 inches.",
  colors: ["Gold", "Silver", "Rose Gold"],
  images: [
    "https://res.cloudinary.com/deywxghov/image/upload/v1760121650/download-fotor-20251010183145_mcpayu.png",
    "https://res.cloudinary.com/deywxghov/image/upload/v1760121652/download-fotor-20251010191944_guluoz.png",
    "https://res.cloudinary.com/deywxghov/image/upload/v1760121653/download_2_-fotor-2025101019328_obleje.png",
  ],
};

const ProductDetails = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { id } = location.state || {};

  const [selectedImage, setSelectedImage] = useState(sampleProduct.images[0]);
  const [openIndex, setOpenIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(sampleProduct.colors[0]);
  const [wishlist, setWishlist] = useState(false);

  // ✅ Toast state
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  // ✅ Sync initial wishlist state
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(list.some((p) => p.id === id));
  }, [id]);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // ✅ SMART CART
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((p) => p.id === id && p.color === color);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({
        id,
        slug,
        title: sampleProduct.title,
        price: sampleProduct.price,
        quantity,
        color,
        image: selectedImage,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    triggerToast("Added to cart ✅");
    window.dispatchEvent(new Event("storageUpdate"));
  };

  // ✅ SMART WISHLIST
  const toggleWishlist = () => {
    let list = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist) {
      list = list.filter((p) => p.id !== id);
      triggerToast("Removed from wishlist 💔");
    } else {
      list.push({ id, title: sampleProduct.title, image: selectedImage });
      triggerToast("Added to wishlist 💚");
    }

    localStorage.setItem("wishlist", JSON.stringify(list));
    setWishlist(!wishlist);
    window.dispatchEvent(new Event("storageUpdate"));
  };

  return (
    <div>
      <ToastPopup message={toastMsg} visible={toastVisible} />

      {/* Breadcrumbs */}
      <div className="mt-[5rem] lg:mt-[8rem] pt-[2rem] px-4 md:px-8 lg:px-16 text-sm text-[#debfad]/75 flex items-center gap-1">
        <Link to="/" className="hover:text-[#debfad]">
          Home
        </Link>{" "}
        /
        <Link to="/shop" className="hover:text-[#debfad]">
          Shop
        </Link>{" "}
        /<span className="text-[#debfad] capitalize">{slug}</span>
      </div>

      {/* Main */}
      <div className="px-4 md:px-8 lg:px-16 py-8 grid grid-cols-1 md:grid-cols-2 gap-8 lg:max-w-[1200px] mx-auto">
        {/* Left: Images */}
        <div className="flex flex-col items-center md:items-start">
          <motion.img
            key={selectedImage}
            src={selectedImage}
            alt={sampleProduct.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-[350px] h-[350px] object-contain rounded-lg shadow-md bg-[#debfad]/90"
          />
          <div className="flex gap-3 mt-4">
            {sampleProduct.images.map((img, i) => (
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
          <h1 className="text-2xl md:text-3xl font-semibold">
            {sampleProduct.title}
          </h1>
          <p className="capitalize text-[#debfad]/70 mt-1">
            Category: {sampleProduct.category}
          </p>
          <p className="text-yellow-500 mt-1">⭐ {sampleProduct.rating} / 5</p>
          <p className="text-3xl font-bold mt-4">${sampleProduct.price}</p>

          {/* Color Selector */}
          <div className="mt-4">
            <p className="text-sm text-[#debfad]/80">Color:</p>
            <div className="flex gap-3 mt-2">
              {sampleProduct.colors.map((c) => (
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
            className="bg-[#debfad] text-[#133827] font-semibold py-3 rounded-xl mt-5 hover:bg-[#ebd6c9] transition hover:scale-[1.02] active:scale-[0.97]"
          >
            Add to Cart
          </button>

          {/* Accordion */}
          <div className="mt-8 w-full">
            <Accordion
              title="Description"
              content={sampleProduct.description}
              isOpen={openIndex === 0}
              onClick={() => setOpenIndex(openIndex === 0 ? null : 0)}
            />
            <Accordion
              title="FAQs"
              content={sampleProduct.faqs}
              isOpen={openIndex === 1}
              onClick={() => setOpenIndex(openIndex === 1 ? null : 1)}
            />
            <Accordion
              title="Shipping"
              content={sampleProduct.shipping}
              isOpen={openIndex === 2}
              onClick={() => setOpenIndex(openIndex === 2 ? null : 2)}
            />
            <Accordion
              title="Size Guide"
              content={sampleProduct.sizeGuide}
              isOpen={openIndex === 3}
              onClick={() => setOpenIndex(openIndex === 3 ? null : 3)}
            />
          </div>
        </div>
      </div>

      <YagsoTicker />

      {/* Related */}
      <div className="mt-16">
        <RelatedProducts />
      </div>
    </div>
  );
};

export default ProductDetails;

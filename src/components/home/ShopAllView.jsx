import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plus, Minus, Heart, HeartOff } from "lucide-react";

const ShopAllView = ({ products, onClose, addToCart, token }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [wishlist, setWishlist] = useState({});
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSelectedVariant(
      product.colors?.[0] || product.sizes?.[0] || product.variants?.[0] || null
    );
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const variants =
      selectedProduct.colors ||
      selectedProduct.sizes ||
      selectedProduct.variants ||
      [];

    if (variants.length > 0 && !selectedVariant) {
      triggerToast("Please select a variant");
      return;
    }

    const productToAdd = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      images: selectedProduct.images,
      stock: selectedProduct.stock || 50,
      discountPercentage: selectedProduct.discountPercentage || 0,
    };

    addToCart(productToAdd, quantity, selectedVariant);
    triggerToast("Added to cart ✅");
    setQuantity(1);
    setSelectedProduct(null);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
    triggerToast(
      wishlist[productId] ? "Removed from wishlist 💔" : "Added to wishlist 💚"
    );
  };

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 overflow-y-auto"
    >
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#debfad]">
              All Products
            </h1>
            <button
              onClick={onClose}
              className="bg-[#debfad] text-[#133827] p-2 rounded-full hover:bg-[#c9956f] transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#133827]/40 border border-[#debfad]/20 rounded-xl p-4 hover:border-[#debfad]/50 transition-all"
              >
                {/* Product Image */}
                <div
                  onClick={() => handleProductClick(product)}
                  className="relative h-48 bg-[#debfad]/10 rounded-lg mb-4 cursor-pointer overflow-hidden group"
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.placement && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {product.placement === "best-sellers" && "🔥 Best Seller"}
                      {product.placement === "new-arrivals" && "✨ New"}
                      {product.placement === "featured" && "⭐ Featured"}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div>
                  <p className="text-gray-400 text-xs uppercase mb-1">
                    {product.category}
                  </p>
                  <h3 className="text-[#debfad] font-semibold mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-white mb-2">
                    ₦{product.price}
                  </p>
                  <p className="text-gray-400 text-sm mb-3">
                    Stock: {product.stock || 0}
                  </p>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleProductClick(product)}
                      className="flex-1 bg-[#debfad] text-[#133827] py-2 rounded-lg font-semibold hover:bg-[#c9956f] transition"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="bg-[#debfad]/20 text-[#debfad] p-2 rounded-lg hover:bg-[#debfad]/30 transition"
                    >
                      {wishlist[product.id] ? (
                        <HeartOff size={20} />
                      ) : (
                        <Heart size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] overflow-y-auto"
        >
          <div className="min-h-screen px-4 py-8 flex items-center justify-center">
            <div className="bg-[#133827] border border-[#debfad]/30 rounded-2xl max-w-4xl w-full p-6 md:p-8">
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="ml-auto block bg-[#debfad] text-[#133827] p-2 rounded-full hover:bg-[#c9956f] transition mb-4"
              >
                <X size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Image */}
                <div className="flex flex-col items-center">
                  <img
                    src={selectedProduct.images?.[0]}
                    alt={selectedProduct.name}
                    className="w-full max-w-[350px] h-[350px] object-contain rounded-lg bg-[#debfad]/10 mb-4"
                  />
                  <div className="flex gap-2">
                    {selectedProduct.images?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt=""
                        className="w-16 h-16 object-contain rounded-md bg-[#debfad]/10 cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                </div>

                {/* Right: Details */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#debfad] mb-2">
                    {selectedProduct.name}
                  </h2>
                  <p className="text-gray-400 capitalize mb-2">
                    {selectedProduct.category}
                  </p>
                  <p className="text-yellow-500 mb-4">
                    ⭐ {selectedProduct.rating || 4} / 5
                  </p>
                  <p className="text-3xl font-bold text-white mb-6">
                    ₦{selectedProduct.price}
                  </p>

                  {/* Variants */}
                  {(selectedProduct.colors ||
                    selectedProduct.sizes ||
                    selectedProduct.variants) && (
                    <div className="mb-6">
                      <p className="text-[#debfad]/80 mb-2">
                        {selectedProduct.colors
                          ? "Color:"
                          : selectedProduct.sizes
                          ? "Size:"
                          : "Variant:"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(
                          selectedProduct.colors ||
                          selectedProduct.sizes ||
                          selectedProduct.variants
                        )?.map((variant) => (
                          <button
                            key={variant}
                            onClick={() => setSelectedVariant(variant)}
                            className={`px-4 py-2 rounded-full border text-sm transition ${
                              selectedVariant === variant
                                ? "bg-[#debfad] text-[#133827] border-[#debfad]"
                                : "border-[#debfad]/40 text-[#debfad] hover:border-[#debfad]"
                            }`}
                          >
                            {variant}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-[#debfad]">Quantity:</span>
                    <button
                      onClick={decreaseQty}
                      className="bg-[#debfad] text-[#133827] w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-white font-semibold">{quantity}</span>
                    <button
                      onClick={increaseQty}
                      className="bg-[#debfad] text-[#133827] w-8 h-8 rounded-full flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#debfad] text-[#133827] py-3 rounded-lg font-bold text-lg hover:bg-[#c9956f] transition"
                  >
                    Add to Cart
                  </button>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div className="mt-6 pt-6 border-t border-[#debfad]/20">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toast */}
      {toastVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-[#133827] text-[#debfad] px-6 py-3 rounded-lg shadow-xl z-[100] border border-[#debfad]/30"
        >
          {toastMsg}
        </motion.div>
      )}
    </motion.div>
  );
};

export default ShopAllView;

// Updated SectionTitle Component
export const SectionTitle = ({ title, see = false, onSeeAll }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h2 className="text-3xl md:text-4xl font-bold text-[#debfad] mb-2">
          {title}
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-[#debfad] to-[#c9956f] rounded-full"></div>
      </div>
      {see && (
        <button
          onClick={onSeeAll}
          className="text-[#debfad] hover:text-[#c9956f] font-semibold transition-colors"
        >
          See All →
        </button>
      )}
    </motion.div>
  );
};

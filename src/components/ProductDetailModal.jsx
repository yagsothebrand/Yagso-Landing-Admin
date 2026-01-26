import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Sparkles,
  Truck,
  Shield,
  Heart,
} from "lucide-react";
import { useProducts } from "./auth/ProductsProvider";

export default function ProductDetailModal({ product, open, onOpenChange }) {
  const {
    addToCart,
    formatPrice,
    products,
    quantity,
    setQuantity,
    setSelectedVariant,
    selectedVariant,
  } = useProducts();

  const [customFieldValues, setCustomFieldValues] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const hasVariants = product.variants && product.variants.length > 0;
  const hasCustomFields =
    product.customFields && product.customFields.length > 0;

  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant?.stock ?? product.stock;
  const isOutOfStock = currentStock === 0;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleCustomFieldChange = (label, value) => {
    setCustomFieldValues((prev) => ({ ...prev, [label]: value }));
  };

  const getCategoryGradient = (category) => {
    switch (category) {
      case "Care Packages":
        return "from-[#fc7182] to-rose-500";
      case "Packages":
        return "from-[#2b6f99] to-cyan-500";
      case "Add-ons":
        return "from-orange-500 to-amber-500";
      case "Protection":
        return "from-green-500 to-emerald-500";
      default:
        return "from-[#2b6f99] to-[#4a8ab8]";
    }
  };

  const handleAddToCart = () => {
    if (hasVariants && !selectedVariant) {
      return;
    }

    if (hasCustomFields) {
      const missingRequired = product.customFields
        .filter((f) => f.required)
        .find((f) => !customFieldValues[f.label]);

      if (missingRequired) {
        return;
      }
    }

    addToCart(product, quantity, selectedVariant, customFieldValues);
    setAddedToCart(true);

    setTimeout(() => {
      // setAddedToCart(false);
      // onOpenChange(false);
      // setQuantity(1);
      // setSelectedVariant(null);
      // setCustomFieldValues({});
      setQuantity(1);
      setSelectedVariant(null);
      setCustomFieldValues({});
    }, 1500);
  };

  const isFormValid = () => {
    if (hasVariants && !selectedVariant) return false;
    if (hasCustomFields) {
      const missingRequired = product.customFields
        .filter((f) => f.required)
        .find((f) => !customFieldValues[f.label]);
      if (missingRequired) return false;
    }
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-white to-slate-50 border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl overflow-hidden shadow-inner"
            >
              <img
                src={product.images?.[currentImageIndex] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                      currentImageIndex === index
                        ? "border-[#2b6f99] shadow-lg"
                        : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-5">
            {/* Category Badge */}
            {product.category && (
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-gradient-to-r ${getCategoryGradient(
                  product.category,
                )} text-white`}
              >
                <Sparkles className="w-3 h-3" />
                {product.category}
              </span>
            )}

            <h2 className="text-2xl font-bold text-slate-900">
              {product.name}
            </h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-3xl font-bold bg-gradient-to-r from-[#fc7182] to-[#ff9a9e] bg-clip-text text-transparent"
            >
              {formatPrice(currentPrice)}
            </motion.p>

            {product.description && (
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-2 p-4 bg-slate-50 rounded-xl">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#fc7182]" />
                  What's Included:
                </h4>
                <ul className="space-y-1.5">
                  {product.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-slate-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variants */}
            {hasVariants && (
              <div className="space-y-3">
                <Label className="text-base font-semibold text-slate-900">
                  Select Option
                </Label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                      className={`px-4 py-2.5 rounded-xl border-2 transition-all ${
                        selectedVariant === variant
                          ? "border-[#2b6f99] bg-gradient-to-r from-[#2b6f99]/10 to-[#4a8ab8]/10 shadow-md"
                          : variant.stock === 0
                            ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "border-slate-200 hover:border-[#2b6f99] hover:shadow-md"
                      }`}
                    >
                      <span className="font-medium text-slate-800">
                        {variant.name}
                      </span>
                      <span className="ml-2 text-sm text-[#fc7182] font-semibold">
                        {formatPrice(variant.price)}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Personalization Fields */}
            {hasCustomFields && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 p-4 bg-gradient-to-r from-[#2b6f99]/5 to-[#fc7182]/5 rounded-xl border border-dashed border-[#2b6f99]/30"
              >
                <Label className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#fc7182]" />
                  Personalize Your Gift
                </Label>
                {product.customFields.map((field, index) => (
                  <div key={index} className="space-y-2">
                    <Label
                      htmlFor={`custom-${index}`}
                      className="text-sm text-slate-700"
                    >
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        id={`custom-${index}`}
                        value={customFieldValues[field.label] || ""}
                        onChange={(e) =>
                          handleCustomFieldChange(field.label, e.target.value)
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        rows={3}
                        className="border-slate-200 focus:border-[#2b6f99] focus:ring-[#2b6f99]/20"
                      />
                    ) : (
                      <Input
                        id={`custom-${index}`}
                        type={field.type}
                        value={customFieldValues[field.label] || ""}
                        onChange={(e) =>
                          handleCustomFieldChange(field.label, e.target.value)
                        }
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        className="border-slate-200 focus:border-[#2b6f99] focus:ring-[#2b6f99]/20"
                      />
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-slate-900">
                Quantity
              </Label>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-slate-100 rounded-xl p-1">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center transition hover:bg-slate-50"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="text-xl font-bold w-14 text-center">
                    {quantity}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= currentStock}
                    className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <span className="text-sm text-slate-500">
                  {currentStock} available
                </span>
              </div>
            </div>

            {/* Delivery & Protection */}
            {/* <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-2 p-3 bg-green-50 rounded-xl">
                <Truck className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-xs font-semibold text-green-700">
                    Free Delivery
                  </p>
                  <p className="text-xs text-green-600">Nationwide</p>
                </div>
              </div>
              <div className="flex-1 flex items-center gap-2 p-3 bg-blue-50 rounded-xl">
                <Shield className="w-5 h-5 text-[#2b6f99]" />
                <div>
                  <p className="text-xs font-semibold text-[#2b6f99]">Secure</p>
                  <p className="text-xs text-[#2b6f99]">Protected</p>
                </div>
              </div>
            </div> */}

            {/* Total & Add to Cart */}
            <div className="pt-4 border-t border-slate-200 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-700">
                  Total:
                </span>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#fc7182] to-[#ff9a9e] bg-clip-text text-transparent">
                  {formatPrice(currentPrice * quantity)}
                </span>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleAddToCart}
                  className={`w-full h-14 text-lg font-bold shadow-lg transition-all ${
                    addedToCart
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/25"
                      : "bg-gradient-to-r from-[#2b6f99] to-[#4a8ab8] hover:from-[#1e5577] hover:to-[#2b6f99] shadow-[#2b6f99]/25"
                  } text-white`}
                  disabled={isOutOfStock || !isFormValid()}
                >
                  <AnimatePresence mode="wait">
                    {addedToCart ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Added to Cart!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart className="w-5 h-5" />
                        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 pt-6 border-t"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((related, index) => (
                <motion.div
                  key={related.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-3 border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    onOpenChange(false);
                    setTimeout(() => {
                      window.dispatchEvent(
                        new CustomEvent("openProductDetail", {
                          detail: related,
                        }),
                      );
                    }, 300);
                  }}
                >
                  <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden mb-2">
                    <img
                      src={related.images?.[0] || "/placeholder.svg"}
                      alt={related.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-medium text-sm line-clamp-1 text-slate-800">
                    {related.name}
                  </h4>
                  <p className="text-[#fc7182] font-bold text-sm mt-1">
                    {formatPrice(related.price)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  );
}

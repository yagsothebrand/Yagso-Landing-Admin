import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Sparkles,
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";

import { useProducts } from "@/components/auth/ProductsProvider";
import VirtualTryOnModal from "./VirtualTryOnModal";

const BRAND = "#948179"; // warm jewelry tone

function ProductDetailsSkeleton({ brand = BRAND }) {
  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="h-6 w-24 bg-slate-100 animate-pulse" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div
              className="aspect-square bg-slate-100 animate-pulse border"
              style={{ borderColor: `${brand}26` }}
            />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-slate-100 animate-pulse border"
                  style={{ borderColor: `${brand}26` }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="h-4 w-24 bg-slate-100 animate-pulse" />
            <div className="h-8 w-3/4 bg-slate-100 animate-pulse" />
            <div className="h-10 w-44 bg-slate-100 animate-pulse" />
            <div className="h-24 w-full bg-slate-100 animate-pulse" />
            <div className="h-14 w-full bg-slate-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Jewelry category gradients (soft, chic)
const getCategoryGradient = (category) => {
  const c = (category || "").trim().toLowerCase();
  if (c.includes("neck")) return "from-[#948179] to-[#d7c9b8]";
  if (c.includes("ear")) return "from-[#b28b6b] to-[#eadbcb]";
  if (c.includes("ring")) return "from-[#7f7266] to-[#d8c9bb]";
  if (c.includes("brace")) return "from-[#9a7a60] to-[#f0e2d6]";
  if (c.includes("set")) return "from-[#6f635a] to-[#cab8a6]";
  return "from-[#948179] to-[#d9cbbd]";
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, loading, addToCart, formatPrice } = useProducts();

  const product = useMemo(
    () => (products || []).find((p) => p.id === id),
    [products, id],
  );

  // store selected variant per related product id
  const [relatedVariantById, setRelatedVariantById] = useState({});

  const [customFieldValues, setCustomFieldValues] = useState({});
  const [tryOnOpen, setTryOnOpen] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState([]);

  const pickFirstAvailableVariant = (variants = []) => {
    if (!Array.isArray(variants) || variants.length === 0) return null;
    return (
      variants.find((v) => (Number(v?.stock ?? 0) || 0) > 0) || variants[0]
    );
  };

  useEffect(() => {
    if (!product) return;

    setCustomFieldValues({});
    setCurrentImageIndex(0);
    setAddedToCart(false);
    setQuantity(1);
    setSelectedExtras([]);

    setSelectedVariant(
      product?.variants?.length
        ? pickFirstAvailableVariant(product.variants)
        : null,
    );
  }, [product?.id]);

  useEffect(() => {
    setSelectedExtras([]);
  }, [selectedVariant?.id]);
  useEffect(() => {
    const s = Number(selectedVariant?.stock ?? 0);
    if (Number.isFinite(s) && s > 0) {
      setQuantity((q) => Math.min(q, s));
    } else if (s === 0) {
      setQuantity(1);
    }
  }, [selectedVariant?.id]);

  const handleCustomFieldChange = (label, value) => {
    setCustomFieldValues((prev) => ({ ...prev, [label]: value }));
  };

  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const hasVariants = variants.length > 0;
  const hasCustomFields = product?.customFields?.length > 0;

  // ✅ Price handling
  const basePrice = Number(product?.price ?? 0) || 0;
  const variantPrices = variants.map((v) => Number(v?.price ?? 0) || 0);
  const minVariantPrice = variantPrices.length
    ? Math.min(...variantPrices)
    : basePrice;

  const currentPrice =
    selectedVariant?.price != null
      ? Number(selectedVariant.price || 0)
      : hasVariants
        ? minVariantPrice
        : basePrice;

  // ✅ Stock handling
  const baseStock = Number(product?.stock ?? 0) || 0;
  const totalVariantStock = variants.reduce(
    (s, v) => s + (Number(v?.stock ?? 0) || 0),
    0,
  );
  const currentStock =
    selectedVariant?.stock != null
      ? Number(selectedVariant.stock || 0)
      : Number(product?.stock ?? 0) || 0; // ✅ base stock when not chosen

  const isOutOfStock = currentStock === 0;

  // ✅ Related products
  const normalize = (v) => (v || "").trim().toLowerCase();
  const sameCategory = (products || []).filter(
    (p) =>
      normalize(p.category) === normalize(product?.category) &&
      p.id !== product?.id,
  );

  const relatedProducts = (
    sameCategory.length
      ? sameCategory
      : (products || []).filter((p) => p.id !== product?.id)
  ).slice(0, 4);
  // ---- Related: quick add helpers ----
  const pickFirstInStockVariant = (variants = []) => {
    if (!Array.isArray(variants) || variants.length === 0) return null;
    return (
      variants.find((v) => (Number(v?.stock ?? 0) || 0) > 0) || variants[0]
    );
  };

  const getProductTotalStock = (p) => {
    const variants = Array.isArray(p?.variants) ? p.variants : [];
    if (variants.length) {
      return variants.reduce((s, v) => s + (Number(v?.stock ?? 0) || 0), 0);
    }
    return Number(p?.stock ?? 0) || 0;
  };

  const getRelatedPriceLabel = (p) => {
    const variants = Array.isArray(p?.variants) ? p.variants : [];
    const base = Number(p?.price ?? 0) || 0;
    if (!variants.length) return formatPrice(base);

    const prices = variants.map((v) => Number(v?.price ?? 0) || 0);
    const min = prices.length ? Math.min(...prices) : base;
    return `From ${formatPrice(min)}`;
  };
  useEffect(() => {
    // initialize selections when relatedProducts change
    const next = {};
    (relatedProducts || []).forEach((p) => {
      const hasVars = Array.isArray(p?.variants) && p.variants.length > 0;
      next[p.id] = hasVars ? pickFirstInStockVariant(p.variants) : null;
    });
    setRelatedVariantById(next);
  }, [id, relatedProducts?.length]); // id ensures refresh on navigation

  // ✅ Extras
  const extrasAll = (product?.extras || []).filter((e) => e.active !== false);
  const normalExtras = extrasAll.filter((e) => e.type !== "text");
  const textExtras = extrasAll.filter((e) => e.type === "text");
  const sortedExtras = [...normalExtras, ...textExtras];

  const extraHasStock = (extra) => {
    if (Array.isArray(extra.variants) && extra.variants.length > 0) {
      return extra.variants.some((v) => (Number(v?.stock ?? 0) || 0) > 0);
    }
    return extra.stock === null || extra.stock === undefined || extra.stock > 0;
  };

  const getExtraEffectivePrice = (extra, picked) => {
    if (picked?.selectedVariant)
      return Number(picked.selectedVariant.price || 0) || 0;
    return Number(extra.price || 0) || 0;
  };

  const extrasTotal = useMemo(() => {
    return (selectedExtras || []).reduce((sum, ex) => {
      const price = ex.selectedVariant
        ? Number(ex.selectedVariant.price ?? 0) || 0
        : Number(ex.price ?? 0) || 0;
      const qty = Number(ex.qty || 1) || 1;
      return sum + price * qty;
    }, 0);
  }, [selectedExtras]);

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) => {
      const exists = prev.find((x) => x.id === extra.id);
      if (exists) return prev.filter((x) => x.id !== extra.id);

      const firstExtraVariant = pickFirstAvailableVariant(
        extra?.variants || [],
      );

      return [
        ...prev,
        {
          id: extra.id,
          name: extra.name,
          price: Number(extra.price || 0) || 0,
          selectedVariant: firstExtraVariant
            ? {
                id: firstExtraVariant.id,
                name: firstExtraVariant.name,
                price: Number(firstExtraVariant.price || 0) || 0,
                stock: Number(firstExtraVariant.stock || 0) || 0,
              }
            : null,
          type: extra.type || "toggle",
          promptTitle: extra.promptTitle || "Your reply",
          promptPlaceholder: extra.promptPlaceholder || "Type here...",
          requiredText: !!extra.requiredText,
          textValue: "",
          qty: 1,
        },
      ];
    });
  };

  const updateExtraVariant = (extraId, variant) => {
    setSelectedExtras((prev) =>
      prev.map((x) =>
        x.id === extraId
          ? {
              ...x,
              selectedVariant: variant
                ? {
                    id: variant.id,
                    name: variant.name,
                    price: Number(variant.price || 0) || 0,
                    stock: Number(variant.stock || 0) || 0,
                  }
                : null,
            }
          : x,
      ),
    );
  };

  const updateExtraText = (id, value) => {
    setSelectedExtras((prev) =>
      prev.map((x) => (x.id === id ? { ...x, textValue: value } : x)),
    );
  };

  const updateExtraQty = (id, qty) => {
    setSelectedExtras((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x)),
    );
  };

  const isExtraSelected = (id) => selectedExtras.some((x) => x.id === id);

  const hasImages = (product?.images || []).length > 0;

  const isFormValid = () => {
    if (hasVariants && !selectedVariant) return false;

    if (hasCustomFields) {
      const missingRequired = product.customFields
        .filter((f) => f.required)
        .find((f) => !customFieldValues[f.label]);
      if (missingRequired) return false;
    }

    const missingExtraText = selectedExtras
      .filter((x) => x.type === "text" && x.requiredText)
      .find((x) => !String(x.textValue || "").trim());

    if (missingExtraText) return false;

    return true;
  };

  const handleAddToCart = () => {
    if (!isFormValid() || isOutOfStock) return;

    addToCart(
      product,
      quantity,
      selectedVariant,
      customFieldValues,
      selectedExtras,
    );

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1200);
  };

  // ====== UI STATES ======
  if (loading) return <ProductDetailsSkeleton brand={BRAND} />;

  if (!product) {
    return (
      <div className="min-h-screen bg-[#fbfaf8] px-4 pt-24">
        <div className="max-w-3xl mx-auto">
          <Card className="rounded-none border-slate-200">
            <CardHeader>
              <CardTitle className="text-slate-900">
                Product not found
              </CardTitle>
              <CardDescription className="text-slate-600">
                It may have been removed or the link is incorrect.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                to="/#products"
                className="inline-flex items-center gap-2 font-semibold text-sm"
                style={{ color: BRAND }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back to shop
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const total = (currentPrice + extrasTotal) * quantity;

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      {/* ===== Sticky Header ===== */}
      <div className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" style={{ color: BRAND }} />
            Back
          </button>

          <p className="text-sm text-slate-500 hidden md:block line-clamp-1">
            {product.name}
          </p>

          <div className="hidden md:flex items-center gap-2">
            <Badge
              variant="secondary"
              className="rounded-none font-bold"
              style={{ background: `${BRAND}10`, color: BRAND }}
            >
              {formatPrice(total)}
            </Badge>
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock || !isFormValid()}
              className="rounded-none font-bold"
              style={{
                background: BRAND,
                opacity: isOutOfStock || !isFormValid() ? 0.6 : 1,
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-6">
          {/* ===== Gallery ===== */}

          <div className="space-y-3 md:sticky md:top-24 md:self-start">
            <div className="grid md:grid-cols-[72px_1fr] gap-3">
              {/* Thumbs rail (desktop) */}
              {hasImages && product.images.length > 1 ? (
                <div className="hidden md:flex md:flex-col gap-2">
                  {product.images.map((img, idx) => {
                    const active = idx === currentImageIndex;
                    return (
                      <button
                        key={img + idx}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        className="w-[72px] h-[72px] border bg-white overflow-hidden rounded-none"
                        style={{
                          borderColor: active ? BRAND : "#e2e8f0",
                          boxShadow: active ? `0 0 0 1px ${BRAND}20` : "none",
                        }}
                      >
                        <img
                          src={img}
                          alt={`thumb ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="hidden md:block" />
              )}

              {/* Main image */}
              <Card className="rounded-none border-slate-200 bg-white overflow-hidden">
                <CardContent className="p-0">
                  <motion.div
                    key={product.images?.[currentImageIndex] || "no-image"}
                    initial={{ opacity: 0.35, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25 }}
                    className="aspect-[4/5] md:h-[calc(100vh-220px)] bg-[#f6f3ef] flex items-center justify-center"
                  >
                    {hasImages ? (
                      <img
                        src={product.images[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <ImageIcon className="w-16 h-16" />
                        <p className="text-xs mt-2">No image</p>
                      </div>
                    )}
                  </motion.div>
                </CardContent>
              </Card>
            </div>

            {/* Thumbs row (mobile) */}
            {hasImages && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 md:hidden">
                {product.images.map((img, idx) => {
                  const active = idx === currentImageIndex;
                  return (
                    <button
                      key={img + idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className="w-16 h-16 border bg-white overflow-hidden rounded-none flex-shrink-0"
                      style={{ borderColor: active ? BRAND : "#e2e8f0" }}
                    >
                      <img
                        src={img}
                        alt={`thumb ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ===== Right: Info / Buy box ===== */}
          <div className="space-y-4">
            <Card className="rounded-none border-slate-200 bg-white">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  {product.category && product.category !== "All" ? (
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-none bg-gradient-to-r ${getCategoryGradient(
                        product.category,
                      )} text-white`}
                    >
                      <Sparkles className="w-3 h-3" />
                      {product.category}
                    </span>
                  ) : (
                    <span />
                  )}

                  {product.sku != null && String(product.sku).trim() !== "" && (
                    <span className="text-[11px] text-slate-500 font-semibold">
                      SKU{" "}
                      <span style={{ color: BRAND, fontWeight: 800 }}>
                        #{product.sku}
                      </span>
                    </span>
                  )}
                </div>

                <div>
                  <CardTitle className="text-2xl md:text-3xl text-slate-900">
                    {product.name}
                  </CardTitle>
                  {product.description ? (
                    <CardDescription className="text-slate-600 mt-2 leading-relaxed">
                      {product.description}
                    </CardDescription>
                  ) : null}
                </div>

                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold">
                      Price
                    </p>
                    <p
                      className="text-3xl font-extrabold"
                      style={{ color: BRAND }}
                    >
                      {hasVariants && !selectedVariant
                        ? `From ${formatPrice(currentPrice)}`
                        : formatPrice(currentPrice)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-semibold">
                      Stock
                    </p>
                    <p className="text-xs text-slate-500 font-semibold">
                      {hasVariants ? "Selected stock" : "Stock"}
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {isOutOfStock
                        ? "Out of stock"
                        : `${currentStock} available`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    onClick={() => setTryOnOpen(true)}
                    variant="outline"
                    className="rounded-none border-slate-200 font-bold"
                  >
                    Try On
                  </Button>

                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || !isFormValid()}
                    className="rounded-none font-extrabold"
                    style={{
                      background: addedToCart
                        ? "linear-gradient(to right,#22c55e,#10b981)"
                        : BRAND,
                      opacity: isOutOfStock || !isFormValid() ? 0.6 : 1,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {addedToCart ? (
                        <motion.span
                          key="added"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="inline-flex items-center"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Added
                        </motion.span>
                      ) : (
                        <motion.span
                          key="add"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="inline-flex items-center"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Separator />

                {/* Variants */}
                {hasVariants && (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-slate-900">
                      Material
                      {!selectedVariant && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>

                    <div className="flex flex-wrap gap-2">
                      {variants.map((v, idx) => {
                        const vStock = Number(v.stock ?? 0) || 0;
                        const out = vStock === 0;
                        const active = selectedVariant?.id === v.id;

                        return (
                          <button
                            key={v.id || idx}
                            type="button"
                            disabled={out}
                            onClick={() => !out && setSelectedVariant(v)}
                            className="px-3 py-2 rounded-none border text-sm font-bold transition"
                            style={{
                              borderColor: active ? BRAND : "#e2e8f0",
                              background: active ? `${BRAND}10` : "white",
                              color: out ? "#94a3b8" : "#0f172a",
                              opacity: out ? 0.7 : 1,
                            }}
                          >
                            {v.name}
                            <span
                              className="ml-2 text-[11px]"
                              style={{ color: BRAND }}
                            >
                              {formatPrice(Number(v.price || 0))}
                            </span>

                            {/* ✅ optional: show per-variant stock in the button */}
                            <span className="ml-2 text-[11px] text-slate-500">
                              ({vStock})
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* ✅ This will change instantly when you pick a variant */}
                    <p className="text-xs font-semibold text-slate-600">
                      Selected stock:{" "}
                      <span className="font-extrabold" style={{ color: BRAND }}>
                        {Number(selectedVariant?.stock ?? 0) || 0}
                      </span>
                    </p>
                  </div>
                )}

                {/* Quantity */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-900">
                    Quantity
                  </Label>

                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center border border-slate-200 bg-white rounded-none">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-11 h-11 grid place-items-center hover:bg-slate-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="w-12 h-11 grid place-items-center border-x border-slate-200 font-extrabold">
                        {quantity}
                      </div>

                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        disabled={quantity >= currentStock}
                        className="w-11 h-11 grid place-items-center hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-semibold">
                        Total
                      </p>
                      <p
                        className="text-lg font-extrabold"
                        style={{ color: BRAND }}
                      >
                        {formatPrice(total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personalization + Extras in an elegant Accordion */}
                {(hasCustomFields || extrasAll.length > 0) && (
                  <Accordion type="multiple" className="w-full">
                    {hasCustomFields && (
                      <AccordionItem
                        value="personalize"
                        className="border-slate-200"
                      >
                        <AccordionTrigger className="text-sm font-extrabold text-slate-900">
                          {product.customFields?.[0]?.displayTitle ||
                            "Personalize"}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            {product.customFields.map((field, index) => (
                              <div
                                key={field.id || index}
                                className="space-y-2"
                              >
                                <Label className="text-xs font-bold text-slate-700">
                                  {field.label}
                                  {field.required && (
                                    <span className="text-red-500 ml-1">*</span>
                                  )}
                                </Label>

                                {field.type === "textarea" ? (
                                  <Textarea
                                    value={customFieldValues[field.label] || ""}
                                    onChange={(e) =>
                                      handleCustomFieldChange(
                                        field.label,
                                        e.target.value,
                                      )
                                    }
                                    placeholder={
                                      field.placeholder ||
                                      `Enter ${field.label.toLowerCase()}...`
                                    }
                                    rows={3}
                                    className="rounded-none border-slate-200 text-sm"
                                    style={{ outlineColor: BRAND }}
                                  />
                                ) : (
                                  <Input
                                    type={field.type || "text"}
                                    value={customFieldValues[field.label] || ""}
                                    onChange={(e) =>
                                      handleCustomFieldChange(
                                        field.label,
                                        e.target.value,
                                      )
                                    }
                                    placeholder={
                                      field.placeholder ||
                                      `Enter ${field.label.toLowerCase()}...`
                                    }
                                    className="rounded-none border-slate-200 h-11 text-sm"
                                    style={{ outlineColor: BRAND }}
                                  />
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {extrasAll.length > 0 && (
                      <AccordionItem
                        value="extras"
                        className="border-slate-200"
                      >
                        <AccordionTrigger className="text-sm font-extrabold text-slate-900">
                          Extras{" "}
                          {extrasTotal > 0 ? (
                            <span
                              className="ml-2 text-sm"
                              style={{ color: BRAND }}
                            >
                              + {formatPrice(extrasTotal)}
                            </span>
                          ) : null}
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            {sortedExtras.map((extra) => {
                              const selected = isExtraSelected(extra.id);
                              const picked = selectedExtras.find(
                                (x) => x.id === extra.id,
                              );
                              const hasStock = extraHasStock(extra);

                              return (
                                <div
                                  key={extra.id}
                                  className="border border-slate-200 rounded-none p-3 bg-white"
                                  style={{
                                    borderColor: selected ? BRAND : "#e2e8f0",
                                    background: selected
                                      ? `${BRAND}08`
                                      : "white",
                                  }}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-extrabold text-slate-900 text-sm">
                                          {extra.name}
                                        </p>

                                        {(extra.requiredText ||
                                          picked?.requiredText) && (
                                          <Badge
                                            variant="secondary"
                                            className="rounded-none text-[10px] font-extrabold"
                                            style={{
                                              background: `${BRAND}14`,
                                              color: BRAND,
                                            }}
                                          >
                                            Reply needed
                                          </Badge>
                                        )}

                                        {!hasStock && (
                                          <Badge
                                            variant="secondary"
                                            className="rounded-none text-[10px] font-extrabold"
                                          >
                                            Out of stock
                                          </Badge>
                                        )}
                                      </div>

                                      {extra.description ? (
                                        <p className="text-xs text-slate-600 mt-1 leading-snug">
                                          {extra.description}
                                        </p>
                                      ) : null}

                                      <p
                                        className="text-sm font-extrabold mt-2"
                                        style={{ color: BRAND }}
                                      >
                                        {formatPrice(
                                          getExtraEffectivePrice(extra, picked),
                                        )}
                                      </p>
                                    </div>

                                    <Button
                                      type="button"
                                      onClick={() => toggleExtra(extra)}
                                      disabled={!hasStock}
                                      className="h-9 px-4 rounded-none text-xs font-extrabold"
                                      style={{
                                        background: selected
                                          ? "#ffffff"
                                          : BRAND,
                                        opacity: !hasStock ? 0.5 : 1,
                                      }}
                                    >
                                      {selected ? "Added" : "Add"}
                                    </Button>
                                  </div>

                                  {selected &&
                                    Array.isArray(extra.variants) &&
                                    extra.variants.length > 0 && (
                                      <div className="mt-3 space-y-2">
                                        <Label className="text-xs font-bold text-slate-700">
                                          Choose option
                                        </Label>
                                        <div className="flex flex-wrap gap-2">
                                          {extra.variants.map((v) => {
                                            const active =
                                              picked?.selectedVariant?.id ===
                                              v.id;
                                            const disabled =
                                              (Number(v?.stock ?? 0) || 0) ===
                                              0;

                                            return (
                                              <button
                                                key={v.id}
                                                type="button"
                                                disabled={disabled}
                                                onClick={() =>
                                                  updateExtraVariant(
                                                    extra.id,
                                                    v,
                                                  )
                                                }
                                                className="px-3 py-2 rounded-none border text-xs font-extrabold transition"
                                                style={{
                                                  borderColor: active
                                                    ? BRAND
                                                    : "#e2e8f0",
                                                  background: active
                                                    ? `${BRAND}10`
                                                    : "white",
                                                  color: disabled
                                                    ? "#94a3b8"
                                                    : active
                                                      ? BRAND
                                                      : "#0f172a",
                                                }}
                                              >
                                                {v.name}
                                                {Number(v.price || 0) > 0 && (
                                                  <span
                                                    className="ml-1.5 text-[10px]"
                                                    style={{ color: BRAND }}
                                                  >
                                                    +{formatPrice(v.price)}
                                                  </span>
                                                )}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}

                                  {selected && (
                                    <div className="mt-3 flex items-center justify-between gap-2">
                                      <div className="inline-flex items-center border border-slate-200 bg-white rounded-none">
                                        <button
                                          type="button"
                                          onClick={() =>
                                            updateExtraQty(
                                              extra.id,
                                              (picked?.qty || 1) - 1,
                                            )
                                          }
                                          className="w-9 h-9 grid place-items-center hover:bg-slate-50"
                                        >
                                          <Minus className="w-3.5 h-3.5" />
                                        </button>

                                        <div className="w-10 h-9 grid place-items-center border-x border-slate-200 font-extrabold text-sm">
                                          {picked?.qty || 1}
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() =>
                                            updateExtraQty(
                                              extra.id,
                                              (picked?.qty || 1) + 1,
                                            )
                                          }
                                          className="w-9 h-9 grid place-items-center hover:bg-slate-50"
                                        >
                                          <Plus className="w-3.5 h-3.5" />
                                        </button>
                                      </div>

                                      <p className="text-xs font-extrabold text-slate-700">
                                        Subtotal:{" "}
                                        <span style={{ color: BRAND }}>
                                          {formatPrice(
                                            getExtraEffectivePrice(
                                              extra,
                                              picked,
                                            ) * (picked?.qty || 1),
                                          )}
                                        </span>
                                      </p>
                                    </div>
                                  )}

                                  {selected && extra.type === "text" && (
                                    <div className="mt-3 space-y-2">
                                      <Label className="text-xs font-bold text-slate-700">
                                        {picked?.promptTitle ||
                                          extra.promptTitle ||
                                          "Your reply"}
                                        {(extra.requiredText ||
                                          picked?.requiredText) && (
                                          <span className="text-red-500 ml-1">
                                            *
                                          </span>
                                        )}
                                      </Label>

                                      <Input
                                        value={picked?.textValue || ""}
                                        onChange={(e) =>
                                          updateExtraText(
                                            extra.id,
                                            e.target.value,
                                          )
                                        }
                                        placeholder={
                                          picked?.promptPlaceholder ||
                                          extra.promptPlaceholder ||
                                          "Type here..."
                                        }
                                        className="h-11 rounded-none border-slate-200 text-sm"
                                        style={{ outlineColor: BRAND }}
                                      />

                                      {(extra.requiredText ||
                                        picked?.requiredText) &&
                                        !String(
                                          picked?.textValue || "",
                                        ).trim() && (
                                          <p className="text-xs text-red-500 font-bold">
                                            Please enter your reply to continue
                                          </p>
                                        )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                )}
              </CardContent>
            </Card>

            {/* Related */}
            {relatedProducts.length > 0 && (
              <Card className="rounded-none border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-base text-slate-900">
                    You Might Also Like
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Similar pieces curated for you.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {relatedProducts.map((rp) => {
                      const stock = getProductTotalStock(rp);
                      const out = stock === 0;

                      const hasVars =
                        Array.isArray(rp?.variants) && rp.variants.length > 0;
                      const selectedRelVariant =
                        relatedVariantById[rp.id] || null;

                      const canQuickAdd =
                        !out && (!hasVars || !!selectedRelVariant);

                      const handleQuickAdd = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!canQuickAdd) return;

                        // related quick add = qty 1, no customFields/extras
                        addToCart(rp, 1, selectedRelVariant, {}, []);
                      };

                      return (
                        <motion.div
                          key={rp.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Link
                            to={`/product/${rp.id}`}
                            className="group block border border-slate-200 bg-white rounded-none overflow-hidden hover:border-slate-300 transition"
                          >
                            <div className="relative aspect-square bg-[#f6f3ef] overflow-hidden">
                              <img
                                src={rp.images?.[0] || "/placeholder.svg"}
                                alt={rp.name}
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                              />

                              {/* Quick add overlay */}
                              <div className="absolute inset-x-0 bottom-0 p-2">
                                <Button
                                  type="button"
                                  onClick={handleQuickAdd}
                                  disabled={!canQuickAdd}
                                  className="w-full h-10 rounded-none text-xs font-extrabold"
                                  style={{
                                    background: canQuickAdd ? BRAND : "#e2e8f0",
                                    color: canQuickAdd ? "white" : "#64748b",
                                  }}
                                >
                                  <ShoppingCart className="w-4 h-4 mr-2" />
                                  {out
                                    ? "Out of Stock"
                                    : hasVars && !selectedRelVariant
                                      ? "Select material"
                                      : "Quick Add"}
                                </Button>
                              </div>

                              {/* Out badge */}
                              {out && (
                                <div className="absolute top-2 left-2">
                                  <Badge
                                    variant="secondary"
                                    className="rounded-none text-[10px] font-extrabold"
                                  >
                                    OUT
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <div className="p-3 space-y-2">
                              <p className="text-sm font-bold text-slate-900 line-clamp-1">
                                {rp.name}
                              </p>

                              <p
                                className="text-sm font-extrabold"
                                style={{ color: BRAND }}
                              >
                                {getRelatedPriceLabel(rp)}
                              </p>

                              {/* Variant picker for related items (minimal) */}
                              {hasVars && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {rp.variants.slice(0, 3).map((v) => {
                                    const vStock = Number(v?.stock ?? 0) || 0;
                                    const vOut = vStock === 0;
                                    const active =
                                      selectedRelVariant?.id === v.id;

                                    const pick = (e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      if (vOut) return;
                                      setRelatedVariantById((prev) => ({
                                        ...prev,
                                        [rp.id]: v,
                                      }));
                                    };

                                    return (
                                      <button
                                        key={v.id}
                                        type="button"
                                        onClick={pick}
                                        disabled={vOut}
                                        className="px-2 py-1 rounded-none border text-[10px] font-extrabold transition"
                                        style={{
                                          borderColor: active
                                            ? BRAND
                                            : "#e2e8f0",
                                          background: active
                                            ? `${BRAND}10`
                                            : "white",
                                          color: vOut
                                            ? "#94a3b8"
                                            : active
                                              ? BRAND
                                              : "#0f172a",
                                          opacity: vOut ? 0.7 : 1,
                                        }}
                                        title={vOut ? "Out of stock" : v.name}
                                      >
                                        {v.name}
                                      </button>
                                    );
                                  })}

                                  {rp.variants.length > 3 && (
                                    <span className="text-[10px] font-bold text-slate-400 self-center">
                                      +{rp.variants.length - 3} more
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ===== Mobile bottom bar ===== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200">
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-slate-500 font-semibold">Total</p>
            <p
              className="text-xl font-extrabold truncate"
              style={{ color: BRAND }}
            >
              {formatPrice(total)}
            </p>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || !isFormValid()}
            className="rounded-none font-extrabold h-12 px-6"
            style={{
              background: addedToCart
                ? "linear-gradient(to right,#22c55e,#10b981)"
                : BRAND,
              opacity: isOutOfStock || !isFormValid() ? 0.6 : 1,
            }}
          >
            <AnimatePresence mode="wait">
              {addedToCart ? (
                <motion.span
                  key="m-added"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className="inline-flex items-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Added
                </motion.span>
              ) : (
                <motion.span
                  key="m-add"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  className="inline-flex items-center"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      <VirtualTryOnModal
        open={tryOnOpen}
        onClose={() => setTryOnOpen(false)}
        product={product}
      />
    </div>
  );
}

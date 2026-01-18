"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Gem,
  Sparkles,
  DollarSign,
  Package,
  Tag,
  FileText,
  Upload,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { useProducts } from "@/components/products/ProductsProvider";
import { toast } from "@/hooks/use-toast";

const JEWELRY_CATEGORIES = [
  { value: "rings", label: "Rings", icon: "💍" },
  { value: "necklaces", label: "Necklaces", icon: "📿" },
  { value: "bracelets", label: "Bracelets", icon: "⌚" },
  { value: "earrings", label: "Earrings", icon: "👂" },
  { value: "pendants", label: "Pendants", icon: "✨" },
  { value: "sets", label: "Sets", icon: "🎀" },
  { value: "anklets", label: "Anklets", icon: "🦶" },
];

const VARIANT_TYPES = {
  rings: {
    label: "Ring Sizes & Finishes",
    sizes: [
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
    ],
    finishes: ["Gold", "Silver", "Rose Gold", "Platinum", "Two-Tone"],
    hasCustomSize: false,
  },
  necklaces: {
    label: "Finishes",
    finishes: ["Gold", "Silver", "Rose Gold", "Platinum", "Two-Tone"],
    hasCustomSize: false,
  },
  bracelets: {
    label: "Sizes",
    finishes: ["One Size", "S", "M", "L", "XL"],
    hasCustomSize: false,
  },
  earrings: {
    label: "Finishes",
    finishes: ["Gold", "Silver", "Rose Gold", "Platinum"],
    hasCustomSize: false,
  },
  pendants: {
    label: "Finishes",
    finishes: ["Gold", "Silver", "Rose Gold", "Platinum"],
    hasCustomSize: false,
  },
  sets: {
    label: "Finishes",
    finishes: ["Gold", "Silver", "Rose Gold", "Platinum"],
    hasCustomSize: false,
  },
  anklets: {
    label: "Sizes",
    finishes: ["One Size", "S", "M", "L"],
    hasCustomSize: false,
  },
};

const PLACEMENTS = [
  { value: "new-arrivals", label: "New Arrivals" },
  { value: "best-sellers", label: "Best Sellers" },
  { value: "featured", label: "Featured" },
  { value: "regular", label: "Regular" },
];

export default function AddJewelry({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    minStock: "5",
    isDiscounted: false,
    discountPercentage: "",
    variants: [],
    placement: "regular",
    notes: "",
    images: [],
  });

  const [customRingSize, setCustomRingSize] = useState("");
  const [selectedFinish, setSelectedFinish] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [generatedSku, setGeneratedSku] = useState("");
  const { user } = useAuth();
  const { addProductsItem } = useProducts();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleVariantSelect = (option, isSize = false) => {
    setFormData((prev) => {
      const exists = prev.variants.includes(option);
      return {
        ...prev,
        variants: exists
          ? prev.variants.filter((v) => v !== option)
          : [...prev.variants, option],
      };
    });
  };

  const addCustomRingSize = () => {
    if (customRingSize && !isNaN(customRingSize)) {
      const size = Number(customRingSize);
      if (size >= 12 && size <= 20) {
        handleVariantSelect(`Size ${size}`);
        setCustomRingSize("");
      } else {
        toast({
          title: "Invalid Size",
          description: "Ring size must be between 12 and 20",
          variant: "destructive",
        });
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const newPreviews = [];
    let loadedCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        loadedCount++;

        if (loadedCount === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      if (file.type.startsWith("video/")) {
        const videoUrl = URL.createObjectURL(file);
        newPreviews.push(videoUrl);
        loadedCount++;

        if (loadedCount === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      } else {
        reader.readAsDataURL(file);
      }
    });
  };

  useEffect(() => {
    if (isOpen) {
      generateNextSku();
    }
  }, [isOpen]);

  const generateNextSku = async () => {
    try {
      const q = query(
        collection(db, "products"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const lastSku = snap.docs[0].data().sku;
        // Extract number from SKU (e.g., "SKU001" -> 001 -> 1)
        const lastNumber = Number.parseInt(lastSku.replace(/\D/g, ""), 10) || 0;
        const nextNumber = lastNumber + 1;
        setGeneratedSku(`SKU${String(nextNumber).padStart(3, "0")}`);
      } else {
        setGeneratedSku("SKU001");
      }
    } catch (error) {
      console.error("Error generating SKU:", error);
      setGeneratedSku("SKU001");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Jewelry name is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select a jewelry category";
    }

    if (formData.variants.length === 0) {
      newErrors.variants = "Please select at least one variant";
    }

    if (
      !formData.stock ||
      isNaN(Number.parseInt(formData.stock)) ||
      Number.parseInt(formData.stock) < 0
    ) {
      newErrors.stock = "Please enter a valid stock quantity";
    }

    if (formData.price && isNaN(Number.parseFloat(formData.price))) {
      newErrors.price = "Please enter a valid price";
    }

    if (
      formData.isDiscounted &&
      (!formData.discountPercentage ||
        isNaN(Number.parseFloat(formData.discountPercentage)))
    ) {
      newErrors.discountPercentage = "Please enter a valid discount percentage";
    }

    if (!formData.images || formData.images.length === 0) {
      newErrors.images = "Please upload at least one image or video";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file, productsName) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("name", productsName);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error("Upload request failed");
      }

      const data = await response.json();

      if (data.success) {
        return data.imageUrl;
      } else {
        throw new Error("Cloudinary upload failed");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const uploadedImageUrls = [];

      for (let i = 0; i < formData.images.length; i++) {
        const file = formData.images[i];

        toast({
          title: `Uploading image ${i + 1} of ${formData.images.length}...`,
        });

        const imageUrl = await uploadToCloudinary(file, formData.name);

        if (!imageUrl) {
          toast({
            title: "Upload Failed",
            description: `Image ${i + 1} upload failed. Please try again.`,
            variant: "destructive",
          });
          setUploading(false);
          return;
        }

        uploadedImageUrls.push(imageUrl);
      }

      toast({ title: "Images uploaded successfully!" });

      const authorizedByName =
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.email || "Unknown User";

      const product = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock),
        minStock: Number.parseInt(formData.minStock),
        variants: formData.variants,
        placement: formData.placement,
        isDiscounted: formData.isDiscounted,
        discountPercentage: formData.isDiscounted
          ? Number.parseFloat(formData.discountPercentage)
          : 0,
        notes: formData.notes,
        images: uploadedImageUrls,
        sku: generatedSku,
        authorizedByName,
        status:
          Number.parseInt(formData.stock) <= 0
            ? "out-of-stock"
            : Number.parseInt(formData.stock) <=
              Number.parseInt(formData.minStock)
            ? "low-stock"
            : "in-stock",
        createdAt: new Date().toISOString(),
      };

      await addProductsItem(product);

      toast({
        title: "Success!",
        description: "Product added successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        minStock: "5",
        isDiscounted: false,
        discountPercentage: "",
        variants: [],
        placement: "regular",
        notes: "",
        images: [],
      });

      setImagePreviews([]);
      setCustomRingSize("");
      setSelectedFinish("");
      onClose();
    } catch (error) {
      console.error("Error submitting product:", error);
      toast({
        title: "Error",
        description: "Something went wrong while saving the product.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="bg-white max-w-4xl mx-auto max-h-[95vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="p-6 overflow-y-auto"
          >
            <DrawerHeader className="px-0 pb-6">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 2,
                    }}
                  >
                    <Gem className="w-8 h-8 text-blue-600" />
                  </motion.div>
                  Add New Jewelry
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  Basic Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-base font-medium">
                      Jewelry Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Vintage Gold Ring"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className={cn(
                        "mt-2 border-blue-200 focus:border-blue-500",
                        errors.name && "border-red-500"
                      )}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="sku" className="text-sm font-medium">
                      Stock Keeping Unit (Auto-generated)
                    </Label>
                    <div className="mt-2 p-3 bg-white border border-orange-200 rounded-lg text-sm font-mono text-orange-700 font-semibold">
                      {generatedSku}
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Category *
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {JEWELRY_CATEGORIES.map((cat) => (
                        <motion.button
                          key={cat.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => {
                            handleInputChange("category", cat.value);
                            setSelectedFinish("");
                            setCustomRingSize("");
                          }}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all text-center",
                            formData.category === cat.value
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300 bg-white"
                          )}
                        >
                          <div className="text-2xl mb-1">{cat.icon}</div>
                          <div className="text-sm font-medium">{cat.label}</div>
                        </motion.button>
                      ))}
                    </div>
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Variants Section */}
              {formData.category && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Gem className="w-5 h-5 text-purple-600" />
                    {VARIANT_TYPES[formData.category]?.label} *
                  </h3>

                  {formData.category === "rings" && (
                    <div className="space-y-6">
                      {/* Ring Sizes Section */}
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">
                          Standard Sizes (5-13)
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {VARIANT_TYPES.rings.sizes.map((size) => (
                            <motion.button
                              key={size}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleVariantSelect(size)}
                              className={cn(
                                "px-3 py-2 rounded-lg border-2 transition-all font-medium text-sm",
                                formData.variants.includes(size)
                                  ? "border-purple-600 bg-purple-200 text-gray-900"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-purple-400"
                              )}
                            >
                              {size}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Ring Size */}
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">
                          Custom Size (12-20)
                        </h4>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min="12"
                            max="20"
                            placeholder="Enter size (12-20)"
                            value={customRingSize}
                            onChange={(e) => setCustomRingSize(e.target.value)}
                            className="w-40 border-purple-200"
                          />
                          <Button
                            type="button"
                            onClick={addCustomRingSize}
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            Add
                          </Button>
                        </div>
                      </div>

                      {/* Ring Finishes */}
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">
                          Finishes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {VARIANT_TYPES.rings.finishes.map((finish) => (
                            <motion.button
                              key={finish}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleVariantSelect(finish)}
                              className={cn(
                                "px-4 py-2 rounded-lg border-2 transition-all font-medium",
                                formData.variants.includes(finish)
                                  ? "border-purple-600 bg-purple-200 text-gray-900"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-purple-400"
                              )}
                            >
                              {finish}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.category !== "rings" && (
                    <div className="flex flex-wrap gap-2">
                      {VARIANT_TYPES[formData.category]?.finishes.map(
                        (option) => (
                          <motion.button
                            key={option}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleVariantSelect(option)}
                            className={cn(
                              "px-4 py-2 rounded-lg border-2 transition-all font-medium",
                              formData.variants.includes(option)
                                ? "border-purple-600 bg-purple-200 text-gray-900"
                                : "border-gray-300 bg-white text-gray-700 hover:border-purple-400"
                            )}
                          >
                            {option}
                          </motion.button>
                        )
                      )}
                    </div>
                  )}

                  {errors.variants && (
                    <p className="text-sm text-red-600 mt-2">
                      {errors.variants}
                    </p>
                  )}
                </motion.div>
              )}

              {/* Placement Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-green-600" />
                  Product Placement
                </h3>

                <div className="space-y-2">
                  {PLACEMENTS.map((placement) => (
                    <label
                      key={placement.value}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-2",
                        formData.placement === placement.value
                          ? "bg-green-100 border-green-600"
                          : "hover:bg-gray-50 border-gray-200"
                      )}
                    >
                      <input
                        type="radio"
                        name="placement"
                        value={placement.value}
                        checked={formData.placement === placement.value}
                        onChange={(e) =>
                          handleInputChange("placement", e.target.value)
                        }
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">
                        {placement.label}
                      </span>
                    </label>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the jewelry, its features, history, or any special details..."
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="mt-2 border-blue-200 focus:border-blue-500"
                  rows={3}
                />
              </motion.div>

              {/* Price & Discount */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                  <Label
                    htmlFor="price"
                    className="text-base font-medium flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4 text-green-600" />
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className={cn(
                      "mt-2 border-green-200 focus:border-green-500",
                      errors.price && "border-red-500"
                    )}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-600 mt-1">{errors.price}</p>
                  )}
                </div>

                <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-xl border border-rose-200">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isDiscounted"
                        checked={formData.isDiscounted}
                        onChange={(e) =>
                          handleInputChange("isDiscounted", e.target.checked)
                        }
                        className="w-4 h-4 rounded"
                      />
                      <Label
                        htmlFor="isDiscounted"
                        className="text-base font-medium cursor-pointer"
                      >
                        Discounted
                      </Label>
                    </div>

                    {formData.isDiscounted && (
                      <div>
                        <Label
                          htmlFor="discountPercentage"
                          className="text-sm font-medium"
                        >
                          Discount Percentage (%)
                        </Label>
                        <Input
                          id="discountPercentage"
                          type="number"
                          placeholder="0"
                          step="0.01"
                          min="0"
                          max="100"
                          value={formData.discountPercentage}
                          onChange={(e) =>
                            handleInputChange(
                              "discountPercentage",
                              e.target.value
                            )
                          }
                          className={cn(
                            "mt-2 border-rose-200 focus:border-rose-500",
                            errors.discountPercentage && "border-red-500"
                          )}
                        />
                        {errors.discountPercentage && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.discountPercentage}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Stock & Min Stock */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-xl border border-cyan-200">
                  <Label
                    htmlFor="stock"
                    className="text-base font-medium flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-cyan-600" />
                    Stock (Quantity)
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange("stock", e.target.value)}
                    className={cn(
                      "mt-2 border-cyan-200 focus:border-cyan-500",
                      errors.stock && "border-red-500"
                    )}
                  />
                  {errors.stock && (
                    <p className="text-sm text-red-600 mt-1">{errors.stock}</p>
                  )}
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
                  <Label
                    htmlFor="minStock"
                    className="text-base font-medium flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-indigo-600" />
                    Minimum Stock
                  </Label>
                  <Input
                    id="minStock"
                    type="number"
                    min="1"
                    value={formData.minStock}
                    onChange={(e) =>
                      handleInputChange("minStock", e.target.value)
                    }
                    className="mt-2 border-indigo-200 focus:border-indigo-500"
                  />
                </div>
              </motion.div>

              {/* Notes */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Label
                  htmlFor="notes"
                  className="text-base font-medium flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-gray-600" />
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional notes, maintenance tips, or reminders..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="mt-2 border-blue-200 focus:border-blue-500"
                  rows={2}
                />
              </motion.div>

              {/* Image Upload Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  Jewelry Images
                </h3>
                <div className="mt-2">
                  <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-blue-600" />
                    <div className="mt-4">
                      <label htmlFor="images" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Click to upload multiple images
                        </span>
                        <span className="text-xs text-gray-600 mt-1 block">
                          PNG, JPG, GIF up to 10MB each
                        </span>
                        <input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*,video/mp4"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  {errors.images && (
                    <p className="text-sm text-red-600 mt-2">{errors.images}</p>
                  )}
                  <AnimatePresence>
                    {imagePreviews.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 grid grid-cols-3 gap-4"
                      >
                        {imagePreviews.map((preview, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20,
                            }}
                          >
                            <Card className="relative group">
                              <CardContent className="p-2">
                                {preview?.includes("video") ? (
                                  <video
                                    src={preview}
                                    className="w-full h-24 object-cover rounded"
                                    controls
                                    muted
                                  />
                                ) : (
                                  <img
                                    src={preview || "/placeholder.svg"}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded"
                                  />
                                )}

                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute -top-2 -right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:flex-1 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  Cancel
                </Button>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:flex-1"
                >
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    {uploading ? "Adding Product..." : "Add Product"}
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

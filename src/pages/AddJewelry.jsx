"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
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
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { useProducts } from "@/components/products/ProductsProvider";
import { toast } from "@/hooks/use-toast";

const JEWELRY_TYPES = [
  { value: "ring", label: "Ring", icon: "💍" },
  { value: "necklace", label: "Necklace", icon: "📿" },
  { value: "bracelet", label: "Bracelet", icon: "⌚" },
  { value: "earring", label: "Earring", icon: "👂" },
  { value: "pendant", label: "Pendant", icon: "✨" },
  { value: "set", label: "Set", icon: "🎀" },
  //   { value: "anklet", label: "Anklet", icon: "🦶" },
  { value: "other", label: "Other", icon: "💎" },
];

const MATERIALS = [
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },

  { value: "diamond", label: "Diamond" },

  { value: "pearl", label: "Pearl" },
  { value: "bronze", label: "Bronze" },
];

export default function AddJewelry({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    material: "",
    description: "",
    price: "",
    stock: "",
    minStock: "5",

    isDiscounted: false,
    discountPercentage: "",
    size: "",
    notes: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [generatedSku, setGeneratedSku] = useState("");
  const { user } = useAuth();
  const { brands, categories, addProductsItem } = useProducts();
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Add files to formData
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    // Create previews
    const newPreviews = [];
    let loadedCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target.result);
        loadedCount++;

        // Only update state when all files are loaded
        if (loadedCount === files.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (isOpen) {
      generateNextSku();
    }
  }, [isOpen]);
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Jewelry name is required";
    }

    if (!formData.type) {
      newErrors.type = "Please select a jewelry type";
    }

    // Add stock validation
    if (
      !formData.stock ||
      isNaN(parseInt(formData.stock)) ||
      parseInt(formData.stock) < 0
    ) {
      newErrors.stock = "Please enter a valid stock quantity";
    }

    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = "Please enter a valid price";
    }

    if (
      formData.isDiscounted &&
      (!formData.discountPercentage ||
        isNaN(parseFloat(formData.discountPercentage)))
    ) {
      newErrors.discountPercentage = "Please enter a valid discount percentage";
    }

    // Add image validation
    if (!formData.images || formData.images.length === 0) {
      newErrors.images = "Please upload at least one image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
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
        const lastNumber = Number.parseInt(lastSku.replace(/\D/g, ""), 10) || 0;
        setGeneratedSku(`SKU${String(lastNumber + 1).padStart(3, "0")}`);
      } else {
        setGeneratedSku("SKU001");
      }
    } catch (error) {
      console.error("Error generating SKU:", error);
      setGeneratedSku("SKU001");
    }
  };
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };
  const uploadToCloudinary = async (file, productsName) => {
    console.log("📤 Uploading file:", file.name, file.type, file.size);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("name", productsName);

    try {
      console.log("🌐 Sending request to /api/upload");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Upload request failed:", errorText);
        throw new Error("Upload request failed");
      }

      const data = await response.json();
      console.log("✅ Upload response:", data);

      if (data.success) {
        return data.imageUrl;
      } else {
        console.error("❌ Cloudinary upload failed:", data);
        throw new Error("Cloudinary upload failed");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form first (includes image check)
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

      // Upload all images
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

      // All uploads succeeded
      toast({ title: "Images uploaded successfully!" });

      const authorizedByName =
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.email || "Unknown User";

      const products = {
        ...formData,
        stock: parseInt(formData.stock),
        price: parseFloat(formData.price),
        minStock: parseInt(formData.minStock),
        images: uploadedImageUrls,
        sku: generatedSku,
        authorizedByName,
        status:
          parseInt(formData.stock) <= 0
            ? "out-of-stock"
            : parseInt(formData.stock) <= parseInt(formData.minStock)
            ? "low-stock"
            : "in-stock",
        createdAt: new Date().toISOString(),
      };

      await addProductsItem(products);

      toast({
        title: "Success!",
        description: "Product added successfully!",
      });

      // Reset form
      setFormData({
        name: "",
        type: "",
        material: "",
        description: "",
        price: "",
        stock: "1",
        minStock: "1",
        isDiscounted: false,
        discountPercentage: "",
        size: "",
        notes: "",
        images: [],
      });

      setImagePreviews([]);
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
                    <Label className="text-base font-medium mb-3 block">
                      Jewelry Type *
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {JEWELRY_TYPES.map((type) => (
                        <motion.button
                          key={type.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          type="button"
                          onClick={() => handleInputChange("type", type.value)}
                          className={cn(
                            "p-3 rounded-lg border-2 transition-all text-center",
                            formData.type === type.value
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300 bg-white"
                          )}
                        >
                          <div className="text-2xl mb-1">{type.icon}</div>
                          <div className="text-sm font-medium">
                            {type.label}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                    {errors.type && (
                      <p className="text-sm text-red-600 mt-2">{errors.type}</p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Material & SKU */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Gem className="w-5 h-5 text-purple-600" />
                    Material
                  </h3>

                  <div className="space-y-2">
                    {MATERIALS.map((material) => (
                      <label
                        key={material.value}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-2",
                          formData.material === material.value
                            ? "bg-purple-100 border-purple-600"
                            : "hover:bg-gray-50 border-gray-200"
                        )}
                      >
                        <input
                          type="radio"
                          name="material"
                          value={material.value}
                          checked={formData.material === material.value}
                          onChange={(e) =>
                            handleInputChange("material", e.target.value)
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">
                          {material.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-5 h-5 text-orange-600" />
                    SKU
                  </h3>

                  <div>
                    <Label htmlFor="sku" className="text-sm font-medium">
                      Stock Keeping Unit (Auto-generated)
                    </Label>
                    <div className="mt-2 p-3 bg-white border border-orange-200 rounded-lg text-sm font-mono text-orange-700 font-semibold">
                      {generatedSku}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
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

              {/* Size */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="bg-gradient-to-br from-teal-50 to-cyan-50 p-6 rounded-xl border border-teal-200"
              >
                <Label
                  htmlFor="size"
                  className="text-base font-medium flex items-center gap-2"
                >
                  <Tag className="w-4 h-4 text-teal-600" />
                  Size (Optional)
                </Label>
                <Input
                  id="size"
                  placeholder="e.g., 7, M, Large, 45cm"
                  value={formData.size}
                  onChange={(e) => handleInputChange("size", e.target.value)}
                  className="mt-2 border-teal-200 focus:border-teal-500"
                />
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
                          accept="image/*"
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
                                <img
                                  src={preview || "/placeholder.svg"}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded"
                                />
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
                    {uploading ? "Adding Products..." : "Add Products"}
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

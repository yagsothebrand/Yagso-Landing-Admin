"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Filter,
  Tag,
  Building2,
  CheckCircle2,
  ImageIcon,
  FileDigitIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { AddInventoryModal } from "./AddInventoryModal";
import { useInventory } from "@/components/inventory/InventoryProvider";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import Layout from "@/components/layout/Layout";

const ImageViewerModal = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  allImages = [],
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen && allImages.length > 0) {
      const index = allImages.findIndex((img) => img === imageUrl);
      setCurrentIndex(index >= 0 ? index : 0);
    }
  }, [isOpen, imageUrl, allImages]);

  if (!isOpen) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="relative max-w-5xl w-full bg-white rounded-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="relative bg-gray-100">
          <img
            src={allImages[currentIndex] || imageUrl || "/placeholder.svg"}
            alt={title}
            className="w-full h-[70vh] object-contain"
          />

          {allImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg"
              >
                →
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {allImages.length}
              </div>
            </>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="p-4 flex gap-2 overflow-x-auto">
            {allImages.map((img, idx) => (
              <img
                key={idx}
                src={img || "/placeholder.svg"}
                alt={`${title} ${idx + 1}`}
                className={cn(
                  "w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all",
                  idx === currentIndex
                    ? "border-blue-500 scale-105"
                    : "border-gray-200 hover:border-blue-300"
                )}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const variants = {
    "in-stock": "bg-green-100 text-green-700 border-green-200",
    "low-stock": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "out-of-stock": "bg-red-100 text-red-700 border-red-200",
  };

  const labels = {
    "in-stock": "In Stock",
    "low-stock": "Low Stock",
    "out-of-stock": "Out of Stock",
  };

  return (
    <Badge
      className={cn(
        "border font-medium",
        variants[status] || "bg-gray-100 text-gray-700"
      )}
    >
      {labels[status] || status}
    </Badge>
  );
};

// View Product Drawer
const ViewProductDrawer = ({ product, isOpen, onClose }) => {
  if (!product) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-4xl mx-auto max-h-[95vh] bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="p-6 overflow-y-auto"
        >
          <DrawerHeader className="px-0 pb-6">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                >
                  <Package className="w-8 h-8 text-blue-600" />
                </motion.div>
                Inventory Details
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Inventory  Images Gallery */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              {product.images && product.images.length > 0 ? (
                <>
                  <img
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-80 object-cover rounded-xl border border-gray-200 shadow-lg cursor-pointer"
                    onClick={() =>
                      handleImageView(
                        product.images[0],
                        product.name,
                        product.images
                      )
                    }
                  />
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {product.images.slice(1, 5).map((img, idx) => (
                        <img
                          key={idx}
                          src={img || "/placeholder.svg"}
                          alt={`${product.name} ${idx + 2}`}
                          className="w-full h-20 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                          onClick={() =>
                            handleImageView(img, product.name, product.images)
                          }
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200">
                  <Package className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Inventory ID
                </label>
                <p className="text-sm font-semibold text-gray-900 font-mono">
                  {product.sku}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">
                  Inventory Name
                </label>
                <p className="text-2xl font-bold text-gray-900">
                  {product.name}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-600" />
                    Category
                  </label>
                  <p className="text-sm capitalize text-gray-900 font-semibold">
                    {product.category}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-purple-600" />
                    Brand
                  </label>
                  <p className="text-sm text-gray-900 font-semibold">
                    {product.brand}
                  </p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-200">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
                    <FileDigitIcon className="w-4 h-4 text-orange-600" />
                    Part Number
                  </label>
                  <p className="text-sm text-gray-900 font-semibold">
                    {product.partNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <label className="text-xs font-medium text-gray-600">
                    Current Stock
                  </label>
                  <p className="text-3xl font-bold text-green-700">
                    {product.stock}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <label className="text-xs font-medium text-gray-600">
                    Min Stock
                  </label>
                  <p className="text-3xl font-bold text-blue-700">
                    {product.minStock || 5}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-200">
                <label className="text-xs font-medium text-gray-600">
                  Price
                </label>
                <p className="text-4xl font-bold text-purple-700">
                  ₦{Number(product.price).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  Status
                </label>
                <StatusBadge status={product.status} />
              </div>

              {product.description && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-medium text-gray-600 block mb-2">
                    Description
                  </label>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {product.authorizedByName && (
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                  <label className="text-xs font-medium text-gray-600 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    Added By
                  </label>
                  <p className="text-sm font-semibold text-indigo-900">
                    {product.authorizedByName}
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
};

// Edit Product Drawer
const EditProductDrawer = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || "",
        category: product.category || "",
        brand: product.brand || "",
        stock: product.stock || 0,
        minStock: product.minStock || 5,
        price: product.price || 0,
        description: product.description || "",
        partNumber: product.partNumber || "",
        sku: product.sku || "",
      });
    }
  }, [product, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({ ...product, ...formData });
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-3xl mx-auto max-h-[90vh] bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="p-6 overflow-y-auto"
        >
          <DrawerHeader className="px-0 pb-6">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 2,
                  }}
                >
                  <Edit className="w-8 h-8 text-blue-600" />
                </motion.div>
                Edit Inventory
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Inventory Name *
                  </label>
                  <Input
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    SKU *
                  </label>
                  <Input
                    value={formData.sku || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, sku: e.target.value })
                    }
                    disabled
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Input
                    value={formData.category || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Brand *
                  </label>
                  <Input
                    value={formData.brand || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, brand: e.target.value })
                    }
                    required
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Stock & Pricing
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <Input
                    type="number"
                    value={formData.stock || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: Number(e.target.value),
                      })
                    }
                    required
                    min="0"
                    className="border-green-200 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Minimum Stock *
                  </label>
                  <Input
                    type="number"
                    value={formData.minStock || 5}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minStock: Number(e.target.value),
                      })
                    }
                    required
                    min="1"
                    className="border-green-200 focus:border-green-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Price (₦) *
                  </label>
                  <Input
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: Number(e.target.value),
                      })
                    }
                    required
                    min="0"
                    step="0.01"
                    className="border-green-200 focus:border-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Description
              </h3>
              <textarea
                className="w-full p-3 border border-purple-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="4"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter Inventory description..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Part Number *
              </label>
              <Input
                value={formData.partNumber || ""}
                onChange={(e) =>
                  setFormData({ ...formData, partNumber: e.target.value })
                }
                required
                className="border-blue-200 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-gray-300 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
};

// Filter Drawer component
const FilterDrawer = ({
  isOpen,
  onClose,
  categories,
  brands,
  tempStatusFilters,
  setTempStatusFilters,
  tempCategoryFilters,
  setTempCategoryFilters,
  tempBrandFilters,
  setTempBrandFilters,
  onApplyFilters,
}) => {
  const toggleFilter = (value, type) => {
    if (type === "status") {
      setTempStatusFilters((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    } else if (type === "category") {
      setTempCategoryFilters((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    } else if (type === "brand") {
      setTempBrandFilters((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    }
  };

  const hasActiveFilters =
    tempStatusFilters.length > 0 ||
    tempCategoryFilters.length > 0 ||
    tempBrandFilters.length > 0;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-md mx-auto max-h-[90vh] bg-white">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="p-6 overflow-y-auto"
        >
          <DrawerHeader className="px-0 pb-6">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Filter className="w-6 h-6 text-blue-600" />
                Filter Product
              </DrawerTitle>
              <DrawerClose asChild>
                <Button variant="ghost" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="space-y-6">
            {/* Status Filters */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600" />
                Stock Status
              </h3>
              <div className="space-y-2">
                {[
                  { value: "in-stock", label: "In Stock", color: "green" },
                  { value: "low-stock", label: "Low Stock", color: "yellow" },
                  {
                    value: "out-of-stock",
                    label: "Out of Stock",
                    color: "red",
                  },
                ].map((status) => (
                  <label
                    key={status.value}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2",
                      tempStatusFilters.includes(status.value)
                        ? `border-${status.color}-500 bg-${status.color}-50`
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={tempStatusFilters.includes(status.value)}
                      onChange={() => toggleFilter(status.value, "status")}
                      className="w-4 h-4 rounded"
                    />
                    <span className="font-medium text-gray-900">
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border-2",
                      tempCategoryFilters.includes(category.name.toLowerCase())
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    {category.image && (
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    )}
                    <input
                      type="checkbox"
                      checked={tempCategoryFilters.includes(
                        category.name.toLowerCase()
                      )}
                      onChange={() =>
                        toggleFilter(category.name.toLowerCase(), "category")
                      }
                      className="hidden"
                    />
                    <span className="text-xs font-medium text-gray-900 text-center">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filters */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-xl border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-600" />
                Brands
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {brands.map((brand) => (
                  <label
                    key={brand.id}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg cursor-pointer transition-all border-2",
                      tempBrandFilters.includes(brand.name.toLowerCase())
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    )}
                  >
                    {brand.image && (
                      <img
                        src={brand.image || "/placeholder.svg"}
                        alt={brand.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                    )}
                    <input
                      type="checkbox"
                      checked={tempBrandFilters.includes(
                        brand.name.toLowerCase()
                      )}
                      onChange={() =>
                        toggleFilter(brand.name.toLowerCase(), "brand")
                      }
                      className="hidden"
                    />
                    <span className="text-xs font-medium text-gray-900 text-center">
                      {brand.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setTempStatusFilters([]);
                setTempCategoryFilters([]);
                setTempBrandFilters([]);
              }}
              className="flex-1 border-gray-300 bg-transparent"
            >
              Clear All
            </Button>
            <Button
              onClick={() => {
                onApplyFilters();
                onClose();
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              // disabled={!hasActiveFilters}
            >
              Apply Filters
              {hasActiveFilters && (
                <Badge className="ml-2 bg-white text-blue-600">
                  {tempStatusFilters.length +
                    tempCategoryFilters.length +
                    tempBrandFilters.length}
                </Badge>
              )}
            </Button>
          </div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
};

// Active Filters component
const ActiveFilters = ({
  statusFilters,
  categoryFilters,
  brandFilters,
  searchTerm,
  clearFilter,
}) => {
  const hasFilters =
    statusFilters.length > 0 ||
    categoryFilters.length > 0 ||
    brandFilters.length > 0 ||
    searchTerm.length > 0;

  if (!hasFilters) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 p-4 bg-blue-50 rounded-lg border border-blue-200"
    >
      <span className="text-xs font-medium text-gray-700">Active Filters:</span>

      {searchTerm && (
        <Badge className="bg-blue-100 text-blue-700 border-blue-300 flex items-center gap-1">
          Search: {searchTerm}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => clearFilter("search")}
          />
        </Badge>
      )}

      {statusFilters.map((filter) => (
        <Badge
          key={filter}
          className="bg-green-100 text-green-700 border-green-300 flex items-center gap-1"
        >
          {filter}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => clearFilter("status", filter)}
          />
        </Badge>
      ))}

      {categoryFilters.map((filter) => (
        <Badge
          key={filter}
          className="bg-purple-100 text-purple-700 border-purple-300 flex items-center gap-1"
        >
          {filter}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => clearFilter("category", filter)}
          />
        </Badge>
      ))}

      {brandFilters.map((filter) => (
        <Badge
          key={filter}
          className="bg-orange-100 text-orange-700 border-orange-300 flex items-center gap-1"
        >
          {filter}
          <X
            className="w-3 h-3 cursor-pointer"
            onClick={() => clearFilter("brand", filter)}
          />
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={() => clearFilter("all")}
        className="text-red-600 hover:bg-red-50"
      >
        Clear All
      </Button>
    </motion.div>
  );
};

// Main Inventory Page Component
export function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isViewDrawerOpen, setIsViewDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    url: "",
    title: "",
    allImages: [],
  });
  const { user } = useAuth();

  // Filter drawer state and filter states
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [tempStatusFilters, setTempStatusFilters] = useState([]);
  const [tempCategoryFilters, setTempCategoryFilters] = useState([]);
  const [tempBrandFilters, setTempBrandFilters] = useState([]);

  const {
    inventory,
    loading,
    getInventory,
    updateInventoryItem,
    deleteInventoryItem,
    getInventoryStats,
    calculateItemStatus,
    categories,
    brands, // Added brands to context
  } = useInventory();
  console.log(inventory);
  const [products, setProducts] = useState([]);

  // Update products when inventory changes
  useEffect(() => {
    if (inventory && Array.isArray(inventory)) {
      const updatedProducts = inventory.map((product) => ({
        ...product,
        status: calculateItemStatus(product.stock, product.minStock),
      }));
      setProducts(updatedProducts);
    }
  }, [inventory, calculateItemStatus]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      searchTerm === "" ||
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.authorizedByName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilters.length === 0 || statusFilters.includes(p.status);

    const matchesCategory =
      categoryFilters.length === 0 ||
      categoryFilters.includes(p.category?.toLowerCase());

    const matchesBrand =
      brandFilters.length === 0 ||
      brandFilters.includes(p.brand?.toLowerCase());

    return matchesSearch && matchesStatus && matchesCategory && matchesBrand;
  });

  const handleImageView = (imageUrl, productName, allImages) => {
    setSelectedImage({
      url: imageUrl,
      title: productName,
      allImages: allImages || [imageUrl],
    });
    setImageViewerOpen(true);
  };

  // Filter management functions
  const handleApplyFilters = () => {
    setStatusFilters(tempStatusFilters);
    setCategoryFilters(tempCategoryFilters);
    setBrandFilters(tempBrandFilters);
  };

  const clearFilter = (type, value) => {
    if (type === "status") {
      setStatusFilters((prev) => prev.filter((f) => f !== value));
      setTempStatusFilters((prev) => prev.filter((f) => f !== value));
    } else if (type === "category") {
      setCategoryFilters((prev) => prev.filter((f) => f !== value));
      setTempCategoryFilters((prev) => prev.filter((f) => f !== value));
    } else if (type === "brand") {
      setBrandFilters((prev) => prev.filter((f) => f !== value));
      setTempBrandFilters((prev) => prev.filter((f) => f !== value));
    } else if (type === "search") {
      setSearchTerm("");
    } else if (type === "all") {
      setStatusFilters([]);
      setCategoryFilters([]);
      setBrandFilters([]);
      setTempStatusFilters([]);
      setTempCategoryFilters([]);
      setTempBrandFilters([]);
      setSearchTerm("");
    }
  };

  useEffect(() => {
    if (isFilterDrawerOpen) {
      setTempStatusFilters(statusFilters);
      setTempCategoryFilters(categoryFilters);
      setTempBrandFilters(brandFilters);
    }
  }, [isFilterDrawerOpen, statusFilters, categoryFilters, brandFilters]);

  const handleEditProduct = async (updatedProduct) => {
    try {
      const { id, ...updateData } = updatedProduct;
      const result = await updateInventoryItem(id, updateData);

      if (result.success) {
        console.log("Inventory updated successfully");
        getInventory(); // Refresh inventory after update
      } else {
        console.error("Failed to update product:", result.error);
        alert("Failed to update product. Please try again.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred while updating the product.");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        const result = await deleteInventoryItem(productId);

        if (result.success) {
          console.log("Inventory deleted successfully");
          getInventory(); // Refresh inventory after delete
        } else {
          console.error("Failed to delete product:", result.error);
          alert("Failed to delete product. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("An error occurred while deleting the product.");
      }
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewDrawerOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsEditDrawerOpen(true);
  };

  const stats = getInventoryStats();
  const {
    total: totalProducts,
    inStock: inStockCount,
    lowStock: lowStockCount,
    outOfStock: outOfStockCount,
  } = stats;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <Package className="w-16 h-16 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  const activeFilterCount =
    statusFilters.length + categoryFilters.length + brandFilters.length;

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-3">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="font-semibold">
                  Dashboard
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="font-semibold">
                  Inventory Management
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-gray-600 mt-1  text-pretty">
                  Manage your spare parts inventory
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    onClick={() => setIsAddModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Inventory
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-blue-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        Total Products
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        {totalProducts}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-green-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-green-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">In Stock</p>
                      <p className="text-xl font-bold text-green-600">
                        {inStockCount}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-yellow-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-yellow-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Low Stock</p>
                      <p className="text-xl font-bold text-yellow-600">
                        {lowStockCount}
                      </p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-red-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-red-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Out of Stock</p>
                      <p className="text-xl font-bold text-red-600">
                        {outOfStockCount}
                      </p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filters section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="bg-white p-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative flex-1 w-full group max-w-xl">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 w-5 h-5" />
                  <Input
                    placeholder="Search by name, SKU, brand, category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-in-out shadow-sm hover:bg-white hover:shadow-md"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => setIsFilterDrawerOpen(true)}
                      className="border-blue-600 text-blue-700 hover:bg-blue-50 bg-transparent relative"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge className="ml-2 bg-blue-600 text-white">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </motion.div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => getInventory()}
                    className="border-gray-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <ActiveFilters
              statusFilters={statusFilters}
              categoryFilters={categoryFilters}
              brandFilters={brandFilters}
              searchTerm={searchTerm}
              clearFilter={clearFilter}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 "
          >
            <AnimatePresence>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white border-blue-200 overflow-hidden">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div
                        className="relative aspect-square bg-gray-100 flex items-center justify-center overflow-hidden cursor-pointer group"
                        onClick={() =>
                          product.images?.[0] &&
                          handleImageView(
                            product.images[0],
                            product.name,
                            product.images
                          )
                        }
                      >
                        {product.images?.[0] ? (
                          <>
                            <img
                              src={product.images[0] || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                              <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </div>
                            {product.images.length > 1 && (
                              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-black/60 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs">
                                +{product.images.length - 1}
                              </div>
                            )}
                          </>
                        ) : (
                          <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                        )}

                        {/* Status badge overlay */}
                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                          <StatusBadge status={product.status} />
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-mono mt-1">
                            {product.sku}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs flex-wrap">
                          <div className="flex items-center gap-1 bg-purple-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                            <Tag className="w-3 h-3 text-purple-600 flex-shrink-0" />
                            <span className="text-purple-700 capitalize truncate max-w-[80px] sm:max-w-none">
                              {product.category}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                            <Building2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            <span className="text-blue-700 truncate max-w-[80px] sm:max-w-none">
                              {product.brand}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 bg-blue-50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md">
                            <FileDigitIcon className="w-3 h-3 text-blue-600 flex-shrink-0" />
                            <span className="text-black-700 truncate max-w-[80px] sm:max-w-none font-bold">
                              {product.partNumber || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-gray-500">Stock</p>
                            <p
                              className={cn(
                                "text-base sm:text-lg font-bold",
                                product.stock === 0
                                  ? "text-red-600"
                                  : product.stock <= (product.minStock || 5)
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              )}
                            >
                              {product.stock}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Price</p>
                            <p className="text-base sm:text-lg font-bold text-gray-900 truncate max-w-[120px]">
                              ₦{Number(product.price).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {product.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 pt-2 border-t border-gray-100">
                            {product.description}
                          </p>
                        )}
                        

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 sm:gap-1.5 pt-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="flex-1"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProduct(product)}
                              className="w-full hover:bg-blue-50 text-blue-600 border-blue-200 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
                            >
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                              <span className="hidden xs:inline">View</span>
                            </Button>
                          </motion.div>
                          {(user?.role === "CEO" ||
                            user?.role === "General Manager") && (
                            <>
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditClick(product)}
                                  className="hover:bg-green-100 text-green-600 h-8 sm:h-9 w-8 sm:w-9 p-0"
                                >
                                  <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.1 }}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                  className="hover:bg-red-100 text-red-600 h-8 sm:h-9 w-8 sm:w-9 p-0"
                                >
                                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </Button>
                              </motion.div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProducts.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm || activeFilterCount > 0
                  ? "No products found matching your criteria."
                  : "No products available. Add your first product!"}
              </p>
            </motion.div>
          )}
        </div>

        {/* Modals/Drawers */}
        <AddInventoryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={() => getInventory()}
        />
        <ViewProductDrawer
          product={selectedProduct}
          isOpen={isViewDrawerOpen}
          onClose={() => {
            setIsViewDrawerOpen(false);
            setSelectedProduct(null);
          }}
        />
        <EditProductDrawer
          product={selectedProduct}
          isOpen={isEditDrawerOpen}
          onClose={() => {
            setIsEditDrawerOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleEditProduct}
        />
        <FilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={() => setIsFilterDrawerOpen(false)}
          categories={categories}
          brands={brands}
          tempStatusFilters={tempStatusFilters}
          setTempStatusFilters={setTempStatusFilters}
          tempCategoryFilters={tempCategoryFilters}
          setTempCategoryFilters={setTempCategoryFilters}
          tempBrandFilters={tempBrandFilters}
          setTempBrandFilters={setTempBrandFilters}
          onApplyFilters={handleApplyFilters}
        />

        <ImageViewerModal
          isOpen={imageViewerOpen}
          onClose={() => setImageViewerOpen(false)}
          imageUrl={selectedImage.url}
          title={selectedImage.title}
          allImages={selectedImage.allImages}
        />
      </div>
    </Layout>
  );
}

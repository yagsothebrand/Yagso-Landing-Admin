"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Tag, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useProducts } from "@/components/products/ProductsProvider";
import { useAuth } from "@/components/auth/AuthProvider";

export function AddCategoryDrawer({ isOpen, onClose }) {
  const { addCategoriesItem } = useProducts();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData({ ...formData, image: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const isFormValid = () => {
    return formData.name.trim() !== "" && formData.description.trim() !== "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    setLoading(true);
    try {
      const res = await addCategoriesItem(formData, user);
      if (res.success) {
        setFormData({ name: "", description: "", image: "" });
        setImagePreview(null);
        onClose();
      }
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-5xl mx-auto h-[95vh] sm:h-[90vh] bg-white">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              {/* Fixed Header */}
              <DrawerHeader className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b flex-shrink-0 bg-white z-10">
                <div className="flex items-center justify-between gap-2">
                  <DrawerTitle className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 truncate">
                    <Tag className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-blue-600 flex-shrink-0" />
                    <span className="truncate">Add New Category</span>
                  </DrawerTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 sm:h-9 sm:w-9 p-0 flex-shrink-0"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </DrawerHeader>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-3 sm:px-4 md:px-6 py-4 sm:py-5 md:py-6">
                <form onSubmit={handleSubmit} className="pb-28 md:pb-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    {/* Image Side */}
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-3 sm:space-y-4"
                    >
                      <div
                        onClick={!imagePreview ? triggerFileInput : undefined}
                        className={`aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden border-2 border-dashed border-blue-300 relative group ${
                          !imagePreview
                            ? "cursor-pointer hover:border-blue-500 hover:bg-gradient-to-br hover:from-blue-100 hover:to-indigo-100 transition-all active:scale-95"
                            : ""
                        }`}
                      >
                        {imagePreview ? (
                          <>
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 sm:top-3 sm:right-3 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                              onClick={removeImage}
                            >
                              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 shadow-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-xs px-2 sm:px-3 h-7 sm:h-8"
                              onClick={triggerFileInput}
                            >
                              Change
                            </Button>
                            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-white/95 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3 sm:py-1.5 shadow-lg">
                              <span className="text-xs font-semibold text-blue-700 flex items-center gap-1 sm:gap-1.5">
                                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                <span className="hidden xs:inline">
                                  Image uploaded
                                </span>
                                <span className="xs:hidden">Uploaded</span>
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-4 sm:p-6">
                            <Upload className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-blue-400 mx-auto mb-2 sm:mb-3 md:mb-4" />
                            <p className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold px-2">
                              Click to Upload Image
                            </p>
                            <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              PNG, JPG up to 10MB
                            </p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </motion.div>

                    {/* Form Side */}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-3 sm:space-y-4 md:space-y-6"
                    >
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-blue-200">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Category Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="Enter category name"
                          required
                          className="border-blue-200 focus:border-blue-500 text-sm h-10 sm:h-11"
                        />
                      </div>

                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl border border-purple-200">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="Enter category description"
                          required
                          className="w-full p-2.5 sm:p-3 border border-purple-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm min-h-[120px] max-h-[200px]"
                        />
                      </div>

                      {/* Desktop Buttons */}
                      <div className="hidden md:flex justify-end gap-3 pt-4 border-t">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onClose}
                          className="border-gray-300 bg-transparent text-sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={loading || !isFormValid()}
                          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          {loading ? "Adding..." : "Add Category"}
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </form>
              </div>

              {/* Fixed Footer for Mobile */}
            </motion.div>
          )}
        </AnimatePresence>
      </DrawerContent>
    </Drawer>
  );
}

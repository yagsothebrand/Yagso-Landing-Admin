"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Plus,
  Check,
  ChevronsUpDown,
  ImageIcon,
} from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { useInventory } from "@/components/inventory/InventoryProvider";

export function AddInventoryModal({ isOpen, onClose, onSave }) {
  const { brands, categories, addInventoryItem } = useInventory();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    stock: "1",
    price: "",
    minStock: "5",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [generatedSku, setGeneratedSku] = useState("");
  const [openCategory, setOpenCategory] = useState(false);
  const [openBrand, setOpenBrand] = useState(false);

  useEffect(() => {
    if (isOpen) {
      generateNextSku();
    }
  }, [isOpen]);

  const generateNextSku = async () => {
    try {
      const q = query(
        collection(db, "inventory"),
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target?.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadToCloudinary = async (file, inventoryName, category) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("name", inventoryName);
    formDataUpload.append("category", category);

    try {
      const response = await fetch(
        "https://osondu-server.onrender.com/api/upload",
        {
          method: "POST",
          body: formDataUpload,
        }
      );

      const data = await response.json();
      if (data.success) {
        return data.imageUrl;
      }
      return null;
    } catch (error) {
      console.error("Upload failed", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const uploadedImageUrls = [];

      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const imageUrl = await uploadToCloudinary(
          file,
          formData.name,
          formData.category
        );
        if (imageUrl) uploadedImageUrls.push(imageUrl);
      }

      const authorizedByName =
        user?.firstName && user?.lastName
          ? `${user.firstName + " "} ${user.lastName}`
          : user?.email || "Unknown User";

      const inventory = {
        ...formData,
        stock: Number.parseInt(formData.stock),
        price: Number.parseFloat(formData.price),
        minStock: Number.parseInt(formData.minStock),
        images: uploadedImageUrls,
        sku: generatedSku,
        partNumber: formData.partNumber,
        authorizedByName,
        status:
          Number.parseInt(formData.stock) === 0
            ? "out-of-stock"
            : Number.parseInt(formData.stock) <=
              Number.parseInt(formData.minStock)
            ? "low-stock"
            : "in-stock",
        createdAt: new Date().toISOString(),
      };

      await addInventoryItem(inventory);
      onClose();
      setFormData({
        name: "",
        category: "",
        brand: "",
        stock: "1",
        price: "",
        partNumber: "",
        minStock: "5",
        description: "",
      });
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Plus className="w-8 h-8 text-blue-600" />
              </motion.div>
              Add New Inventory
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Auto-Generated SKU
                  </Label>
                  <p className="text-2xl font-bold text-blue-600 mt-1">
                    {generatedSku}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Check className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Inventory Name *</Label>
                  <Input
                    id="name"
                    className="bg-white border-purple-200 focus:border-purple-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    placeholder="Enter inventory name"
                  />
                </div>
                <div>
                  <Label htmlFor="partNumber">Part Number *</Label>
                  <Input
                    id="partNumber"
                    className="bg-white border-purple-200 focus:border-purple-500"
                    value={formData.partNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, partNumber: e.target.value }))
                    }
                    required
                    placeholder="Enter part Number"
                  />
                </div>
                <div>
                  <Label>Brand *</Label>
                  <Button
                    onClick={() => setOpenBrand(true)}
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openBrand}
                    className="w-full justify-between bg-white border-purple-200 hover:bg-purple-50"
                  >
                    {formData.brand ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            brands.find((b) => b.name === formData.brand)
                              ?.image || "/placeholder.svg"
                          }
                          alt={formData.brand}
                          className="w-5 h-5 object-contain"
                        />
                        {formData.brand}
                      </div>
                    ) : (
                      "Select brand..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  <CommandDialog
                    open={openBrand}
                    onOpenChange={setOpenBrand}
                    className="bg-white"
                  >
                    <CommandInput placeholder="Search brand..." />
                    <CommandList>
                      <CommandEmpty>No brand found.</CommandEmpty>
                      <CommandGroup>
                        {brands.map((brand) => (
                          <CommandItem
                            key={brand.id}
                            value={brand.name}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                brand: brand.name,
                              }));
                              setOpenBrand(false);
                            }}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <img
                                src={brand.image || "/placeholder.svg"}
                                alt={brand.name}
                                className="w-8 h-8 object-contain"
                              />
                              <span className="font-medium">{brand.name}</span>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  formData.brand === brand.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </CommandDialog>
                </div>

                <div>
                  <Label>Category *</Label>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategory}
                    onClick={() => setOpenCategory(true)}
                    className="w-full justify-between bg-white border-purple-200 hover:bg-purple-50"
                  >
                    {formData.category ? (
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            categories.find((c) => c.name === formData.category)
                              ?.image || "/placeholder.svg"
                          }
                          alt={formData.category}
                          className="w-5 h-5 object-cover rounded"
                        />
                        {formData.category}
                      </div>
                    ) : (
                      "Select category..."
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>

                  <CommandDialog
                    open={openCategory}
                    onOpenChange={setOpenCategory}
                    className="bg-white"
                  >
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                      <CommandEmpty>No category found.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            value={category.name}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                category: category.name,
                              }));
                              setOpenCategory(false);
                            }}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <img
                                src={category.image || "/placeholder.svg"}
                                alt={category.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                              <span className="font-medium">
                                {category.name}
                              </span>
                              <Check
                                className={cn(
                                  "ml-auto h-4 w-4",
                                  formData.category === category.name
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </CommandDialog>
                </div>

                <div>
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    className="bg-white border-purple-200 focus:border-purple-500"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    required
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Stock Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Current Stock *</Label>
                  <Input
                    id="stock"
                    className="bg-white border-green-200 focus:border-green-500"
                    type="number"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        stock: e.target.value,
                      }))
                    }
                    required
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label htmlFor="minStock">Minimum Stock *</Label>
                  <Input
                    id="minStock"
                    type="number"
                    className="bg-white border-green-200 focus:border-green-500"
                    value={formData.minStock}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minStock: e.target.value,
                      }))
                    }
                    required
                    placeholder="5"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-xl border border-orange-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h3>
              <Textarea
                className="bg-white border-orange-200 focus:border-orange-500 resize-none"
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                placeholder="Enter inventory description..."
              />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                inventory Images
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
                        Images will be uploaded to Cloudinary
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
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={uploading}
                className="border-gray-300 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                disabled={uploading}
              >
                {uploading ? "Adding Inventory..." : "Add Inventory"}
              </Button>
            </div>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

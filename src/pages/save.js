"use client";

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { db } from "@/firebase"; // make sure you’ve initialized Firebase
import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { useInventory } from "@/components/inventory/InventoryProvider";

export function AddProductModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    brand: "",
    stock: "",
    price: "",
    minStock: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { brands, categories } = useInventory();
  console.log(categories);
  const { toast } = useToast();

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

  const uploadToCloudinary = async (file, productName, category) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("name", productName);
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

  const generateNextSku = async () => {
    try {
      const q = query(
        collection(db, "inventory"),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const lastSku = snap.docs[0].data().sku; // e.g. "SKU005"
        const lastNumber = parseInt(lastSku.replace(/\D/g, ""), 10) || 0;
        return `SKU${String(lastNumber + 1).padStart(3, "0")}`;
      }
      return "SKU001";
    } catch (error) {
      console.error("Error generating SKU:", error);
      return "SKU001";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const sku = await generateNextSku();
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

      const product = {
        ...formData,
        stock: Number.parseInt(formData.stock),
        price: Number.parseFloat(formData.price), // now treated as ₦
        minStock: Number.parseInt(formData.minStock),
        images: uploadedImageUrls,
        sku,
        status:
          Number.parseInt(formData.stock) === 0
            ? "out-of-stock"
            : Number.parseInt(formData.stock) <=
              Number.parseInt(formData.minStock)
            ? "low-stock"
            : "in-stock",
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "inventory"), product);

      toast({
        title: "Product Added",
        description: `${formData.name} has been successfully added.`,
      });

      onClose();
      setFormData({
        name: "",
        category: "",
        brand: "",
        stock: "",
        price: "",
        minStock: "",
        description: "",
      });
      setImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                className=" bg-white border border-gray-300"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="brand">Brand</Label>
              <Select
                value={formData.brand}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, brand: value }))
                }
              >
                <SelectTrigger className=" bg-white border border-gray-300">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md rounded-md">
                  {brands.map((b, idx) => (
                    <SelectItem key={idx} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className=" bg-white border border-gray-300">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent className="bg-white shadow-md rounded-md">
                  {categories.map((cat, idx) => (
                    <SelectItem key={idx} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Price (₦)</Label>
              <Input
                id="price"
                className=" bg-white border border-gray-300"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock">Current Stock</Label>
              <Input
                id="stock"
                className=" bg-white border border-gray-300"
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, stock: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="minStock">Minimum Stock</Label>
              <Input
                id="minStock"
                type="number"
                className=" bg-white border border-gray-300"
                value={formData.minStock}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, minStock: e.target.value }))
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              className=" bg-white border border-gray-300"
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          <div>
            <Label>Product Images</Label>
            <div className="mt-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-600" />
                <div className="mt-4">
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Click here to upload inventory images
                    </span>
                    {/* <span className="text-xs text-gray-700">
                      Images will be uploaded to Cloudinary
                    </span> */}
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

              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <Card key={index} className="relative">
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
                          className="absolute -top-2 -right-2 h-6 w-6 p-0"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600"
              disabled={uploading}
            >
              {uploading ? "Adding Product..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useInventory } from "@/components/inventory/InventoryProvider";

export function AddBrandModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { addBrandsItem } = useInventory(); // 🔹 from provider

  // Handle image selection
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !image) {
      toast({
        title: "Missing Fields",
        description: "Please provide a name and an image.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(image);
      if (!imageUrl) throw new Error("Image upload failed");

      // Save to Firebase using provider
      await addBrandsItem({
        name: formData.name,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Brand Added",
        description: `${formData.name} has been successfully added.`,
      });

      onClose();
      setFormData({ name: "" });
      setImage(null);
      setPreview("");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to add brand. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Brand Name */}
          <div>
            <Label htmlFor="name">Brand Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          {/* Brand Image */}
          <div>
            <Label>Brand Image</Label>
            <div className="mt-2">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-600" />
                <div className="mt-4">
                  <label htmlFor="image" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload brand image
                    </span>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {preview && (
                <div className="mt-4 grid grid-cols-1 gap-4">
                  <Card className="relative">
                    <CardContent className="p-2">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0"
                        onClick={removeImage}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
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
              {uploading ? "Adding Brand..." : "Add Brand"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

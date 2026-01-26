import React, { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { useBlog } from "./auth/BlogProvider";
import { Loader2, Upload, X, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

const BRAND = "#948179";

export default function BlogForm({ editingBlog, onSave, onCancel }) {
  const { uploadFile } = useBlog();
  const [uploading, setUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    title: editingBlog?.title || "",
    description: editingBlog?.description || "",
    category: editingBlog?.category || "",
    author: editingBlog?.author || "",
    content: editingBlog?.content || "",
    images: editingBlog?.images || [],
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert("Please fill in title and description");
      return;
    }

    setUploading(true);
    try {
      const uploadedImages = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const url = await uploadFile(imageFiles[i]);
        uploadedImages.push(url);
      }

      const allImages = [...formData.images, ...uploadedImages];
      const blogData = {
        ...formData,
        images: allImages,
        image: allImages[0] || "",
        date: new Date().toISOString().split("T")[0],
      };

      await onSave(blogData);
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to save blog");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfaf8]">
      {/* Top navigation bar */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={onCancel}
            disabled={uploading}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4" style={{ color: BRAND }} />
            Back
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[12px] tracking-[0.18em] uppercase" style={{ color: BRAND }}>
            {editingBlog ? "Edit Post" : "Create Post"}
          </p>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/80 backdrop-blur border border-slate-200 rounded-none overflow-hidden"
        >
          {/* Card Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-white/70">
            <div className="flex items-center justify-between">
              <p className="text-sm tracking-[0.18em] uppercase font-bold text-slate-700">
                Post Details
              </p>
              <span className="text-[11px] tracking-[0.18em] uppercase text-slate-400">
                Required Fields *
              </span>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs tracking-wide uppercase font-semibold text-slate-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full h-11 px-4 border border-slate-200 rounded-none bg-white focus:outline-none focus:border-slate-400 disabled:opacity-50"
                placeholder="Post title"
                disabled={uploading}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs tracking-wide uppercase font-semibold text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-200 rounded-none bg-white focus:outline-none focus:border-slate-400 disabled:opacity-50 resize-none"
                rows="3"
                placeholder="Short description"
                disabled={uploading}
              />
            </div>

            {/* Category & Author */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-wide uppercase font-semibold text-slate-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full h-11 px-4 border border-slate-200 rounded-none bg-white focus:outline-none focus:border-slate-400 disabled:opacity-50"
                  placeholder="e.g., Education"
                  disabled={uploading}
                />
              </div>
              <div>
                <label className="block text-xs tracking-wide uppercase font-semibold text-slate-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full h-11 px-4 border border-slate-200 rounded-none bg-white focus:outline-none focus:border-slate-400 disabled:opacity-50"
                  placeholder="Author name"
                  disabled={uploading}
                />
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <label className="block text-xs tracking-wide uppercase font-semibold text-slate-700 mb-2">
                Content
              </label>
              <div className="border border-slate-200 rounded-none">
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) =>
                    setFormData({ ...formData, content: value })
                  }
                  disabled={uploading}
                />
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-xs tracking-wide uppercase font-semibold text-slate-700 mb-2">
                Blog Images
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2 h-11 px-4 border border-slate-200 rounded-none bg-white hover:bg-slate-50 transition disabled:opacity-50">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploading}
                />
                <Upload className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Upload Images</span>
              </label>

              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-32 h-32 object-cover border border-slate-200 rounded-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition disabled:opacity-50"
                        disabled={uploading}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <Button
                onClick={handleSave}
                className="flex-1 h-11 rounded-none text-white font-semibold tracking-wide hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: BRAND }}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Post"
                )}
              </Button>
              <Button 
                onClick={onCancel} 
                variant="outline" 
                className="flex-1 h-11 rounded-none border-slate-200 bg-white hover:border-slate-300"
                disabled={uploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
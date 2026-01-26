import React, { useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { useBlog } from "./auth/BlogProvider";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "./ui/button";

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
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={onCancel}
          className="mb-6 p-2 text-gray-600 hover:text-gray-900"
          disabled={uploading}
        >
          ← Back
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            {editingBlog ? "Edit Blog Post" : "Create Blog Post"}
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b6f99]"
                placeholder="Post title"
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b6f99]"
                rows="3"
                placeholder="Short description"
                disabled={uploading}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b6f99]"
                  placeholder="e.g., Education"
                  disabled={uploading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2b6f99]"
                  placeholder="Author name"
                  disabled={uploading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Content
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) =>
                  setFormData({ ...formData, content: value })
                }
                disabled={uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Blog Images
              </label>
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={uploading}
                />
                <Upload className="w-4 h-4" />
                Upload Images
              </label>

              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        disabled={uploading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-[#2b6f99] to-[#2b6f99] text-white"
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
              <Button onClick={onCancel} variant="outline" disabled={uploading}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

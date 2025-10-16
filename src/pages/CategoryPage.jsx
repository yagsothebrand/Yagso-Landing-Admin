"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Tag, Trash2, ImageIcon, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Image, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { useProducts } from "@/components/products/ProductsProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { ImageViewerModal } from "./ImageViewerModal";
import { AddCategoryDrawer } from "./AddCategoryDrawer";
import Layout from "@/components/layout/Layout";

export function CategoryPage() {
  const { categories, loading, deleteCategory } = useProducts();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ url: "", title: "" });

  const canManageCategories =
    user?.role === "CEO" || user?.role === "General Manager";

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDelete = async (categoryId) => {
    if (!canManageCategories) return;
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const totalCategories = categories.length;
  const categoriesWithImages = categories.filter((cat) => cat.image).length;
  const categoriesWithoutImages = categories.filter((cat) => !cat.image).length;

  // Get unique authorized users count (if applicable)
  const uniqueContributors = new Set(
    categories
      .filter((cat) => cat.authorizedByName)
      .map((cat) => cat.authorizedByName)
  ).size;

  const handleImageView = (imageUrl, categoryName) => {
    setSelectedImage({ url: imageUrl, title: categoryName });
    setImageViewerOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-3"
      >
        <div className="max-w-7xl mx-auto space-y-6">
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
                  Products
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="font-semibold">
                  Category Management
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-gray-600 mt-1 text-pretty">
                  Organize your products by categories
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canManageCategories && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      onClick={() => setIsAddDrawerOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-purple-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        Total Categories
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-purple-600">
                        {totalCategories}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-2 sm:p-3 rounded-full">
                      <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Categories with Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-green-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-green-50 to-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">With Images</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-600">
                        {categoriesWithImages}
                      </p>
                    </div>
                    <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                      <Image className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Categories without Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
            >
              <Card className="border-orange-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-orange-50 to-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">
                        Without Images
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-orange-600">
                        {categoriesWithoutImages}
                      </p>
                    </div>
                    <div className="bg-orange-100 p-2 sm:p-3 rounded-full">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contributors (if applicable) */}
            {(user?.role === "CEO" || user?.role === "General Manager") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <Card className="border-blue-200 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-blue-50 to-white">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">
                          Contributors
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-blue-600">
                          {uniqueContributors}
                        </p>
                      </div>
                      <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 space-y-4"
          >
            <div className="relative group w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 w-5 h-5" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 ease-in-out shadow-sm hover:bg-white hover:shadow-md"
              />
            </div>

            {searchTerm && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    Showing {filteredCategories.length} of {categories.length}{" "}
                    categories
                  </span>
                </div>
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-500 text-sm"
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear Search
                </Button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 bg-white border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-blue-600" />
                        {category.name}
                      </CardTitle>
                      {canManageCategories && (
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-red-100 text-red-600"
                            onClick={() => handleDelete(category.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors group"
                      onClick={() =>
                        category.image &&
                        handleImageView(category.image, category.name)
                      }
                    >
                      {category.image ? (
                        <div className="relative w-full h-full">
                          <img
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                            <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </div>
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>

                    {category.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    {category.authorizedByName &&
                      (user?.role === "CEO" ||
                        user?.role === "General Manager") && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {category.authorizedByName}
                        </p>
                      )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredCategories.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? "No categories found matching your search."
                  : "No categories available. Add your first category!"}
              </p>
            </motion.div>
          )}
        </div>

        {canManageCategories && (
          <AddCategoryDrawer
            isOpen={isAddDrawerOpen}
            onClose={() => setIsAddDrawerOpen(false)}
          />
        )}

        <ImageViewerModal
          isOpen={imageViewerOpen}
          onClose={() => setImageViewerOpen(false)}
          imageUrl={selectedImage.url}
          title={selectedImage.title}
        />
      </motion.div>
    </Layout>
  );
}

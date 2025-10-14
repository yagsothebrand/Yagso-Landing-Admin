"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Calendar,
  User,
  Search,
  Package,
  ShoppingCart,
  Trash2,
  Building2,
  Tag,
  ImageIcon,
  Save,
  CheckCircle,
  Shield,
  Edit3,
  Filter,
  SlidersHorizontal,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  generateUserId,
  generateInvoiceNumber,
  validateEmail,
  calculateInvoiceTotal,
  getTodayDate,
} from "@/lib/invoice-utils";
import { cn } from "@/lib/utils";
import { useInventory } from "@/components/inventory/InventoryProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import { ActiveFilters } from "./ActiveFilters";

export function CreateInvoiceDrawer({
  isOpen,
  onClose,
  onCreateInvoice,
  editingInvoice = null,
}) {
  const [formData, setFormData] = useState({
    customerId: generateUserId(),
    customerEmail: "",
    dueDate: getTodayDate(),
    description: "",
    products: [],
    paymentStatus: "unpaid",
  });

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showProductSearch, setShowProductSearch] = useState(false);
  const { inventory, brands, categories } = useInventory();
  const { user } = useAuth();
  const [extensionNumber, setExtensionNumber] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pin, setPin] = useState(["", "", "", ""]);

  const [statusFilters, setStatusFilters] = useState([]);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const [brandFilters, setBrandFilters] = useState([]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const [tempStatusFilters, setTempStatusFilters] = useState([]);
  const [tempCategoryFilters, setTempCategoryFilters] = useState([]);
  const [tempBrandFilters, setTempBrandFilters] = useState([]);

  const openFilterDrawer = () => {
    setTempStatusFilters([...statusFilters]);
    setTempCategoryFilters([...categoryFilters]);
    setTempBrandFilters([...brandFilters]);
    setFilterDrawerOpen(true);
  };

  const toggleTempFilter = (value, filterType) => {
    if (filterType === "status") {
      setTempStatusFilters((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    } else if (filterType === "category") {
      setTempCategoryFilters((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    } else if (filterType === "brand") {
      setTempBrandFilters((prev) =>
        prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value]
      );
    }
  };

  const applyFilters = () => {
    setStatusFilters(tempStatusFilters);
    setCategoryFilters(tempCategoryFilters);
    setBrandFilters(tempBrandFilters);
    setFilterDrawerOpen(false);
  };

  const clearFilter = (type, value) => {
    if (type === "status") {
      setStatusFilters((prev) => prev.filter((f) => f !== value));
    } else if (type === "category") {
      setCategoryFilters((prev) => prev.filter((f) => f !== value));
    } else if (type === "brand") {
      setBrandFilters((prev) => prev.filter((f) => f !== value));
    } else if (type === "search") {
      setSearchTerm("");
    } else if (type === "all") {
      setStatusFilters([]);
      setCategoryFilters([]);
      setBrandFilters([]);
      setSearchTerm("");
    }
  };

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      setExtensionNumber(newPin.join(""));

      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  useEffect(() => {
    if (editingInvoice) {
      setFormData({
        customerId: editingInvoice.customerId,
        customerEmail: editingInvoice.customerEmail || "",
        dueDate: editingInvoice.dueDate,
        description: editingInvoice.description || "",
        products: editingInvoice.products || [],
        paymentStatus: editingInvoice.status,
      });
    } else {
      setFormData({
        customerId: generateUserId(),
        customerEmail: "",
        dueDate: getTodayDate(),
        description: "",
        products: [],
        paymentStatus: "unpaid",
      });
    }
    setErrors({});
    setSearchTerm("");
    setStatusFilters([]);
    setCategoryFilters([]);
    setBrandFilters([]);
  }, [editingInvoice, isOpen]);

  const filteredInventory = inventory.filter((item) => {
    const matchesStatus =
      statusFilters.length === 0 || statusFilters.includes(item.status);
    const matchesCategory =
      categoryFilters.length === 0 ||
      categoryFilters.includes(item.category?.toLowerCase());

    const matchesSearch =
      !searchTerm ||
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand =
      brandFilters.length === 0 ||
      brandFilters.includes(item.brand?.toLowerCase());

    return matchesSearch && matchesStatus && matchesBrand && matchesCategory;
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addProductToInvoice = (product) => {
    const existingProduct = formData.products.find((p) => p.id === product.id);

    if (existingProduct) {
      if (existingProduct.quantity >= product.stock) {
        alert(`Cannot add more. Only ${product.stock} in stock.`);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        products: prev.products.map((p) =>
          p.id === product.id
            ? { ...p, quantity: Math.min(p.quantity + 1, product.stock) }
            : p
        ),
      }));
    } else {
      if (product.stock <= 0) {
        alert(`"${product.name}" is out of stock.`);
        return;
      }
      setFormData((prev) => ({
        ...prev,
        products: [
          ...prev.products,
          {
            id: product.id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            quantity: 1,
            image: product.images?.[0] || null,
            description: product.description,
            stock: product.stock,
          },
        ],
      }));
    }
  };

  const updateProductQuantity = (productId, quantity) => {
    const productInInvoice = formData.products.find((p) => p.id === productId);
    if (!productInInvoice) return;

    if (quantity > productInInvoice.stock) {
      alert(`Only ${productInInvoice.stock} available in stock.`);
      quantity = productInInvoice.stock;
    }

    if (quantity <= 0) {
      removeProductFromInvoice(productId);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.id === productId ? { ...p, quantity: Number.parseInt(quantity) } : p
      ),
    }));
  };

  const removeProductFromInvoice = (productId) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    if (formData.products.length === 0) {
      newErrors.products = "At least one product is required";
    }

    if (formData.customerEmail && !validateEmail(formData.customerEmail)) {
      newErrors.customerEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuthSubmit = (action) => {
    setPendingAction(action);

    if (pendingAction === "create") {
      handleCreateInvoice();
    } else if (pendingAction === "draft") {
      handleCreateInvoice();
    }
  };

  const StatusBadge = ({ status }) => {
    switch (status) {
      case "in-stock":
        return (
          <Badge className="bg-green-100 text-green-700 border-0">
            In Stock
          </Badge>
        );
      case "low-stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-0">
            Low Stock
          </Badge>
        );
      case "out-of-stock":
        return (
          <Badge className="bg-red-100 text-red-700 border-0">
            Out of Stock
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleCreateInvoice = () => {
    if (validateForm()) {
      const totalAmount = calculateInvoiceTotal(formData.products);

      const newInvoice = {
        id: editingInvoice ? editingInvoice.id : generateInvoiceNumber(),
        customerId: formData.customerId,
        customerEmail: formData.customerEmail || null,
        amount: totalAmount,
        amountDue: totalAmount,
        dueDate: formData.dueDate,
        description:
          formData.description || "Invoice for products and services",
        products: formData.products,
        status: formData.paymentStatus,
        createdAt: editingInvoice
          ? editingInvoice.createdAt
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        authorizedByName: user?.firstName + "  " + user?.lastName,
        authorizedBy: user?.email,
        extensionNumber: user?.extensionId || extensionNumber,
        firebaseId: editingInvoice?.firebaseId || null,
      };

      onCreateInvoice(newInvoice);

      resetForm();
    }
  };

  const resetForm = () => {
    if (editingInvoice) {
      setFormData({
        customerId: editingInvoice.customerId,
        customerEmail: editingInvoice.customerEmail || "",
        dueDate: editingInvoice.dueDate,
        description: editingInvoice.description || "",
        products: editingInvoice.products || [],
        paymentStatus: editingInvoice.status,
      });
    } else {
      setFormData({
        customerId: generateUserId(),
        customerEmail: "",
        dueDate: getTodayDate(),
        description: "",
        products: [],
        paymentStatus: "unpaid",
      });
    }

    setErrors({});
    setShowProductSearch(false);
    onClose();
  };

  const generateNewCustomerId = () => {
    setFormData((prev) => ({ ...prev, customerId: generateUserId() }));
  };

  const totalAmount = calculateInvoiceTotal(formData.products);
  const activeFilterCount =
    statusFilters.length + categoryFilters.length + brandFilters.length;

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="bg-white max-w-6xl mx-auto max-h-[95vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="p-6 overflow-y-auto"
          >
            <DrawerHeader className="px-0 pb-6">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-2xl font-bold text-primary flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 90, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 3,
                    }}
                  >
                    {editingInvoice ? (
                      <Edit3 className="w-8 h-8 text-blue-600" />
                    ) : (
                      <Plus className="w-8 h-8 text-blue-600" />
                    )}
                  </motion.div>
                  {editingInvoice ? "Edit Invoice" : "Create New Invoice"}
                </DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>

            <div className="space-y-6">
              {/* Customer Information */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Customer Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="customerId"
                      className="text-base font-medium"
                    >
                      Customer ID *
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="customerId"
                        value={formData.customerId}
                        readOnly
                        className="flex-1 bg-white border-blue-200"
                      />
                      {!editingInvoice && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={generateNewCustomerId}
                          className="px-4 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                        >
                          Generate
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="customerEmail"
                      className="text-base font-medium"
                    >
                      Customer Email (Optional)
                    </Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      placeholder="customer@example.com"
                      value={formData.customerEmail}
                      onChange={(e) =>
                        handleInputChange("customerEmail", e.target.value)
                      }
                      className={`border-blue-200 focus:border-blue-500 ${
                        errors.customerEmail ? "border-red-500" : ""
                      }`}
                    />
                    {errors.customerEmail && (
                      <p className="text-sm text-red-600">
                        {errors.customerEmail}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Product Search Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Invoice Items
                  </h3>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowProductSearch(!showProductSearch)}
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Search className="w-4 h-4 mr-2" />
                      {showProductSearch ? "Hide" : "Add"} Products
                    </Button>
                  </motion.div>
                </div>

                {errors.products && (
                  <p className="text-sm text-red-600">{errors.products}</p>
                )}

                <AnimatePresence>
                  {showProductSearch && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-xl border border-blue-200 space-y-4"
                    >
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            placeholder="Search products by name, SKU, brand, category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white border-gray-300 focus:border-blue-500"
                          />
                        </div>

                        <Button
                          variant="outline"
                          onClick={openFilterDrawer}
                          className="gap-2 bg-white relative"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                          Filters
                          {activeFilterCount > 0 && (
                            <Badge className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-600 text-white text-xs">
                              {activeFilterCount}
                            </Badge>
                          )}
                        </Button>
                      </div>

                      {/* Active Filters */}
                      <ActiveFilters
                        statusFilters={statusFilters}
                        categoryFilters={categoryFilters}
                        brandFilters={brandFilters}
                        searchTerm={searchTerm}
                        clearFilter={clearFilter}
                      />

                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto p-2">
                        {" "}
                        {filteredInventory.map((product) => (
                          <motion.div
                            key={product.id}
                            whileHover={{ scale: 1.03, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => addProductToInvoice(product)}
                            className="bg-white rounded-lg border border-gray-200 hover:border-blue-400 hover:shadow-lg cursor-pointer transition-all duration-200 overflow-hidden group"
                          >
                            {/* Product Image */}
                            <div className="relative aspect-square bg-gray-100">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageIcon className="w-8 h-8 text-gray-300" />
                                </div>
                              )}
                              {/* Status Badge Overlay */}
                              <div className="absolute top-2 right-2">
                                <StatusBadge status={product.status} />
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-2 space-y-1">
                              <h4 className="font-semibold text-xs truncate text-gray-900">
                                {product.name}
                              </h4>
                              <h6 className="text-[10px] text-gray-500 truncate">
                                {product.brand}
                              </h6>
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] font-bold text-blue-600">
                                  ₦{product.price.toLocaleString()}
                                </span>
                                <span className="text-[10px] font-bold text-red-500">
                                  Stock: {product.stock}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {filteredInventory.length === 0 && (
                        <div className="text-center py-12">
                          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">
                            No products found
                          </p>
                          <p className="text-sm text-gray-400">
                            Try adjusting your filters or search term
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Selected Products */}
                {formData.products.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border rounded-xl overflow-hidden shadow-sm"
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                        Selected Items ({formData.products.length})
                      </h4>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {formData.products.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                        >
                          {product.image ? (
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}

                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-900 text-lg">
                              {product.name}
                            </h5>
                            <p className="text-sm text-gray-600 mb-2">
                              {product.description}
                            </p>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="text-xs">
                                <Building2 className="w-3 h-3 mr-1" />
                                {product.brand}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Tag className="w-3 h-3 mr-1" />
                                {product.category}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-sm text-gray-600">
                                Unit Price
                              </p>
                              <p className="font-bold text-lg">
                                ₦{product.price.toLocaleString()}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor={`qty-${product.id}`}
                                className="text-sm font-medium"
                              >
                                Qty:
                              </Label>

                              <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateProductQuantity(
                                      product.id,
                                      Math.max(1, product.quantity - 1)
                                    )
                                  }
                                  className="px-3 py-1 text-lg font-bold hover:bg-gray-100"
                                >
                                  −
                                </button>

                                <input
                                  id={`qty-${product.id}`}
                                  type="number"
                                  min="1"
                                  value={product.quantity}
                                  onChange={(e) =>
                                    updateProductQuantity(
                                      product.id,
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-14 text-center border-x border-blue-200"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateProductQuantity(
                                      product.id,
                                      product.quantity + 1
                                    )
                                  }
                                  className="px-3 py-1 text-lg font-bold hover:bg-gray-100"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-600">Total</p>
                              <p className="font-bold text-xl text-blue-600">
                                ₦
                                {(
                                  product.price * product.quantity
                                ).toLocaleString()}
                              </p>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeProductFromInvoice(product.id)
                              }
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Total Amount:
                        </span>
                        <span className="text-3xl font-bold text-blue-600">
                          ₦{totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Due Date and Description */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="dueDate"
                    className="text-base font-medium flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-blue-600" />
                    Due Date *
                  </Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      handleInputChange("dueDate", e.target.value)
                    }
                    className={cn(
                      "border-blue-200 focus:border-blue-500",
                      errors.dueDate && "border-red-500"
                    )}
                  />

                  {errors.dueDate && (
                    <p className="text-sm text-red-600">{errors.dueDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="paymentStatus"
                    className="text-base font-medium flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    Payment Status *
                  </Label>

                  <RadioGroup
                    value={formData.paymentStatus}
                    onValueChange={(value) =>
                      handleInputChange("paymentStatus", value)
                    }
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    {/* Unpaid */}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unpaid" id="unpaid" />
                      <Label
                        htmlFor="unpaid"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        Not Paid
                      </Label>
                    </div>

                    {/* Paid */}
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paid" id="paid" />
                      <Label
                        htmlFor="paid"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Paid
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-base font-medium"
                  >
                    Description (Optional)
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Additional notes or description..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="border-blue-200 focus:border-blue-500"
                    rows={3}
                  />
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="w-full sm:flex-1 border-gray-300 hover:bg-gray-50 bg-transparent text-sm sm:text-base py-2 sm:py-2.5"
                >
                  Cancel
                </Button>

                {!editingInvoice && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:flex-1"
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAuthSubmit("draft")}
                      disabled={formData.paymentStatus === "paid"}
                      className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent disabled:opacity-50 text-sm sm:text-base py-2 sm:py-2.5"
                    >
                      <Save className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                      <span className="truncate">Save as Draft</span>
                      {formData.paymentStatus === "paid" && (
                        <span className="text-xs ml-1 sm:ml-2 hidden md:inline">
                          (Paid invoices cannot be drafts)
                        </span>
                      )}
                    </Button>
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:flex-1"
                >
                  <Button
                    type="button"
                    onClick={() => handleAuthSubmit("create")}
                    disabled={formData.paymentStatus === "unpaid"}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base py-2 sm:py-2.5"
                  >
                    <CheckCircle className="w-4 h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                    <span className="truncate">
                      {editingInvoice
                        ? "Update Invoice"
                        : `Create Invoice (₦${totalAmount.toLocaleString()})`}
                    </span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </DrawerContent>
      </Drawer>

      <Drawer open={filterDrawerOpen} onOpenChange={setFilterDrawerOpen}>
        <DrawerContent className="max-w-md mx-auto max-h-[85vh] bg-white">
          <DrawerHeader className="border-b">
            <DrawerTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter Products
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-6 space-y-6 overflow-y-auto">
            {/* Status Filters */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-900">
                Stock Status
              </h4>
              <div className="space-y-2">
                {[
                  {
                    value: "in-stock",
                    label: "In Stock",
                    color: "bg-green-500",
                  },
                  {
                    value: "low-stock",
                    label: "Low Stock",
                    color: "bg-yellow-500",
                  },
                  {
                    value: "out-of-stock",
                    label: "Out of Stock",
                    color: "bg-red-500",
                  },
                ].map((status) => (
                  <label
                    key={status.value}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-2",
                      tempStatusFilters.includes(status.value)
                        ? "bg-blue-50 border-blue-500"
                        : "hover:bg-gray-50 border-gray-200"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={tempStatusFilters.includes(status.value)}
                      onChange={() => toggleTempFilter(status.value, "status")}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className={`w-3 h-3 rounded-full ${status.color}`} />
                    <span className="text-sm font-medium">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filters */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-900">
                Categories
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors border-2",
                      tempCategoryFilters.includes(category.name.toLowerCase())
                        ? "bg-purple-50 border-purple-500"
                        : "hover:bg-gray-50 border-gray-200"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={tempCategoryFilters.includes(
                        category.name.toLowerCase()
                      )}
                      onChange={() =>
                        toggleTempFilter(
                          category.name.toLowerCase(),
                          "category"
                        )
                      }
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    {category.image && (
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
                    <span className="text-sm font-medium truncate">
                      {category.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Filters */}
            <div>
              <h4 className="font-semibold text-sm mb-3 text-gray-900">
                Brands
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {brands.map((brand) => (
                  <label
                    key={brand.id}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors border-2",
                      tempBrandFilters.includes(brand.name.toLowerCase())
                        ? "bg-orange-50 border-orange-500"
                        : "hover:bg-gray-50 border-gray-200"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={tempBrandFilters.includes(
                        brand.name.toLowerCase()
                      )}
                      onChange={() =>
                        toggleTempFilter(brand.name.toLowerCase(), "brand")
                      }
                      className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    {brand.image && (
                      <img
                        src={brand.image || "/placeholder.svg"}
                        alt={brand.name}
                        className="w-8 h-8 object-contain rounded"
                      />
                    )}
                    <span className="text-sm font-medium truncate">
                      {brand.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Apply Filter Button */}
          <div className="border-t p-4 bg-gray-50 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setTempStatusFilters([]);
                setTempCategoryFilters([]);
                setTempBrandFilters([]);
              }}
              className="flex-1"
            >
              Clear All
            </Button>
            <Button
              onClick={applyFilters}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Authorization Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-xl max-w-md w-full mx-4"
            >
              <div className="text-center mb-6">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Authorization Required
                </h3>
                <p className="text-gray-600">
                  Hello {user?.name || user?.email}, please enter your extension
                  number to authorize this action.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2 justify-center">
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      id={`pin-${index}`}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      className="w-12 h-12 text-center border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAuthModal(false);
                      setExtensionNumber("");
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAuthSubmit}
                    disabled={!extensionNumber}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Authorize
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

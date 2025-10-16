import React, { useEffect, useState, createContext, useContext } from "react";
import PropTypes from "prop-types";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); // 🔥 for admin list
  const [brands, setBrands] = useState([]); // 🔥 for admin list
  const [tableLoading, setTableLoading] = useState(false);

  const [categories, setCategories] = useState([]); // 🔥 for admin list

  const db = getFirestore();

  // ✅ Fetch all products items
  const getProducts = async () => {
    setTableLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(productsList);
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
      setTableLoading(false);
    }
  };

  const getBrands = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "brands"));
      const brandList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(brandList);
      setBrands(brandList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };
  const addBrandsItem = async (newItem, user) => {
    try {
      setLoading(true);
      const docRef = doc(collection(db, "brands"));
      const itemWithTimestamp = {
        ...newItem,
        id: docRef.id,
        authorizedByName: user?.firstName + " " + user?.lastName,
        authorizedBy: user?.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, itemWithTimestamp);
      await getBrands(); // refresh list
      setLoading(false);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding brands item:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };
  const getCategories = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "category"));
      const categoriesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCategories(categoriesList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };
  const addCategoriesItem = async (newItem, user) => {
    try {
      // setLoading(true);
      const docRef = doc(collection(db, "category"));
      const itemWithTimestamp = {
        ...newItem,
        id: docRef.id,
        authorizedByName: user?.firstName + " " + user?.lastName,
        authorizedBy: user?.email,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, itemWithTimestamp);
      await getCategories(); // refresh list
      // setLoading(false);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding category item:", error);
      // setLoading(false);
      return { success: false, error: error.message };
    }
  };
  // ✅ Add new products item
  const addProductsItem = async (newItem) => {
    try {
      setLoading(true);
      const docRef = doc(collection(db, "products"));
      const itemWithTimestamp = {
        ...newItem,
        id: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, itemWithTimestamp);
      await getProducts(); // refresh list
      setLoading(false);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding products item:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // ✅ Update products item
  const updateProductsItem = async (itemId, updatedData) => {
    try {
      setLoading(true);
      const itemRef = doc(db, "products", itemId);
      const updateData = {
        ...updatedData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(itemRef, updateData);
      await getProducts(); // refresh list
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error updating products item:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // ✅ Delete products item
  const deleteProductsItem = async (itemId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "products", itemId));
      await getProducts(); // refresh list
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error deleting products item:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };
  const deleteCategory = async (itemId) => {
    try {
      // setLoading(true);
      await deleteDoc(doc(db, "category", itemId));
      await getCategories(); // refresh list
      // setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error deleting category item:", error);
      // setLoading(false);
      return { success: false, error: error.message };
    }
  };
  const deleteBrand = async (itemId) => {
    console.log(itemId);
    try {
      // setLoading(true);
      await deleteDoc(doc(db, "brands", itemId));
      await getBrands(); // refresh list
      // setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error deleting brand item:", error);
      // setLoading(false);
      return { success: false, error: error.message };
    }
  };
  // ✅ Get single products item
  const getProductsItem = async (itemId) => {
    try {
      const docRef = doc(db, "products", itemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          success: true,
          data: { id: docSnap.id, ...docSnap.data() },
        };
      } else {
        return { success: false, error: "Item not found" };
      }
    } catch (error) {
      console.error("Error fetching products item:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Bulk update products items
  const bulkUpdateProducts = async (items) => {
    try {
      setLoading(true);
      const { writeBatch } = await import("firebase/firestore");
      const batch = writeBatch(db);

      items.forEach((item) => {
        const itemRef = doc(db, "products", item.id);
        batch.update(itemRef, {
          ...item,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      await getProducts(); // refresh list
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error bulk updating products:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // ✅ Status helper function (can be used in components)
  const calculateItemStatus = (stock, minStock = 5) => {
    const stockNum = Number(stock) || 0;
    const minStockNum = Number(minStock) || 5;

    if (stockNum === 0) return "out-of-stock";
    if (stockNum <= minStockNum) return "low-stock";
    return "in-stock";
  };

  // ✅ Get products statistics
  const getProductsStats = () => {
    if (!products || !Array.isArray(products)) {
      return {
        total: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
      };
    }

    const stats = {
      total: products.length,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
    };

    products.forEach((item) => {
      const status = calculateItemStatus(item.stock, item.minStock);
      switch (status) {
        case "in-stock":
          stats.inStock++;
          break;
        case "low-stock":
          stats.lowStock++;
          break;
        case "out-of-stock":
          stats.outOfStock++;
          break;
      }
    });

    return stats;
  };
  const reduceStock = async (products) => {
    try {
      const updatedProducts = [...products];

      for (const item of products) {
        const idx = updatedProducts.findIndex((i) => i.id === item.id);
        if (idx !== -1) {
          const currentStock = updatedProducts[idx].stock || 0;
          const minStock = updatedProducts[idx].minStock || 0; // default 0 if missing
          const newStock = Math.max(currentStock - (item.quantity || 0), 0);

          updatedProducts[idx].stock = newStock;

          // 🔹 Determine status using minStock
          if (newStock === 0) {
            updatedProducts[idx].status = "out-of-stock";
          } else if (newStock <= minStock) {
            updatedProducts[idx].status = "low-stock";
          } else {
            updatedProducts[idx].status = "in-stock";
          }

          // 🔥 update Firebase
          const productRef = doc(db, "products", item.id);
          await updateDoc(productRef, {
            stock: newStock,
            status: updatedProducts[idx].status,
          });
        }
      }

      // update local state
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error reducing stock:", error);
    }
  };

  // ✅ Get low stock items (for notifications)
  const getLowStockItems = () => {
    if (!products || !Array.isArray(products)) return [];

    return products.filter((item) => {
      const status = calculateItemStatus(item.stock, item.minStock);
      return status === "low-stock" || status === "out-of-stock";
    });
  };

  // ✅ Search products items
  const searchProducts = (query, category = "all", status = "all") => {
    if (!products || !Array.isArray(products)) return [];

    return products.filter((item) => {
      const matchesQuery =
        !query ||
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.sku?.toLowerCase().includes(query.toLowerCase()) ||
        item.brands?.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        category === "all" ||
        item.category?.toLowerCase() === category.toLowerCase();

      const itemStatus = calculateItemStatus(item.stock, item.minStock);
      const matchesStatus = status === "all" || itemStatus === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  };

  useEffect(() => {
    getProducts();
    getBrands();
    getCategories();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        addBrandsItem,
        addCategoriesItem,
        brands,
        getBrands,
        getProducts,
        addProductsItem,
        updateProductsItem,
        deleteProductsItem,
        getProductsItem,
        bulkUpdateProducts,
        calculateItemStatus,
        getProductsStats,
        reduceStock,
        deleteCategory,
        deleteBrand,
        getCategories,
        categories,
        getLowStockItems,
        searchProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within an Products Provider");
  }
  return context;
};

ProductsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

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

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [inventory, setInventory] = useState([]); // 🔥 for admin list
  const [brands, setBrands] = useState([]); // 🔥 for admin list
 const [tableLoading, setTableLoading] = useState(false)

  const [categories, setCategories] = useState([]); // 🔥 for admin list

  const db = getFirestore();

  // ✅ Fetch all inventory items
  const getInventory = async () => {
    setTableLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, "inventory"));
      const inventoryList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(inventoryList);
      setInventory(inventoryList);
   
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setTableLoading(false)
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
      console.error("Error fetching inventory:", error);
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
      console.error("Error fetching inventory:", error);
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
  // ✅ Add new inventory item
  const addInventoryItem = async (newItem) => {
    try {
      setLoading(true);
      const docRef = doc(collection(db, "inventory"));
      const itemWithTimestamp = {
        ...newItem,
        id: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, itemWithTimestamp);
      await getInventory(); // refresh list
      setLoading(false);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding inventory item:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // ✅ Update inventory item
  const updateInventoryItem = async (itemId, updatedData) => {
    try {
      setLoading(true);
      const itemRef = doc(db, "inventory", itemId);
      const updateData = {
        ...updatedData,
        updatedAt: serverTimestamp(),
      };

      await updateDoc(itemRef, updateData);
      await getInventory(); // refresh list
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error updating inventory item:", error);
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  // ✅ Delete inventory item
  const deleteInventoryItem = async (itemId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "inventory", itemId));
      await getInventory(); // refresh list
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error deleting inventory item:", error);
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
  // ✅ Get single inventory item
  const getInventoryItem = async (itemId) => {
    try {
      const docRef = doc(db, "inventory", itemId);
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
      console.error("Error fetching inventory item:", error);
      return { success: false, error: error.message };
    }
  };

  // ✅ Bulk update inventory items
  const bulkUpdateInventory = async (items) => {
    try {
      setLoading(true);
      const { writeBatch } = await import("firebase/firestore");
      const batch = writeBatch(db);

      items.forEach((item) => {
        const itemRef = doc(db, "inventory", item.id);
        batch.update(itemRef, {
          ...item,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      await getInventory(); // refresh list
      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error("Error bulk updating inventory:", error);
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

  // ✅ Get inventory statistics
  const getInventoryStats = () => {
    if (!inventory || !Array.isArray(inventory)) {
      return {
        total: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
      };
    }

    const stats = {
      total: inventory.length,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
    };

    inventory.forEach((item) => {
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
      const updatedInventory = [...inventory];

      for (const item of products) {
        const idx = updatedInventory.findIndex((i) => i.id === item.id);
        if (idx !== -1) {
          const currentStock = updatedInventory[idx].stock || 0;
          const minStock = updatedInventory[idx].minStock || 0; // default 0 if missing
          const newStock = Math.max(currentStock - (item.quantity || 0), 0);

          updatedInventory[idx].stock = newStock;

          // 🔹 Determine status using minStock
          if (newStock === 0) {
            updatedInventory[idx].status = "out-of-stock";
          } else if (newStock <= minStock) {
            updatedInventory[idx].status = "low-stock";
          } else {
            updatedInventory[idx].status = "in-stock";
          }

          // 🔥 update Firebase
          const productRef = doc(db, "inventory", item.id);
          await updateDoc(productRef, {
            stock: newStock,
            status: updatedInventory[idx].status,
          });
        }
      }

      // update local state
      setInventory(updatedInventory);
    } catch (error) {
      console.error("Error reducing stock:", error);
    }
  };

  // ✅ Get low stock items (for notifications)
  const getLowStockItems = () => {
    if (!inventory || !Array.isArray(inventory)) return [];

    return inventory.filter((item) => {
      const status = calculateItemStatus(item.stock, item.minStock);
      return status === "low-stock" || status === "out-of-stock";
    });
  };

  // ✅ Search inventory items
  const searchInventory = (query, category = "all", status = "all") => {
    if (!inventory || !Array.isArray(inventory)) return [];

    return inventory.filter((item) => {
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
    getInventory();
    getBrands();
    getCategories();
  }, []);

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        loading,
        addBrandsItem,
        addCategoriesItem,
        brands,
        getBrands,
        getInventory,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        getInventoryItem,
        bulkUpdateInventory,
        calculateItemStatus,
        getInventoryStats,
        reduceStock,
        deleteCategory,
        deleteBrand,
        getCategories,
        categories,
        getLowStockItems,
        searchInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an Inventory Provider");
  }
  return context;
};

InventoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

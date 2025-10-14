"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { toast } from "@/hooks/use-toast.jsx";
import { useRef } from "react";

const NotificationContext = createContext(undefined);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const checkedProducts = useRef(new Set());

  const unreadCount = notifications.filter(
    (n) => !n.read && !n.dismissed
  ).length;

  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: `${notification.productId}-${Date.now()}`,
      timestamp: new Date(),
      dismissed: false,
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show toast notification with custom message
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === "out-of-stock" ? "destructive" : "default",
    });
  }, []);

  const showToast = useCallback((message, options = {}) => {
    toast({
      title: options.title || "Notification",
      description: message,
      variant: options.variant || "default",
      duration: options.duration,
    });
  }, []);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, dismissed: true } : notif
      )
    );
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);
  const clearAll = useCallback(() => {
    setNotifications([]);
    // setCheckedProducts(new Set());
  }, []);
  const checkInventoryStock = useCallback(
    (inventory) => {
      if (!inventory || !Array.isArray(inventory)) return;

      inventory.forEach((product) => {
        const productKey = product.id;

        // ✅ Use ref (does not reset on re-render)
        if (checkedProducts.current.has(productKey)) return;

        const existingNotification = notifications.find(
          (n) => n.productId === product.id && !n.dismissed
        );
        if (existingNotification) return;

        const stock = Number(product.stock) || 0;
        const minStock = Number(product.minStock) || 5;

        if (stock === 0) {
          addNotification({
            type: "out-of-stock",
            title: "Out of Stock Alert",
            message: `${product.name} is completely out of stock`,
            productId: product.id,
            productName: product.name,
            stock: 0,
          });
          checkedProducts.current.add(productKey);
        } else if (stock <= minStock) {
          addNotification({
            type: "low-stock",
            title: "Low Stock Alert",
            message: `${product.name} has only ${stock} unit${
              stock !== 1 ? "s" : ""
            } remaining`,
            productId: product.id,
            productName: product.name,
            stock,
          });
          checkedProducts.current.add(productKey);
        }
      });
    },
    [notifications, addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        dismissNotification,
        markAsRead,
        markAllAsRead,
    clearAll,
        checkInventoryStock,
        showToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
}

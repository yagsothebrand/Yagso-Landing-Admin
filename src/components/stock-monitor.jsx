"use client";

import { useEffect } from "react";
import {  useProducts } from "./products/ProductsProvider";
import { useNotifications } from "./notification/NotificationProvider";

export function StockMonitor() {
  const { products } = useProducts();
  const { checkInventoryStock } = useNotifications();

  // useEffect(() => {
  //   if (inventory && inventory.length > 0) {
  //     checkInventoryStock(inventory);
  //   }
  // }, [inventory, checkInventoryStock]);

  return null; // This is a monitoring component with no UI
}

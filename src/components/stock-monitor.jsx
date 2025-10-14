"use client";

import { useEffect } from "react";
import { useInventory } from "./inventory/InventoryProvider";
import { useNotifications } from "./notification/NotificationProvider";

export function StockMonitor() {
  const { inventory } = useInventory();
  const { checkInventoryStock } = useNotifications();

  // useEffect(() => {
  //   if (inventory && inventory.length > 0) {
  //     checkInventoryStock(inventory);
  //   }
  // }, [inventory, checkInventoryStock]);

  return null; // This is a monitoring component with no UI
}

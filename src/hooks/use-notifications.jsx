"use client"

import { useState } from "react"

export function useNotifications() {
  const [notifications, setNotifications] = useState([])

  const checkLowStock = (inventory) => {
    if (!inventory || !Array.isArray(inventory)) return

    const lowStockItems = inventory.filter((item) => item.stock <= (item.minStock || 5) && item.stock > 0)

    const outOfStockItems = inventory.filter((item) => item.stock === 0)

    const newNotifications = [
      ...lowStockItems.map((item) => ({
        id: `low-${item.id}`,
        type: "warning",
        message: `${item.name} is running low on stock (${item.stock} remaining)`,
        timestamp: new Date(),
      })),
      ...outOfStockItems.map((item) => ({
        id: `out-${item.id}`,
        type: "error",
        message: `${item.name} is out of stock`,
        timestamp: new Date(),
      })),
    ]

    setNotifications(newNotifications)
  }

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return {
    notifications,
    checkLowStock,
    clearNotification,
    clearAllNotifications,
  }
}

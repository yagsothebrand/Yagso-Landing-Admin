"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

import { db } from "@/firebase"
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore"
import { useLandingAuth } from "../landingauth/LandingAuthProvider"

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { token } = useLandingAuth()
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState(null)

  useEffect(() => {
    if (!token) {
      setCart([])
      return
    }

    const loadCart = async () => {
      setLoading(true)
      try {
        const cartRef = doc(db, "users", token, "cart", "items")
        const cartSnap = await getDoc(cartRef)
        if (cartSnap.exists()) {
          setCart(cartSnap.data().items || [])
        } else {
          setCart([])
        }
      } catch (error) {
        console.error("[v0] Error loading cart:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [token])

  const addToCart = useCallback(
    async (product) => {
      if (!token) {
        console.warn("[v0] User not authenticated")
        return
      }

      const existingItem = cart.find((item) => item.id === product.id && item.variant === product.variant)

      let updatedCart
      if (existingItem) {
        updatedCart = cart.map((item) =>
          item.id === product.id && item.variant === product.variant
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item,
        )
      } else {
        updatedCart = [...cart, { ...product, quantity: product.quantity || 1 }]
      }

      setCart(updatedCart)
      setLastAddedItem(product)
      setIsDrawerOpen(true)

      try {
        const cartRef = doc(db, "users", token, "cart", "items")
        await setDoc(cartRef, { items: updatedCart, updatedAt: new Date() })
      } catch (error) {
        console.error("[v0] Error saving cart:", error)
      }
    },
    [token, cart],
  )

  const updateCartItem = useCallback(
    async (productId, variant, quantity) => {
      if (!token) return

      let updatedCart
      if (quantity <= 0) {
        updatedCart = cart.filter((item) => !(item.id === productId && item.variant === variant))
      } else {
        updatedCart = cart.map((item) =>
          item.id === productId && item.variant === variant ? { ...item, quantity } : item,
        )
      }

      setCart(updatedCart)

      try {
        const cartRef = doc(db, "users", token, "cart", "items")
        await setDoc(cartRef, { items: updatedCart, updatedAt: new Date() })
      } catch (error) {
        console.error("[v0] Error updating cart:", error)
      }
    },
    [token, cart],
  )

  const removeFromCart = useCallback(
    async (productId, variant) => {
      if (!token) return

      const updatedCart = cart.filter((item) => !(item.id === productId && item.variant === variant))

      setCart(updatedCart)

      try {
        const cartRef = doc(db, "users", token, "cart", "items")
        await setDoc(cartRef, { items: updatedCart, updatedAt: new Date() })
      } catch (error) {
        console.error("[v0] Error removing from cart:", error)
      }
    },
    [token, cart],
  )

  const clearCart = useCallback(async () => {
    if (!token) return

    setCart([])

    try {
      const cartRef = doc(db, "users", token, "cart", "items")
      await deleteDoc(cartRef)
    } catch (error) {
      console.error("[v0] Error clearing cart:", error)
    }
  }, [token])

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        isDrawerOpen,
        setIsDrawerOpen,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}

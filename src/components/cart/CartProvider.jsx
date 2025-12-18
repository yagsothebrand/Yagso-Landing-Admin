"use client";

import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

import { db, doc } from "@/firebase";
import { useLandingAuth } from "../landingauth/LandingAuthProvider";
import { getDoc, setDoc } from "firebase/firestore";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { userId, user } = useLandingAuth();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setCart([]);
      return;
    }

    const loadCart = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().cart) {
          setCart(userSnap.data().cart);
        } else {
          setCart([]);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [userId]);

  useEffect(() => {
    if (loading || !userId) return;

    const saveCart = async () => {
      try {
        const userRef = doc(db, "users", userId);
        await setDoc(
          userRef,
          { cart: cart, cartUpdatedAt: new Date() },
          { merge: true }
        );
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    };

    saveCart();
  }, [cart, loading, userId]);

  // On mount, load cart from cookies
  useEffect(() => {
    const storedCart = Cookies.get("cart");
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error("Error parsing cart from cookies:", error);
        Cookies.remove("cart");
      }
    }
  }, []);

  // Save cart to cookies whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      Cookies.set("cart", JSON.stringify(cart), {
        expires: 7,
        sameSite: "strict",
      });
    } else {
      Cookies.remove("cart");
    }
  }, [cart]);

  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id && item.variant === selectedVariant
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > (product.stock || 0)) {
          console.log("[v0] Cannot add - exceeds stock");
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id && item.variant === selectedVariant
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        if (quantity > (product.stock || 0)) {
          console.log("[v0] Cannot add - quantity exceeds stock");
          return prevCart;
        }
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "/placeholder.svg",
            variant: selectedVariant,
            quantity,
            stock: product.stock,
            discount: product.discountPercentage || 0,
          },
        ];
      }
    });
    setIsDrawerOpen(true);
  };

  const updateCartItem = (itemId, variant, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId, variant);
      return;
    }

    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === itemId && item.variant === variant) {
          if (newQuantity > (item.stock || 0)) {
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  const removeFromCart = (itemId, variant) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.id === itemId && item.variant === variant)
      )
    );
  };

  const clearCart = async () => {
    if (!userId) {
      setCart([]);
      Cookies.remove("cart");
      return;
    }

    try {
      const cartRef = doc(db, "users", userId);

      await setDoc(
        cartRef,
        { cart: [], cartUpdatedAt: new Date() },
        { merge: true }
      );

      setCart([]); // Update state after Firestore
      Cookies.remove("cart"); // Clear cookie
    } catch (error) {
      console.error("[v0] Error clearing cart:", error);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const basePrice = item.price * item.quantity;
      const discount = item.discount ? (basePrice * item.discount) / 100 : 0;
      return total + (basePrice - discount);
    }, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cart,
    isDrawerOpen,
    setIsDrawerOpen,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    userId,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

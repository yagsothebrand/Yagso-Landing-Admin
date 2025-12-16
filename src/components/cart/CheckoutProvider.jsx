// CheckoutProvider.js - Complete implementation

import React, { createContext, useContext, useState } from "react";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useLandingAuth } from "@/components/landingauth/LandingAuthProvider";

const CheckoutContext = createContext();

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error("useCheckout must be used within CheckoutProvider");
  }
  return context;
};

export const CheckoutProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const { user, userId } = useLandingAuth();

  const generateCheckoutId = () => { 
     return "chk_" + Math.random().toString(36).substring(2, 12);
  };

  const getCheckoutId = async () => {
    setLoading(true);

    const userRef = doc(db, "users", userId);
    try {
      // 1. Re-fetch the latest user document (prevents stale context data)
      const freshSnap = await getDoc(userRef);

      if (!freshSnap.exists()) {
        throw new Error("User does not exist in Firestore.");
      }

      const freshData = freshSnap.data();

      // 2. If checkoutId already exists → use it
      if (freshData.checkoutId) {
        return freshData.checkoutId;
      }

      // 3. Otherwise generate a new ID
      const newCheckoutId = generateCheckoutId();

      await setDoc(userRef, { checkoutId: newCheckoutId }, { merge: true });

      return newCheckoutId;
    } catch (err) {
      console.error("getCheckoutId ERROR:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const saveOrder = async (orderData, paymentResponse) => {
    setLoading(true);
    try {
      // Create the complete order object
      const completeOrderData = {
        // Order identification
        orderNumber: orderData.orderNumber,
        paymentReference:
          orderData.paymentReference || paymentResponse.reference,

        // Customer information
        customerEmail: orderData.customerEmail,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        userId: orderData.userId || user?.id || null,

        // Shipping address
        shippingAddress: {
          fullName: orderData.shippingAddress.fullName,
          address: orderData.shippingAddress.address,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          zipCode: orderData.shippingAddress.zipCode || "",
          phone: orderData.shippingAddress.phone,
        },

        // Order items
        items: orderData.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          variant: item.variant || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount || 0,
          totalPrice: item.totalPrice,
          image: item.image,
        })),

        // Pricing breakdown
        subtotal: orderData.subtotal,
        savings: orderData.savings || 0,
        shippingCost: orderData.shippingCost,
        totalAmount: orderData.totalAmount,

        // Order status
        status: orderData.status || "Processing",
        paymentStatus: orderData.paymentStatus || "Paid",
        paymentMethod: orderData.paymentMethod || "Paystack",

        // Tracking information
        trackingNumber: null,
        estimatedDelivery: null,
        deliveredAt: null,

        // Timestamps
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        // Payment details
        paymentDetails: {
          reference: paymentResponse.reference,
          transactionId:
            paymentResponse.trans || paymentResponse.transaction || null,
          status: paymentResponse.status || "success",
        },
      };

      // Save to main orders collection
      const orderRef = await addDoc(
        collection(db, "orders"),
        completeOrderData
      );

      console.log("✅ Order saved to main collection:", orderRef.id);

      // If user is logged in, also save to their personal orders subcollection
      if (userId) {
        const userOrderRef = doc(db, "users", userId, "orders", orderRef.id);
        await setDoc(userOrderRef, {
          ...completeOrderData,
          orderId: orderRef.id,
        });

        console.log("✅ Order saved to user subcollection");
      }

      return {
        orderId: orderRef.id,
        orderNumber: orderData.orderNumber,
        success: true,
      };
    } catch (error) {
      console.error("❌ Error saving order:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const saveBillingInfo = async (billingData) => {
    if (!user?.id) {
      console.log("No user logged in, skipping billing info save");
      return;
    }

    try {
      const userRef = doc(db, "users", userId);

      await updateDoc(userRef, {
        billingInfo: {
          fullName: billingData.fullName,
          phone: billingData.phone,
          address: billingData.address,
          city: billingData.city,
          state: billingData.state,
          zipCode: billingData.zipCode || "",
          email: billingData.email,
        },
        updatedAt: serverTimestamp(),
      });

      console.log("✅ Billing info saved");
    } catch (error) {
      console.error("❌ Error saving billing info:", error);
      throw error;
    }
  };

  const getOrderById = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        return { id: orderSnap.id, ...orderSnap.data() };
      }

      return null;
    } catch (error) {
      console.error("❌ Error fetching order:", error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, status, additionalData = {}) => {
    try {
      const orderRef = doc(db, "orders", orderId);

      await updateDoc(orderRef, {
        status,
        ...additionalData,
        updatedAt: serverTimestamp(),
      });

      // Also update in user's subcollection if exists
      if (user?.id) {
        const userOrderRef = doc(db, "users", userId, "orders", orderId);
        const userOrderSnap = await getDoc(userOrderRef);

        if (userOrderSnap.exists()) {
          await updateDoc(userOrderRef, {
            status,
            ...additionalData,
            updatedAt: serverTimestamp(),
          });
        }
      }

      console.log("✅ Order status updated");
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      throw error;
    }
  };

  const value = {
    saveOrder,
    saveBillingInfo,
    getOrderById,
    getCheckoutId,
    updateOrderStatus,
    loading,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export default CheckoutProvider;

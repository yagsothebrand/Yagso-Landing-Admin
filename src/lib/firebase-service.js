// Firebase service functions for invoice operations
import { db } from "@/firebase.js";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

// Save invoice (works for both draft/unpaid/paid by changing status)
import {
  addDoc,
  collection,
  getDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase"; // adjust import as needed

export const saveInvoiceToFirebase = async (invoice, userId) => {
  try {
    const invoiceData = {
      ...invoice,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Save the document
    const docRef = await addDoc(collection(db, "invoices"), invoiceData);

    // Confirm it exists
    const savedDoc = await getDoc(docRef);
    if (savedDoc.exists()) {
      return { success: true, id: docRef.id, data: savedDoc.data() };
    } else {
      return { success: false, error: "Document was not saved" };
    }
  } catch (error) {
    console.error("Error saving invoice:", error);
    return { success: false, error: error.message };
  }
};

// Get invoices (user only sees their own; CEO sees all)
export const getUserInvoices = async (userId = null) => {
  try {
    let q;

    if (userId) {
      q = query(collection(db, "invoices"), where("userId", "==", userId));
    } else {
      q = query(collection(db, "invoices"));
    }

    const querySnapshot = await getDocs(q);
    const invoices = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      invoices.push({
        firebaseId: docSnap.id, // 👈 always include Firestore ID
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      });
    });

    invoices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { success: true, invoices };
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return { success: false, error: error.message, invoices: [] };
  }
};

// Update invoice
export const updateInvoiceInFirebase = async (invoiceId, updates) => {
  try {
    const invoiceRef = doc(db, "invoices", invoiceId);
    await updateDoc(invoiceRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating invoice:", error);
    return { success: false, error: error.message };
  }
};

// Delete invoice
export const deleteInvoiceFromFirebase = async (invoiceId) => {
  try {
    await deleteDoc(doc(db, "invoices", invoiceId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return { success: false, error: error.message };
  }
};

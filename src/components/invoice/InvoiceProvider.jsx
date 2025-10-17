"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../auth/AuthProvider";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const InvoiceContext = createContext();

export function InvoiceProvider({ children }) {
  const [invoices, setInvoices] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const db = getFirestore();

  const getInvoices = async (userId = null) => {
    try {
      let q;

      if (userId) {
        q = query(collection(db, "invoices"), where("userId", "==", userId));
      } else {
        q = query(collection(db, "invoices"));
      }

      const querySnapshot = await getDocs(q);
      const invoiceList = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        invoiceList.push({
          ...data,
          firebaseId: docSnap.id, // ✅ comes last so it can’t be overwritten
          createdAt:
            data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt:
            data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        });
      });

      // sort by created date
      invoiceList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // ✅ save directly to state
      setInvoices(invoiceList);
      console.log(invoiceList);
    } catch (error) {
      toast({
        title: error.message,
        description: "Something went wrong",
      });
      console.error("Error fetching invoices:", error);
      setInvoices([]); // clear state on failure
    }
  };

  const addInvoice = async (invoiceData) => {
    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, "invoices"), {
        ...invoiceData,
        status: invoiceData.status,
        userId: user?.id || invoiceData.userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      await getInvoices(user.role === "CEO" ? null : user.id);
      toast({
        title: "Invoice Added Successfully",
        // description: "Invoice Added Successfully",
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding invoice:", error);
      toast({
        title: error.message,
        description: "Something went wrong",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (invoiceId, updateData) => {
    try {
      setLoading(true);
      const invoiceRef = doc(db, "invoices", invoiceId);
      await updateDoc(invoiceRef, {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      await getInvoices(user.role === "CEO" ? null : user.id);
      return { success: true };
    } catch (error) {
      console.error("Error updating invoice:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    console.log(invoiceId);
    try {
      setLoading(true);
      await deleteDoc(doc(db, "invoices", invoiceId));
      await getInvoices(user.role === "CEO" ? null : user.id);
      toast({
        title: `Invoice ${invoiceId}`,
        description: "Deleted Successfully",
      });
    } catch (error) {
      console.error("Error deleting invoice:", error);
      toast({
        title: error.message,
        description: "Something went wrong",
      });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const sendInvoiceEmail = async (recipientEmail, invoice, senderInfo) => {
    try {
      console.log("[v0] Sending invoice email to:", recipientEmail);

      const response = await axios.post("/api/send-email", {
        recipientEmail,
        invoice,
        senderInfo,
      });
      if (response.data.success) {
        await addDoc(collection(db, "sentEmails"), {
          to: recipientEmail,
          invoiceId: invoice.id,
          subject: `Invoice ${
            invoice.status === "paid"
              ? "Payment Confirmation"
              : "Invoice Details"
          }`,
          status: "sent",
          sentAt: serverTimestamp(),
          sender: "contact@yagso.com",
          authorizedByName: invoice.authorizedByName || "Unknown Customer",
        });

        return {
          success: true,
          message: `Invoice ${invoice.id} has been sent to ${recipientEmail} successfully!`,
        };
      }

      // ✅ Log sent email in Firestore
    } catch (error) {
      console.error("[v0] Error sending email:", error);
      toast({
        title: error.message,
        description: "Something went wrong",
      });
      // ❌ Log failed attempt
      await addDoc(collection(db, "sentEmails"), {
        to: recipientEmail,
        invoiceId: invoice.id,
        subject: "Invoice Send Failed",
        status: "failed",
        error: error.message,
        sentAt: serverTimestamp(),
      });

      return {
        success: false,
        message: "Failed to send invoice email. Please try again later.",
      };
    }
  };

  const searchInvoices = async (
    searchTerm,
    statusFilter = "all",
    startDate = null,
    endDate = null,
    userId = null
  ) => {
    try {
      let q;
      if (userId) {
        q = query(collection(db, "invoices"), where("userId", "==", userId));
      } else {
        q = query(collection(db, "invoices"));
      }

      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      }));

      // Apply filters on client side
      if (statusFilter !== "all") {
        results = results.filter((invoice) => invoice.status === statusFilter);
      }

      if (searchTerm) {
        results = results.filter(
          (invoice) =>
            invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.customerId
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            invoice.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            invoice.products?.some(
              (product) =>
                product.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                product.brand
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase()) ||
                product.category
                  ?.toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
        );
      }

      if (startDate || endDate) {
        results = results.filter((invoice) => {
          const invoiceDate = new Date(invoice.createdAt);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;

          if (start && invoiceDate < start) return false;
          if (end && invoiceDate > end) return false;
          return true;
        });
      }

      // Sort results by date
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return results;
    } catch (error) {
      toast({
        title: error.message,
        description: "Something went wrong",
      });
      console.error("Error searching invoices:", error);
      return [];
    }
  };

  const getInvoiceStats = () => {
    const allInvoices = [...invoices, ...drafts];
    const total = allInvoices.length;
    const paid = invoices.filter((inv) => inv.status === "paid").length;
    const unpaid = invoices.filter((inv) => inv.status === "unpaid").length;
    const overdue = invoices.filter((inv) => inv.status === "overdue").length;
    const draftCount = drafts.length;
    const totalAmount = invoices.reduce(
      (sum, inv) => sum + (inv.amount || 0),
      0
    );
    const totalDue = invoices.reduce((sum, inv) => sum + 0, 0);

    return { total, paid, unpaid, overdue, draftCount, totalAmount, totalDue };
  };

  useEffect(() => {
    if (user?.id) {
      getInvoices(user.role === "CEO" ? null : user.id);
    }
  }, [user]);

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        drafts,
        loading,
        setInvoices,
        setDrafts,
        getInvoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        searchInvoices,
        sendInvoiceEmail,
        getInvoiceStats,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
}

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoices must be used within InvoiceProvider");
  }
  return context;
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice must be used within InvoiceProvider");
  }
  return context;
};

"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  Trash2,
  RefreshCw,
  FileDown,
  Plus,
  Printer,
  Mail,
  DollarSign,
  Filter,
  Edit3,
  User,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { InvoiceDrawer } from "./InvoiceDrawer";
import { CreateInvoiceDrawer } from "./CreateInvoiceDrawer";

import {
  formatCurrency,
  formatDate,
  getStatusColor,
  exportToCSV,
  isDateInRange,
} from "@/lib/invoice-utils";

import {
  InvoiceProvider,
  useInvoice,
} from "@/components/invoice/InvoiceProvider";
import {
  InventoryProvider,
  useInventory,
} from "@/components/inventory/InventoryProvider";

import { Pagination } from "@/components/Pagination";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";
import Layout from "@/components/layout/Layout";
import { useNotifications } from "@/components/notification/NotificationProvider";

import { AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export function Modal({ isOpen, onClose, title, children, actions }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            className="fixed z-50 inset-0 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center border-b px-5 py-4 bg-gradient-to-r from-blue-500 to-blue-500 text-white">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-white/10 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                {children}
              </div>

              {/* Footer */}
              {actions && (
                <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                  {actions}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function DeleteInvoiceModal({ open, setOpen, onConfirm, invoice }) {
  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2"
      >
        Delete
      </Button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Delete Invoice"
        actions={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                onConfirm(invoice);
                // setOpen(false);
              }}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-gray-700 leading-relaxed">
          Are you sure you want to delete invoice{" "}
          <span className="font-semibold">{invoice?.id}</span>?
          <br />
          <span className="font-medium text-red-600">
            This action cannot be undone.
          </span>
        </p>
      </Modal>
    </>
  );
}

function InvoicesPageContent() {
  const {
    invoices,
    loading,
    addInvoice,
    deleteInvoice,
    updateInvoice,
    sendInvoiceEmail,
  } = useInvoice();
  const { allUsers, user } = useAuth();
  // State to control layout view
  const [layout, setLayout] = useState("grid"); // "grid" | "list"

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState("all");
  const [authorizedByFilter, setAuthorizedByFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [manualEmail, setManualEmail] = useState("");

  const {
    inventory,
    brands,
    categories,
    reduceStock,
    loading: inventoryLoading,
  } = useInventory();

  const resetFilters = () => {
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setStatusFilter("all");
    setAuthorizedByFilter("all");
  };

  const statuses = ["all", "paid", "overdue", "unpaid"];

  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      const matchesSearch =
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.products?.some(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "all" || invoice.status === statusFilter;

      const matchesAuthorizedBy =
        authorizedByFilter === "all" ||
        invoice.authorizedBy === authorizedByFilter ||
        invoice.authorizedBy === authorizedByFilter;

      const matchesDateRange = isDateInRange(
        invoice.createdAt || invoice.dueDate,
        dateRange.start,
        dateRange.end
      );

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAuthorizedBy &&
        matchesDateRange
      );
    });
  }, [invoices, searchTerm, statusFilter, authorizedByFilter, dateRange]);

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailDrawerOpen(true);
  };
  const renderAuthorizedUserProfile = (invoice, allUsers) => {
    if (!invoice?.authorizedBy) {
      console.warn("⚠️ No authorizedBy found on invoice");
      return null;
    }

    if (!Array.isArray(allUsers) || allUsers.length === 0) {
      console.warn("⚠️ allUsers not loaded yet");
      return null;
    }

    // Find the matching user
    const matchedUser = allUsers.find(
      (u) => u.email?.toLowerCase() === invoice.authorizedBy.toLowerCase()
    );

    if (!matchedUser) {
      console.warn("⚠️ No matching user found for:", invoice.authorizedBy);
    }

    const profileImage = matchedUser?.profileImage;
    const firstName =
      matchedUser?.firstName || invoice?.authorizedByName?.split(" ")[0] || "";
    const lastName =
      matchedUser?.lastName || invoice?.authorizedByName?.split(" ")[1] || "";
    const initials = `${firstName.charAt(0) || ""}${
      lastName.charAt(0) || ""
    }`.toUpperCase();

    return (
      <div className="mt-4 flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={invoice?.authorizedByName || "User"}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-blue-100"
              onError={(e) => {
                console.error("Image failed to load:", profileImage);
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm sm:text-base border-2 border-blue-100">
              {initials}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-900">
            {invoice.authorizedByName || "N/A"}
          </p>
          {/* {invoice.authorizedBy && (
            <p className="text-sm text-gray-500">{invoice.authorizedBy}</p>
          )} */}
        </div>
      </div>
    );
  };

  const handleCreateInvoice = async (invoiceData) => {
    if (!user) return;

    let result;

    if (invoiceData.firebaseId) {
      result = await updateInvoice(invoiceData.firebaseId, invoiceData);
    } else {
      result = await addInvoice(invoiceData, user.id);
    }

    if (result?.success) {
      if (invoiceData.status === "paid") {
        await reduceStock(invoiceData.products);
        handleSendEmail(invoiceData);
      }
    } else {
      console.error("Invoice save failed:", result?.error || "Unknown error");
    }
  };

  const handleDeleteInvoice = async (invoice) => {
    try {
      await deleteInvoice(invoice.firebaseId);
      setIsDeleteModalOpen(false);
    } catch (err) {
      console.error("Error deleting invoice:", err);
    }
  };

  // 1️⃣ CSV Export Helper
  const exportToCSV = (data, filename = "export") => {
    if (!data || !data.length) {
      console.warn("No data provided for CSV export.");
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add header row
    csvRows.push(headers.join(","));

    // Add data rows
    for (const row of data) {
      const values = headers.map((header) => {
        const cell = row[header] ?? "";
        // Escape quotes and commas
        return `"${String(cell).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(","));
    }

    // Combine into a CSV blob
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);

    // Trigger download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2️⃣ Flatten Invoices + Export
  const handleExportCSV = () => {
    if (!filteredInvoices?.length) {
      console.warn("No invoices to export");
      return;
    }

    const flattened = filteredInvoices.map((invoice) => {
      const productDetails =
        invoice.products
          ?.map(
            (p) =>
              `${p.name || ""} (${p.brand || ""}) x${p.quantity || 1} - ₦${(
                p.price || 0
              ).toLocaleString()}`
          )
          .join("; ") || "—";

      return {
        "Invoice ID": invoice.id || "—",
        "Customer ID": invoice.customerId || "—",
        "Customer Email": invoice.customerEmail || "—",
        "Authorized By":
          invoice.authorizedByName || invoice.authorizedBy || "—",
        Amount: invoice.amount ? `₦${invoice.amount.toLocaleString()}` : "—",
        "Amount Due":
          invoice.status === "paid"
            ? "₦0"
            : invoice.amountDue
            ? `₦${invoice.amountDue.toLocaleString()}`
            : "—",

        Status: invoice.status || "—",
        Description: invoice.description || "—",
        Products: productDetails,
        "Due Date": invoice.dueDate || "—",
        "Created At": invoice.createdAt
          ? new Date(invoice.createdAt).toLocaleString()
          : "—",
        "Updated At": invoice.updatedAt
          ? new Date(invoice.updatedAt).toLocaleString()
          : "—",
        "Extension Number": invoice.extensionNumber || "—",
      };
    });

    console.log("Exporting invoices:", flattened); // Debug line
    exportToCSV(
      flattened,
      `invoices-${new Date().toISOString().split("T")[0]}`
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const stats = useMemo(() => {
    const userInvoices = invoices;

    const total = userInvoices.length;
    const paid = userInvoices.filter((inv) => inv.status === "paid").length;
    const overdue = userInvoices.filter(
      (inv) => inv.status === "overdue"
    ).length;
    const unpaid = userInvoices.filter((inv) => inv.status === "unpaid").length;

    const totalAmount = userInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalDue = userInvoices.reduce((sum, inv) => sum + inv.amountDue, 0);

    return { total, paid, overdue, unpaid, totalAmount, totalDue };
  }, [invoices]);

  const handleEditInvoice = (invoice) => {
    if (invoice.status === "paid") {
      alert("Cannot edit paid invoices");
      return;
    }
    setSelectedInvoice(invoice);
    setIsCreateDrawerOpen(true);
  };

  const handlePrintInvoice = (invoice) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print invoices");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.id}</title>
        <style>
   
      .company-info {
      
        text-align: center;
        color: #64748b;
        font-size: 0.95rem;
      }
      .company-logo {
        width: 120px;
      
      }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: white;
            color: #333;
            line-height: 1.6;
          }
          .invoice-header { 
            text-align: center; 
            margin-bottom: 40px; 
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
          }
          .invoice-header h1 {
            color: #2563eb;
            font-size: 2.5rem;
            margin: 0;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          .invoice-header h2 {
            color: #64748b;
            font-size: 1.5rem;
            margin: 10px 0 0 0;
            font-weight: 400;
          }
          .invoice-details { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 30px; 
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }
          .invoice-details div {
            flex: 1;
          }
          .invoice-details strong {
            color: #1e293b;
            display: block;
            margin-bottom: 8px;
            font-size: 1.1rem;
            font-weight: 600;
          }
          .products-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 30px 0; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            overflow: hidden;
          }
          .products-table th, .products-table td { 
            border: 1px solid #e2e8f0; 
            padding: 16px; 
            text-align: left; 
          }
          .products-table th { 
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            font-weight: 600;
            font-size: 0.95rem;
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }
          .products-table tbody tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .products-table tbody tr:hover {
            background-color: #f1f5f9;
          }
          .total-section { 
            text-align: right; 
            margin-top: 30px;
            padding: 24px;
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-radius: 12px;
            border: 1px solid #cbd5e1;
          }
          .total-section p {
            margin: 8px 0;
            font-size: 1.1rem;
          }
          .total-amount {
            font-size: 1.5rem !important;
            color: #2563eb !important;
            font-weight: 700 !important;
            border-top: 2px solid #2563eb;
            padding-top: 12px !important;
            margin-top: 12px !important;
          }
          .amount-due {
            color: #dc2626 !important;
            font-weight: 600 !important;
          }
          
          .footer-note {
            margin-top: 40px;
            text-align: center;
            color: #64748b;
            font-size: 0.9rem;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
          }
          .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
          }
          .status-paid {
            background-color: #dcfce7;
            color: #166534;
          }
         
          .status-overdue {
            background-color: #fefce8;
            color: #a16207;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
      
        <div class="company-info">
           <img src="/images/osondu-logo.png" alt="Osondu Autos Logo" class="company-logo" />
      <h3 style="margin: 0; color: #1e293b;">Osondu Autos</h3>
      <p style="margin: 5px 0;">Block 2 Shop 33 Aspamda Main Gate Tradefair, Ojo.</p>
      <p style="margin: 5px 0;">Phone: 08108042048 | Email: info@osonduautos.com</p>
        </div>
        
        <div class="invoice-header">
          <h1>INVOICE</h1>
          <h2>${invoice.id}</h2>
        </div>
        
        <div class="invoice-details">
          <div>
            <strong>Bill To:</strong>
            <p style="margin: 4px 0; font-size: 1.1rem;">${
              invoice.customerId
            }</p>
            ${
              invoice.customerEmail
                ? `<p style="margin: 4px 0; color: #64748b;">${invoice.customerEmail}</p>`
                : ""
            }
          </div>
          <div style="text-align: right;">
            <strong>Invoice Details:</strong>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${formatDate(
              invoice.createdAt || new Date()
            )}</p>
          
            <p style="margin: 4px 0;"><strong>Status:</strong> 
              <span class="status-badge status-${
                invoice.status
              }">${invoice.status.toUpperCase()}</span>
            </p>
            ${
              invoice.authorizedByName
                ? `<p style="margin: 4px 0; font-size: 0.9rem; color: #64748b;"><strong>Authorized by:</strong> ${invoice.authorizedByName}</p>`
                : ""
            }
          </div>
        </div>
        
        ${
          invoice.products?.length > 0
            ? `
          <table class="products-table">
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Brand</th>
                <th>Category</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.products
                .map(
                  (product) => `
                <tr>
                  <td>
                    <strong>${product.name}</strong>
                    ${
                      product.description
                        ? `<br><small style="color: #64748b;">${product.description}</small>`
                        : ""
                    }
                  </td>
                  <td>${product.brand || "N/A"}</td>
                  <td>${product.category || "N/A"}</td>
                  <td style="text-align: center;">${product.quantity}</td>
                  <td style="text-align: right;">₦${product.price.toLocaleString()}</td>
                  <td style="text-align: right; font-weight: 600;">₦${(
                    product.price * product.quantity
                  ).toLocaleString()}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `
            : `<div style="padding: 24px; background: #f8fafc; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
                <strong style="color: #1e293b; font-size: 1.1rem;">Service Description:</strong>
                <p style="margin: 8px 0 0 0; color: #64748b;">${invoice.description}</p>
               </div>`
        }
        
        <div class="total-section">
          <p><strong>Subtotal:</strong> ₦${invoice.amount.toLocaleString()}</p>
          <p><strong>Tax (0%):</strong> ₦0.00</p>
          <p class="total-amount">Total Amount: ₦${invoice.amount.toLocaleString()}</p>
          <p class="amount-due">Amount Due: ₦${(invoice.status === "paid"
            ? "0"
            : invoice.amountDue
          ).toLocaleString()}</p>
        </div>
        
        <div class="footer-note">
        ${
          invoice.status === "unpaid" ? (
            <p>
              <strong>
                {" "}
                Payment is kindly requested within 30 days of the invoice date
              </strong>
            </p>
          ) : null
        }
          <p><strong>Thank you for your business!</strong></p>
          <p style="margin-top: 16px; font-size: 0.8rem;">
            This invoice was generated electronically and is valid without signature.
          </p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
      };
    };
  };

  const handleSendEmail = async (invoice) => {
    let recipientEmail = invoice.customerEmail;

    if (!recipientEmail && invoice.status === "paid") {
      setSelectedInvoice(invoice);
      setShowEmailModal(true);
      return; // ⬅️ stop here — wait for user to input email
    }

    // if (!recipientEmail) {
    //   toast({
    //     title: "No email address found for this customer.",
    //     description: "Please add an email address to send the invoice.",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    const senderInfo = {
      companyName: "Osondu Autos",
      address: "Block 2 Shop 33 Aspamda Main Gate Tradefair, Ojo.",
      phone: "08108042048",
      email: "osondunigeriaenterprises@gmail.com",
    };

    try {
      const result = await sendInvoiceEmail(
        recipientEmail,
        invoice,
        senderInfo
      );
      if (result.success) {
        toast({ title: result.message });
      } else {
        toast({ title: result.message, variant: "destructive" });
      }
    } catch (error) {
      toast({
        title: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleManualEmailSubmit = async () => {
    if (!manualEmail.trim()) {
      toast({ title: "Email address is required." });
      return;
    }

    const senderInfo = {
      companyName: "Osondu Autos",
      address: "Block 2 Shop 33 Aspamda Main Gate Tradefair, Ojo.",
      phone: "08108042048",
      email: "osondunigeriaenterprises@gmail.com",
    };

    try {
      const result = await sendInvoiceEmail(
        manualEmail,
        selectedInvoice,
        senderInfo
      );
      if (result.success) {
        toast({ title: result.message });
      } else {
        toast({ title: result.message, variant: "destructive" });
      }
      setShowEmailModal(false);
      setManualEmail("");
      setSelectedInvoice(null);
    } catch (error) {
      toast({
        title: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-blue-100 rounded-lg"></div>
            <div className="h-8 bg-blue-50 rounded-lg"></div>
            <div className="h-8 bg-blue-50 rounded-lg"></div>
          </div>
          <p className="text-center text-gray-500 mt-6">
            Fetching invoices securely...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="font-semibold">
                Dashboard
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="font-semibold">
                Invoice Management
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-gray-600 mt-1 text-pretty">
                Create and manage and track your invoices efficiently
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="border-green-600 text-green-700 hover:bg-green-50 bg-transparent"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Export CSV
              </Button>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                  onClick={() => setIsCreateDrawerOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Invoice
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Invoices</p>
                <p className="text-xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileDown className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Paid</p>
                <p className="text-xl font-bold text-green-600">{stats.paid}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <p className="w-6 h-6 text-green-600"> ₦</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Overdue</p>
                <p className="text-xl font-bold text-yellow-600">
                  {stats.overdue}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Unpaid</p>
                <p className="text-xl font-bold text-red-600">{stats.unpaid}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-purple-600">
                  {formatCurrency(stats.totalAmount)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <p className="w-6 h-6 text-purple-600"> ₦</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="rounded-xl"
        >
          {/* Search */}
          <div className="relative group w-full max-w-xl py-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search invoices, customers, or products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full rounded-xl border-gray-300 focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 flex-wrap">
            {/* Date Range */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-3 border-2 border-blue-500 rounded-2xl px-4 py-3 bg-white shadow-sm hover:shadow-md transition-all duration-200 flex-1"
              whileHover={{ scale: 1.02 }}
            >
              {/* Start Date */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-5 h-5 text-blue-500 shrink-0" />
                <Input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="w-full sm:w-44 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              {/* Divider (arrow) */}
              <span className="hidden sm:block text-gray-400 font-semibold">
                →
              </span>

              {/* End Date */}
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="w-full sm:w-44 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </motion.div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap p-2">
              {statuses.map((status) => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                    statusFilter === status
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </motion.button>
              ))}
            </div>

            {/* User Filter */}
            {(user?.role === "CEO" || user?.role === "General Manager") &&
              allUsers &&
              allUsers.length > 0 && (
                <motion.div
                  className="flex items-center gap-2 border-2 border-blue-500 rounded-2xl px-4 py-3 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <User className="w-5 h-5 text-blue-500 shrink-0" />

                  <select
                    value={authorizedByFilter}
                    onChange={(e) => setAuthorizedByFilter(e.target.value)}
                    className="w-full sm:w-56 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="all">All Users</option>
                    {allUsers.map((u) => (
                      <option key={u.id} value={u.email}>
                        {`${u.firstName || ""} ${u.lastName || ""}`.trim() ||
                          u.email}
                      </option>
                    ))}
                  </select>
                </motion.div>
              )}

            {/* <div className="flex justify-end mb-4">
              <Button
                variant={layout === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setLayout("grid")}
              >
                Grid View
              </Button>
              <Button
                variant={layout === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setLayout("list")}
                className="ml-2"
              >
                List View
              </Button>
            </div> */}

            {/* Clear Filters */}
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="rounded-full lg:ml-auto"
            >
              Clear Filters
            </Button>
          </div>
        </motion.div>

        {/* Invoices Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={
            layout === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {paginatedInvoices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 text-gray-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 mb-3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 13h6m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h6l6 6v10a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm text-gray-400">
                Try adjusting your filters or search terms.
              </p>
            </motion.div>
          ) : (
            paginatedInvoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className={`rounded-xl shadow-lg overflow-hidden border relative ${
                  layout === "list" ? "w-full" : ""
                }`}
              >
                {/* Top gradient strip */}
                <div
                  className={cn(
                    "h-2 w-full",
                    invoice.status === "paid" &&
                      "bg-gradient-to-r from-green-200 to-green-100",
                    invoice.status === "pending" &&
                      "bg-gradient-to-r from-yellow-200 to-yellow-100",
                    invoice.status === "overdue" &&
                      "bg-gradient-to-r from-red-200 to-red-100",
                    invoice.status === "draft" &&
                      "bg-gradient-to-r from-blue-200 to-blue-100",
                    invoice.status === "unpaid" &&
                      "bg-gradient-to-r from-indigo-200 to-indigo-100"
                  )}
                />

                {/* Card content */}
                <div className="p-5 bg-white">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {invoice.id}
                    </h3>
                    <Badge
                      className={cn(
                        "px-2 py-1 text-sm rounded-full font-medium border shadow-sm",
                        invoice.status === "paid" &&
                          "border-green-500 text-green-700 bg-green-50",
                        invoice.status === "pending" &&
                          "border-yellow-500 text-yellow-700 bg-yellow-50",
                        invoice.status === "overdue" &&
                          "border-red-500 text-red-700 bg-red-50",
                        invoice.status === "draft" &&
                          "border-blue-500 text-blue-700 bg-blue-50",
                        invoice.status === "unpaid" &&
                          "border-indigo-500 text-indigo-700 bg-indigo-50"
                      )}
                    >
                      {invoice.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Customer */}
                  <div className="mt-3">
                    <p className="font-medium text-gray-800">
                      {invoice.customerId}
                    </p>
                    {invoice.customerEmail && (
                      <p className="text-sm text-gray-500">
                        {invoice.customerEmail}
                      </p>
                    )}
                  </div>

                  {/* Amounts */}
                  <div className="mt-4 space-y-1">
                    <p className="text-sm text-gray-700">
                      Amount:{" "}
                      <span className="font-semibold text-blue-700 border border-blue-300 bg-blue-50 px-2 py-0.5 rounded">
                        {formatCurrency(invoice.amount)}
                      </span>
                    </p>
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        invoice.status === "paid"
                          ? "text-green-700"
                          : "text-red-600"
                      )}
                    >
                      Due:{" "}
                      {formatCurrency(
                        invoice.status === "paid" ? "0.00" : invoice.amountDue
                      )}
                    </p>
                  </div>

                  {/* Authorized */}
                  {renderAuthorizedUserProfile(invoice, allUsers)}

                  {/* Actions */}
                  <motion.div
                    className="mt-4 flex flex-wrap gap-2 border-t pt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-blue-500 hover:bg-blue-50"
                      onClick={() => handleViewInvoice(invoice)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:bg-green-50"
                      onClick={() => handlePrintInvoice(invoice)}
                    >
                      <Printer className="w-4 h-4 mr-1" /> Print
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-purple-600 hover:bg-purple-50"
                      disabled={invoice.status === "unpaid"}
                      onClick={() => handleSendEmail(invoice)}
                    >
                      <Mail className="w-4 h-4 mr-1" /> Email
                    </Button>
                    {invoice.status !== "paid" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-yellow-600 hover:bg-yellow-50"
                        onClick={() => handleEditInvoice(invoice)}
                      >
                        <Edit3 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    )}
                    {(user?.role === "CEO" ||
                      user?.role === "General Manager") && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setIsDeleteModalOpen(true);
                          setSelectedInvoice(invoice);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />

        <InvoiceDrawer
          invoice={selectedInvoice}
          isOpen={isDetailDrawerOpen}
          onClose={() => setIsDetailDrawerOpen(false)}
        />

        <CreateInvoiceDrawer
          isOpen={isCreateDrawerOpen}
          onClose={() => {
            setIsCreateDrawerOpen(false);
            setSelectedInvoice(null);
          }}
          onCreateInvoice={handleCreateInvoice}
          editingInvoice={selectedInvoice}
        />
        <Modal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          title="Send Customer Email"
          actions={
            <>
              <Button
                variant="outline"
                onClick={() => setShowEmailModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleManualEmailSubmit}
                className="bg-blue-500 text-white"
              >
                Send Invoice
              </Button>
            </>
          }
        >
          <div className="space-y-3">
            {/* <label className="block text-gray-700 font-medium text-sm">
              Customer Email
            </label> */}
            <input
              type="email"
              placeholder="Enter email address"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </Modal>
        <DeleteInvoiceModal
          open={isDeleteModalOpen}
          setOpen={setIsDeleteModalOpen}
          onConfirm={() => handleDeleteInvoice(selectedInvoice)}
          invoice={selectedInvoice}
        />
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Layout>
      <InvoicesPageContent />
    </Layout>
  );
}

/**
 * Generate a random user ID
 */
// export function generateUserId() {
//   const prefix = "CUST";
//   const randomNum = Math.floor(Math.random() * 1000000)
//     .toString()
//     .padStart(6, "0");
//   return `${prefix}-${randomNum}`;
// }

/**
 * Generate a unique invoice number
 */
// export function generateInvoiceNumber() {
//   const prefix = "INV";
//   const timestamp = Date.now().toString().slice(-8);
//   const randomNum = Math.floor(Math.random() * 1000)
//     .toString()
//     .padStart(3, "0");
//   return `${prefix}-${timestamp}-${randomNum}`;
// }

/**
 * Generate a unique draft ID
 */

/**
 * Validate email address format
 */
export function validateEmail(email) {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Calculate total amount from products array
 */
export function calculateInvoiceTotal(products) {
  if (!products || products.length === 0) return 0;

  return products.reduce((total, product) => {
    const price = Number(product.price) || 0;
    const quantity = Number(product.quantity) || 0;
    return total + price * quantity;
  }, 0);
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Get date after specified minutes in YYYY-MM-DD format
 */
export function getDateAfterMinutes(minutes) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutes);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format currency to Nigerian Naira
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Get status color classes for badges
 */
export function getStatusColor(status) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 border-green-200";
    case "unpaid":
      return "bg-red-100 text-red-800 border-red-200";
    case "overdue":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "draft":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

/**
 * Check if date is within range
 */
export function isDateInRange(date, startDate, endDate) {
  if (!startDate && !endDate) return true;

  const checkDate = new Date(date);
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && end) {
    return checkDate >= start && checkDate <= end;
  } else if (start) {
    return checkDate >= start;
  } else if (end) {
    return checkDate <= end;
  }

  return true;
}

/**
 * Export data to CSV file
 */
export function exportToCSV(data, filename) {
  const headers = [
    "Invoice ID",
    "Customer ID",
    "Customer Email",
    "Due Date",
    "Amount",
    "Amount Due",
    "Status",
    "Created At",
  ];

  const csvContent = [
    headers.join(","),
    ...data.map((invoice) =>
      [
        invoice.id,
        invoice.customerId,
        invoice.customerEmail || "",
        invoice.dueDate,
        invoice.amount,
        invoice.amountDue,
        invoice.status,
        invoice.createdAt,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
/**
 * Generate a random user/customer ID
 */
export function generateUserId() {
  const prefix = "CUST";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate a unique invoice number
 */
export function generateInvoiceNumber() {
  const prefix = "INV";
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}-${year}${month}${day}-${random}`;
}



/**
 * Format currency amount with Naira symbol
 */
// export function formatCurrency(amount) {
//   return `₦${amount.toLocaleString("en-NG", {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 2,
//   })}`;
// }

/**
 * Calculate days until due date
 */
export function getDaysUntilDue(dueDate) {
  const due = new Date(dueDate);
  const today = new Date();
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check if an invoice is overdue
 */
export function isOverdue(dueDate, status) {
  if (status === "paid") return false;
  return getDaysUntilDue(dueDate) < 0;
}

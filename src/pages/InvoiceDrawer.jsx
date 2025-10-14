"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Calendar,
  User,
  Mail,
  DollarSign,
  Package,
  FileText,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "@/lib/invoice-utils";

export function InvoiceDrawer({ invoice, isOpen, onClose, onSendEmail }) {
  const [isSending, setIsSending] = useState(false);

  if (!invoice) return null;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white max-w-4xl mx-auto max-h-[95vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="p-6 overflow-y-auto"
        >
          <DrawerHeader className="px-0 pb-6">
            <div className="flex items-center justify-between">
              <DrawerTitle className="text-2xl font-bold text-primary">
                Invoice Details
              </DrawerTitle>
              <div className="flex items-center gap-2">
                <DrawerClose asChild>
                  <Button variant="ghost" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerHeader>

          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {invoice.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Created: {formatDate(invoice.createdAt)}
                  </p>
                </div>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <User className="w-4 h-4" />
                    <span className="font-medium">Customer ID:</span>
                    <span>{invoice.customerId}</span>
                  </div>
                  {invoice.customerEmail && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4" />
                      <span className="font-medium">Email:</span>
                      <span>{invoice.customerEmail}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Date:</span>
                    <span>{formatDate(invoice.createdAt)}</span>
                  </div>
                  {invoice.authorizedBy && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4" />
                      <span className="font-medium">Authorized by:</span>
                      <span>{invoice.authorizedBy}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {invoice.description && (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Description
                    </h4>
                    <p className="text-gray-700">{invoice.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Products */}
            {invoice.products && invoice.products.length > 0 && (
              <div className="bg-white border rounded-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    Invoice Items ({invoice.products.length})
                  </h4>
                </div>
                <div className="divide-y divide-gray-100">
                  {invoice.products.map((product, index) => (
                    <div
                      key={index}
                      className="p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {product.image && (
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h5 className="font-semibold text-gray-900">
                            {product.name}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {product.brand || "N/A"} •{" "}
                            {product.category || "N/A"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {product.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {formatCurrency(product.price)} × {product.quantity}
                        </p>
                        <p className="font-bold text-lg text-blue-600">
                          {formatCurrency(product.price * product.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-lg">
                  <span className="text-gray-700 flex items-center gap-2">
                    {/* <DollarSign className="w-5 h-5" /> */}
                    Total Amount:
                  </span>
                  <span className="font-bold text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg border-t border-blue-200 pt-3">
                  <span className="text-gray-700 font-semibold">
                    Amount Due:
                  </span>
                  <span className="font-bold text-2xl text-red-600">
                    {formatCurrency(
                      invoice.status === "paid" ? "0" : invoice.amountDue
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}

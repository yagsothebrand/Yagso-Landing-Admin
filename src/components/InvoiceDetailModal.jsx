"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Printer, Mail, Download, Pause, Play } from "lucide-react";

export function InvoiceDetailModal({ invoice, isOpen, onClose }) {
  const [isSuspended, setIsSuspended] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    // Email functionality would be implemented here
    console.log("Sending email for invoice:", invoice.id);
  };

  const handleSuspend = () => {
    setIsSuspended(!isSuspended);
    // Suspend/resume invoice functionality
  };

  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Details - {invoice.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Dreams POS</h2>
              <p className="text-gray-600">Spare Parts Management</p>
              <p className="text-sm text-gray-500">
                123 Business Street, City, State 12345
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-semibold">INVOICE</h3>
              <p className="text-gray-600">#{invoice.id}</p>
              <p className="text-sm text-gray-500">Date: {invoice.dueDate}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Bill To:</h4>
              <p className="font-medium">{invoice.customer.name}</p>
              <p className="text-sm text-gray-600">customer@example.com</p>
              <p className="text-sm text-gray-600">123 Customer Street</p>
              <p className="text-sm text-gray-600">City, State 12345</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Invoice Details:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge
                    className={
                      invoice.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : invoice.status === "unpaid"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {isSuspended ? "Suspended" : invoice.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Due Date:</span>
                  <span>{invoice.dueDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Terms:</span>
                  <span>Net 30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <h4 className="font-semibold mb-4">Items:</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium">
                      Description
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Qty</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Unit Price
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="py-3 px-4">Brake Pad Set - Front</td>
                    <td className="py-3 px-4">2</td>
                    <td className="py-3 px-4">$89.99</td>
                    <td className="py-3 px-4">$179.98</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Engine Oil Filter</td>
                    <td className="py-3 px-4">1</td>
                    <td className="py-3 px-4">$24.50</td>
                    <td className="py-3 px-4">$24.50</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Labor - Installation</td>
                    <td className="py-3 px-4">2 hrs</td>
                    <td className="py-3 px-4">$75.00</td>
                    <td className="py-3 px-4">$150.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>$354.48</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8.5%):</span>
                <span>$30.13</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${invoice.amount}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Paid:</span>
                <span>${invoice.paid}</span>
              </div>
              <div className="flex justify-between font-semibold text-red-600">
                <span>Amount Due:</span>
                <span>${invoice.amountDue}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <div className="flex gap-2">
              <Button
                variant={isSuspended ? "default" : "outline"}
                onClick={handleSuspend}
                className={isSuspended ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {isSuspended ? (
                  <Play className="w-4 h-4 mr-2" />
                ) : (
                  <Pause className="w-4 h-4 mr-2" />
                )}
                {isSuspended ? "Resume" : "Suspend"}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={handleEmail}>
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

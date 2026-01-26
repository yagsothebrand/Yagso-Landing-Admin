import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

export default function Cart({ items, onClose, onRemove }) {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const tax = (subtotal * 0.1).toFixed(2);
  const total = (subtotal + parseFloat(tax)).toFixed(2);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 20 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-600 text-lg mb-4">
                    Your cart is empty
                  </p>
                  <Button onClick={onClose} className="bg-[#2b6f99] text-white">
                    Continue Shopping
                  </Button>
                </div>
              </div>
            ) : (
              items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {item.addOns && item.addOns.length > 0 && (
                    <div className="mb-3 space-y-1">
                      {item.addOns.map((addOn) => (
                        <p key={addOn.id} className="text-xs text-gray-600">
                          + {addOn.label}
                        </p>
                      ))}
                    </div>
                  )}

                  <p className="font-bold text-[#2b6f99]">
                    ${item.total.toFixed(2)}
                  </p>
                </motion.div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-6 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%):</span>
                  <span className="font-semibold">${tax}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                  <span>Total:</span>
                  <span className="bg-gradient-to-r from-[#2b6f99] to-[#fc7182] bg-clip-text text-transparent">
                    ${total}
                  </span>
                </div>
              </div>

              <Button className="w-full bg-gradient-to-r from-[#2b6f99] to-[#2b6f99] text-white">
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

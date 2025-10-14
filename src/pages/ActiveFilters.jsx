"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function ActiveFilters({
  statusFilters,
  categoryFilters,
  brandFilters,
  searchTerm,
  clearFilter,
}) {
  const hasFilters =
    statusFilters.length > 0 ||
    categoryFilters.length > 0 ||
    brandFilters.length > 0 ||
    searchTerm;

  if (!hasFilters) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200"
    >
      <span className="text-sm font-medium text-gray-700">Active Filters:</span>

      <AnimatePresence mode="popLayout">
        {searchTerm && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            layout
          >
            <Badge
              variant="secondary"
              className="bg-white border-blue-300 text-blue-700 gap-1"
            >
              Search: {searchTerm}
              <button
                onClick={() => clearFilter("search")}
                className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </motion.div>
        )}

        {statusFilters.map((status) => (
          <motion.div
            key={status}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            layout
          >
            <Badge
              variant="secondary"
              className="bg-green-100 border-green-300 text-green-700 gap-1"
            >
              {status}
              <button
                onClick={() => clearFilter("status", status)}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </motion.div>
        ))}

        {categoryFilters.map((category) => (
          <motion.div
            key={category}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            layout
          >
            <Badge
              variant="secondary"
              className="bg-purple-100 border-purple-300 text-purple-700 gap-1"
            >
              {category}
              <button
                onClick={() => clearFilter("category", category)}
                className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </motion.div>
        ))}

        {brandFilters.map((brand) => (
          <motion.div
            key={brand}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            layout
          >
            <Badge
              variant="secondary"
              className="bg-orange-100 border-orange-300 text-orange-700 gap-1"
            >
              {brand}
              <button
                onClick={() => clearFilter("brand", brand)}
                className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => clearFilter("all")}
          className="h-6 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Clear All
        </Button>
      )}
    </motion.div>
  );
}

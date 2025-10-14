"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}) {
  const pageNumbers = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-card p-4 rounded-lg border"
    >
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-muted-foreground">
          Items per page:
        </span>
        <RadioGroup
          value={itemsPerPage.toString()}
          onValueChange={(value) =>
            onItemsPerPageChange(Number.parseInt(value, 10))
          }
          className="flex items-center gap-4"
        >
          {[5, 10, 20, 50].map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <RadioGroupItem value={size.toString()} id={"items-" + size} />
              <Label
                htmlFor={"items-" + size}
                className="text-sm cursor-pointer"
              >
                {size}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

    <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="h-8 w-8 p-0"
            >
              1
            </Button>
            {startPage > 2 && (
              <span className="text-muted-foreground px-2">...</span>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <motion.div
            key={page}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={
                "h-8 w-8 p-0 " +
                (currentPage === page
                  ? "bg-secondary text-secondary-foreground"
                  : "")
              }
            >
              {page}
            </Button>
          </motion.div>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="text-muted-foreground px-2">...</span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(totalPages)}
              className="h-8 w-8 p-0"
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

"use client";
import { useToast } from "../../hooks/use-toast";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(
        ({
          id,
          title,
          description,
          action,
          isConfirmation,
          onConfirm,
          onCancel,
          ...props
        }) => (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {isConfirmation ? (
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (onConfirm) onConfirm();
                    props.onOpenChange?.(false);
                  }}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Yes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (onCancel) onCancel();
                    props.onOpenChange?.(false);
                  }}
                >
                  <X className="w-4 h-4 mr-1" />
                  No
                </Button>
              </div>
            ) : (
              <>
                {action}
                <ToastClose />
              </>
            )}
          </Toast>
        )
      )}
      <ToastViewport />
    </ToastProvider>
  );
}

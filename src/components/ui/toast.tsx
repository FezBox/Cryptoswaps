"use client";

/**
 * Toast Component
 *
 * Individual toast notification with icon, message, and close button.
 */

import { CheckCircle, XCircle, Info, X } from "lucide-react";
import type { Toast } from "@/store/useToastStore";
import { cn } from "@/lib/utils";

interface ToastProps {
  toast: Toast;
  onClose: () => void;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
};

const styles = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  info: "bg-blue-600 text-white",
};

export function Toast({ toast, onClose }: ToastProps) {
  const Icon = icons[toast.type];

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg",
        "animate-[modal-fade-in_200ms_ease-out]",
        "min-w-[300px] max-w-md",
        styles[toast.type]
      )}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 hover:opacity-80 transition-opacity"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

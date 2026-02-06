"use client";

/**
 * Toast Container Component
 *
 * Renders all active toasts in a fixed position using React Portal.
 */

import { createPortal } from "react-dom";
import { useToastStore } from "@/store/useToastStore";
import { Toast } from "./toast";
import { useEffect, useState } from "react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>,
    document.body
  );
}

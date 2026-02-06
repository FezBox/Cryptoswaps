"use client";

/**
 * TransactionStatus Component
 *
 * Visual badge showing transaction status (pending/success/failed)
 */

import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { TransactionStatus } from "@/store/useTransactionsStore";
import { cn } from "@/lib/utils";

interface TransactionStatusProps {
  status: TransactionStatus;
}

const statusConfig = {
  pending: {
    icon: Loader2,
    label: "Pending",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    iconClassName: "animate-spin",
  },
  success: {
    icon: CheckCircle,
    label: "Success",
    className: "bg-green-100 text-green-700 border-green-200",
    iconClassName: "",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "bg-red-100 text-red-700 border-red-200",
    iconClassName: "",
  },
};

export function TransactionStatus({ status }: TransactionStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
        config.className
      )}
    >
      <Icon className={cn("w-3.5 h-3.5", config.iconClassName)} />
      <span>{config.label}</span>
    </div>
  );
}

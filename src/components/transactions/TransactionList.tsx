"use client";

/**
 * TransactionList Component
 *
 * Displays list of transactions with empty state
 */

import { PackageOpen } from "lucide-react";
import { TransactionCard } from "./TransactionCard";
import { useTransactionsStore } from "@/store/useTransactionsStore";

export function TransactionList() {
  const { transactions } = useTransactionsStore();

  // Empty state
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-full bg-primary-50 flex items-center justify-center mb-4">
          <PackageOpen className="w-10 h-10 text-primary-300" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          No transactions yet
        </h3>
        <p className="text-sm text-text-secondary text-center max-w-sm">
          Your swap transactions will appear here. Start by making your first
          swap!
        </p>
      </div>
    );
  }

  // Transaction list
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}

"use client";

/**
 * Transactions Page
 *
 * Displays user's swap transaction history
 */

import { TransactionList } from "@/components/transactions/TransactionList";
import { useTransactionsStore } from "@/store/useTransactionsStore";
import { Trash2 } from "lucide-react";

export default function TransactionsPage() {
  const { transactions, clearTransactions } = useTransactionsStore();

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Transactions
            </h1>
            <p className="text-text-secondary">
              View your swap transaction history
            </p>
          </div>

          {/* Clear button (only show if there are transactions) */}
          {transactions.length > 0 && (
            <button
              onClick={clearTransactions}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Transaction List */}
      <TransactionList />
    </div>
  );
}

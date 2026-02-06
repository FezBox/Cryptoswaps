/**
 * Transactions Store - Track swap transaction history
 *
 * Persists to localStorage for persistence across sessions.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Token } from "@/types";

export type TransactionStatus = "pending" | "success" | "failed";

export interface Transaction {
  id: string;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  status: TransactionStatus;
  timestamp: number;
  txHash?: string; // Optional transaction hash (mock for now)
  errorMessage?: string; // Error message if failed
}

interface TransactionsState {
  // State
  transactions: Transaction[];

  // Actions
  addTransaction: (
    transaction: Omit<Transaction, "id" | "timestamp">
  ) => string;
  updateTransactionStatus: (
    id: string,
    status: TransactionStatus,
    errorMessage?: string
  ) => void;
  clearTransactions: () => void;
}

export const useTransactionsStore = create<TransactionsState>()(
  persist(
    (set) => ({
      // Initial state
      transactions: [],

      // Add new transaction
      addTransaction: (transaction) => {
        const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newTransaction: Transaction = {
          ...transaction,
          id,
          timestamp: Date.now(),
        };

        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }));

        return id;
      },

      // Update transaction status
      updateTransactionStatus: (id, status, errorMessage) => {
        set((state) => ({
          transactions: state.transactions.map((tx) =>
            tx.id === id
              ? {
                  ...tx,
                  status,
                  errorMessage: status === "failed" ? errorMessage : undefined,
                  txHash:
                    status === "success"
                      ? `0x${Math.random().toString(16).substr(2, 64)}`
                      : tx.txHash,
                }
              : tx
          ),
        }));
      },

      // Clear all transactions
      clearTransactions: () => {
        set({ transactions: [] });
      },
    }),
    {
      name: "cryptoswaps-transactions", // localStorage key
    }
  )
);

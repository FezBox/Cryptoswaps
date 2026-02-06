"use client";

/**
 * TransactionCard Component
 *
 * Displays a single transaction with details
 */

import { ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { TransactionStatus } from "./TransactionStatus";
import type { Transaction } from "@/store/useTransactionsStore";

interface TransactionCardProps {
  transaction: Transaction;
}

/**
 * Format timestamp to readable date/time
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Show relative time for recent transactions
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  // Show full date for older transactions
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

/**
 * Truncate transaction hash
 */
function truncateHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const [copiedHash, setCopiedHash] = useState(false);

  const handleCopyHash = async () => {
    if (!transaction.txHash) return;

    try {
      await navigator.clipboard.writeText(transaction.txHash);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    } catch (error) {
      console.error("Failed to copy hash:", error);
    }
  };

  return (
    <div className="bg-white border border-primary-100 rounded-xl p-4 hover:border-primary-200 transition-colors">
      {/* Header - Status and Time */}
      <div className="flex items-center justify-between mb-3">
        <TransactionStatus status={transaction.status} />
        <span className="text-xs text-text-secondary">
          {formatTimestamp(transaction.timestamp)}
        </span>
      </div>

      {/* Swap Details */}
      <div className="flex items-center gap-3">
        {/* From Token */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-bold text-primary-600">
                {transaction.fromToken.symbol.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">
                {transaction.fromAmount} {transaction.fromToken.symbol}
              </div>
              <div className="text-xs text-text-secondary">
                {transaction.fromToken.name}
              </div>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <ArrowRight className="w-5 h-5 text-text-secondary flex-shrink-0" />

        {/* To Token */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center">
              <span className="text-sm font-bold text-accent">
                {transaction.toToken.symbol.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">
                {transaction.toAmount} {transaction.toToken.symbol}
              </div>
              <div className="text-xs text-text-secondary">
                {transaction.toToken.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Hash (if success) */}
      {transaction.txHash && transaction.status === "success" && (
        <div className="mt-3 pt-3 border-t border-primary-100">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-text-secondary">Transaction Hash</div>
            <div className="flex items-center gap-2">
              <code className="text-xs text-text-primary font-mono">
                {truncateHash(transaction.txHash)}
              </code>
              <button
                onClick={handleCopyHash}
                className="p-1 hover:bg-primary-50 rounded transition-colors"
                aria-label="Copy transaction hash"
              >
                {copiedHash ? (
                  <Check className="w-3.5 h-3.5 text-green-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-text-secondary" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message (if failed) */}
      {transaction.errorMessage && transaction.status === "failed" && (
        <div className="mt-3 pt-3 border-t border-primary-100">
          <div className="text-xs text-red-600">{transaction.errorMessage}</div>
        </div>
      )}
    </div>
  );
}

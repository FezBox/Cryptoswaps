/**
 * SwapConfirmationModal Component
 *
 * Critical safety gate requiring explicit user confirmation before ANY swap.
 * Displays all swap details, fees, and warnings. Cannot be accidentally closed.
 */

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { ArrowDown, AlertTriangle, Info, X } from "lucide-react";
import type { Token, Chain, SwapQuote } from "@/types";
import { useState } from "react";

interface SwapConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;

  // Swap details
  fromChain: Chain;
  toChain: Chain;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  quote: SwapQuote;
  slippage: number;
  quoteTimestamp?: number;
}

const PARTNER_FEE_PERCENTAGE = 0.1; // 0.10%
const QUOTE_EXPIRY_MS = 30 * 1000; // 30 seconds

export function SwapConfirmationModal({
  open,
  onClose,
  onConfirm,
  fromChain,
  toChain,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  quote,
  slippage,
  quoteTimestamp,
}: SwapConfirmationModalProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Calculate partner fee (0.10% of toAmount)
  const partnerFee = parseFloat(toAmount) * (PARTNER_FEE_PERCENTAGE / 100);
  const toAmountAfterFee = parseFloat(toAmount) - partnerFee;

  // Calculate minimum received (after fee AND slippage)
  const minimumReceived = toAmountAfterFee * (1 - slippage / 100);

  // Calculate USD value for large swap warning
  const fromUsdValue =
    fromToken.price ? parseFloat(fromAmount) * fromToken.price : 0;

  // Check quote staleness
  const isQuoteStale =
    quoteTimestamp && Date.now() - quoteTimestamp > QUOTE_EXPIRY_MS;

  // Warning conditions
  const warnings = [];

  if (slippage > 3) {
    warnings.push({
      type: "high-slippage" as const,
      message: "Your transaction may result in significantly fewer tokens than expected.",
    });
  }

  if (quote.priceImpact > 3) {
    warnings.push({
      type: "high-impact" as const,
      message: "This swap will significantly affect the market price.",
    });
  }

  if (fromUsdValue > 10000) {
    warnings.push({
      type: "large-swap" as const,
      message: "You are swapping a large amount. Please verify all details carefully.",
    });
  }

  const handleBackdropClick = () => {
    if (!showCancelConfirm) {
      setShowCancelConfirm(true);
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelConfirm(false);
    onClose();
  };

  const handleKeepOpen = () => {
    setShowCancelConfirm(false);
  };

  return (
    <Modal open={open} onClose={handleBackdropClick}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-text-primary dark:text-white">
            Review Swap
          </h2>
          <button
            onClick={() => setShowCancelConfirm(true)}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Swap Overview */}
        <div className="space-y-3 py-4">
          {/* From */}
          <div className="p-3 rounded-lg bg-primary-50 dark:bg-zinc-700/50">
            <p className="text-xs text-text-secondary dark:text-zinc-400 mb-1">From</p>
            <p className="text-lg font-semibold text-text-primary dark:text-white">
              {fromAmount} {fromToken.symbol}
            </p>
            <p className="text-xs text-text-secondary dark:text-zinc-400">{fromChain.name}</p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center">
            <ArrowDown className="h-5 w-5 text-text-secondary dark:text-zinc-400" />
          </div>

          {/* To */}
          <div className="p-3 rounded-lg bg-primary-50 dark:bg-zinc-700/50">
            <p className="text-xs text-text-secondary dark:text-zinc-400 mb-1">To</p>
            <p className="text-lg font-semibold text-text-primary dark:text-white">
              ~{toAmount} {toToken.symbol}
            </p>
            <p className="text-xs text-text-secondary dark:text-zinc-400">{toChain.name}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-zinc-700" />

        {/* Details */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2 text-text-primary dark:text-white">
            <Info className="h-4 w-4" />
            Details
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary dark:text-zinc-400">Rate</span>
              <span className="font-medium text-text-primary dark:text-white">
                1 {fromToken.symbol} = {quote.rate.toFixed(6)} {toToken.symbol}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-secondary dark:text-zinc-400">Partner Fee</span>
              <span className="font-medium text-text-primary dark:text-white">
                {PARTNER_FEE_PERCENTAGE}% ({partnerFee.toFixed(4)} {toToken.symbol})
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-secondary dark:text-zinc-400">Price Impact</span>
              <span
                className={`font-medium ${
                  quote.priceImpact > 3
                    ? "text-red-600"
                    : quote.priceImpact > 1
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {quote.priceImpact.toFixed(2)}%
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-secondary dark:text-zinc-400">Network Fee</span>
              <span className="font-medium text-text-primary dark:text-white">
                ~${quote.estimatedGas}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-text-secondary dark:text-zinc-400">Max Slippage</span>
              <span className="font-medium text-text-primary dark:text-white">
                {slippage}%
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-zinc-700" />

        {/* Minimum Received */}
        <div className="flex justify-between items-center p-3 rounded-lg bg-primary-100 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
          <span className="text-sm font-semibold text-text-primary dark:text-white">
            Minimum Received
          </span>
          <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
            {minimumReceived.toFixed(4)} {toToken.symbol}
          </span>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                {warnings.map((warning, idx) => (
                  <p key={idx} className="text-sm text-red-800 dark:text-red-200">
                    {warning.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stale Quote Warning */}
        {isQuoteStale && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800 dark:text-red-200">
                Quote expired. Please refresh to get a new quote.
              </p>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Overlay */}
        {showCancelConfirm && (
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-200">
                Cancel this swap?
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleKeepOpen} className="flex-1">
                  No, keep open
                </Button>
                <Button variant="accent" size="sm" onClick={handleConfirmCancel} className="flex-1">
                  Yes, cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!showCancelConfirm && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => setShowCancelConfirm(true)} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={onConfirm} disabled={!!isQuoteStale} className="flex-1">
              Confirm Swap
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

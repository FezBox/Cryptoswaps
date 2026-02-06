"use client";

/**
 * SwapCard Component
 *
 * Main swap interface combining all swap components.
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSwitchChain } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import TokenInput from "./TokenInput";
import Button from "@/components/ui/button";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSwapStore } from "@/store/useSwapStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useToastStore } from "@/store/useToastStore";
import { useTransactionsStore } from "@/store/useTransactionsStore";
import { useDebounce } from "@/hooks/useDebounce";
import SettingsButton from "./SettingsButton";
import SlippageModal from "./SlippageModal";
import { SwapConfirmationModal } from "./SwapConfirmationModal";
import { SwapProgressModal, SwapStep } from "./SwapProgressModal";
import { useSwapRecoveryStore } from "@/store/useSwapRecoveryStore";

// Mapping of chain names to wagmi chain IDs
const CHAIN_ID_MAP: Record<string, number> = {
  ethereum: 1,
  arbitrum: 42161,
  base: 8453,
  bsc: 56,
  optimism: 10,
  polygon: 137,
  avalanche: 43114,
};

export default function SwapCard() {
  const [isSlippageModalOpen, setIsSlippageModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [swapProgress, setSwapProgress] = useState<SwapStep>(SwapStep.CREATING_INTENT);
  const [swapTxHash, setSwapTxHash] = useState<string | undefined>();
  const [swapErrorMessage, setSwapErrorMessage] = useState<string | undefined>();

  const {
    fromChain,
    toChain,
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    setFromChain,
    setToChain,
    setFromToken,
    setToToken,
    setFromAmount,
    flipSwap,
    reset,
    quote,
    isLoadingQuote,
    quoteError,
    quoteTimestamp,
    fetchQuote,
    executeSwap,
    isExecutingSwap,
    swapError,
    slippage,
  } = useSwapStore();

  const { isConnected, chainId } = useWalletStore();
  const { addToast } = useToastStore();
  const { addTransaction, updateTransactionStatus } = useTransactionsStore();
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain();
  const { openConnectModal } = useConnectModal();

  // Debounce fromAmount to avoid excessive quote fetching
  const debouncedFromAmount = useDebounce(fromAmount, 500);

  // Fetch quote when debounced amount or tokens change
  useEffect(() => {
    if (
      fromToken &&
      toToken &&
      debouncedFromAmount &&
      parseFloat(debouncedFromAmount) > 0
    ) {
      fetchQuote();
    }
  }, [debouncedFromAmount, fromToken, toToken, fetchQuote]);

  // Calculate swap button state and text
  const getSwapButtonState = () => {
    if (!fromToken || !toToken) {
      return { disabled: true, text: "Select tokens" };
    }
    if (!fromAmount || parseFloat(fromAmount) === 0) {
      return { disabled: true, text: "Enter amount" };
    }
    if (isLoadingQuote) {
      return { disabled: true, text: "Fetching quote..." };
    }
    if (quoteError || !quote) {
      return { disabled: true, text: "Quote unavailable" };
    }
    if (!isConnected) {
      return {
        disabled: false,
        text: "Connect Wallet",
        onClick: () => openConnectModal?.(),
      };
    }

    // Check if we need to switch network
    if (fromChain && isConnected) {
      const requiredChainId = CHAIN_ID_MAP[fromChain.name.toLowerCase()];
      if (requiredChainId && chainId !== requiredChainId) {
        return {
          disabled: isSwitchingChain,
          text: isSwitchingChain
            ? `Switching to ${fromChain.name}...`
            : `Switch to ${fromChain.name}`,
          onClick: async () => {
            try {
              await switchChain({ chainId: requiredChainId });
            } catch (error) {
              addToast({
                type: "error",
                message: `Failed to switch to ${fromChain.name}`,
              });
            }
          },
        };
      }
    }

    return {
      disabled: false,
      text: "Swap",
      onClick: () => setIsConfirmationModalOpen(true), // Open confirmation modal
    };
  };

  const buttonState = getSwapButtonState();

  // Confirm swap handler - opens progress modal and executes swap
  const handleConfirmSwap = async () => {
    if (!fromToken || !toToken || !quote) return;

    // Close confirmation modal
    setIsConfirmationModalOpen(false);

    // Open progress modal
    setIsProgressModalOpen(true);
    setSwapProgress(SwapStep.CREATING_INTENT);
    setSwapTxHash(undefined);
    setSwapErrorMessage(undefined);

    // Execute swap with progress tracking
    await executeSwapWithProgress();
  };

  // Execute swap with progress tracking
  const executeSwapWithProgress = async () => {
    if (!fromToken || !toToken || !quote) return;

    try {
      // Step 1: Creating intent
      setSwapProgress(SwapStep.CREATING_INTENT);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 2: Signing
      setSwapProgress(SwapStep.SIGNING_TX);

      // Step 3: Submitting
      setSwapProgress(SwapStep.SUBMITTING_TX);

      // Create pending transaction
      const txId = addTransaction({
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        status: "pending",
      });

      // Execute swap (spoke provider created internally from wagmi)
      const result = await executeSwap();

      if (!result.success) {
        throw new Error(swapError || "Swap failed");
      }

      setSwapTxHash(result.txHash || undefined);

      // Save to recovery store
      if (result.txHash) {
        useSwapRecoveryStore.getState().setPendingSwap({
          txHash: result.txHash,
          fromToken,
          toToken,
          fromAmount,
          toAmount,
          timestamp: Date.now(),
          step: SwapStep.CONFIRMING_TX,
        });
      }

      // Step 4: Confirming
      setSwapProgress(SwapStep.CONFIRMING_TX);
      // TODO: Wait for confirmation from SDK
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Step 5: Complete
      setSwapProgress(SwapStep.COMPLETE);

      // Clear recovery store
      useSwapRecoveryStore.getState().clearPendingSwap();

      // Update transaction to success
      updateTransactionStatus(txId, "success");

      // Success toast
      addToast({
        type: "success",
        message: `Swapped ${fromAmount} ${fromToken.symbol} → ${toAmount} ${toToken.symbol}`,
      });

      // Reset form after short delay
      setTimeout(() => reset(), 2000);
    } catch (error) {
      setSwapProgress(SwapStep.FAILED);
      setSwapErrorMessage((error as Error).message || "Unknown error");

      addToast({
        type: "error",
        message: swapError || "Swap failed",
      });
    }
  };

  // Retry swap handler
  const handleRetrySwap = () => {
    // Close progress modal
    setIsProgressModalOpen(false);

    // Re-open confirmation modal for user to review again
    setIsConfirmationModalOpen(true);
  };

  // Recovery check on mount
  useEffect(() => {
    const { pendingSwap, hasPendingSwap, clearPendingSwap } =
      useSwapRecoveryStore.getState();

    if (hasPendingSwap() && pendingSwap) {
      const shouldRecover = window.confirm(
        `You have a pending swap: ${pendingSwap.fromAmount} ${pendingSwap.fromToken.symbol} → ${pendingSwap.toToken.symbol}.\n\n` +
          `Transaction: ${pendingSwap.txHash}\n\n` +
          `Would you like to check its status?`
      );

      if (shouldRecover) {
        setIsProgressModalOpen(true);
        setSwapProgress(pendingSwap.step);
        setSwapTxHash(pendingSwap.txHash);
        // TODO: Check transaction status
      } else {
        clearPendingSwap();
      }
    }
  }, []);

  // Placeholder swap details (would be calculated from actual swap quote)
  const showDetails = fromToken && toToken && fromAmount && parseFloat(fromAmount) > 0;

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white dark:bg-[#1E1E1E] rounded-3xl border border-[#E0E0E0] dark:border-[#444444] p-6 shadow-sm">
        {/* Header with Settings Button */}
        <div className="flex justify-end mb-4">
          <SettingsButton onClick={() => setIsSlippageModalOpen(true)} />
        </div>

        {/* From Input */}
        <TokenInput
          label="From"
          chain={fromChain}
          token={fromToken}
          amount={fromAmount}
          onAmountChange={setFromAmount}
          onChainSelect={setFromChain}
          onTokenSelect={setFromToken}
        />

        {/* Flip Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <motion.button
            onClick={flipSwap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            className="bg-white dark:bg-[#333333] border-2 border-[#E0E0E0] dark:border-[#444444] rounded-xl p-2
                       hover:bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] hover:border-[#CCCCCC] dark:hover:border-[#555555] transition-colors
                       shadow-sm"
            aria-label="Flip tokens"
          >
            <ArrowDownUp className="w-5 h-5 text-[#666666] dark:text-white" />
          </motion.button>
        </div>

        {/* To Input */}
        <TokenInput
          label="To"
          chain={toChain}
          token={toToken}
          amount={toAmount}
          onAmountChange={() => {}} // No-op since amount is calculated
          onChainSelect={setToChain}
          onTokenSelect={setToToken}
          isLoading={isLoadingQuote}
        />

        {/* Swap Details - Loading State */}
        <AnimatePresence mode="wait">
          {showDetails && isLoadingQuote && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="mt-4 p-4 bg-[#F8F8F8] dark:bg-[#252525] rounded-xl border border-[#EEEEEE] dark:border-[#444444] space-y-2 overflow-hidden"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-secondary dark:text-[#999999]">
                  Fetching quote...
                </span>
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            </motion.div>
          )}

          {/* Swap Details - Quote Data */}
          {showDetails && !isLoadingQuote && quote && (
            <motion.div
              key="quote"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="mt-4 p-4 bg-[#F8F8F8] dark:bg-[#252525] rounded-xl border border-[#EEEEEE] dark:border-[#444444] space-y-2 overflow-hidden"
            >
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-dark-text-secondary">Rate</span>
                <span className="text-text-primary dark:text-white font-medium">
                  1 {fromToken.symbol} = {quote.rate.toFixed(6)} {toToken.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-dark-text-secondary">Partner Fee</span>
                <span className="text-text-primary dark:text-white font-medium">
                  0.10% ({(parseFloat(toAmount) * 0.001).toFixed(4)} {toToken.symbol})
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-dark-text-secondary">Price Impact</span>
                <span
                  className={cn(
                    "font-medium",
                    quote.priceImpact < 1
                      ? "text-[#16A34A] dark:text-[#4ADE80]"
                      : quote.priceImpact < 3
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-red-600 dark:text-red-400"
                  )}
                >
                  {quote.priceImpact.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-dark-text-secondary">Network Fee</span>
                <span className="text-text-primary dark:text-white font-medium">
                  ~${quote.estimatedGas}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary dark:text-dark-text-secondary">Max Slippage</span>
                <span className="text-text-primary dark:text-white font-medium">
                  {slippage}%
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-[#E0E0E0] dark:border-[#444444]">
                <span className="text-text-secondary dark:text-dark-text-secondary">Minimum Received</span>
                <span className="text-text-primary dark:text-white font-medium">
                  {parseFloat(quote.minimumReceived).toFixed(6)} {toToken.symbol}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quote Error */}
        <AnimatePresence>
          {quoteError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl overflow-hidden"
            >
              <p className="text-sm text-red-600 dark:text-red-400">{quoteError}</p>
              <button
                onClick={fetchQuote}
                className="text-sm text-red-700 dark:text-red-400 underline mt-2 hover:text-red-800 dark:hover:text-red-300"
              >
                Retry
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swap Button */}
        <Button
          className="w-full mt-4"
          size="lg"
          disabled={buttonState.disabled}
          loading={isExecutingSwap}
          onClick={buttonState.onClick}
        >
          {buttonState.text}
        </Button>
      </div>

      {/* Slippage Settings Modal */}
      <SlippageModal
        open={isSlippageModalOpen}
        onClose={() => setIsSlippageModalOpen(false)}
      />

      {/* Swap Confirmation Modal */}
      {fromChain && toChain && fromToken && toToken && quote && (
        <SwapConfirmationModal
          open={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          onConfirm={handleConfirmSwap}
          fromChain={fromChain}
          toChain={toChain}
          fromToken={fromToken}
          toToken={toToken}
          fromAmount={fromAmount}
          toAmount={toAmount}
          quote={quote}
          slippage={slippage}
          quoteTimestamp={quoteTimestamp || undefined}
        />
      )}

      {/* Swap Progress Modal */}
      {fromToken && toToken && toChain && (
        <SwapProgressModal
          open={isProgressModalOpen}
          onClose={() => setIsProgressModalOpen(false)}
          onRetry={handleRetrySwap}
          currentStep={swapProgress}
          txHash={swapTxHash}
          error={swapErrorMessage}
          fromToken={fromToken}
          toToken={toToken}
          fromAmount={fromAmount}
          toAmount={toAmount}
          toChain={toChain}
        />
      )}
    </div>
  );
}

/**
 * SwapProgressModal Component
 *
 * Displays real-time progress during swap execution with step-by-step feedback.
 * Cannot be closed during execution, only on success or failure.
 */

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { getExplorerUrl, getExplorerName } from "@/lib/blockExplorers";
import { sodaxToEvmChainId } from "@/lib/sodax/chains";
import type { Token, Chain } from "@/types";
import { Loader2, CheckCircle2, XCircle, Circle, X } from "lucide-react";

export enum SwapStep {
  APPROVING = "approving",
  CREATING_INTENT = "creating_intent",
  SIGNING_TX = "signing_tx",
  SUBMITTING_TX = "submitting_tx",
  CONFIRMING_TX = "confirming_tx",
  POLLING_STATUS = "polling_status",
  PENDING_CONFIRMATION = "pending_confirmation",
  COMPLETE = "complete",
  FAILED = "failed",
}

interface SwapProgressModalProps {
  open: boolean;
  onClose: () => void;
  onRetry: () => void;

  currentStep: SwapStep;
  txHash?: string;
  error?: string;

  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  toChain: Chain;
}

interface StepInfo {
  id: SwapStep;
  label: string;
}

const STEPS: StepInfo[] = [
  { id: SwapStep.APPROVING, label: "Approving token..." },
  { id: SwapStep.CREATING_INTENT, label: "Creating swap intent..." },
  { id: SwapStep.SIGNING_TX, label: "Signing transaction..." },
  { id: SwapStep.SUBMITTING_TX, label: "Submitting to network..." },
  { id: SwapStep.CONFIRMING_TX, label: "Waiting for confirmation..." },
  { id: SwapStep.POLLING_STATUS, label: "Checking solver status..." },
];

function StepIcon({ step, currentStep }: { step: SwapStep; currentStep: SwapStep }) {
  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  // Failed state
  if (currentStep === SwapStep.FAILED && stepIndex === currentIndex) {
    return <XCircle className="h-5 w-5 text-destructive" />;
  }

  // Complete state
  if (currentStep === SwapStep.COMPLETE || stepIndex < currentIndex) {
    return <CheckCircle2 className="h-5 w-5 text-green-600" />;
  }

  // Active state
  if (stepIndex === currentIndex) {
    return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
  }

  // Pending state
  return <Circle className="h-5 w-5 text-muted-foreground" />;
}

function StepStatus({ step, currentStep }: { step: SwapStep; currentStep: SwapStep }) {
  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  if (currentStep === SwapStep.FAILED && stepIndex === currentIndex) {
    return <span className="text-xs text-destructive font-medium">Failed</span>;
  }

  if (currentStep === SwapStep.COMPLETE || stepIndex < currentIndex) {
    return <span className="text-xs text-green-600 font-medium">Done</span>;
  }

  if (stepIndex === currentIndex) {
    return <span className="text-xs text-primary font-medium">Active</span>;
  }

  return <span className="text-xs text-muted-foreground">Pending</span>;
}

export function SwapProgressModal({
  open,
  onClose,
  onRetry,
  currentStep,
  txHash,
  error,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  toChain,
}: SwapProgressModalProps) {
  const isExecuting =
    currentStep !== SwapStep.COMPLETE &&
    currentStep !== SwapStep.FAILED &&
    currentStep !== SwapStep.PENDING_CONFIRMATION;

  const evmChainId = toChain?.id ? sodaxToEvmChainId(toChain.id) : undefined;
  const explorerUrl = txHash && evmChainId ? getExplorerUrl(evmChainId, txHash) : undefined;
  const explorerName = evmChainId ? getExplorerName(evmChainId) : "Block Explorer";

  const handleClose = () => {
    if (!isExecuting) {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-text-primary dark:text-white">
            {currentStep === SwapStep.COMPLETE
              ? "Swap Successful!"
              : currentStep === SwapStep.PENDING_CONFIRMATION
              ? "Swap Submitted"
              : currentStep === SwapStep.FAILED
              ? "Swap Failed"
              : "Processing Swap"}
          </h2>
          {!isExecuting && (
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Success State */}
        {currentStep === SwapStep.COMPLETE && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
            <div className="text-center space-y-2">
              <p className="text-sm text-text-secondary dark:text-zinc-400">
                Successfully swapped
              </p>
              <p className="text-lg font-semibold text-text-primary dark:text-white">
                {fromAmount} {fromToken.symbol} → {toAmount} {toToken.symbol}
              </p>
            </div>

            {txHash && explorerUrl && (
              <div className="text-center space-y-2 w-full">
                <p className="text-xs text-text-secondary dark:text-zinc-400">
                  Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    View on {explorerName} →
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Pending Confirmation State */}
        {currentStep === SwapStep.PENDING_CONFIRMATION && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <div className="text-center space-y-2">
              <p className="font-semibold text-text-primary dark:text-white">
                Swap submitted successfully!
              </p>
              <p className="text-sm text-text-secondary dark:text-zinc-400 max-w-sm">
                Cross-chain transfer in progress. Your tokens may take 1-2 minutes to arrive.
              </p>
            </div>

            {txHash && explorerUrl && (
              <div className="text-center space-y-2 w-full">
                <p className="text-xs text-text-secondary dark:text-zinc-400">
                  Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    View on {explorerName} →
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {currentStep === SwapStep.FAILED && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <XCircle className="h-16 w-16 text-red-600" />
            <div className="text-center space-y-2">
              <p className="font-semibold text-text-primary dark:text-white">
                Transaction failed
              </p>
              <p className="text-sm text-text-secondary dark:text-zinc-400 max-w-sm">
                {error || "An unknown error occurred during the swap."}
              </p>
            </div>
          </div>
        )}

        {/* Polling Status State */}
        {currentStep === SwapStep.POLLING_STATUS && (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <div className="text-center space-y-2">
              <p className="font-semibold text-text-primary dark:text-white">
                Swap submitted, checking status...
              </p>
              <p className="text-sm text-text-secondary dark:text-zinc-400 max-w-sm">
                Checking with solver. This may take up to 2 minutes.
              </p>
            </div>

            {txHash && explorerUrl && (
              <div className="text-center space-y-2 w-full">
                <p className="text-xs text-text-secondary dark:text-zinc-400">
                  Transaction: {txHash.slice(0, 10)}...{txHash.slice(-8)}
                </p>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    View on {explorerName} →
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}

        {/* Progress Steps */}
        {currentStep !== SwapStep.COMPLETE &&
         currentStep !== SwapStep.FAILED &&
         currentStep !== SwapStep.PENDING_CONFIRMATION &&
         currentStep !== SwapStep.POLLING_STATUS && (
          <div className="space-y-3">
            {STEPS.map((step) => (
              <div key={step.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <StepIcon step={step.id} currentStep={currentStep} />
                  <span className="text-sm text-text-primary dark:text-zinc-200">
                    {step.label}
                  </span>
                </div>
                <StepStatus step={step.id} currentStep={currentStep} />
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          {currentStep === SwapStep.FAILED && (
            <>
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button variant="primary" onClick={onRetry} className="flex-1">
                Try Again
              </Button>
            </>
          )}

          {currentStep === SwapStep.PENDING_CONFIRMATION && (
            <Button variant="primary" onClick={onClose} className="w-full">
              Close
            </Button>
          )}

          {currentStep === SwapStep.COMPLETE && (
            <Button variant="primary" onClick={onClose} className="w-full">
              Close
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

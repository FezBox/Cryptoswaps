/**
 * Swap Recovery Store
 *
 * Persists pending swaps in localStorage for browser recovery.
 * Allows users to track swap progress even after browser close/reload.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Token } from "@/types";
import { SwapStep } from "@/components/swap/SwapProgressModal";

interface PendingSwap {
  txHash: string;
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  timestamp: number;
  step: SwapStep;
}

interface SwapRecoveryState {
  pendingSwap: PendingSwap | null;

  // Actions
  setPendingSwap: (swap: PendingSwap) => void;
  clearPendingSwap: () => void;
  hasPendingSwap: () => boolean;
}

const PENDING_SWAP_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export const useSwapRecoveryStore = create<SwapRecoveryState>()(
  persist(
    (set, get) => ({
      pendingSwap: null,

      setPendingSwap: (swap: PendingSwap) => {
        set({ pendingSwap: swap });
      },

      clearPendingSwap: () => {
        set({ pendingSwap: null });
      },

      hasPendingSwap: () => {
        const { pendingSwap } = get();

        // No pending swap
        if (!pendingSwap) {
          return false;
        }

        // Check if swap is expired (older than 1 hour)
        const isExpired =
          Date.now() - pendingSwap.timestamp > PENDING_SWAP_EXPIRY_MS;

        if (isExpired) {
          // Auto-clear expired swap
          set({ pendingSwap: null });
          return false;
        }

        // Valid pending swap exists
        return true;
      },
    }),
    {
      name: "swap-recovery-storage",
      version: 1,
    }
  )
);

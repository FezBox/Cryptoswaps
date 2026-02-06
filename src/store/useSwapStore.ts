/**
 * Swap Store - Global state for swap form
 *
 * Manages the swap interface state including selected chains, tokens, and amounts.
 * Integrated with SODAX SDK for real quotes and swap execution.
 */

import { create } from "zustand";
import type { Chain, Token } from "@/types";
import type { SodaxSwapQuote } from "@/lib/sodax/types";
import { fetchSodaxQuote } from "@/lib/sodax/quote";
import { executeSodaxSwap } from "@/lib/sodax/swap";
import { validateSwapAmount } from "@/lib/sodax/utils";
import { getUserFriendlyError } from "@/lib/sodax/errors";
import { SwapStep } from "@/components/swap/SwapProgressModal";
import { getAccount, switchChain } from "wagmi/actions";
import { config } from "@/lib/wagmi/config";
import { createEvmSpokeProvider } from "@/lib/sodax/spokeProvider";
import { sodaxToEvmChainId } from "@/lib/sodax/chains";

interface SwapState {
  // State
  fromChain: Chain | null;
  toChain: Chain | null;
  fromToken: Token | null;
  toToken: Token | null;
  fromAmount: string;
  toAmount: string;

  // Quote state
  quote: SodaxSwapQuote | null;
  isLoadingQuote: boolean;
  quoteError: string | null;
  quoteTimestamp: number | null;

  // Swap execution state
  isExecutingSwap: boolean;
  swapError: string | null;

  // Transaction tracking
  currentTxHash: string | null;
  currentSwapStep: SwapStep | null;

  // SDK error tracking
  sdkError: {
    code: string;
    message: string;
    details?: any;
  } | null;

  // Settings
  slippage: number; // Slippage tolerance as percentage (e.g., 0.5 = 0.5%)

  // Actions
  setFromChain: (chain: Chain | null) => void;
  setToChain: (chain: Chain | null) => void;
  setFromToken: (token: Token | null) => void;
  setToToken: (token: Token | null) => void;
  setFromAmount: (amount: string) => void;
  setToAmount: (amount: string) => void;
  flipSwap: () => void;
  reset: () => void;

  // Quote actions
  fetchQuote: () => Promise<void>;
  executeSwap: () => Promise<{ success: boolean; txHash: string | null }>;
  clearQuote: () => void;

  // Settings actions
  setSlippage: (slippage: number) => void;
}

const initialState = {
  fromChain: null,
  toChain: null,
  fromToken: null,
  toToken: null,
  fromAmount: "",
  toAmount: "",
  quote: null,
  isLoadingQuote: false,
  quoteError: null,
  quoteTimestamp: null,
  isExecutingSwap: false,
  swapError: null,
  currentTxHash: null,
  currentSwapStep: null,
  sdkError: null,
  slippage: 0.5, // Default 0.5% slippage tolerance
};

export const useSwapStore = create<SwapState>((set) => ({
  // Initial state
  ...initialState,

  // Actions
  setFromChain: (chain) => set({ fromChain: chain }),

  setToChain: (chain) => set({ toChain: chain }),

  setFromToken: (token) => set({ fromToken: token }),

  setToToken: (token) => set({ toToken: token }),

  setFromAmount: (amount) => set({ fromAmount: amount }),

  setToAmount: (amount) => set({ toAmount: amount }),

  flipSwap: () =>
    set((state) => ({
      fromChain: state.toChain,
      toChain: state.fromChain,
      fromToken: state.toToken,
      toToken: state.fromToken,
      fromAmount: state.toAmount,
      toAmount: state.fromAmount,
      quote: null,
      quoteError: null,
    })),

  reset: () => set(initialState),

  // Quote actions
  fetchQuote: async () => {
    const state = useSwapStore.getState();
    const { fromToken, toToken, fromAmount, slippage } = state;

    // Validation
    if (
      !fromToken ||
      !toToken ||
      !fromAmount ||
      parseFloat(fromAmount) === 0
    ) {
      set({ quote: null, quoteError: null, toAmount: "" });
      return;
    }

    // Validate amount
    const validation = validateSwapAmount(fromAmount, fromToken);
    if (!validation.valid) {
      set({ quoteError: validation.error, quote: null, toAmount: "" });
      return;
    }

    set({ isLoadingQuote: true, quoteError: null, sdkError: null });

    try {
      // Fetch real quote from SODAX SDK
      const quote = await fetchSodaxQuote(
        fromToken,
        toToken,
        fromAmount,
        slippage
      );

      // Verify parameters haven't changed during the async operation (stale check)
      const current = useSwapStore.getState();
      if (
        current.fromToken?.symbol !== quote.fromToken.symbol ||
        current.toToken?.symbol !== quote.toToken.symbol ||
        current.fromAmount !== quote.fromAmount
      ) {
        return; // Stale request, ignore
      }

      set({
        quote,
        isLoadingQuote: false,
        quoteError: null,
        quoteTimestamp: Date.now(),
        toAmount: quote.toAmount,
      });
    } catch (err) {
      set({
        quote: null,
        isLoadingQuote: false,
        quoteError: getUserFriendlyError(err),
        toAmount: "",
      });
      console.error("Quote fetch error:", err);
    }
  },

  executeSwap: async () => {
    const state = useSwapStore.getState();
    const { quote, slippage, quoteTimestamp, fromToken } = state;

    if (!quote) {
      set({ swapError: "No quote available" });
      return { success: false, txHash: null };
    }

    // Check quote staleness (30 seconds)
    if (quoteTimestamp && Date.now() - quoteTimestamp > 30000) {
      set({ swapError: "Quote expired. Please refresh." });
      return { success: false, txHash: null };
    }

    // Check if token is native or ERC-20 to set initial step
    const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";
    const isNativeToken = fromToken?.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();
    const initialStep = isNativeToken ? SwapStep.CREATING_INTENT : SwapStep.APPROVING;

    set({
      isExecutingSwap: true,
      swapError: null,
      sdkError: null,
      currentTxHash: null,
      currentSwapStep: initialStep,
    });

    try {
      // Get wallet address from wagmi
      const account = getAccount(config);
      const userAddress = account.address;
      if (!userAddress) {
        throw new Error("Wallet not connected");
      }

      // Get EVM chain ID from source token
      if (!fromToken) {
        throw new Error("Source token not selected");
      }
      const evmChainId = sodaxToEvmChainId(fromToken.chainId);
      if (!evmChainId) {
        throw new Error(`Unsupported chain: ${fromToken.chainId}`);
      }

      // Switch wallet to source chain if needed
      const currentChainId = account.chainId;
      if (currentChainId !== evmChainId) {
        await switchChain(config, { chainId: evmChainId as any });
      }

      // Create EVM spoke provider from wagmi wallet client
      const spokeProvider = await createEvmSpokeProvider(evmChainId);

      // Update UI to show creating intent step
      set({ currentSwapStep: SwapStep.CREATING_INTENT });

      // Execute swap through SODAX SDK (includes status polling)
      const result = await executeSodaxSwap({
        quote,
        userAddress,
        slippage,
        spokeProvider,
      });

      console.log('[Swap Store] Swap result:', {
        success: result.success,
        txHash: result.txHash,
        intentHash: result.intentHash,
        srcChainId: result.srcChainId,
        dstChainId: result.dstChainId,
      });

      // Swap submitted successfully - show success immediately
      // The solver acknowledged the swap, user can verify on block explorer
      set({
        isExecutingSwap: false,
        currentSwapStep: SwapStep.COMPLETE,
        currentTxHash: result.txHash,
      });
      return { success: true, txHash: result.txHash };
    } catch (err) {
      const errorMessage = getUserFriendlyError(err);

      set({
        isExecutingSwap: false,
        currentSwapStep: SwapStep.FAILED,
        swapError: errorMessage,
        sdkError: {
          code: (err as any).code || "unknown",
          message: errorMessage,
          details: (err as any).details,
        },
      });

      console.error("Swap execution error:", err);
      return { success: false, txHash: null };
    }
  },

  clearQuote: () => {
    set({ quote: null, quoteError: null, toAmount: "" });
  },

  // Settings actions
  setSlippage: (slippage) => set({ slippage }),
}));

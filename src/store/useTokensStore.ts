/**
 * Tokens Store - Global state for swap tokens
 *
 * Fetches all tokens once and caches them by chain.
 */

import { create } from "zustand";
import { getAllTokens } from "@/lib/mcp/methods";
import { MCPError } from "@/lib/mcp/client";
import type { Token, ChainId } from "@/types";

interface TokensState {
  // State
  tokensByChain: Record<string, Token[]>;
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;

  // Actions
  fetchAllTokens: () => Promise<void>;
  fetchTokensForChain: (chainId: ChainId) => Promise<void>;
  getTokensForChain: (chainId: ChainId) => Token[];
  isLoadingChain: (chainId: ChainId) => boolean;
}

export const useTokensStore = create<TokensState>((set, get) => ({
  // Initial state
  tokensByChain: {},
  isLoading: false,
  hasFetched: false,
  error: null,

  // Actions
  fetchAllTokens: async () => {
    const { hasFetched, isLoading } = get();

    // Don't fetch if already fetched or currently loading
    if (hasFetched || isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const allTokens = await getAllTokens();

      set({
        tokensByChain: allTokens,
        isLoading: false,
        hasFetched: true,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching all tokens:", err);

      let errorMessage = "An unknown error occurred";
      if (err instanceof MCPError) {
        errorMessage = `MCP Error (${err.code}): ${err.message}`;
      } else if (err instanceof Error) {
        errorMessage = `Error: ${err.message}`;
      }

      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  fetchTokensForChain: async (_chainId: ChainId) => {
    // This now just triggers fetchAllTokens
    await get().fetchAllTokens();
  },

  // Getter for tokens of a specific chain
  getTokensForChain: (chainId: ChainId) => {
    return get().tokensByChain[chainId] || [];
  },

  // Check if tokens are currently loading
  isLoadingChain: (_chainId: ChainId) => {
    return get().isLoading;
  },
}));

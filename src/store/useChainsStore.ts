/**
 * Chains Store - Global state for blockchain chains
 *
 * Fetches and caches supported chains from the SODAX MCP API.
 */

import { create } from "zustand";
import { getChains } from "@/lib/mcp/methods";
import { MCPError } from "@/lib/mcp/client";
import type { Chain } from "@/types";

interface ChainsState {
  // State
  chains: Chain[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchChains: () => Promise<void>;
}

export const useChainsStore = create<ChainsState>((set) => ({
  // Initial state
  chains: [],
  isLoading: false,
  error: null,

  // Actions
  fetchChains: async () => {
    set({ isLoading: true, error: null });

    try {
      const fetchedChains = await getChains();
      set({
        chains: Array.isArray(fetchedChains) ? fetchedChains : [],
        isLoading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching chains:", err);

      let errorMessage = "An unknown error occurred";
      if (err instanceof MCPError) {
        errorMessage = `MCP Error (${err.code}): ${err.message}`;
      } else if (err instanceof Error) {
        errorMessage = `Error: ${err.message}`;
      }

      set({
        chains: [],
        isLoading: false,
        error: errorMessage,
      });
    }
  },
}));

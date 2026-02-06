/**
 * Wallet Store - Global state for wallet connection
 *
 * Uses wagmi hooks to provide wallet connection state and actions.
 * This is a wrapper around wagmi's useAccount for backward compatibility.
 */

"use client";

import { useAccount, useDisconnect, useChainId } from "wagmi";

/**
 * Custom hook that wraps wagmi's useAccount to provide wallet state
 * Maintains the same API as the previous Zustand store for backward compatibility
 */
export function useWalletStore() {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();

  return {
    // State
    address: address || null,
    isConnected,
    walletType: connector?.name?.toLowerCase() || null,
    chainId,

    // Actions
    disconnect,
  };
}

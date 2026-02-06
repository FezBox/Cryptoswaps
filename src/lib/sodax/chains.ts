/**
 * Chain ID Mapping Utilities
 *
 * Handles conversions between:
 * - SODAX format ("sonic", "0xa4b1.arbitrum")
 * - EVM chain IDs (146, 42161)
 * - SDK chain constants
 */

import type { ChainId } from "@/types";

/**
 * Maps SODAX chain IDs to EVM numeric chain IDs
 * Centralized mapping extracted from TokenInput.tsx
 */
export const SODAX_TO_EVM_CHAIN_ID: Record<string, number> = {
  // Full format (from API)
  sonic: 146,
  "0xa4b1.arbitrum": 42161,
  "0x2105.base": 8453,
  "0x38.bsc": 56,
  "0xa.optimism": 10,
  "0x89.polygon": 137,
  "0xa86a.avax": 43114,
  "0x1.ethereum": 1,
  // Simple format
  arbitrum: 42161,
  base: 8453,
  bsc: 56,
  optimism: 10,
  polygon: 137,
  avalanche: 43114,
  avax: 43114,
  ethereum: 1,
  icon: 1, // ICON uses Ethereum
} as const;

/**
 * Maps SODAX chain IDs to SDK chain identifiers
 * Used for SDK quote and swap calls
 *
 * SDK BlockchainId type:
 * "sonic" | "ethereum" | "sui" | "solana" | "stellar" | "hyper" | "lightlink" |
 * "0xa4b1.arbitrum" | "0x2105.base" | "0x38.bsc" | "0xa.optimism" |
 * "0x89.polygon" | "0xa86a.avax" | "0x1.icon" | "injective-1" | "0x2019.kaia"
 */
export const SODAX_TO_SDK_CHAIN_ID = {
  sonic: "sonic",
  "0xa4b1.arbitrum": "0xa4b1.arbitrum",
  arbitrum: "0xa4b1.arbitrum",
  "0x1.ethereum": "ethereum",
  ethereum: "ethereum",
  "0x2105.base": "0x2105.base",
  base: "0x2105.base",
  "0x38.bsc": "0x38.bsc",
  bsc: "0x38.bsc",
  "0xa.optimism": "0xa.optimism",
  optimism: "0xa.optimism",
  "0x89.polygon": "0x89.polygon",
  polygon: "0x89.polygon",
  "0xa86a.avax": "0xa86a.avax",
  avalanche: "0xa86a.avax",
  avax: "0xa86a.avax",
  "0x1.icon": "0x1.icon",
  icon: "0x1.icon",
} as const;

/**
 * Convert SODAX chain ID to EVM chain ID
 * Handles hex format parsing if needed
 */
export function sodaxToEvmChainId(sodaxChainId: ChainId): number | undefined {
  // Try direct mapping first
  const mapped = SODAX_TO_EVM_CHAIN_ID[sodaxChainId];
  if (mapped) return mapped;

  // Try parsing hex format (0xa86a.avax -> 43114)
  if (sodaxChainId.startsWith("0x") && sodaxChainId.includes(".")) {
    const hexPart = sodaxChainId.split(".")[0];
    return parseInt(hexPart, 16);
  }

  return undefined;
}

/**
 * Convert SODAX chain ID to SDK chain identifier
 */
export function sodaxToSdkChainId(sodaxChainId: ChainId): string {
  const sdkChainId = SODAX_TO_SDK_CHAIN_ID[sodaxChainId as keyof typeof SODAX_TO_SDK_CHAIN_ID];
  if (!sdkChainId) {
    throw new Error(`Unsupported chain ID for SDK: ${sodaxChainId}`);
  }
  // Cast to SDK's BlockchainId type
  return sdkChainId as any;
}

/**
 * Check if chain is EVM-compatible
 */
export function isEvmChain(sodaxChainId: ChainId): boolean {
  return sodaxToEvmChainId(sodaxChainId) !== undefined;
}

/**
 * Validate chain is supported for swaps
 */
export function validateChainForSwap(sodaxChainId: ChainId): void {
  if (!SODAX_TO_SDK_CHAIN_ID[sodaxChainId as keyof typeof SODAX_TO_SDK_CHAIN_ID]) {
    throw new Error(`Chain ${sodaxChainId} is not supported for swaps yet`);
  }
}

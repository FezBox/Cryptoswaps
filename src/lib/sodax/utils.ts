/**
 * SODAX SDK Utilities
 *
 * Helper functions for SDK integration
 */

import { getWalletClient } from "wagmi/actions";
import { config } from "@/lib/wagmi/config";

/**
 * Get spoke provider for EVM chains from wagmi
 * This is needed by SDK for swap execution
 */
export async function getSpokeProvider(chainId: number) {
  try {
    // Get wallet client from wagmi
    const walletClient = await getWalletClient(config, { chainId });

    if (!walletClient) {
      throw new Error("Wallet client not available");
    }

    // Convert wagmi wallet client to format expected by SDK
    // The SDK likely expects an ethers provider or viem public client
    // Adjust based on actual SDK requirements
    return walletClient;
  } catch (error) {
    throw new Error(`Failed to get spoke provider: ${error}`);
  }
}

/**
 * Validate token amount is within acceptable range
 */
export function validateSwapAmount(
  amount: string,
  token: { symbol: string; decimals: number }
): { valid: boolean; error?: string } {
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    return { valid: false, error: "Amount must be greater than 0" };
  }

  // Check for dust amounts (too small)
  const MIN_AMOUNT = 0.000001;
  if (numAmount < MIN_AMOUNT) {
    return {
      valid: false,
      error: `Amount too small. Minimum is ${MIN_AMOUNT} ${token.symbol}`,
    };
  }

  // Check for unreasonably large amounts (safety check)
  const MAX_AMOUNT = 1e12;
  if (numAmount > MAX_AMOUNT) {
    return {
      valid: false,
      error: "Amount too large",
    };
  }

  return { valid: true };
}

/**
 * Format time remaining for quote expiry
 */
export function formatQuoteExpiry(timestamp: number): string {
  const QUOTE_EXPIRY_MS = 30 * 1000;
  const timeRemaining = QUOTE_EXPIRY_MS - (Date.now() - timestamp);

  if (timeRemaining <= 0) {
    return "Expired";
  }

  const seconds = Math.floor(timeRemaining / 1000);
  return `${seconds}s`;
}

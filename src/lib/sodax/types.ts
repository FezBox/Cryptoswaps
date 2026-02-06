/**
 * SODAX SDK Type Definitions and Adapters
 *
 * Bridges between app types and SDK types
 */

import type { Token, SwapQuote } from "@/types";
import { parseUnits, formatUnits } from "viem";

/**
 * Extended SwapQuote with SDK-specific data
 */
export interface SodaxSwapQuote extends SwapQuote {
  // SDK-specific fields needed for swap execution
  intentParams?: unknown;
  quotedAmount: bigint;
  rawQuoteData?: unknown;
}

/**
 * Parameters for executing a swap
 */
export interface SwapExecutionParams {
  quote: SodaxSwapQuote;
  userAddress: string;
  slippage: number; // percentage
  spokeProvider: unknown; // EVM provider from wagmi
}

/**
 * Result type for operations (matches SDK pattern)
 */
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

/**
 * Parse token amount string to BigInt with proper decimals
 * e.g., "1.5" with 18 decimals -> 1500000000000000000n
 *
 * Uses viem's parseUnits for proper decimal handling
 */
export function parseTokenAmount(amount: string, decimals: number): bigint {
  try {
    return parseUnits(amount, decimals);
  } catch (error) {
    throw new Error(`Failed to parse amount "${amount}" with ${decimals} decimals: ${error}`);
  }
}

/**
 * Format BigInt token amount to string with decimals
 * e.g., 1500000000000000000n with 18 decimals -> "1.5"
 *
 * Uses viem's formatUnits for proper decimal handling
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  try {
    return formatUnits(amount, decimals);
  } catch (error) {
    throw new Error(`Failed to format amount ${amount} with ${decimals} decimals: ${error}`);
  }
}

/**
 * Convert app Token to SDK quote request format
 */
export function tokenToSdkFormat(token: Token, amount: string): {
  address: string;
  chainId: string;
  amount: bigint;
} {
  return {
    address: token.address,
    chainId: token.chainId,
    amount: parseTokenAmount(amount, token.decimals),
  };
}

/**
 * Convert SDK quote response to app SwapQuote format
 */
export function sdkQuoteToSwapQuote(
  sdkQuote: any, // SDK response type
  fromToken: Token,
  toToken: Token,
  fromAmount: string,
  slippage: number
): SodaxSwapQuote {
  // Extract quoted amount from SDK response
  const quotedAmount = BigInt(sdkQuote.quoted_amount || 0);

  // Format to string for display
  const toAmount = formatTokenAmount(quotedAmount, toToken.decimals);

  // Calculate rate
  const toAmountNum = parseFloat(toAmount);
  const fromAmountNum = parseFloat(fromAmount);
  const rate = toAmountNum / fromAmountNum;

  // Calculate minimum received after slippage
  const minimumReceived = (toAmountNum * (1 - slippage / 100)).toString();

  // Price impact calculation (if provided by SDK, otherwise estimate)
  const priceImpact = sdkQuote.price_impact
    ? parseFloat(sdkQuote.price_impact) * 100
    : calculatePriceImpact(fromToken, toToken, fromAmountNum, toAmountNum);

  // Gas estimation (if provided by SDK)
  const estimatedGas = sdkQuote.estimated_gas
    ? formatTokenAmount(BigInt(sdkQuote.estimated_gas), 18)
    : "0.005"; // fallback estimate

  return {
    fromToken,
    toToken,
    fromAmount,
    toAmount,
    rate,
    priceImpact,
    estimatedGas,
    minimumReceived,
    slippage,
    quotedAmount,
    intentParams: sdkQuote.intent_params,
    rawQuoteData: sdkQuote,
  };
}

/**
 * Calculate price impact percentage
 * Compares actual rate vs expected rate based on token prices
 */
function calculatePriceImpact(
  fromToken: Token,
  toToken: Token,
  fromAmount: number,
  toAmount: number
): number {
  if (!fromToken.price || !toToken.price) {
    return 0.1; // Default small impact if prices unavailable
  }

  const expectedRate = fromToken.price / toToken.price;
  const actualRate = toAmount / fromAmount;
  const impact = Math.abs((actualRate - expectedRate) / expectedRate) * 100;

  return Math.min(impact, 10); // Cap at 10% for display
}

/**
 * SODAX SDK Quote Integration
 *
 * Fetches real swap quotes from SODAX SDK
 */

import type { Token } from "@/types";
import type { SodaxSwapQuote } from "./types";
import { getSodaxClient } from "./client";
import { sodaxToSdkChainId, validateChainForSwap } from "./chains";
import { parseTokenAmount, sdkQuoteToSwapQuote } from "./types";
import { SodaxError, SodaxErrorCode, mapSdkError } from "./errors";

/**
 * Fetch real swap quote from SODAX SDK
 *
 * @param fromToken - Token being swapped from
 * @param toToken - Token being swapped to
 * @param amount - Amount to swap (as string for precision)
 * @param slippage - Slippage tolerance percentage (e.g., 0.5 for 0.5%)
 * @returns Promise resolving to SodaxSwapQuote
 * @throws SodaxError if quote generation fails
 */
export async function fetchSodaxQuote(
  fromToken: Token,
  toToken: Token,
  amount: string,
  slippage: number = 0.5
): Promise<SodaxSwapQuote> {
  // Validation
  if (!amount || parseFloat(amount) <= 0) {
    throw new SodaxError(
      SodaxErrorCode.INVALID_AMOUNT,
      "Amount must be greater than 0"
    );
  }

  // Validate chains are supported
  try {
    validateChainForSwap(fromToken.chainId);
    validateChainForSwap(toToken.chainId);
  } catch (error) {
    throw mapSdkError(error);
  }

  // Get SDK client
  const sodax = getSodaxClient();

  // Convert amount to BigInt with proper decimals
  let amountBigInt: bigint;
  try {
    amountBigInt = parseTokenAmount(amount, fromToken.decimals);
    console.log("[SODAX] Parsed amount:", {
      inputAmount: amount,
      decimals: fromToken.decimals,
      amountBigInt: amountBigInt.toString(),
    });
  } catch (error) {
    console.error("[SODAX] Failed to parse amount:", error);
    throw error;
  }

  // Convert chain IDs
  let srcChainId: string;
  let dstChainId: string;
  try {
    srcChainId = sodaxToSdkChainId(fromToken.chainId);
    dstChainId = sodaxToSdkChainId(toToken.chainId);
    console.log("[SODAX] Chain IDs:", {
      srcChainOriginal: fromToken.chainId,
      dstChainOriginal: toToken.chainId,
      srcChainSdk: srcChainId,
      dstChainSdk: dstChainId,
    });
  } catch (error) {
    console.error("[SODAX] Failed to convert chain IDs:", error);
    throw error;
  }

  // Prepare SDK quote request
  const quoteRequest = {
    token_src: fromToken.address,
    token_dst: toToken.address,
    token_src_blockchain_id: srcChainId,
    token_dst_blockchain_id: dstChainId,
    amount: amountBigInt, // SDK expects BigInt, not string
    quote_type: "exact_input" as const,
  } as any; // Type assertion for SDK compatibility

  console.log("[SODAX Quote Request]", {
    fromToken: fromToken.symbol,
    toToken: toToken.symbol,
    amount,
    amountBigInt: amountBigInt.toString(),
    chainPair: `${fromToken.chainId} -> ${toToken.chainId}`,
    sdkChainIds: {
      src: sodaxToSdkChainId(fromToken.chainId),
      dst: sodaxToSdkChainId(toToken.chainId),
    },
    quoteRequest,
    timestamp: Date.now(),
  });

  try {
    // Call SDK getQuote
    console.log("[SODAX] Calling SDK getQuote with:", JSON.stringify(quoteRequest, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));
    const result = await sodax.swaps.getQuote(quoteRequest);

    // Handle Result<T, E> pattern from SDK
    if (!result.ok) {
      console.error("[SODAX Quote Error]", {
        error: result.error,
        errorType: typeof result.error,
        errorDetails: JSON.stringify(result.error, null, 2),
        chainPair: `${fromToken.chainId} -> ${toToken.chainId}`,
        quoteRequest,
      });
      throw mapSdkError(result.error);
    }

    console.log("[SODAX Quote Success]", {
      quotedAmount: result.value.quoted_amount,
      latency: Date.now(),
    });

    // Convert SDK response to app format
    const quote = sdkQuoteToSwapQuote(
      result.value,
      fromToken,
      toToken,
      amount,
      slippage
    );

    return quote;
  } catch (error) {
    // Map and re-throw errors
    if (error instanceof SodaxError) {
      throw error;
    }

    console.error("[SODAX Quote Exception] Full error:", error);
    console.error("[SODAX Quote Exception] Details:", {
      errorType: typeof error,
      errorConstructor: error?.constructor?.name,
      errorMessage: (error as any)?.message,
      errorStack: (error as any)?.stack,
      errorString: String(error),
      errorJSON: JSON.stringify(error, Object.getOwnPropertyNames(error), 2),
      chainPair: `${fromToken.chainId} -> ${toToken.chainId}`,
      quoteRequest,
    });

    throw mapSdkError(error);
  }
}

/**
 * Validate quote is still fresh
 * Quotes typically expire after 30-60 seconds
 */
export function isQuoteStale(quoteTimestamp: number): boolean {
  const QUOTE_EXPIRY_MS = 30 * 1000; // 30 seconds
  return Date.now() - quoteTimestamp > QUOTE_EXPIRY_MS;
}

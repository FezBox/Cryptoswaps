/**
 * SODAX SDK Swap Execution
 *
 * Handles swap transaction execution with wagmi integration.
 * Note: Status polling is disabled due to CORS issues with the solver API.
 * When swap() returns ok: true, the swap IS submitted successfully.
 */

import type { SwapExecutionParams } from "./types";
import { parseTokenAmount } from "./types";
import { getSodaxClient } from "./client";
import { sodaxToSdkChainId } from "./chains";
import { SodaxError, SodaxErrorCode } from "./errors";
import { clearLastSentTxHash } from "./spokeProvider";

/**
 * Swap execution result
 */
export interface SwapExecutionResult {
  success: boolean;
  txHash: string;
  intentHash?: string;
  srcChainId?: string;
  dstChainId?: string;
}

/**
 * Execute swap using SODAX SDK
 *
 * @param params - Swap execution parameters
 * @returns Promise resolving to swap result with txHash and isPending status
 * @throws SodaxError if swap execution fails completely (wallet rejection, on-chain revert, etc)
 */
export async function executeSodaxSwap(
  params: SwapExecutionParams
): Promise<SwapExecutionResult> {
  const { quote, userAddress, slippage, spokeProvider } = params;

  // Clear any previous tx hash
  clearLastSentTxHash();

  // Validate parameters
  if (!userAddress || !userAddress.startsWith("0x")) {
    throw new SodaxError(
      SodaxErrorCode.INVALID_AMOUNT,
      "Invalid user address"
    );
  }

  if (!spokeProvider) {
    throw new SodaxError(
      SodaxErrorCode.NETWORK_ERROR,
      "Wallet provider not available"
    );
  }

  // Log spokeProvider details
  console.log("[SODAX Swap] Provider details:", {
    spokeProvider,
    spokeProviderType: typeof spokeProvider,
    spokeProviderKeys: spokeProvider ? Object.keys(spokeProvider) : [],
    hasRequest: spokeProvider && typeof (spokeProvider as any).request === 'function',
    hasSend: spokeProvider && typeof (spokeProvider as any).send === 'function',
  });

  // Convert user's input amount to BigInt
  // CRITICAL: Use the user's FROM amount, not the quoted output amount
  const inputAmountBigInt = parseTokenAmount(quote.fromAmount, quote.fromToken.decimals);

  // Calculate minimum output amount with slippage
  const minOutputAmount = calculateMinOutput(
    quote.quotedAmount,
    slippage
  );

  console.log("[SODAX Swap] Execution params:", {
    fromToken: quote.fromToken.symbol,
    toToken: quote.toToken.symbol,
    fromChain: quote.fromToken.chainId,
    toChain: quote.toToken.chainId,
    userInputAmount: quote.fromAmount,
    inputAmountBigInt: inputAmountBigInt.toString(),
    quotedOutputAmount: quote.quotedAmount.toString(),
    minOutput: minOutputAmount.toString(),
    userAddress,
    slippage,
    inputToken: quote.fromToken.address,
    outputToken: quote.toToken.address,
    timestamp: Date.now(),
  });

  console.log("[SODAX Swap] CRITICAL - Amount validation:");
  console.log("  Input amount (from user):", quote.fromAmount, "→", inputAmountBigInt.toString());
  console.log("  Min output amount (with slippage):", minOutputAmount.toString());

  // Get SDK client
  const sodax = getSodaxClient();

  // Prepare swap intent parameters
  const intentParams = {
    inputToken: quote.fromToken.address,
    outputToken: quote.toToken.address,
    inputAmount: inputAmountBigInt,  // USER'S INPUT, not the quoted output!
    minOutputAmount: minOutputAmount,
    deadline: BigInt(0),
    allowPartialFill: false,
    srcChain: sodaxToSdkChainId(quote.fromToken.chainId) as any,
    dstChain: sodaxToSdkChainId(quote.toToken.chainId) as any,
    srcAddress: userAddress,
    dstAddress: userAddress,
    solver: "0x0000000000000000000000000000000000000000",
    data: "0x",
  } as any;

  console.log('[SODAX Swap] Calling swap with intentParams:', {
    inputToken: intentParams.inputToken,
    outputToken: intentParams.outputToken,
    inputAmount: intentParams.inputAmount.toString(),
    minOutputAmount: intentParams.minOutputAmount.toString(),
    srcChain: intentParams.srcChain,
    dstChain: intentParams.dstChain,
    srcAddress: intentParams.srcAddress,
    dstAddress: intentParams.dstAddress,
  });

  // STEP 0: Token approval for ERC-20 tokens
  // Native token address (no approval needed)
  const NATIVE_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000";
  const isNativeToken = quote.fromToken.address.toLowerCase() === NATIVE_TOKEN_ADDRESS.toLowerCase();

  if (!isNativeToken) {
    console.log('[SODAX Swap] ERC-20 token detected, requesting approval...');

    try {
      const approveResult = await sodax.swaps.approve({
        intentParams,
        spokeProvider,
      } as any);

      if (!approveResult.ok) {
        throw new SodaxError(
          SodaxErrorCode.TRANSACTION_FAILED,
          `Token approval failed: ${JSON.stringify(approveResult.error)}`
        );
      }

      const approveTxHash = (approveResult.value as any).transaction_hash ||
                            (approveResult.value as any).transactionHash ||
                            (approveResult.value as any).hash ||
                            approveResult.value;

      console.log('[SODAX Swap] ✓ Token approved, tx:', approveTxHash);
    } catch (error) {
      // Check if this is a wallet rejection (user cancelled)
      const err = error as any;
      if (err?.code === 4001 || err?.code === 'ACTION_REJECTED' || err?.message?.includes('user rejected')) {
        throw new SodaxError(
          SodaxErrorCode.USER_REJECTED,
          "Token approval was rejected by user",
          error
        );
      }
      // Re-throw if it's already a SodaxError
      if (error instanceof SodaxError) {
        throw error;
      }
      // Otherwise wrap it
      throw new SodaxError(
        SodaxErrorCode.TRANSACTION_FAILED,
        `Token approval failed: ${(error as Error).message}`,
        error
      );
    }
  } else {
    console.log('[SODAX Swap] Native token detected, skipping approval');
  }

  // STEP 1: Execute swap
  // The SDK's swap() returns Result<[SolverExecutionResponse, Intent, IntentDeliveryInfo]>
  // where IntentDeliveryInfo contains srcTxHash (the spoke transaction hash)
  const swapResult = await sodax.swaps.swap({
    intentParams,
    spokeProvider,
  } as any);

  if (!swapResult.ok) {
    console.error('[SODAX Swap] Swap failed:', swapResult.error);

    // Check if this is a wallet rejection
    const err = swapResult.error as any;
    if (err?.code === 4001 || err?.code === 'ACTION_REJECTED' ||
        err?.message?.includes('user rejected') || err?.message?.includes('User rejected')) {
      throw new SodaxError(
        SodaxErrorCode.USER_REJECTED,
        "Transaction was rejected by user",
        swapResult.error
      );
    }

    throw new SodaxError(
      SodaxErrorCode.TRANSACTION_FAILED,
      `Swap failed: ${JSON.stringify(swapResult.error)}`,
      swapResult.error
    );
  }

  // STEP 2: Destructure the successful result
  // Result tuple: [SolverExecutionResponse, Intent, IntentDeliveryInfo]
  const [solverResponse, intent, deliveryInfo] = swapResult.value;

  console.log('[SODAX Swap] Solver response:', solverResponse);
  console.log('[SODAX Swap] Intent:', {
    intentId: intent.intentId?.toString(),
    srcChain: intent.srcChain,
    dstChain: intent.dstChain,
  });
  console.log('[SODAX Swap] Delivery info:', deliveryInfo);

  // STEP 3: Extract the spoke transaction hash from deliveryInfo
  const spokeTxHash = deliveryInfo.srcTxHash;

  if (!spokeTxHash) {
    console.error('[SODAX Swap] No srcTxHash in deliveryInfo:', deliveryInfo);
    throw new SodaxError(
      SodaxErrorCode.TRANSACTION_FAILED,
      "No transaction hash in swap response"
    );
  }

  console.log('[SODAX Swap] ✓ Swap submitted successfully!');
  console.log('[SODAX Swap] Spoke tx hash:', spokeTxHash);
  console.log('[SODAX Swap] Intent hash:', solverResponse.intent_hash);

  // Return success immediately - the solver acknowledged the swap
  // Status polling is disabled due to CORS issues with solver API from browser
  return {
    success: true,
    txHash: spokeTxHash,
    intentHash: solverResponse.intent_hash,
    srcChainId: deliveryInfo.srcChainId,
    dstChainId: deliveryInfo.dstChainId,
  };
}

/**
 * Calculate minimum output amount with slippage tolerance
 */
function calculateMinOutput(
  quotedAmount: bigint,
  slippage: number
): bigint {
  // Convert slippage percentage to basis points
  // e.g., 0.5% = 50 basis points = 9950/10000 multiplier
  const basisPoints = BigInt(Math.floor((100 - slippage) * 100));
  const minAmount = (quotedAmount * basisPoints) / BigInt(10000);
  return minAmount;
}

/**
 * Monitor transaction status
 * Can be called after swap execution to track confirmation
 */
export async function waitForSwapConfirmation(
  txHash: string,
  chainId: number,
  timeout: number = 60000
): Promise<boolean> {
  // Implementation depends on chain
  // For EVM chains, use wagmi's waitForTransaction
  // For non-EVM chains, use SDK's transaction tracking

  // Placeholder implementation
  console.log(`[SODAX Swap] Waiting for confirmation: ${txHash} on chain ${chainId} (timeout: ${timeout}ms)`);

  // TODO: Implement actual transaction confirmation tracking
  return true;
}

/**
 * Swap-related type definitions
 */

import { Token } from "./token";

/**
 * Swap quote with pricing and fee information
 */
export interface SwapQuote {
  /** Source token being swapped */
  fromToken: Token;
  /** Destination token to receive */
  toToken: Token;
  /** Amount of source token to swap (in token units) */
  fromAmount: string;
  /** Amount of destination token to receive (in token units) */
  toAmount: string;
  /** Exchange rate (toAmount / fromAmount) */
  rate: number;
  /** Price impact percentage (e.g., 0.5 for 0.5%) */
  priceImpact: number;
  /** Estimated gas cost in native token units */
  estimatedGas: string;
  /** Minimum amount to receive after slippage (in token units) */
  minimumReceived: string;
  /** Slippage tolerance used for this quote (percentage) */
  slippage: number;
}

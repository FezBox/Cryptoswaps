/**
 * Token-related type definitions
 */

import { ChainId } from "./chain";

/**
 * Cryptocurrency token information
 */
export interface Token {
  /** Token symbol (e.g., "ETH", "USDC") */
  symbol: string;
  /** Full token name (e.g., "Ethereum", "USD Coin") */
  name: string;
  /** Contract address on the blockchain */
  address: string;
  /** Number of decimal places for token amounts */
  decimals: number;
  /** Chain where this token exists */
  chainId: ChainId;
  /** URL to token logo image */
  logoUrl: string;
  /** Current price in USD (optional, may be fetched dynamically) */
  price?: number;
}

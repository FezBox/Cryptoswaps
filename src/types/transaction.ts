/**
 * Transaction-related type definitions
 */

import { ChainId } from "./chain";
import { Token } from "./token";

/**
 * Transaction types
 */
export type TransactionType = "swap" | "bridge" | "cross-chain-swap";

/**
 * Transaction status
 */
export type TransactionStatus =
  | "pending"
  | "confirmed"
  | "failed"
  | "cancelled";

/**
 * Transaction record
 */
export interface Transaction {
  /** Unique transaction identifier */
  id: string;
  /** Type of transaction */
  type: TransactionType;
  /** Current transaction status */
  status: TransactionStatus;
  /** Source blockchain */
  fromChain: ChainId;
  /** Destination blockchain */
  toChain: ChainId;
  /** Source token */
  fromToken: Token;
  /** Destination token */
  toToken: Token;
  /** Amount sent (in token units) */
  fromAmount: string;
  /** Amount received (in token units) */
  toAmount: string;
  /** Unix timestamp (milliseconds) */
  timestamp: number;
  /** Blockchain transaction hash (optional, pending transactions may not have it yet) */
  txHash?: string;
}

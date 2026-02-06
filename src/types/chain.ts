/**
 * Chain-related type definitions
 */

import { SUPPORTED_CHAINS } from "@/lib/constants";

/**
 * Supported blockchain network identifiers
 */
export type ChainId = typeof SUPPORTED_CHAINS[number];

/**
 * Blockchain network configuration
 */
export interface Chain {
  /** Unique chain identifier */
  id: ChainId;
  /** Internal chain name (lowercase) */
  name: string;
  /** User-facing display name */
  displayName: string;
  /** Icon identifier or URL */
  icon: string;
  /** Whether this chain acts as a hub for cross-chain routing */
  isHub: boolean;
}

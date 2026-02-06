/**
 * Block Explorer Utilities
 *
 * Maps chain IDs to block explorer URLs for transaction tracking
 */

interface BlockExplorer {
  name: string;
  url: string;
}

/**
 * Mapping of EVM chain IDs to their block explorers
 */
const BLOCK_EXPLORERS: Record<number, BlockExplorer> = {
  1: { name: "Etherscan", url: "https://etherscan.io" },
  42161: { name: "Arbiscan", url: "https://arbiscan.io" },
  8453: { name: "Basescan", url: "https://basescan.org" },
  56: { name: "BscScan", url: "https://bscscan.com" },
  10: { name: "Optimism Explorer", url: "https://optimistic.etherscan.io" },
  137: { name: "Polygonscan", url: "https://polygonscan.com" },
  43114: { name: "Snowtrace", url: "https://snowtrace.io" },
  146: { name: "Sonic Explorer", url: "https://sonicscan.org" },
};

/**
 * Get the block explorer URL for a transaction
 *
 * @param chainId - EVM chain ID
 * @param txHash - Transaction hash
 * @returns Full URL to view the transaction on the block explorer
 */
export function getExplorerUrl(chainId: number, txHash: string): string {
  const explorer = BLOCK_EXPLORERS[chainId];
  if (!explorer) {
    console.warn(`No block explorer configured for chain ID ${chainId}`);
    return "#";
  }
  return `${explorer.url}/tx/${txHash}`;
}

/**
 * Get the block explorer name for a chain
 *
 * @param chainId - EVM chain ID
 * @returns Explorer name (e.g., "Etherscan") or "Block Explorer" as fallback
 */
export function getExplorerName(chainId: number): string {
  const explorer = BLOCK_EXPLORERS[chainId];
  return explorer?.name || "Block Explorer";
}

/**
 * Check if a block explorer is available for a chain
 *
 * @param chainId - EVM chain ID
 * @returns true if explorer is configured
 */
export function hasExplorer(chainId: number): boolean {
  return chainId in BLOCK_EXPLORERS;
}

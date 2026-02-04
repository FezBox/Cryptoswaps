/**
 * Application-wide constants
 * Phase 1: Basic configuration
 */

export const APP_NAME = "SODAX";
export const APP_DESCRIPTION = "Cross-chain cryptocurrency swap platform";

// Placeholder for future chain configurations
export const SUPPORTED_CHAINS = [
  "sonic",
  "ethereum",
  "arbitrum",
  "base",
  "bsc",
  "optimism",
  "polygon",
  "avalanche",
  "sui",
  "solana",
  "stellar",
  "injective",
  "icon",
  "hyper",
  "lightlink",
] as const;

export type SupportedChain = typeof SUPPORTED_CHAINS[number];

// MCP endpoint (for future phases)
export const MCP_ENDPOINT = "https://mcp-test.sodax.com/mcp";

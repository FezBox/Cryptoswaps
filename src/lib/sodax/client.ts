/**
 * SODAX SDK Client Configuration
 *
 * Initializes the SODAX SDK with partner fee configuration for mainnet
 */

import { Sodax } from "@sodax/sdk";

// Partner fee configuration (0.10% = 10 basis points)
export const PARTNER_FEE = {
  address: (process.env.NEXT_PUBLIC_SODAX_PARTNER_ADDRESS || "0xd11DfD5a72Ef6162F5c6028a2e31672F39f4337D") as `0x${string}`,
  percentage: parseInt(process.env.NEXT_PUBLIC_SODAX_PARTNER_FEE_PERCENTAGE || "10"),
} as const;

// Validate partner fee is configured
if (!PARTNER_FEE.address || PARTNER_FEE.address.startsWith("0x0000")) {
  console.warn("SODAX partner fee address not configured properly");
}

// Environment validation - MAINNET ONLY
const SODAX_ENV = process.env.NEXT_PUBLIC_SODAX_ENVIRONMENT || "mainnet";
if (SODAX_ENV !== "mainnet") {
  throw new Error("SODAX SDK: Only mainnet is supported. Set NEXT_PUBLIC_SODAX_ENVIRONMENT=mainnet");
}

/**
 * Singleton SODAX SDK client instance
 * Configured with partner fee for all operations
 *
 * Partner fee: 0.10% (10 basis points) sent to partner address
 */
export const sodaxClient = new Sodax({
  swaps: { partnerFee: PARTNER_FEE },
});

/**
 * Get SODAX SDK client instance
 * Safe accessor with validation
 */
export function getSodaxClient(): Sodax {
  if (!sodaxClient) {
    throw new Error("SODAX SDK client not initialized");
  }
  return sodaxClient;
}

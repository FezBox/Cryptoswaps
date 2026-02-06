/**
 * Wagmi Configuration
 *
 * Configures wagmi with EVM chains and wallet connectors for SODAX swap interface
 */

import {
  mainnet,
  arbitrum,
  base,
  bsc,
  optimism,
  polygon,
  avalanche,
} from "wagmi/chains";
import { defineChain } from "viem";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// Define Sonic chain manually (not in wagmi's default chains)
export const sonic = defineChain({
  id: 146,
  name: "Sonic",
  nativeCurrency: {
    name: "Sonic",
    symbol: "S",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.soniclabs.com"],
    },
  },
  blockExplorers: {
    default: {
      name: "Sonic Explorer",
      url: "https://sonicscan.org",
    },
  },
});

// Configure wagmi with supported EVM chains
export const config = getDefaultConfig({
  appName: "SODAX Swap",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [sonic, mainnet, arbitrum, base, bsc, optimism, polygon, avalanche],
  ssr: true, // Enable server-side rendering support
});

/**
 * EVM Spoke Provider for SODAX SDK
 *
 * Creates a spoke provider from wagmi's wallet client
 * using the SDK's EvmSpokeProvider and SonicSpokeProvider classes
 */

import { getWalletClient, getPublicClient } from "wagmi/actions";
import { config } from "@/lib/wagmi/config";
import { EvmSpokeProvider, SonicSpokeProvider, spokeChainConfig } from "@sodax/sdk";
import type { IEvmWalletProvider, Address, Hash, Hex } from "@sodax/sdk";
import type { WalletClient } from "viem";

// Sonic chain ID
const SONIC_CHAIN_ID = 146;

// Track the last sent transaction hash for status polling
// This is set when sendTransaction is called and can be used if swap() fails
let lastSentTxHash: string | null = null;

/**
 * Get the last sent transaction hash
 * This is used for status polling when the SDK's swap() call fails
 */
export function getLastSentTxHash(): string | null {
  return lastSentTxHash;
}

/**
 * Clear the last sent transaction hash
 */
export function clearLastSentTxHash(): void {
  lastSentTxHash = null;
}

/**
 * Create an EVM wallet provider adapter from wagmi's wallet client
 * Implements IEvmWalletProvider interface expected by SODAX SDK
 */
function createWalletProviderAdapter(walletClient: WalletClient, chainId: number): IEvmWalletProvider {
  return {
    getWalletAddress: async (): Promise<Address> => {
      if (!walletClient.account) {
        throw new Error("No account connected");
      }
      return walletClient.account.address as Address;
    },

    sendTransaction: async (tx: {
      from: Address;
      to: Address;
      value: bigint;
      data: Hex;
    }): Promise<Hash> => {
      // Use wagmi's sendTransaction
      const hash = await walletClient.sendTransaction({
        account: walletClient.account!,
        chain: walletClient.chain,
        to: tx.to,
        value: tx.value,
        data: tx.data,
      });

      // Store the hash for status polling
      lastSentTxHash = hash;
      console.log('[Spoke Provider] Transaction sent:', hash);

      return hash as Hash;
    },

    waitForTransactionReceipt: async (txHash: Hash) => {
      // Wait for transaction receipt using wagmi's public client
      const publicClient = getPublicClient(config, { chainId: chainId as any });
      if (!publicClient) {
        throw new Error("Public client not available");
      }
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      return receipt as any; // Cast to EvmRawTransactionReceipt
    },
  };
}

/**
 * Create an EVM spoke provider from wagmi wallet client
 *
 * Returns the appropriate SDK spoke provider:
 * - SonicSpokeProvider for Sonic chain (146)
 * - EvmSpokeProvider for other EVM chains
 */
export async function createEvmSpokeProvider(chainId: number) {
  const walletClient = await getWalletClient(config, { chainId });

  if (!walletClient) {
    throw new Error("Wallet not connected");
  }

  console.log("[Spoke Provider] Creating spoke provider:", {
    chainId,
    account: walletClient.account?.address,
    isSonic: chainId === SONIC_CHAIN_ID,
  });

  // Create wallet provider adapter
  const walletProvider = createWalletProviderAdapter(walletClient, chainId);

  // Determine which spoke provider to use
  if (chainId === SONIC_CHAIN_ID) {
    // Use SonicSpokeProvider for Sonic chain
    const chainConfig = spokeChainConfig["sonic"];
    console.log("[Spoke Provider] Using SonicSpokeProvider with config:", chainConfig);
    return new SonicSpokeProvider(walletProvider, chainConfig as any);
  } else {
    // Use EvmSpokeProvider for other EVM chains
    // Map numeric chain ID to SDK chain key
    const chainKey = getChainKeyFromId(chainId);
    if (!chainKey) {
      throw new Error(`Unsupported EVM chain ID: ${chainId}`);
    }

    const chainConfig = spokeChainConfig[chainKey];
    console.log("[Spoke Provider] Using EvmSpokeProvider with config:", {
      chainKey,
      chainConfig,
    });

    return new EvmSpokeProvider(walletProvider, chainConfig as any);
  }
}

/**
 * Map numeric EVM chain ID to SDK chain key
 * This is used to look up the chain config from spokeChainConfig
 */
function getChainKeyFromId(chainId: number): keyof typeof spokeChainConfig | null {
  const chainMap: Record<number, keyof typeof spokeChainConfig> = {
    1: "ethereum",
    42161: "0xa4b1.arbitrum",
    8453: "0x2105.base",
    56: "0x38.bsc",
    10: "0xa.optimism",
    137: "0x89.polygon",
    43114: "0xa86a.avax",
    146: "sonic",
  };

  return chainMap[chainId] || null;
}

/**
 * ChainIcon Component
 *
 * Displays chain logo with multi-tier fallback system:
 * 1. Try chain.icon from API
 * 2. Try cryptocurrency-icons CDN (works for chains that have token equivalents)
 * 3. Fallback to gradient circle with letter
 */

import type { Chain } from "@/types";
import { useState, useEffect } from "react";

interface ChainIconProps {
  chain: Chain;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

/**
 * Chain name mapping for CDN URLs
 * Maps chain.name to the symbol used in cryptocurrency-icons CDN
 */
const CHAIN_MAPPING: Record<string, string> = {
  // Major chains
  ethereum: "eth",
  avax: "avax",
  avalanche: "avax",
  polygon: "matic",
  matic: "matic",
  arbitrum: "arb",
  optimism: "op",
  base: "base",
  sonic: "", // No CDN available
  injective: "inj",
  osmosis: "osmo",
  neutron: "ntrn",
  celestia: "tia",
  dydx: "dydx",
  stargaze: "stars",

  // Add more as needed
};

/**
 * Generate a consistent gradient color pair from chain name
 */
function getGradientColors(chainName: string): string {
  const gradients = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-red-500 to-red-600",
    "from-orange-500 to-orange-600",
    "from-yellow-500 to-yellow-600",
    "from-green-500 to-green-600",
    "from-teal-500 to-teal-600",
    "from-cyan-500 to-cyan-600",
    "from-indigo-500 to-indigo-600",
    "from-violet-500 to-violet-600",
    "from-fuchsia-500 to-fuchsia-600",
  ];

  // Hash the chain name to pick a gradient
  let hash = 0;
  for (let i = 0; i < chainName.length; i++) {
    hash = chainName.charCodeAt(i) + ((hash << 5) - hash);
  }

  return gradients[Math.abs(hash) % gradients.length];
}

/**
 * Get CDN URL for chain icon
 */
function getCdnUrl(chainName: string): string | null {
  // Normalize chain name
  const normalizedName = chainName.toLowerCase();

  // Check if chain has a mapping
  const mappedSymbol = CHAIN_MAPPING[normalizedName];

  // If mapped to empty string, skip CDN (will use letter fallback)
  if (mappedSymbol === "") {
    return null;
  }

  // Use mapped symbol or original chain name
  const cdnSymbol = mappedSymbol || normalizedName;

  // cryptocurrency-icons CDN URL
  return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/${cdnSymbol}.svg`;
}

export default function ChainIcon({ chain, size = "md" }: ChainIconProps) {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [attemptedCdn, setAttemptedCdn] = useState(false);

  useEffect(() => {
    // Reset state when chain changes
    setHasError(false);
    setAttemptedCdn(false);

    // Try chain.icon first
    if (chain.icon && chain.icon.trim() !== "") {
      setImageSource(chain.icon);
    } else {
      // Try CDN as first fallback
      const cdnUrl = getCdnUrl(chain.name);
      if (cdnUrl) {
        setImageSource(cdnUrl);
      } else {
        // No CDN available, go straight to letter fallback
        setHasError(true);
      }
    }
  }, [chain.icon, chain.name]);

  const handleError = () => {
    if (imageSource === chain.icon && !attemptedCdn) {
      // First attempt failed (chain.icon), try CDN
      const cdnUrl = getCdnUrl(chain.name);
      if (cdnUrl) {
        setImageSource(cdnUrl);
        setAttemptedCdn(true);
      } else {
        // No CDN available, show letter fallback
        setHasError(true);
      }
    } else {
      // CDN attempt failed (or was already tried), show letter fallback
      setHasError(true);
    }
  };

  // Show gradient letter fallback if no valid image
  if (hasError || !imageSource) {
    const gradientColors = getGradientColors(chain.name);

    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradientColors} flex items-center justify-center font-bold text-white shadow-sm`}
      >
        {chain.displayName.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={imageSource}
      alt={chain.displayName}
      className={`${sizeClasses[size]} rounded-full`}
      onError={handleError}
    />
  );
}

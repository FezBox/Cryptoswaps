/**
 * TokenIcon Component
 *
 * Displays token logo with multi-tier fallback system:
 * 1. Try token.logoUrl from API
 * 2. Try cryptocurrency-icons CDN
 * 3. Fallback to gradient circle with letter
 */

import type { Token } from "@/types";
import { useState, useEffect } from "react";

interface TokenIconProps {
  token: Token;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-8 h-8 text-sm",
  lg: "w-10 h-10 text-base",
};

/**
 * Symbol mapping for tokens with different CDN names or special cases
 */
const SYMBOL_MAPPING: Record<string, string> = {
  // Wrapped tokens
  wS: "sonic", // Wrapped Sonic -> Sonic
  WETH: "eth",
  WBTC: "btc",
  WMATIC: "matic",
  WAVAX: "avax",

  // Stablecoins
  "USDC.e": "usdc",
  "USDT.e": "usdt",

  // Special cases that won't be in CDN - will fallback to letter
  S: "", // Sonic native - no CDN
  bnUSD: "", // Balanced Dollar - no CDN
};

/**
 * Generate a consistent gradient color pair from token symbol
 */
function getGradientColors(symbol: string): string {
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

  // Hash the symbol to pick a gradient
  let hash = 0;
  for (let i = 0; i < symbol.length; i++) {
    hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
  }

  return gradients[Math.abs(hash) % gradients.length];
}

/**
 * Get CDN URL for token icon
 */
function getCdnUrl(symbol: string): string | null {
  // Check if symbol has a mapping
  const mappedSymbol = SYMBOL_MAPPING[symbol];

  // If mapped to empty string, skip CDN (will use letter fallback)
  if (mappedSymbol === "") {
    return null;
  }

  // Use mapped symbol or original symbol
  const cdnSymbol = mappedSymbol || symbol;

  // cryptocurrency-icons CDN URL
  return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/${cdnSymbol.toLowerCase()}.svg`;
}

export default function TokenIcon({ token, size = "md" }: TokenIconProps) {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [attemptedCdn, setAttemptedCdn] = useState(false);

  useEffect(() => {
    // Reset state when token changes
    setHasError(false);
    setAttemptedCdn(false);

    // Try token.logoUrl first
    if (token.logoUrl && token.logoUrl.trim() !== "") {
      setImageSource(token.logoUrl);
    } else {
      // Try CDN as first fallback
      const cdnUrl = getCdnUrl(token.symbol);
      if (cdnUrl) {
        setImageSource(cdnUrl);
      } else {
        // No CDN available, go straight to letter fallback
        setHasError(true);
      }
    }
  }, [token.logoUrl, token.symbol]);

  const handleError = () => {
    if (imageSource === token.logoUrl && !attemptedCdn) {
      // First attempt failed (logoUrl), try CDN
      const cdnUrl = getCdnUrl(token.symbol);
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
    const gradientColors = getGradientColors(token.symbol);

    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradientColors} flex items-center justify-center font-bold text-white shadow-sm`}
      >
        {token.symbol.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={imageSource}
      alt={token.symbol}
      className={`${sizeClasses[size]} rounded-full`}
      onError={handleError}
    />
  );
}

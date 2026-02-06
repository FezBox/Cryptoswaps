"use client";

import { useState, useEffect } from "react";
import { getTokens } from "@/lib/mcp/methods";
import { MCPError } from "@/lib/mcp/client";
import type { Token, ChainId } from "@/types";
import { useChainsStore } from "@/store/useChainsStore";

export default function TestMCPPage() {
  // Use Zustand store for chains
  const { chains, isLoading: loadingChains, error: chainsError, fetchChains } = useChainsStore();

  // Local state for tokens (not using store yet)
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch chains on component mount
  useEffect(() => {
    fetchChains();
  }, [fetchChains]);

  // Fetch tokens for a specific chain
  const handleFetchTokens = async (chainId: ChainId) => {
    try {
      setLoadingTokens(true);
      setError(null);
      const fetchedTokens = await getTokens(chainId);
      setTokens(Array.isArray(fetchedTokens) ? fetchedTokens : []);
    } catch (err) {
      console.error("Error fetching tokens:", err);
      if (err instanceof MCPError) {
        setError(`MCP Error (${err.code}): ${err.message}`);
      } else if (err instanceof Error) {
        setError(`Error: ${err.message}`);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoadingTokens(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-text-primary mb-8">
        MCP Client Test
      </h1>

      {/* Error Display */}
      {(chainsError || error) && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error:</p>
          <p className="text-red-700 text-sm mt-1">{chainsError || error}</p>
        </div>
      )}

      {/* Chains Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Supported Chains
        </h2>

        {loadingChains ? (
          <div className="flex items-center gap-2 text-text-secondary">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p>Loading chains...</p>
          </div>
        ) : chains.length > 0 ? (
          <div className="grid gap-3">
            {chains.map((chain) => (
              <div
                key={chain.id}
                className="p-4 bg-white border border-primary-100 rounded-lg hover:border-primary-200 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      {chain.displayName}
                    </h3>
                    <p className="text-sm text-text-secondary">
                      ID: {chain.id} | Name: {chain.name}
                      {chain.isHub && (
                        <span className="ml-2 text-xs bg-primary-100 text-primary px-2 py-0.5 rounded">
                          Hub
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => handleFetchTokens(chain.id)}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                    disabled={loadingTokens}
                  >
                    Load Tokens
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary">No chains found</p>
        )}
      </section>

      {/* Tokens Section */}
      <section>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Tokens {tokens.length > 0 && `(${tokens.length})`}
        </h2>

        {loadingTokens ? (
          <div className="flex items-center gap-2 text-text-secondary">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p>Loading tokens...</p>
          </div>
        ) : tokens.length > 0 ? (
          <div className="grid gap-2">
            {tokens.map((token, index) => (
              <div
                key={`${token.chainId}-${token.address}-${index}`}
                className="p-3 bg-white border border-primary-100 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {token.logoUrl && (
                    <img
                      src={token.logoUrl}
                      alt={token.symbol}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-text-primary text-sm">
                      {token.name} ({token.symbol})
                    </h3>
                    <p className="text-xs text-text-secondary">
                      {token.address.slice(0, 10)}...{token.address.slice(-8)} |
                      Decimals: {token.decimals} | Chain: {token.chainId}
                    </p>
                  </div>
                  {token.price && (
                    <div className="text-right">
                      <p className="text-sm font-medium text-text-primary">
                        ${token.price.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text-secondary">
            Click "Load Tokens" on a chain to see available tokens
          </p>
        )}
      </section>
    </div>
  );
}

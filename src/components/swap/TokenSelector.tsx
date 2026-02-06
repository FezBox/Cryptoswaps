"use client";

/**
 * TokenSelector Component
 *
 * Modal selector for tokens with search and popular tokens section.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useTokensStore } from "@/store/useTokensStore";
import TokenIcon from "./TokenIcon";
import type { Token, Chain, ChainId } from "@/types";

interface TokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  chain: Chain | null;
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
}

// Popular token symbols to highlight
const POPULAR_SYMBOLS = ["USDC", "ETH", "S"];

export default function TokenSelector({
  isOpen,
  onClose,
  chain,
  selectedToken: _selectedToken,
  onSelect,
}: TokenSelectorProps) {
  const {
    getTokensForChain,
    fetchTokensForChain,
    isLoadingChain,
    error,
  } = useTokensStore();

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch tokens when chain changes
  useEffect(() => {
    if (chain && isOpen) {
      console.log("Fetching tokens for chain:", chain.id);
      fetchTokensForChain(chain.id as ChainId);
    }
  }, [chain, isOpen, fetchTokensForChain]);

  // Get tokens for the selected chain
  const tokens = chain ? getTokensForChain(chain.id as ChainId) : [];
  const isLoading = chain ? isLoadingChain(chain.id as ChainId) : false;

  // Debug logging
  useEffect(() => {
    if (chain) {
      console.log(`Tokens for ${chain.id}:`, tokens);
      console.log(`Loading: ${isLoading}, Error: ${error}`);
    }
  }, [chain, tokens, isLoading, error]);

  // Filter tokens based on search query
  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get popular tokens (that are in the filtered list)
  const popularTokens = filteredTokens.filter((token) =>
    POPULAR_SYMBOLS.includes(token.symbol.toUpperCase())
  );

  // Get other tokens (excluding popular ones)
  const otherTokens = filteredTokens.filter(
    (token) => !POPULAR_SYMBOLS.includes(token.symbol.toUpperCase())
  );

  const handleSelect = (token: Token) => {
    onSelect(token);
    onClose();
    setSearchQuery("");
  };

  return (
    <Modal open={isOpen} onClose={onClose} className="max-w-md max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-[#2C2C2C] dark:text-white">
          Select Token
        </h2>
        <button
          onClick={onClose}
          className="text-[#666666] dark:text-[#999999] hover:text-[#2C2C2C] dark:hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Chain Info */}
      {chain && (
        <div className="mb-4 text-sm text-[#666666] dark:text-[#999999]">
          Tokens on <span className="font-medium">{chain.displayName}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] dark:text-[#999999]" />
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-3 py-2 border border-[#E5E5E5] dark:border-[#444444] rounded-lg
                   bg-white dark:bg-[#333333] text-[#2C2C2C] dark:text-white
                   text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                   placeholder:text-[#AAAAAA] dark:placeholder:text-[#666666]"
          autoFocus
        />
      </div>

      {/* Content */}
      <div className="overflow-y-auto max-h-96 -mx-6 px-6">
        {!chain ? (
          <div className="py-8 text-center text-[#666666] dark:text-[#999999] text-sm">
            Please select a chain first
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <div className="text-red-600 dark:text-red-400 text-sm font-medium mb-2">
              Error loading tokens
            </div>
            <div className="text-red-500 dark:text-red-400 text-xs">{error}</div>
            <div className="mt-4 text-xs text-[#666666] dark:text-dark-text-secondary">
              Chain ID: {chain.id}
            </div>
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center text-[#666666] dark:text-[#999999] text-sm">
            Loading tokens...
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-[#666666] dark:text-dark-text-secondary text-sm mb-2">
              No tokens found
            </div>
            <div className="text-xs text-[#666666] dark:text-[#999999]">
              Chain ID: {chain.id}
            </div>
          </div>
        ) : (
          <>
            {/* Popular Tokens */}
            {popularTokens.length > 0 && (
              <div className="mb-4">
                <div className="text-xs font-medium text-[#666666] dark:text-dark-text-secondary mb-2 uppercase tracking-wider">
                  Popular
                </div>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.03,
                      },
                    },
                  }}
                  className="space-y-1"
                >
                  {popularTokens.map((token) => (
                    <motion.button
                      key={`${token.chainId}-${token.address}`}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      onClick={() => handleSelect(token)}
                      className="w-full px-3 py-3 flex items-center gap-3
                               hover:bg-[#F5F5F5] dark:hover:bg-[#333333] rounded-lg transition-colors text-left"
                    >
                      <TokenIcon token={token} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#2C2C2C] dark:text-white">
                          {token.symbol}
                        </div>
                        <div className="text-xs text-[#666666] dark:text-[#999999] truncate">
                          {token.name}
                        </div>
                      </div>
                      {token.price && (
                        <div className="text-sm text-[#2C2C2C] dark:text-white font-medium">
                          ${token.price.toFixed(2)}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            )}

            {/* All Tokens */}
            {otherTokens.length > 0 && (
              <div>
                {popularTokens.length > 0 && (
                  <div className="text-xs font-medium text-[#666666] dark:text-[#999999] mb-2 uppercase tracking-wider">
                    All Tokens
                  </div>
                )}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.03,
                      },
                    },
                  }}
                  className="space-y-1"
                >
                  {otherTokens.map((token) => (
                    <motion.button
                      key={`${token.chainId}-${token.address}`}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      onClick={() => handleSelect(token)}
                      className="w-full px-3 py-3 flex items-center gap-3
                               hover:bg-[#F5F5F5] dark:hover:bg-[#333333] rounded-lg transition-colors text-left"
                    >
                      <TokenIcon token={token} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-[#2C2C2C] dark:text-white">
                          {token.symbol}
                        </div>
                        <div className="text-xs text-[#666666] dark:text-[#999999] truncate">
                          {token.name}
                        </div>
                      </div>
                      {token.price && (
                        <div className="text-sm text-[#2C2C2C] dark:text-white font-medium">
                          ${token.price.toFixed(2)}
                        </div>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}

"use client";

/**
 * ChainSelector Component
 *
 * Dropdown selector for blockchain chains with search functionality.
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useChainsStore } from "@/store/useChainsStore";
import ChainIcon from "./ChainIcon";
import type { Chain } from "@/types";

interface ChainSelectorProps {
  selectedChain: Chain | null;
  onSelect: (chain: Chain) => void;
  label?: string;
  disabled?: boolean;
}

export default function ChainSelector({
  selectedChain,
  onSelect,
  label,
  disabled = false,
}: ChainSelectorProps) {
  const { chains, isLoading, fetchChains } = useChainsStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch chains on mount
  useEffect(() => {
    if (chains.length === 0 && !isLoading) {
      fetchChains();
    }
  }, [chains.length, isLoading, fetchChains]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Filter chains based on search query
  const filteredChains = chains.filter(
    (chain) =>
      chain.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chain.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if a chain is Sonic (hub)
  const isHub = (chain: Chain) => chain.name === "sonic" || chain.isHub;

  const handleSelect = (chain: Chain) => {
    onSelect(chain);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {label}
        </label>
      )}

      {/* Selector Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-2 py-2.5 bg-white dark:bg-[#333333] border border-[#E0E0E0] dark:border-[#444444] rounded-lg
                   flex items-center justify-between gap-1.5 text-sm
                   hover:border-[#CCCCCC] hover:bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] dark:hover:border-[#555555] transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        {selectedChain ? (
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <ChainIcon chain={selectedChain} size="md" />
            <div className="text-left min-w-0 flex-1">
              <div className="font-medium text-[#2C2C2C] dark:text-white truncate">
                {selectedChain.displayName}
              </div>
              {isHub(selectedChain) && (
                <div className="text-xs text-white dark:text-primary bg-primary dark:bg-primary/10 px-1.5 py-0.5 rounded">Hub</div>
              )}
            </div>
          </div>
        ) : (
          <span className="text-[#666666] dark:text-[#999999]">Select</span>
        )}
        <ChevronDown
          className={`w-4 h-4 text-[#666666] dark:text-white transition-transform flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute z-50 w-full mt-2 bg-white dark:bg-[#2A2A2A] border border-[#E0E0E0] dark:border-[#444444] rounded-lg
                       shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-lg max-h-96 overflow-hidden flex flex-col"
          >
          {/* Search Input */}
          <div className="p-3 border-b border-[#E5E5E5] dark:border-[#444444]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666] dark:text-[#999999]" />
              <input
                type="text"
                placeholder="Search chains..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-[#E5E5E5] dark:border-[#444444] rounded-lg
                         bg-white dark:bg-[#333333] text-[#2C2C2C] dark:text-white
                         text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                         placeholder:text-[#AAAAAA] dark:placeholder:text-[#666666]"
                autoFocus
              />
            </div>
          </div>

          {/* Chains List */}
          <div className="overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-[#666666] dark:text-[#999999] text-sm">
                Loading chains...
              </div>
            ) : filteredChains.length === 0 ? (
              <div className="p-4 text-center text-[#666666] dark:text-[#999999] text-sm">
                No chains found
              </div>
            ) : (
              <div className="py-1">
                {filteredChains.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => handleSelect(chain)}
                    className="w-full px-4 py-3 flex items-center gap-3
                             hover:bg-[#F5F5F5] dark:hover:bg-[#333333] transition-colors text-left"
                  >
                    <ChainIcon chain={chain} size="md" />
                    <div className="flex-1">
                      <div className="font-medium text-[#2C2C2C] dark:text-white">
                        {chain.displayName}
                      </div>
                      <div className="text-xs text-[#666666] dark:text-[#999999]">
                        {chain.id}
                      </div>
                    </div>
                    {isHub(chain) && (
                      <div className="text-xs bg-primary text-white dark:bg-primary dark:text-[#1A1A1A] px-2 py-1 rounded">
                        Hub
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

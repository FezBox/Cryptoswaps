"use client";

/**
 * Test page for ChainSelector and TokenSelector components
 */

import { useState } from "react";
import ChainSelector from "@/components/swap/ChainSelector";
import TokenSelector from "@/components/swap/TokenSelector";
import Button from "@/components/ui/button";
import type { Chain, Token } from "@/types";

export default function TestSelectorsPage() {
  const [fromChain, setFromChain] = useState<Chain | null>(null);
  const [toChain, setToChain] = useState<Chain | null>(null);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);

  const [isFromTokenModalOpen, setIsFromTokenModalOpen] = useState(false);
  const [isToTokenModalOpen, setIsToTokenModalOpen] = useState(false);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        Selector Components Test
      </h1>
      <p className="text-text-secondary mb-8">
        Demo page for ChainSelector and TokenSelector components
      </p>

      <div className="grid gap-8 md:grid-cols-2">
        {/* From Section */}
        <div className="bg-white p-6 rounded-2xl border border-primary-100">
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            From
          </h2>

          {/* Chain Selector */}
          <div className="mb-4">
            <ChainSelector
              label="Source Chain"
              selectedChain={fromChain}
              onSelect={setFromChain}
            />
          </div>

          {/* Token Selector Button */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Source Token
            </label>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsFromTokenModalOpen(true)}
              disabled={!fromChain}
            >
              {fromToken ? (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{fromToken.symbol}</span>
                  <span className="text-text-secondary text-sm">
                    {fromToken.name}
                  </span>
                </div>
              ) : (
                <span className="text-text-secondary">Select token</span>
              )}
            </Button>
          </div>

          {/* Selected Info */}
          {fromChain && (
            <div className="mt-4 p-3 bg-primary-50 rounded-lg text-sm">
              <div className="font-medium text-text-primary mb-1">
                Selected Chain:
              </div>
              <div className="text-text-secondary">
                {fromChain.displayName} ({fromChain.id})
              </div>
            </div>
          )}

          {fromToken && (
            <div className="mt-2 p-3 bg-primary-50 rounded-lg text-sm">
              <div className="font-medium text-text-primary mb-1">
                Selected Token:
              </div>
              <div className="text-text-secondary">
                {fromToken.symbol} - {fromToken.name}
              </div>
              <div className="text-xs text-text-secondary mt-1 truncate">
                {fromToken.address}
              </div>
              {fromToken.price && (
                <div className="text-text-primary mt-1">
                  Price: ${fromToken.price.toFixed(2)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* To Section */}
        <div className="bg-white p-6 rounded-2xl border border-primary-100">
          <h2 className="text-xl font-semibold text-text-primary mb-4">To</h2>

          {/* Chain Selector */}
          <div className="mb-4">
            <ChainSelector
              label="Destination Chain"
              selectedChain={toChain}
              onSelect={setToChain}
            />
          </div>

          {/* Token Selector Button */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Destination Token
            </label>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setIsToTokenModalOpen(true)}
              disabled={!toChain}
            >
              {toToken ? (
                <div className="flex items-center gap-2">
                  <span className="font-medium">{toToken.symbol}</span>
                  <span className="text-text-secondary text-sm">
                    {toToken.name}
                  </span>
                </div>
              ) : (
                <span className="text-text-secondary">Select token</span>
              )}
            </Button>
          </div>

          {/* Selected Info */}
          {toChain && (
            <div className="mt-4 p-3 bg-primary-50 rounded-lg text-sm">
              <div className="font-medium text-text-primary mb-1">
                Selected Chain:
              </div>
              <div className="text-text-secondary">
                {toChain.displayName} ({toChain.id})
              </div>
            </div>
          )}

          {toToken && (
            <div className="mt-2 p-3 bg-primary-50 rounded-lg text-sm">
              <div className="font-medium text-text-primary mb-1">
                Selected Token:
              </div>
              <div className="text-text-secondary">
                {toToken.symbol} - {toToken.name}
              </div>
              <div className="text-xs text-text-secondary mt-1 truncate">
                {toToken.address}
              </div>
              {toToken.price && (
                <div className="text-text-primary mt-1">
                  Price: ${toToken.price.toFixed(2)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Token Selector Modals */}
      <TokenSelector
        isOpen={isFromTokenModalOpen}
        onClose={() => setIsFromTokenModalOpen(false)}
        chain={fromChain}
        selectedToken={fromToken}
        onSelect={setFromToken}
      />

      <TokenSelector
        isOpen={isToTokenModalOpen}
        onClose={() => setIsToTokenModalOpen(false)}
        chain={toChain}
        selectedToken={toToken}
        onSelect={setToToken}
      />
    </div>
  );
}

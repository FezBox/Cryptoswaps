"use client";

/**
 * Test page for TokenInput component
 */

import { useState } from "react";
import TokenInput from "@/components/swap/TokenInput";
import type { Chain, Token } from "@/types";

export default function TestTokenInputPage() {
  const [fromChain, setFromChain] = useState<Chain | null>(null);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("");

  const [toChain, setToChain] = useState<Chain | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [toAmount, setToAmount] = useState("");

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-text-primary mb-2">
        TokenInput Component Test
      </h1>
      <p className="text-text-secondary mb-8">
        Demo page for the combined TokenInput component
      </p>

      {/* Swap Card */}
      <div className="bg-background rounded-3xl border border-primary-100 p-6 space-y-4">
        {/* From Input */}
        <TokenInput
          label="From"
          chain={fromChain}
          token={fromToken}
          amount={fromAmount}
          onAmountChange={setFromAmount}
          onChainSelect={setFromChain}
          onTokenSelect={setFromToken}
        />

        {/* Swap Arrow */}
        <div className="flex justify-center -my-2 relative z-10">
          <button
            className="bg-white border border-primary-100 rounded-xl p-2
                       hover:bg-primary-50 transition-colors"
            onClick={() => {
              // Flip functionality
              setFromChain(toChain);
              setFromToken(toToken);
              setFromAmount(toAmount);
              setToChain(fromChain);
              setToToken(fromToken);
              setToAmount(fromAmount);
            }}
          >
            <svg
              className="w-5 h-5 text-text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        {/* To Input */}
        <TokenInput
          label="To"
          chain={toChain}
          token={toToken}
          amount={toAmount}
          onAmountChange={setToAmount}
          onChainSelect={setToChain}
          onTokenSelect={setToToken}
        />
      </div>

      {/* Debug Info */}
      <div className="mt-8 p-4 bg-white rounded-xl border border-primary-100">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Current State
        </h3>
        <div className="space-y-2 text-sm text-text-secondary font-mono">
          <div>
            <strong>From:</strong> {fromAmount || "0"}{" "}
            {fromToken?.symbol || "?"} on {fromChain?.displayName || "?"}
          </div>
          <div>
            <strong>To:</strong> {toAmount || "0"} {toToken?.symbol || "?"} on{" "}
            {toChain?.displayName || "?"}
          </div>
        </div>
      </div>
    </div>
  );
}

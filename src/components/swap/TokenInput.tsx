"use client";

/**
 * TokenInput Component
 *
 * Combined input component for amount, chain, and token selection.
 */

import { useState } from "react";
import { useBalance, useAccount, useReadContract } from "wagmi";
import { formatUnits, erc20Abi } from "viem";
import ChainSelector from "./ChainSelector";
import TokenSelector from "./TokenSelector";
import TokenIcon from "./TokenIcon";
import Button from "@/components/ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Chain, Token } from "@/types";

interface TokenInputProps {
  label: string;
  chain: Chain | null;
  token: Token | null;
  amount: string;
  onAmountChange: (amount: string) => void;
  onChainSelect: (chain: Chain) => void;
  onTokenSelect: (token: Token) => void;
  readonly?: boolean;
  isLoading?: boolean;
}

// Mapping from SODAX chainId to EVM chain ID
// Handles both full format (0xa86a.avax) and simple format (avax, arbitrum, etc.)
const SODAX_TO_EVM_CHAIN_ID: Record<string, number> = {
  // Full format (from API)
  "sonic": 146,
  "0xa4b1.arbitrum": 42161,
  "0x2105.base": 8453,
  "0x38.bsc": 56,
  "0xa.optimism": 10,
  "0x89.polygon": 137,
  "0xa86a.avax": 43114,
  "0x1.ethereum": 1,
  // Simple format (may also be used)
  "arbitrum": 42161,
  "base": 8453,
  "bsc": 56,
  "optimism": 10,
  "polygon": 137,
  "avalanche": 43114,
  "avax": 43114,
  "ethereum": 1,
  "icon": 1, // ICON uses Ethereum
};

export default function TokenInput({
  label,
  chain,
  token,
  amount,
  onAmountChange,
  onChainSelect,
  onTokenSelect,
  readonly = false,
  isLoading = false,
}: TokenInputProps) {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const { address } = useAccount();

  // Map SODAX chainId to EVM chain ID
  // Try mapping first, then fallback to parsing hex format (0xa86a = 43114)
  const evmChainId = token?.chainId
    ? (SODAX_TO_EVM_CHAIN_ID[token.chainId] ||
       (token.chainId.startsWith("0x") && token.chainId.includes(".")
         ? parseInt(token.chainId.split(".")[0], 16)
         : undefined))
    : undefined;

  // Fetch token balance - different methods for native vs ERC20 tokens
  // In wagmi v2+, useBalance only works for native tokens
  // ERC20 tokens require useReadContract with ERC20 ABI
  const shouldFetchBalance = !!address && !!token && !readonly && !!evmChainId;
  const isNativeToken = token?.address === "0x0000000000000000000000000000000000000000";

  // Debug logs
  console.log("🔍 Balance Debug:", {
    label,
    walletAddress: address,
    tokenSymbol: token?.symbol,
    tokenAddress: token?.address,
    sodaxChainId: token?.chainId,
    evmChainId,
    isNativeToken,
    shouldFetchBalance,
  });

  // Fetch native token balance
  const {
    data: nativeBalanceData,
    isLoading: isLoadingNative
  } = useBalance(
    shouldFetchBalance && isNativeToken
      ? {
          address: address,
          chainId: evmChainId,
        }
      : undefined
  );

  // Fetch ERC20 token balance
  const {
    data: erc20Balance,
    isLoading: isLoadingERC20,
  } = useReadContract(
    shouldFetchBalance && !isNativeToken
      ? {
          address: token.address as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address],
          chainId: evmChainId,
        }
      : undefined
  );

  // Combine balance data from either source
  const balanceData = isNativeToken ? nativeBalanceData : (erc20Balance !== undefined ? {
    value: erc20Balance,
    decimals: token?.decimals || 18,
    symbol: token?.symbol || "",
  } : undefined);
  const isLoadingBalance = isNativeToken ? isLoadingNative : isLoadingERC20;

  // Debug balance response
  console.log("💰 Balance Response:", {
    tokenSymbol: token?.symbol,
    isNativeToken,
    nativeBalanceData,
    erc20Balance,
    balanceData,
    isLoadingBalance,
  });

  // Handle numeric input validation
  const handleAmountChange = (value: string) => {
    // Allow empty string
    if (value === "") {
      onAmountChange("");
      return;
    }

    // Allow only numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (!regex.test(value)) {
      return;
    }

    // Limit decimal places based on token decimals (default to 18)
    const decimals = token?.decimals || 18;
    const parts = value.split(".");
    if (parts.length === 2 && parts[1].length > decimals) {
      return;
    }

    onAmountChange(value);
  };

  // Format balance from bigint
  const formattedBalance = balanceData
    ? formatUnits(balanceData.value, balanceData.decimals)
    : "0";

  // Handle MAX button click
  const handleMaxClick = () => {
    if (balanceData) {
      onAmountChange(formattedBalance);
    }
  };

  // Calculate USD value
  const usdValue = token && amount && parseFloat(amount) > 0
    ? `$${(parseFloat(amount) * (token.price || 0)).toFixed(2)}`
    : "$0.00";

  // Format balance for display (4 decimal places)
  const displayBalance = parseFloat(formattedBalance).toFixed(4);

  return (
    <div className="bg-[#F8F8F8] dark:bg-[#2A2A2A] rounded-2xl border border-[#E0E0E0] dark:border-[#444444] p-4">
      {/* Grid layout for perfect alignment */}
      <div className="grid grid-cols-[minmax(0,1fr)_145px] gap-x-3 gap-y-3 mb-4 w-full">
        {/* Row 1: Label and Chain Selector */}
        <span className="text-sm font-medium text-text-secondary dark:text-[#999999] self-center">
          {label}
        </span>
        <div className="w-full">
          <ChainSelector
            selectedChain={chain}
            onSelect={onChainSelect}
            disabled={readonly}
          />
        </div>

        {/* Row 2: Amount Input and Token Selector */}
        <div className="relative">
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            disabled={readonly || !token || isLoading}
            className={cn(
              "text-3xl font-semibold text-[#2C2C2C] dark:text-white bg-transparent",
              "outline-none placeholder:text-[#AAAAAA] dark:placeholder:text-[#666666]",
              "disabled:opacity-50 disabled:cursor-not-allowed self-center min-w-0",
              isLoading && "opacity-50"
            )}
          />
          {isLoading && readonly && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}
        </div>
        <div className="w-full">
          <Button
            variant="outline"
            size="md"
            onClick={() => setIsTokenModalOpen(true)}
            disabled={readonly || !chain}
            className="w-full flex items-center justify-center gap-1.5 whitespace-nowrap text-sm px-2"
          >
            {token ? (
              <>
                <TokenIcon token={token} size="sm" />
                <span className="font-semibold truncate">{token.symbol}</span>
                <ChevronDown className="w-4 h-4 text-text-secondary dark:text-[#999999] flex-shrink-0" />
              </>
            ) : (
              <>
                <span className="text-text-secondary dark:text-[#888888]">Select</span>
                <ChevronDown className="w-4 h-4 text-text-secondary dark:text-[#999999] flex-shrink-0" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Bottom Row: USD Value + Balance */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-[#888888] dark:text-[#888888]">{usdValue}</span>
        {!readonly && (
          <div className="flex items-center gap-2">
            <span className="text-[#888888] dark:text-[#888888]">
              Balance:{" "}
              <span className="font-medium">
                {isLoadingBalance ? "..." : displayBalance}
              </span>
            </span>
            {balanceData && parseFloat(formattedBalance) > 0 && (
              <button
                onClick={handleMaxClick}
                className="text-primary hover:text-primary-700 dark:hover:text-primary-500 font-medium text-xs px-2 py-0.5 rounded bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                MAX
              </button>
            )}
          </div>
        )}
      </div>

      {/* Token Selector Modal */}
      <TokenSelector
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        chain={chain}
        selectedToken={token}
        onSelect={(selectedToken) => {
          onTokenSelect(selectedToken);
          setIsTokenModalOpen(false);
        }}
      />
    </div>
  );
}

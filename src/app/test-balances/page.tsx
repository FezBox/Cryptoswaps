"use client";

import { useEffect, useState } from "react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatUnits, erc20Abi } from "viem";
import { useTokensStore } from "@/store/useTokensStore";
import type { Token } from "@/types";

// Chain ID mapping (same as TokenInput)
const SODAX_TO_EVM_CHAIN_ID: Record<string, number> = {
  "sonic": 146,
  "0xa4b1.arbitrum": 42161,
  "0x2105.base": 8453,
  "0x38.bsc": 56,
  "0xa.optimism": 10,
  "0x89.polygon": 137,
  "0xa86a.avax": 43114,
  "0x1.ethereum": 1,
  "arbitrum": 42161,
  "base": 8453,
  "bsc": 56,
  "optimism": 10,
  "polygon": 137,
  "avalanche": 43114,
  "avax": 43114,
  "ethereum": 1,
  "icon": 1,
};

function TokenBalanceRow({ token }: { token: Token }) {
  const { address } = useAccount();

  const evmChainId = token.chainId
    ? (SODAX_TO_EVM_CHAIN_ID[token.chainId] ||
       (token.chainId.startsWith("0x") && token.chainId.includes(".")
         ? parseInt(token.chainId.split(".")[0], 16)
         : undefined))
    : undefined;

  const isNativeToken = token.address === "0x0000000000000000000000000000000000000000";
  const shouldFetch = !!address && !!token && !!evmChainId;

  // Wagmi v2+ removed token parameter from useBalance
  // Use useBalance for native tokens, useReadContract for ERC20s
  const {
    data: nativeBalanceData,
    isLoading: isLoadingNative,
    error: nativeError
  } = useBalance(
    shouldFetch && isNativeToken
      ? {
          address: address,
          chainId: evmChainId,
        }
      : undefined
  );

  const {
    data: erc20Balance,
    isLoading: isLoadingERC20,
    error: erc20Error,
  } = useReadContract(
    shouldFetch && !isNativeToken
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
    decimals: token.decimals,
    symbol: token.symbol,
  } : undefined);
  const isLoading = isNativeToken ? isLoadingNative : isLoadingERC20;
  const error = isNativeToken ? nativeError : erc20Error;

  const formattedBalance = balanceData
    ? formatUnits(balanceData.value, balanceData.decimals)
    : null;

  return (
    <tr className={shouldFetch ? "" : "opacity-50"}>
      <td className="px-4 py-2 border">{token.symbol}</td>
      <td className="px-4 py-2 border text-xs">{token.chainId}</td>
      <td className="px-4 py-2 border">{evmChainId ?? "❌"}</td>
      <td className="px-4 py-2 border">{isNativeToken ? "✓" : ""}</td>
      <td className="px-4 py-2 border text-xs">{token.address.slice(0, 10)}...</td>
      <td className="px-4 py-2 border">{shouldFetch ? "✓" : "❌"}</td>
      <td className="px-4 py-2 border">
        {isLoading ? (
          <span className="text-yellow-600">Loading...</span>
        ) : error ? (
          <span className="text-red-600" title={String(error)}>Error</span>
        ) : formattedBalance !== null ? (
          <span className="text-green-600">{parseFloat(formattedBalance).toFixed(6)}</span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
    </tr>
  );
}

export default function TestBalancesPage() {
  const { tokensByChain, fetchAllTokens, isLoading } = useTokensStore();
  const { address, isConnected } = useAccount();
  const [allTokens, setAllTokens] = useState<Token[]>([]);

  useEffect(() => {
    fetchAllTokens();
  }, [fetchAllTokens]);

  useEffect(() => {
    const tokens: Token[] = [];
    Object.values(tokensByChain).forEach((chainTokens) => {
      tokens.push(...chainTokens);
    });
    setAllTokens(tokens);
  }, [tokensByChain]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Balance Test - Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Token Balance Test</h1>

      {!isConnected ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          ⚠️ Wallet not connected. Connect your wallet to test balance fetching.
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          ✓ Wallet connected: {address?.slice(0, 10)}...{address?.slice(-8)}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Chain ID Mapping</h2>
        <div className="bg-gray-100 p-4 rounded">
          {Object.entries(SODAX_TO_EVM_CHAIN_ID).map(([sodax, evm]) => (
            <div key={sodax} className="text-sm">
              <code>{sodax}</code> → {evm}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">
          Tokens Found: {allTokens.length}
        </h2>
        <p className="text-sm text-gray-600">
          Grouped by chain: {Object.keys(tokensByChain).length} chains
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Symbol</th>
              <th className="px-4 py-2 border">SODAX Chain ID</th>
              <th className="px-4 py-2 border">EVM Chain ID</th>
              <th className="px-4 py-2 border">Native</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Can Fetch?</th>
              <th className="px-4 py-2 border">Balance</th>
            </tr>
          </thead>
          <tbody>
            {allTokens.map((token, idx) => (
              <TokenBalanceRow key={`${token.chainId}-${token.address}-${idx}`} token={token} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 p-4 rounded">
        <h3 className="font-semibold mb-2">Legend:</h3>
        <ul className="text-sm space-y-1">
          <li>✓ Can Fetch = All requirements met (wallet connected, chain mapped, valid token)</li>
          <li>❌ Can Fetch = Missing requirements (check EVM Chain ID column)</li>
          <li>🟢 Green balance = Successfully fetched</li>
          <li>🔴 Red "Error" = Fetch failed (hover to see error)</li>
          <li>🟡 Yellow "Loading..." = Currently fetching</li>
          <li>⚪ Gray "-" = Not fetched (requirements not met)</li>
        </ul>
      </div>
    </div>
  );
}

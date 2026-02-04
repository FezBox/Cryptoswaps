/**
 * Core type definitions for SODAX
 * Phase 1: Basic placeholder types
 */

export type Chain = {
  id: string;
  name: string;
  logo: string;
  nativeToken: string;
};

export type Token = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logo: string;
  chainId: string;
};

export type SwapRoute = {
  fromChain: string;
  toChain: string;
  fromToken: Token;
  toToken: Token;
  amount: string;
};

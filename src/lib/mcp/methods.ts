/**
 * Typed MCP method wrappers for SODAX API
 *
 * Provides convenient, type-safe functions for calling MCP methods.
 */

import { mcpClient } from "./client";
import type { Chain, ChainId } from "@/types";
import type { Token } from "@/types";

/**
 * MCP response wrapper with content and structuredContent
 */
interface MCPResponse<T> {
  content?: Array<{ type: string; text: string }>;
  structuredContent?: T;
}

/**
 * Response structure for sodax_get_supported_chains
 */
interface GetChainsStructuredContent {
  chains: string[]; // Array of chain IDs
  total: number;
}

/**
 * Response structure for sodax_get_swap_tokens
 * Returns tokens grouped by chain ID
 */
interface GetTokensStructuredContent {
  [chainId: string]: Token[];
}

/**
 * Converts a chain ID string to a basic Chain object
 */
function chainIdToChain(chainId: string): Chain {
  // Extract the simple name from formats like "0xa86a.avax" or "injective-1"
  const simpleName = chainId.includes(".")
    ? chainId.split(".")[1]
    : chainId.replace(/-.+$/, "");

  // Capitalize first letter for display name
  const displayName =
    simpleName.charAt(0).toUpperCase() + simpleName.slice(1);

  return {
    id: chainId as ChainId,
    name: simpleName,
    displayName: displayName,
    icon: "", // No icon data from API
    isHub: false, // No hub data from API
  };
}

/**
 * Fetches all supported blockchain chains from SODAX
 *
 * @returns Promise resolving to array of supported chains
 * @throws MCPError if the request fails
 */
export async function getChains(): Promise<Chain[]> {
  const response = await mcpClient.request<
    MCPResponse<GetChainsStructuredContent>
  >("sodax_get_supported_chains");

  // Debug logging
  console.log("getChains response:", JSON.stringify(response, null, 2));

  // Extract chain IDs from structuredContent
  if (
    response &&
    typeof response === "object" &&
    "structuredContent" in response &&
    response.structuredContent &&
    "chains" in response.structuredContent
  ) {
    const chainIds = response.structuredContent.chains;
    return chainIds.map(chainIdToChain);
  }

  throw new Error(`Unexpected response structure: ${JSON.stringify(response)}`);
}

/**
 * Fetches all available swap tokens grouped by chain
 *
 * @returns Promise resolving to object with chain IDs as keys and token arrays as values
 * @throws MCPError if the request fails
 */
export async function getAllTokens(): Promise<Record<string, Token[]>> {
  const response = await mcpClient.request<
    MCPResponse<GetTokensStructuredContent>
  >("sodax_get_swap_tokens", { response_format: "json" });

  // Debug logging
  console.log("getAllTokens response:", JSON.stringify(response, null, 2));

  // Extract tokens from content[0].text (it's a JSON string)
  if (
    response &&
    typeof response === "object" &&
    "content" in response &&
    Array.isArray(response.content) &&
    response.content.length > 0 &&
    response.content[0].type === "text" &&
    typeof response.content[0].text === "string"
  ) {
    // Parse the JSON string to get the actual tokens object
    const tokensData = JSON.parse(response.content[0].text);
    console.log("Parsed tokens data:", tokensData);

    // Add chainId to each token since the API returns tokens grouped by chain
    // but doesn't include chainId on individual token objects
    const tokensWithChainId: Record<string, Token[]> = {};
    for (const [chainId, tokens] of Object.entries(tokensData)) {
      tokensWithChainId[chainId] = (tokens as Token[]).map((token) => ({
        ...token,
        chainId: chainId as ChainId,
      }));
    }

    return tokensWithChainId;
  }

  throw new Error(`Unexpected response structure: ${JSON.stringify(response)}`);
}

/**
 * Fetches available swap tokens for a specific chain
 *
 * @param chainId - Chain ID to get tokens for
 * @returns Promise resolving to array of available tokens for the chain
 * @throws MCPError if the request fails
 */
export async function getTokens(chainId: ChainId): Promise<Token[]> {
  const allTokens = await getAllTokens();
  return allTokens[chainId] || [];
}

/**
 * Lists all available MCP tools from the SODAX API
 *
 * @returns Promise resolving to list of available tools
 * @throws MCPError if the request fails
 */
export async function listTools(): Promise<unknown> {
  return await mcpClient.listTools();
}

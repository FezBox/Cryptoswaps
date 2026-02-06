/**
 * MCP (Model Context Protocol) Client for SODAX API
 *
 * Implements JSON-RPC 2.0 protocol for communication with the MCP endpoint.
 */

const MCP_ENDPOINT = "https://mcp-test.sodax.com/mcp";
const MCP_API_ROUTE = "/api/mcp";

/**
 * Determines the appropriate endpoint based on environment
 * Uses API route in browser to avoid CORS, direct endpoint in server-side contexts
 */
function getDefaultEndpoint(): string {
  // Check if running in browser
  if (typeof window !== "undefined") {
    return MCP_API_ROUTE;
  }
  // Server-side: use direct endpoint
  return MCP_ENDPOINT;
}

/**
 * JSON-RPC 2.0 request structure
 */
interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: Record<string, unknown>;
}

/**
 * JSON-RPC 2.0 success response structure
 */
interface JsonRpcSuccessResponse<T> {
  jsonrpc: "2.0";
  id: number;
  result: T;
}

/**
 * JSON-RPC 2.0 error object
 */
interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

/**
 * JSON-RPC 2.0 error response structure
 */
interface JsonRpcErrorResponse {
  jsonrpc: "2.0";
  id: number;
  error: JsonRpcError;
}

/**
 * Union type for JSON-RPC responses
 */
type JsonRpcResponse<T> = JsonRpcSuccessResponse<T> | JsonRpcErrorResponse;

/**
 * Custom error class for MCP-related errors
 */
export class MCPError extends Error {
  code: number;
  data?: unknown;

  constructor(message: string, code: number, data?: unknown) {
    super(message);
    this.name = "MCPError";
    this.code = code;
    this.data = data;
  }
}

/**
 * MCP Client for interacting with SODAX MCP endpoint
 */
export class MCPClient {
  private endpoint: string;
  private requestId: number;

  constructor(endpoint?: string) {
    this.endpoint = endpoint ?? getDefaultEndpoint();
    this.requestId = 0;
  }

  /**
   * Makes a JSON-RPC 2.0 request to the MCP endpoint using tools/call wrapper
   *
   * @param toolName - The tool/method name to call (e.g., "sodax_get_supported_chains")
   * @param args - Optional arguments object for the tool
   * @returns Promise resolving to the result data
   * @throws MCPError if the request fails or returns an error response
   */
  async request<T>(
    toolName: string,
    args?: Record<string, unknown>
  ): Promise<T> {
    // Increment request ID for each new request
    this.requestId += 1;
    const id = this.requestId;

    // Construct JSON-RPC 2.0 request with tools/call wrapper
    const requestBody: JsonRpcRequest = {
      jsonrpc: "2.0",
      id,
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args ?? {},
      },
    };

    try {
      // Make HTTP POST request
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: JSON.stringify(requestBody),
      });

      // Check HTTP response status
      if (!response.ok) {
        throw new MCPError(
          `HTTP error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      // Parse JSON response
      const jsonResponse: JsonRpcResponse<T> = await response.json();

      // Check for JSON-RPC error response
      if ("error" in jsonResponse) {
        throw new MCPError(
          jsonResponse.error.message,
          jsonResponse.error.code,
          jsonResponse.error.data
        );
      }

      // Return successful result
      return jsonResponse.result;
    } catch (error) {
      // Re-throw MCPError as-is
      if (error instanceof MCPError) {
        throw error;
      }

      // Wrap other errors (network errors, JSON parse errors, etc.)
      if (error instanceof Error) {
        throw new MCPError(
          `MCP request failed: ${error.message}`,
          -32603, // Internal error code
          error
        );
      }

      // Unknown error type
      throw new MCPError("MCP request failed: Unknown error", -32603, error);
    }
  }

  /**
   * Lists all available tools from the MCP endpoint
   *
   * @returns Promise resolving to the list of available tools
   * @throws MCPError if the request fails or returns an error response
   */
  async listTools(): Promise<unknown> {
    // Increment request ID for each new request
    this.requestId += 1;
    const id = this.requestId;

    // Construct JSON-RPC 2.0 request for tools/list
    const requestBody = {
      jsonrpc: "2.0" as const,
      id,
      method: "tools/list",
    };

    try {
      // Make HTTP POST request
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
        body: JSON.stringify(requestBody),
      });

      // Check HTTP response status
      if (!response.ok) {
        throw new MCPError(
          `HTTP error: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      // Parse JSON response
      const jsonResponse = await response.json();

      // Check for JSON-RPC error response
      if ("error" in jsonResponse) {
        throw new MCPError(
          jsonResponse.error.message,
          jsonResponse.error.code,
          jsonResponse.error.data
        );
      }

      // Return successful result
      return jsonResponse.result;
    } catch (error) {
      // Re-throw MCPError as-is
      if (error instanceof MCPError) {
        throw error;
      }

      // Wrap other errors (network errors, JSON parse errors, etc.)
      if (error instanceof Error) {
        throw new MCPError(
          `MCP request failed: ${error.message}`,
          -32603, // Internal error code
          error
        );
      }

      // Unknown error type
      throw new MCPError("MCP request failed: Unknown error", -32603, error);
    }
  }
}

/**
 * Default singleton instance for convenience
 */
export const mcpClient = new MCPClient();

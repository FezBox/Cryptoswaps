/**
 * MCP API Proxy Route
 *
 * Proxies MCP requests server-side to avoid CORS issues in the browser.
 */

import { NextRequest, NextResponse } from "next/server";

const MCP_ENDPOINT = "https://mcp-test.sodax.com/mcp";

export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const body = await request.json();

    // Forward the request to the MCP endpoint
    const response = await fetch(MCP_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
      },
      body: JSON.stringify(body),
    });

    // Get the response data
    const data = await response.json();

    // Return the response with appropriate status code
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    // Handle errors
    console.error("MCP proxy error:", error);

    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32603,
          message:
            error instanceof Error ? error.message : "Internal server error",
        },
      },
      { status: 500 }
    );
  }
}

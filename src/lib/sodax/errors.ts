/**
 * SODAX Error Handling
 *
 * Maps SDK errors to user-friendly messages
 */

/**
 * Error codes for SODAX operations
 */
export enum SodaxErrorCode {
  INSUFFICIENT_LIQUIDITY = "INSUFFICIENT_LIQUIDITY",
  INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
  INVALID_AMOUNT = "INVALID_AMOUNT",
  UNSUPPORTED_CHAIN = "UNSUPPORTED_CHAIN",
  UNSUPPORTED_TOKEN = "UNSUPPORTED_TOKEN",
  QUOTE_EXPIRED = "QUOTE_EXPIRED",
  NETWORK_ERROR = "NETWORK_ERROR",
  USER_REJECTED = "USER_REJECTED",
  TRANSACTION_FAILED = "TRANSACTION_FAILED",
  SLIPPAGE_EXCEEDED = "SLIPPAGE_EXCEEDED",
  RELAY_TIMEOUT = "RELAY_TIMEOUT",
  SUBMIT_TX_FAILED = "SUBMIT_TX_FAILED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Custom error class for SODAX operations
 */
export class SodaxError extends Error {
  code: SodaxErrorCode;
  originalError?: unknown;

  constructor(
    code: SodaxErrorCode,
    message: string,
    originalError?: unknown
  ) {
    super(message);
    this.name = "SodaxError";
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES: Record<SodaxErrorCode, string> = {
  [SodaxErrorCode.INSUFFICIENT_LIQUIDITY]:
    "Insufficient liquidity for this trade size. Try a smaller amount.",
  [SodaxErrorCode.INSUFFICIENT_BALANCE]:
    "Insufficient balance to complete this swap.",
  [SodaxErrorCode.INVALID_AMOUNT]:
    "Invalid swap amount. Please enter a valid number.",
  [SodaxErrorCode.UNSUPPORTED_CHAIN]:
    "This blockchain is not supported yet.",
  [SodaxErrorCode.UNSUPPORTED_TOKEN]:
    "This token is not supported for swaps.",
  [SodaxErrorCode.QUOTE_EXPIRED]:
    "Quote has expired. Please refresh to get a new quote.",
  [SodaxErrorCode.NETWORK_ERROR]:
    "Network error. Please check your connection and try again.",
  [SodaxErrorCode.USER_REJECTED]:
    "Transaction was rejected by user.",
  [SodaxErrorCode.TRANSACTION_FAILED]:
    "Transaction failed. Please try again.",
  [SodaxErrorCode.SLIPPAGE_EXCEEDED]:
    "Price changed too much. Increase slippage tolerance or try again.",
  [SodaxErrorCode.RELAY_TIMEOUT]:
    "Cross-chain relay in progress. Tokens may take 1-2 minutes to arrive.",
  [SodaxErrorCode.SUBMIT_TX_FAILED]:
    "Swap submitted. Cross-chain confirmation pending.",
  [SodaxErrorCode.UNKNOWN_ERROR]:
    "An unexpected error occurred. Please try again.",
};

/**
 * Map SDK errors to SodaxError
 */
export function mapSdkError(error: unknown): SodaxError {
  // Handle SDK Result error
  if (typeof error === "object" && error !== null) {
    const err = error as any;

    // Check for specific SDK error patterns
    if (err.message?.includes("liquidity")) {
      return new SodaxError(
        SodaxErrorCode.INSUFFICIENT_LIQUIDITY,
        ERROR_MESSAGES[SodaxErrorCode.INSUFFICIENT_LIQUIDITY],
        error
      );
    }

    if (err.message?.includes("balance")) {
      return new SodaxError(
        SodaxErrorCode.INSUFFICIENT_BALANCE,
        ERROR_MESSAGES[SodaxErrorCode.INSUFFICIENT_BALANCE],
        error
      );
    }

    if (err.message?.includes("slippage")) {
      return new SodaxError(
        SodaxErrorCode.SLIPPAGE_EXCEEDED,
        ERROR_MESSAGES[SodaxErrorCode.SLIPPAGE_EXCEEDED],
        error
      );
    }

    if (err.message?.includes("user rejected") || err.code === 4001 || err.code === "ACTION_REJECTED") {
      return new SodaxError(
        SodaxErrorCode.USER_REJECTED,
        ERROR_MESSAGES[SodaxErrorCode.USER_REJECTED],
        error
      );
    }

    if (err.message?.includes("network") || err.code === "NETWORK_ERROR") {
      return new SodaxError(
        SodaxErrorCode.NETWORK_ERROR,
        ERROR_MESSAGES[SodaxErrorCode.NETWORK_ERROR],
        error
      );
    }

    if (err.message?.includes("unsupported chain")) {
      return new SodaxError(
        SodaxErrorCode.UNSUPPORTED_CHAIN,
        ERROR_MESSAGES[SodaxErrorCode.UNSUPPORTED_CHAIN],
        error
      );
    }

    // Check for relay/submit timeout patterns
    if (err.message?.includes("relay") && (err.message?.includes("timeout") || err.message?.includes("timed out"))) {
      return new SodaxError(
        SodaxErrorCode.RELAY_TIMEOUT,
        ERROR_MESSAGES[SodaxErrorCode.RELAY_TIMEOUT],
        error
      );
    }

    if (err.message?.includes("submit") && err.message?.includes("failed")) {
      return new SodaxError(
        SodaxErrorCode.SUBMIT_TX_FAILED,
        ERROR_MESSAGES[SodaxErrorCode.SUBMIT_TX_FAILED],
        error
      );
    }
  }

  // Fallback for unknown errors
  return new SodaxError(
    SodaxErrorCode.UNKNOWN_ERROR,
    ERROR_MESSAGES[SodaxErrorCode.UNKNOWN_ERROR],
    error
  );
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error: unknown): string {
  if (error instanceof SodaxError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Check if it's a known error pattern
    const mappedError = mapSdkError(error);
    return mappedError.message;
  }

  return ERROR_MESSAGES[SodaxErrorCode.UNKNOWN_ERROR];
}

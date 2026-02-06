/**
 * Quote Generation
 *
 * Re-exports SODAX SDK quote functionality.
 * The mock implementation has been replaced with real SDK integration.
 */

import { fetchSodaxQuote } from "./sodax/quote";

// Export SDK quote as main quote function
// Maintains backward compatibility with existing code that uses generateMockQuote
export const generateMockQuote = fetchSodaxQuote;

// Re-export for explicit usage
export { fetchSodaxQuote as generateQuote };

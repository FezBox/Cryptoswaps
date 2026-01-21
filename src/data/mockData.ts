import type { Token, Transaction, WalletInfo, Chain } from '../types';

// Token colors for icons
const TOKEN_COLORS: Record<string, string> = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    SOL: '#00FFA3',
    USDC: '#2775CA',
    USDT: '#26A17B',
    BNB: '#F3BA2F',
    MATIC: '#8247E5',
    AVAX: '#E84142',
    DOGE: '#C2A633',
    LINK: '#2A5ADA',
    UNI: '#FF007A',
    AAVE: '#B6509E',
    CRV: '#3465A4',
    SUSHI: '#FA52A0',
    DOT: '#E6007A',
    ADA: '#0033AD',
    XRP: '#23292F',
    LTC: '#BFBBBB',
    BCH: '#8DC351',
    ATOM: '#2E3148',
};

// Chain data
export const CHAINS: Chain[] = [
    { name: 'Bitcoin', icon: '₿', color: '#F7931A' },
    { name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
    { name: 'Solana', icon: '◎', color: '#00FFA3' },
    { name: 'Polygon', icon: '⬡', color: '#8247E5' },
    { name: 'Arbitrum', icon: '△', color: '#28A0F0' },
    { name: 'NEAR', icon: '◈', color: '#00C1DE' },
];

// Mock token data
export const TOKENS: Token[] = [
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿', chain: 'Bitcoin', balance: '1.5', usdValue: '63750.00', color: TOKEN_COLORS.BTC },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', chain: 'Ethereum', balance: '10.2', usdValue: '20400.00', color: TOKEN_COLORS.ETH },
    { symbol: 'SOL', name: 'Solana', icon: '◎', chain: 'Solana', balance: '500', usdValue: '15000.00', color: TOKEN_COLORS.SOL },
    { symbol: 'USDC', name: 'USD Coin', icon: '$', chain: 'Ethereum', balance: '5000', usdValue: '5000.00', color: TOKEN_COLORS.USDC },
    { symbol: 'USDT', name: 'Tether', icon: '₮', chain: 'Ethereum', balance: '3000', usdValue: '3000.00', color: TOKEN_COLORS.USDT },
    { symbol: 'BNB', name: 'BNB', icon: '◆', chain: 'BSC', balance: '25', usdValue: '7500.00', color: TOKEN_COLORS.BNB },
    { symbol: 'MATIC', name: 'Polygon', icon: '⬡', chain: 'Polygon', balance: '2500', usdValue: '2250.00', color: TOKEN_COLORS.MATIC },
    { symbol: 'AVAX', name: 'Avalanche', icon: 'Ⓐ', chain: 'Avalanche', balance: '150', usdValue: '5250.00', color: TOKEN_COLORS.AVAX },
    { symbol: 'DOGE', name: 'Dogecoin', icon: 'Ð', chain: 'Dogecoin', balance: '10000', usdValue: '800.00', color: TOKEN_COLORS.DOGE },
    { symbol: 'LINK', name: 'Chainlink', icon: '⬡', chain: 'Ethereum', balance: '200', usdValue: '2800.00', color: TOKEN_COLORS.LINK },
    { symbol: 'UNI', name: 'Uniswap', icon: '🦄', chain: 'Ethereum', balance: '300', usdValue: '2100.00', color: TOKEN_COLORS.UNI },
    { symbol: 'AAVE', name: 'Aave', icon: '👻', chain: 'Ethereum', balance: '20', usdValue: '1800.00', color: TOKEN_COLORS.AAVE },
    { symbol: 'CRV', name: 'Curve DAO', icon: '⟟', chain: 'Ethereum', balance: '5000', usdValue: '2500.00', color: TOKEN_COLORS.CRV },
    { symbol: 'SUSHI', name: 'SushiSwap', icon: '🍣', chain: 'Ethereum', balance: '1000', usdValue: '1200.00', color: TOKEN_COLORS.SUSHI },
    { symbol: 'DOT', name: 'Polkadot', icon: '●', chain: 'Polkadot', balance: '400', usdValue: '2800.00', color: TOKEN_COLORS.DOT },
    { symbol: 'ADA', name: 'Cardano', icon: '₳', chain: 'Cardano', balance: '5000', usdValue: '2250.00', color: TOKEN_COLORS.ADA },
    { symbol: 'XRP', name: 'XRP', icon: '✕', chain: 'XRP Ledger', balance: '3000', usdValue: '1500.00', color: TOKEN_COLORS.XRP },
    { symbol: 'LTC', name: 'Litecoin', icon: 'Ł', chain: 'Litecoin', balance: '30', usdValue: '2250.00', color: TOKEN_COLORS.LTC },
    { symbol: 'BCH', name: 'Bitcoin Cash', icon: '฿', chain: 'Bitcoin Cash', balance: '10', usdValue: '2500.00', color: TOKEN_COLORS.BCH },
    { symbol: 'ATOM', name: 'Cosmos', icon: '⚛', chain: 'Cosmos', balance: '200', usdValue: '1800.00', color: TOKEN_COLORS.ATOM },
];

// Wallet options
export const WALLETS: WalletInfo[] = [
    { type: 'metamask', name: 'MetaMask', icon: '🦊', badge: 'Popular' },
    { type: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
    { type: 'coinbase', name: 'Coinbase Wallet', icon: '💰' },
    { type: 'phantom', name: 'Phantom', icon: '👻', badge: 'Solana' },
    { type: 'near', name: 'NEAR Wallet', icon: '◈' },
];

// Generate random hex string
function randomHex(length: number): string {
    return Array.from({ length }, () =>
        Math.floor(Math.random() * 16).toString(16)
    ).join('');
}

// Generate random transaction hash
export function generateTxHash(): string {
    return '0x' + randomHex(64);
}

// Generate random amount
function randomAmount(min: number, max: number, decimals = 4): string {
    return (Math.random() * (max - min) + min).toFixed(decimals);
}

// Generate random timestamp (last 7 days)
function randomTimestamp(): number {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    return Math.floor(Math.random() * (now - sevenDaysAgo) + sevenDaysAgo);
}

// Get random item from array
function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Token pairs for realistic swaps
const TOKEN_PAIRS = [
    ['BTC', 'ETH'], ['ETH', 'USDC'], ['SOL', 'USDC'], ['BTC', 'USDT'],
    ['ETH', 'BTC'], ['USDC', 'ETH'], ['SOL', 'ETH'], ['MATIC', 'ETH'],
    ['AVAX', 'USDC'], ['LINK', 'ETH'], ['UNI', 'USDC'], ['DOT', 'ETH'],
    ['ADA', 'USDT'], ['BNB', 'ETH'], ['DOGE', 'BTC'], ['XRP', 'USDC'],
];

// Generate mock transactions
export function generateMockTransactions(count: number): Transaction[] {
    const statuses: ('completed' | 'pending' | 'failed')[] = ['completed', 'pending', 'failed'];
    const statusWeights = [0.7, 0.2, 0.1]; // 70% completed, 20% pending, 10% failed

    return Array.from({ length: count }, () => {
        const [fromSymbol, toSymbol] = randomItem(TOKEN_PAIRS);
        const fromToken = TOKENS.find(t => t.symbol === fromSymbol) || TOKENS[0];
        const toToken = TOKENS.find(t => t.symbol === toSymbol) || TOKENS[1];

        // Determine status based on weights
        const rand = Math.random();
        let status: 'completed' | 'pending' | 'failed' = 'completed';
        if (rand > statusWeights[0] + statusWeights[1]) status = 'failed';
        else if (rand > statusWeights[0]) status = 'pending';

        const fromAmount = fromSymbol.includes('USD') ? randomAmount(100, 5000, 2) : randomAmount(0.1, 10);
        const rate = (parseFloat(toToken.usdValue) / parseFloat(fromToken.usdValue) * parseFloat(toToken.balance) / parseFloat(fromToken.balance)).toFixed(4);
        const toAmount = (parseFloat(fromAmount) * parseFloat(rate)).toFixed(4);

        return {
            hash: generateTxHash(),
            from: { token: fromToken, amount: fromAmount, chain: fromToken.chain },
            to: { token: toToken, amount: toAmount, chain: toToken.chain },
            status,
            timestamp: randomTimestamp(),
            solver: `Solver #${Math.floor(Math.random() * 100)}`,
            depositAddress: `${fromToken.chain.substring(0, 3).toLowerCase()}1q${randomHex(8)}...${randomHex(6)}`,
            fee: `$${randomAmount(0.1, 5, 2)}`,
            executionTime: `${randomAmount(1.5, 4, 1)}s`,
            rate: `1 ${fromSymbol} = ${rate} ${toSymbol}`,
        };
    });
}

// Pre-generated mock transactions
export const MOCK_TRANSACTIONS: Transaction[] = generateMockTransactions(75);

// Mock exchange rates (simplified)
export const MOCK_RATES: Record<string, Record<string, number>> = {
    BTC: { ETH: 25, USDC: 42500, SOL: 1400 },
    ETH: { BTC: 0.04, USDC: 2000, SOL: 56 },
    SOL: { BTC: 0.00071, ETH: 0.018, USDC: 35 },
    USDC: { BTC: 0.0000235, ETH: 0.0005, SOL: 0.0286 },
};

// Get exchange rate
export function getExchangeRate(from: string, to: string): number {
    if (from === to) return 1;
    if (MOCK_RATES[from]?.[to]) return MOCK_RATES[from][to];
    if (MOCK_RATES[to]?.[from]) return 1 / MOCK_RATES[to][from];
    // Fallback: calculate through USD values
    const fromToken = TOKENS.find(t => t.symbol === from);
    const toToken = TOKENS.find(t => t.symbol === to);
    if (fromToken && toToken) {
        return parseFloat(fromToken.usdValue) / parseFloat(toToken.usdValue);
    }
    return 1;
}

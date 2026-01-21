// Token type
export interface Token {
    symbol: string;
    name: string;
    icon: string;
    chain: string;
    balance: string;
    usdValue: string;
    color: string;
}

// Transaction types
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface TokenAmount {
    token: Token;
    amount: string;
    chain: string;
}

export interface Transaction {
    hash: string;
    from: TokenAmount;
    to: TokenAmount;
    status: TransactionStatus;
    timestamp: number;
    solver: string;
    depositAddress: string;
    fee: string;
    executionTime: string;
    rate: string;
}

// Wallet types
export type WalletType = 'metamask' | 'walletconnect' | 'coinbase' | 'phantom' | 'near';

export interface WalletInfo {
    type: WalletType;
    name: string;
    icon: string;
    badge?: string;
}

// Swap settings
export type SwapMode = 'exact_input' | 'exact_output';

export interface SwapSettings {
    slippage: number;
    deadline: number;
    swapMode: SwapMode;
}

// Button states
export type SwapButtonState =
    | 'connect_wallet'
    | 'select_token'
    | 'enter_amount'
    | 'insufficient_balance'
    | 'approve_token'
    | 'swap'
    | 'swapping';

// Modal types
export type ModalType =
    | 'wallet'
    | 'token_from'
    | 'token_to'
    | 'settings'
    | 'confirm_swap'
    | 'swap_progress'
    | 'transaction_details'
    | null;

// Chain type
export interface Chain {
    name: string;
    icon: string;
    color: string;
}

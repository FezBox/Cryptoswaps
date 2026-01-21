import { create } from 'zustand';
import type { Token, Transaction, SwapMode, ModalType, WalletType, SwapButtonState } from '../types';
import { TOKENS, generateTxHash, getExchangeRate, MOCK_TRANSACTIONS } from '../data/mockData';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
}

interface AppState {
    // Wallet State
    walletConnected: boolean;
    walletAddress: string | null;
    walletType: WalletType | null;
    isConnecting: boolean;

    // Token Selection
    fromToken: Token | null;
    toToken: Token | null;
    fromAmount: string;
    toAmount: string;

    // Swap Settings
    slippage: number;
    deadline: number;
    swapMode: SwapMode;

    // Approval State
    approvedTokens: Set<string>;

    // UI State
    activeModal: ModalType;
    isSwapping: boolean;
    swapStep: number;
    selectedTransaction: Transaction | null;

    // Transactions
    transactions: Transaction[];

    // Toasts
    toasts: Toast[];

    // Computed
    getButtonState: () => SwapButtonState;
    getQuote: () => { rate: string; toAmount: string; minReceived: string; priceImpact: string } | null;

    // Actions
    connectWallet: (type: WalletType) => Promise<void>;
    disconnectWallet: () => void;
    setFromToken: (token: Token) => void;
    setToToken: (token: Token) => void;
    setFromAmount: (amount: string) => void;
    flipTokens: () => void;
    setMaxAmount: () => void;
    setSlippage: (slippage: number) => void;
    setDeadline: (deadline: number) => void;
    setSwapMode: (mode: SwapMode) => void;
    resetSettings: () => void;
    approveToken: () => Promise<void>;
    executeSwap: () => Promise<void>;
    openModal: (modal: ModalType) => void;
    closeModal: () => void;
    setSelectedTransaction: (tx: Transaction | null) => void;
    addToast: (type: Toast['type'], message: string) => void;
    removeToast: (id: string) => void;
    copyToClipboard: (text: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
    // Initial State
    walletConnected: false,
    walletAddress: null,
    walletType: null,
    isConnecting: false,

    fromToken: null,
    toToken: null,
    fromAmount: '',
    toAmount: '',

    slippage: 0.5,
    deadline: 20,
    swapMode: 'exact_input',

    approvedTokens: new Set(),

    activeModal: null,
    isSwapping: false,
    swapStep: 0,
    selectedTransaction: null,

    transactions: [...MOCK_TRANSACTIONS],

    toasts: [],

    // Computed: Get button state
    getButtonState: () => {
        const state = get();
        if (!state.walletConnected) return 'connect_wallet';
        if (!state.fromToken) return 'select_token';
        if (!state.toToken) return 'select_token';
        if (!state.fromAmount || parseFloat(state.fromAmount) <= 0) return 'enter_amount';
        if (parseFloat(state.fromAmount) > parseFloat(state.fromToken.balance)) return 'insufficient_balance';
        if (!state.approvedTokens.has(state.fromToken.symbol)) return 'approve_token';
        if (state.isSwapping) return 'swapping';
        return 'swap';
    },

    // Computed: Get quote
    getQuote: () => {
        const state = get();
        if (!state.fromToken || !state.toToken || !state.fromAmount || parseFloat(state.fromAmount) <= 0) {
            return null;
        }

        const rate = getExchangeRate(state.fromToken.symbol, state.toToken.symbol);
        const toAmount = (parseFloat(state.fromAmount) * rate).toFixed(6);
        const minReceived = (parseFloat(toAmount) * (1 - state.slippage / 100)).toFixed(6);
        const priceImpact = (Math.random() * 0.8 + 0.1).toFixed(2); // Mock: 0.1-0.9%

        return {
            rate: `1 ${state.fromToken.symbol} = ${rate.toFixed(4)} ${state.toToken.symbol}`,
            toAmount,
            minReceived,
            priceImpact,
        };
    },

    // Actions
    connectWallet: async (type) => {
        set({ isConnecting: true });
        await new Promise(resolve => setTimeout(resolve, 1500));
        set({
            walletConnected: true,
            walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            walletType: type,
            isConnecting: false,
            activeModal: null,
        });
        get().addToast('success', 'Wallet connected successfully!');
    },

    disconnectWallet: () => {
        set({
            walletConnected: false,
            walletAddress: null,
            walletType: null,
            approvedTokens: new Set(),
        });
        get().addToast('info', 'Wallet disconnected');
    },

    setFromToken: (token) => {
        const state = get();
        // If selecting same as toToken, swap them
        if (state.toToken?.symbol === token.symbol) {
            set({ fromToken: token, toToken: state.fromToken });
        } else {
            set({ fromToken: token });
        }
        set({ activeModal: null });
    },

    setToToken: (token) => {
        const state = get();
        // If selecting same as fromToken, swap them
        if (state.fromToken?.symbol === token.symbol) {
            set({ toToken: token, fromToken: state.toToken });
        } else {
            set({ toToken: token });
        }
        set({ activeModal: null });
    },

    setFromAmount: (amount) => {
        // Only allow valid number input
        if (amount === '' || /^\d*\.?\d*$/.test(amount)) {
            set({ fromAmount: amount });
        }
    },

    flipTokens: () => {
        const state = get();
        set({
            fromToken: state.toToken,
            toToken: state.fromToken,
            fromAmount: state.toAmount,
        });
    },

    setMaxAmount: () => {
        const state = get();
        if (state.fromToken) {
            set({ fromAmount: state.fromToken.balance });
        }
    },

    setSlippage: (slippage) => set({ slippage }),
    setDeadline: (deadline) => set({ deadline }),
    setSwapMode: (mode) => set({ swapMode: mode }),

    resetSettings: () => set({ slippage: 0.5, deadline: 20, swapMode: 'exact_input' }),

    approveToken: async () => {
        const state = get();
        if (!state.fromToken) return;

        set({ isSwapping: true });
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newApproved = new Set(state.approvedTokens);
        newApproved.add(state.fromToken.symbol);

        set({ approvedTokens: newApproved, isSwapping: false });
        get().addToast('success', `${state.fromToken.symbol} approved for trading!`);
    },

    executeSwap: async () => {
        const state = get();
        if (!state.fromToken || !state.toToken || !state.fromAmount) return;

        const quote = state.getQuote();
        if (!quote) return;

        set({ isSwapping: true, swapStep: 1, activeModal: 'swap_progress' });

        // Step 1: Depositing (2s)
        await new Promise(resolve => setTimeout(resolve, 2000));
        set({ swapStep: 2 });

        // Step 2: Processing (3s)
        await new Promise(resolve => setTimeout(resolve, 3000));
        set({ swapStep: 3 });

        // Step 3: Confirming (2s)
        await new Promise(resolve => setTimeout(resolve, 2000));
        set({ swapStep: 4 });

        // Add transaction to history
        const newTx: Transaction = {
            hash: generateTxHash(),
            from: { token: state.fromToken, amount: state.fromAmount, chain: state.fromToken.chain },
            to: { token: state.toToken, amount: quote.toAmount, chain: state.toToken.chain },
            status: 'completed',
            timestamp: Date.now(),
            solver: `Solver #${Math.floor(Math.random() * 100)}`,
            depositAddress: `${state.fromToken.chain.substring(0, 3).toLowerCase()}1q${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 8)}`,
            fee: `$${(Math.random() * 2 + 0.5).toFixed(2)}`,
            executionTime: '2.3s',
            rate: quote.rate,
        };

        set(s => ({
            transactions: [newTx, ...s.transactions],
            isSwapping: false,
        }));

        get().addToast('success', 'Swap completed!');
    },

    openModal: (modal) => set({ activeModal: modal }),
    closeModal: () => set({ activeModal: null, swapStep: 0 }),

    setSelectedTransaction: (tx) => set({ selectedTransaction: tx, activeModal: tx ? 'transaction_details' : null }),

    addToast: (type, message) => {
        const id = Math.random().toString(36).slice(2);
        set(s => ({ toasts: [...s.toasts, { id, type, message }] }));
        setTimeout(() => get().removeToast(id), 4000);
    },

    removeToast: (id) => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),

    copyToClipboard: (text) => {
        navigator.clipboard.writeText(text);
        get().addToast('success', 'Copied to clipboard!');
    },
}));

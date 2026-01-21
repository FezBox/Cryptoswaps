import { useState } from 'react';
import { Book, Zap, Wallet, Link2, Settings, Code, Users } from 'lucide-react';

const SIDEBAR_SECTIONS = [
    {
        title: 'Getting Started',
        items: [
            { id: 'introduction', label: 'Introduction', icon: Book },
            { id: 'quick-start', label: 'Quick Start', icon: Zap },
            { id: 'how-it-works', label: 'How It Works', icon: Settings },
        ],
    },
    {
        title: 'Features',
        items: [
            { id: 'swapping', label: 'Swapping Tokens', icon: Link2 },
            { id: 'wallets', label: 'Supported Wallets', icon: Wallet },
            { id: 'chains', label: 'Supported Chains', icon: Link2 },
        ],
    },
    {
        title: 'Advanced',
        items: [
            { id: 'slippage', label: 'Slippage Settings', icon: Settings },
            { id: 'intents', label: 'How Intents Work', icon: Code },
            { id: 'solvers', label: 'About Solvers', icon: Users },
        ],
    },
];

const CONTENT: Record<string, { title: string; content: string }> = {
    introduction: {
        title: 'Introduction',
        content: `Welcome to CryptoSwaps documentation! CryptoSwaps is a cross-chain token swap platform that enables seamless trading across Bitcoin, Ethereum, Solana, and other major blockchain networks.

Our platform uses intent-based execution, which means you simply express what you want to swap, and our network of professional solvers competes to fulfill your order with the best possible rate.

Key features:
• Cross-chain swaps in 2-3 seconds
• Best prices through solver competition
• Non-custodial and trustless
• Support for 100+ tokens across 6+ chains`,
    },
    'quick-start': {
        title: 'Quick Start',
        content: `Getting started with CryptoSwaps is easy:

1. Connect Your Wallet
   Click the "Connect Wallet" button in the header and select your preferred wallet (MetaMask, WalletConnect, Coinbase, Phantom, or NEAR Wallet).

2. Select Tokens
   Choose the token you want to swap FROM and the token you want to receive TO. You can select tokens from different chains.

3. Enter Amount
   Type the amount you want to swap. The estimated output will be calculated automatically based on current market rates.

4. Review & Confirm
   Check the quote details including exchange rate, fees, and minimum received. Click "Swap" to proceed.

5. Complete Transaction
   Confirm the transaction in your wallet. Your swap will be executed in 2-3 seconds and the tokens will be delivered to your wallet.`,
    },
    'how-it-works': {
        title: 'How It Works',
        content: `CryptoSwaps uses an intent-based architecture powered by Sodax infrastructure:

Intent Expression
When you create a swap, you're expressing an "intent" - a commitment to trade a specific amount of one token for another. This intent is broadcast to our solver network.

Solver Competition
Professional market makers (solvers) compete to fulfill your intent. They analyze cross-chain liquidity and submit bids with the best possible rate they can offer.

Atomic Execution
The winning solver executes your swap atomically. This means either the entire swap completes successfully, or nothing happens - your funds are never at risk.

Settlement
Tokens are settled directly to your wallet on the destination chain. The entire process takes just 2-3 seconds, regardless of which chains are involved.`,
    },
    swapping: {
        title: 'Swapping Tokens',
        content: `The swap interface is designed to be intuitive and powerful:

Token Selection
Click on either token selector to open the token modal. You can search by name or symbol, or choose from popular tokens.

Amount Input
Enter the amount you want to swap in the "From" field. The "To" amount is calculated automatically. Click MAX to swap your entire balance.

Flip Tokens
Click the swap arrow button to quickly reverse the direction of your swap.

Quote Details
Expand the quote panel to see detailed information:
• Exchange rate
• Estimated execution time
• Network fees
• Minimum received (accounting for slippage)
• Routing information`,
    },
    wallets: {
        title: 'Supported Wallets',
        content: `CryptoSwaps supports a wide range of wallets:

MetaMask
The most popular Ethereum wallet. Works with Ethereum, Polygon, Arbitrum, and other EVM chains.

WalletConnect
Connect any WalletConnect-compatible mobile or desktop wallet.

Coinbase Wallet
The official Coinbase self-custody wallet.

Phantom
The leading Solana wallet. Required for Solana chain swaps.

NEAR Wallet
The official NEAR Protocol wallet for NEAR chain swaps.`,
    },
    chains: {
        title: 'Supported Chains',
        content: `CryptoSwaps currently supports the following blockchain networks:

• Bitcoin - The original cryptocurrency
• Ethereum - The leading smart contract platform
• Solana - High-performance blockchain
• Polygon - Ethereum scaling solution
• Arbitrum - Ethereum Layer 2
• NEAR - Sharded blockchain platform

More chains are being added regularly. Check our announcements for updates.`,
    },
    slippage: {
        title: 'Slippage Settings',
        content: `Slippage tolerance determines how much price movement you're willing to accept:

What is Slippage?
Slippage is the difference between the expected price and the actual execution price. This can occur due to market movements between when you submit and when your swap executes.

Setting Slippage
• 0.5% - Recommended for most swaps
• 1% - For volatile markets
• 2% - For highly volatile or illiquid tokens
• Custom - Set any value up to 50%

Warning
Setting slippage too high may result in unfavorable rates. Setting it too low may cause swaps to fail if the market moves.`,
    },
    intents: {
        title: 'How Intents Work',
        content: `Intent-based trading is a paradigm shift in how swaps are executed:

Traditional Swaps
In traditional DEXs, you interact directly with liquidity pools. This requires you to understand the routing, pay gas fees on multiple chains, and handle bridging manually.

Intent-Based Swaps
With intents, you simply express what you want: "I want to swap 1 BTC for ETH." The infrastructure handles everything else.

Benefits
• No bridging complexity
• Best execution through competition
• Cross-chain atomic settlement
• Simplified user experience`,
    },
    solvers: {
        title: 'About Solvers',
        content: `Solvers are the backbone of the CryptoSwaps network:

What are Solvers?
Solvers are professional market makers who compete to fulfill swap intents. They provide liquidity and execution services.

How They Work
1. Solvers monitor incoming intents
2. They calculate the best rate they can offer
3. They submit bids to the solver network
4. The best bid wins and executes the swap

Benefits for Users
• Competition ensures best prices
• Professional execution
• Deep liquidity access
• Fast settlement`,
    },
};

export default function Docs() {
    const [activeSection, setActiveSection] = useState('introduction');
    const currentContent = CONTENT[activeSection];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <nav className="sticky top-24 space-y-6">
                        {SIDEBAR_SECTIONS.map((section) => (
                            <div key={section.title}>
                                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                                    {section.title}
                                </h3>
                                <ul className="space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => setActiveSection(item.id)}
                                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === item.id
                                                        ? 'bg-indigo-500/20 text-indigo-400'
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                    }`}
                                            >
                                                <item.icon size={16} />
                                                {item.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* Content */}
                <main className="flex-1 min-w-0">
                    <article className="prose prose-invert max-w-none">
                        <h1 className="text-3xl font-bold text-white mb-6">{currentContent.title}</h1>
                        <div className="text-slate-300 whitespace-pre-line leading-relaxed">
                            {currentContent.content}
                        </div>
                    </article>
                </main>
            </div>
        </div>
    );
}

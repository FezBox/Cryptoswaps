# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-02-06

### Added

#### Core Swap Functionality
- Cross-chain token swap interface with support for 15+ blockchain networks
- Real-time quote fetching with debounced input for optimal performance
- Slippage protection with configurable tolerance (0.5%, 1%, 3%, custom)
- Swap confirmation modal with full transaction details
- Swap progress modal with step-by-step status tracking
- Automatic swap recovery for pending transactions on page reload

#### Supported Chains
- Ethereum (Chain ID: 1)
- Arbitrum (Chain ID: 42161)
- Base (Chain ID: 8453)
- BSC (Chain ID: 56)
- Polygon (Chain ID: 137)
- Avalanche (Chain ID: 43114)
- Optimism (Chain ID: 10)
- Sonic (Chain ID: 146)

#### UI Components
- `SwapCard` - Main swap interface with token inputs and swap execution
- `TokenInput` - Token amount input with chain and token selectors
- `ChainSelector` - Dropdown for selecting source/destination chains
- `TokenSelector` - Modal for browsing and searching tokens
- `ChainIcon` / `TokenIcon` - Dynamic icon components with fallbacks
- `SlippageModal` - Settings modal for configuring slippage tolerance
- `SwapConfirmationModal` - Review modal before swap execution
- `SwapProgressModal` - Real-time swap progress tracking
- `SettingsButton` - Gear icon button for accessing settings

#### Layout Components
- `Header` - App header with navigation and wallet connection
- `Footer` - App footer with links
- `ThemeToggle` - Dark/light mode toggle button
- `ThemeProvider` - Theme context provider with system preference detection

#### Reusable UI Components
- `Button` - Versatile button component with variants and loading state
- `Card` - Card container component
- `Input` - Styled input component
- `Modal` - Reusable modal dialog with animations
- `Skeleton` - Loading skeleton component
- `Toast` / `ToastContainer` - Toast notification system

#### Transaction Management
- `TransactionCard` - Individual transaction display
- `TransactionList` - List of all transactions with filtering
- `TransactionStatus` - Status indicator component
- Transaction history page at `/transactions`
- Block explorer links for all supported chains

#### Wallet Integration
- RainbowKit wallet connection with ConnectButton
- Support for MetaMask, WalletConnect, Coinbase Wallet, and more
- Automatic chain switching when required
- Real-time balance display for connected wallet

#### State Management (Zustand Stores)
- `useSwapStore` - Swap state, quotes, and execution
- `useWalletStore` - Wallet connection status tracking
- `useToastStore` - Toast notification management
- `useTransactionsStore` - Transaction history persistence
- `useSwapRecoveryStore` - Pending swap recovery

#### SODAX SDK Integration
- SDK client initialization and configuration
- Chain ID mapping utilities (SODAX to EVM, SODAX to SDK)
- Quote fetching with error handling
- Swap execution via spoke provider
- Custom error types for swap operations

#### Hooks
- `useDebounce` - Debounce hook for input values
- `useTokenBalance` - Real-time token balance fetching

#### Utilities
- `cn()` - Tailwind class name merger
- Block explorer URL generators for all supported chains
- Chain validation and conversion utilities

### Technical Stack
- Next.js 16.1.6 with App Router
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- Framer Motion for animations
- Zustand for state management
- wagmi + viem for blockchain interactions
- RainbowKit for wallet connection
- SODAX SDK for cross-chain swaps

---

## Release Notes

### v0.1.0 - Initial Release

This is the first public release of CryptoSwaps, a modern cross-chain token swap interface.

#### Highlights

**Seamless Cross-Chain Swaps**
Swap tokens across 8 major blockchain networks with a single, intuitive interface. The SODAX SDK handles the complexity of cross-chain routing while providing competitive rates.

**Modern User Experience**
- Clean, responsive design that works on desktop and mobile
- Smooth animations powered by Framer Motion
- Dark and light themes with automatic system preference detection
- Real-time feedback with toast notifications

**Robust State Management**
- Zustand-powered state management for predictable behavior
- Transaction history persisted to local storage
- Automatic recovery of pending swaps on page reload

**Developer-Friendly**
- TypeScript throughout for type safety
- Modular component architecture
- Clear separation of concerns
- Well-documented codebase

#### Known Limitations

- Non-EVM chains (Solana, Sui, etc.) not yet supported
- Token approval flow pending implementation
- Transaction status polling needs improvement

#### Coming Soon

- Additional chain support
- Token approval management
- Advanced routing options
- Portfolio tracking
- Price charts and analytics

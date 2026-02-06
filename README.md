# CryptoSwaps

A modern, cross-chain token swap interface built with Next.js 16, React 19, and the SODAX SDK. Swap tokens across 15+ blockchain networks with a beautiful, intuitive UI.

![CryptoSwaps](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)

## Features

### Core Functionality
- **Cross-Chain Swaps** - Swap tokens across 15+ blockchain networks including Ethereum, Arbitrum, Base, BSC, Polygon, Avalanche, Optimism, and Sonic
- **Real-Time Quotes** - Live price quotes with rate, price impact, and gas estimates
- **Slippage Protection** - Configurable slippage tolerance (0.5%, 1%, 3%, or custom)
- **Transaction Tracking** - Full transaction history with status updates and block explorer links

### User Experience
- **Modern UI** - Clean, responsive design with smooth Framer Motion animations
- **Dark/Light Theme** - Automatic theme detection with manual toggle
- **Wallet Integration** - Seamless connection via RainbowKit supporting MetaMask, WalletConnect, Coinbase Wallet, and more
- **Mobile Responsive** - Fully optimized for mobile and desktop

### Technical Features
- **Multi-Chain Support** - Native support for EVM chains with automatic chain switching
- **Token Search** - Search tokens by name, symbol, or contract address
- **Balance Display** - Real-time token balance updates
- **Swap Recovery** - Automatic recovery of pending swaps on page reload
- **Toast Notifications** - Non-intrusive feedback for all actions

## Supported Chains

| Chain | Chain ID | Status |
|-------|----------|--------|
| Ethereum | 1 | ✅ |
| Arbitrum | 42161 | ✅ |
| Base | 8453 | ✅ |
| BSC | 56 | ✅ |
| Polygon | 137 | ✅ |
| Avalanche | 43114 | ✅ |
| Optimism | 10 | ✅ |
| Sonic | 146 | ✅ |

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Wallet Connection**: [RainbowKit](https://www.rainbowkit.com/) + [wagmi](https://wagmi.sh/)
- **Blockchain**: [viem](https://viem.sh/) + [SODAX SDK](https://sodax.xyz/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone https://github.com/FezBox/Cryptoswaps.git
cd Cryptoswaps
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── transactions/      # Transaction history page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (swap interface)
│   └── providers.tsx      # Client-side providers
├── components/
│   ├── layout/            # Header, Footer components
│   ├── swap/              # Swap-related components
│   │   ├── SwapCard.tsx   # Main swap interface
│   │   ├── TokenInput.tsx # Token input with chain/token selectors
│   │   ├── ChainSelector.tsx
│   │   ├── TokenSelector.tsx
│   │   ├── SlippageModal.tsx
│   │   ├── SwapConfirmationModal.tsx
│   │   └── SwapProgressModal.tsx
│   ├── transactions/      # Transaction history components
│   ├── ui/                # Reusable UI components
│   └── wallet/            # Wallet connection components
├── hooks/                 # Custom React hooks
├── lib/
│   ├── sodax/            # SODAX SDK integration
│   │   ├── chains.ts     # Chain ID mappings
│   │   ├── client.ts     # SDK client initialization
│   │   ├── quote.ts      # Quote fetching logic
│   │   └── swap.ts       # Swap execution logic
│   ├── wagmi/            # wagmi configuration
│   └── utils.ts          # Utility functions
├── store/                 # Zustand state stores
│   ├── useSwapStore.ts   # Swap state management
│   ├── useWalletStore.ts # Wallet state management
│   ├── useToastStore.ts  # Toast notifications
│   └── useTransactionsStore.ts
└── types/                 # TypeScript type definitions
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional: WalletConnect Project ID (for production)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### Slippage Settings

Default slippage tolerance is 1%. Users can configure:
- 0.5% (Low)
- 1% (Medium) - Default
- 3% (High)
- Custom value

## Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Code Style

- TypeScript strict mode enabled
- ESLint with Next.js configuration
- Tailwind CSS for styling
- Consistent component structure

## Architecture

### State Management

The app uses Zustand for state management with the following stores:

- **useSwapStore** - Manages swap state (tokens, amounts, quotes, execution)
- **useWalletStore** - Tracks wallet connection status
- **useToastStore** - Handles toast notifications
- **useTransactionsStore** - Persists transaction history
- **useSwapRecoveryStore** - Handles swap recovery on page reload

### SDK Integration

The SODAX SDK is integrated for:
- Fetching token lists and chain data
- Getting real-time swap quotes
- Executing cross-chain swaps
- Transaction status tracking

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [SODAX](https://sodax.xyz/) for the cross-chain swap SDK
- [RainbowKit](https://www.rainbowkit.com/) for wallet connection
- [Next.js](https://nextjs.org/) team for the amazing framework

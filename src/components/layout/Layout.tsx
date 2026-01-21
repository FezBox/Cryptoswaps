import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Toast';

// Import all modals
import { WalletModal } from '../modals/WalletModal';
import { TokenModal } from '../modals/TokenModal';
import { SettingsModal } from '../modals/SettingsModal';
import { ConfirmSwapModal } from '../modals/ConfirmSwapModal';
import { SwapProgressModal } from '../modals/SwapProgressModal';
import { TransactionDetailModal } from '../modals/TransactionDetailModal';

export function Layout() {
    return (
        <div className="min-h-screen flex flex-col bg-bg-primary">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />

            {/* Global modals */}
            <WalletModal />
            <TokenModal />
            <SettingsModal />
            <ConfirmSwapModal />
            <SwapProgressModal />
            <TransactionDetailModal />

            {/* Toast notifications */}
            <ToastContainer />
        </div>
    );
}

import { useStore } from '../../store/appStore';
import { Modal } from '../ui/Modal';
import { WALLETS } from '../../data/mockData';
import { Loader2 } from 'lucide-react';

export function WalletModal() {
    const { activeModal, closeModal, connectWallet, isConnecting } = useStore();

    const isOpen = activeModal === 'wallet';

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="Connect Wallet" size="sm">
            <div className="p-4 space-y-3">
                {WALLETS.map((wallet) => (
                    <button
                        key={wallet.type}
                        onClick={() => connectWallet(wallet.type)}
                        disabled={isConnecting}
                        className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-indigo-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{wallet.icon}</span>
                            <span className="font-medium text-white group-hover:text-indigo-300 transition-colors">
                                {wallet.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {wallet.badge && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">
                                    {wallet.badge}
                                </span>
                            )}
                            {isConnecting && (
                                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                            )}
                        </div>
                    </button>
                ))}
            </div>
            <div className="px-4 pb-4">
                <p className="text-xs text-slate-500 text-center">
                    By connecting a wallet, you agree to our Terms of Service
                </p>
            </div>
        </Modal>
    );
}

import { useState, useMemo } from 'react';
import { useStore } from '../../store/appStore';
import { Modal } from '../ui/Modal';
import { ChainBadge } from '../ui/Badge';
import { TOKENS } from '../../data/mockData';
import { Search } from 'lucide-react';
import { formatUSD } from '../../utils/formatters';

const POPULAR_TOKENS = ['BTC', 'ETH', 'SOL', 'USDC', 'USDT'];

export function TokenModal() {
    const { activeModal, closeModal, setFromToken, setToToken, walletConnected } = useStore();
    const [searchQuery, setSearchQuery] = useState('');

    const isFromToken = activeModal === 'token_from';
    const isToToken = activeModal === 'token_to';
    const isOpen = isFromToken || isToToken;

    const filteredTokens = useMemo(() => {
        if (!searchQuery) return TOKENS;
        const query = searchQuery.toLowerCase();
        return TOKENS.filter(
            (token) =>
                token.symbol.toLowerCase().includes(query) ||
                token.name.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleSelectToken = (token: typeof TOKENS[0]) => {
        if (isFromToken) {
            setFromToken(token);
        } else {
            setToToken(token);
        }
        setSearchQuery('');
    };

    const handleClose = () => {
        setSearchQuery('');
        closeModal();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} title="Select a token" size="md">
            {/* Search */}
            <div className="p-4 border-b border-slate-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search name or paste address"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Popular tokens */}
            <div className="px-4 pt-4 pb-2">
                <p className="text-xs text-slate-500 mb-2">Popular</p>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_TOKENS.map((symbol) => {
                        const token = TOKENS.find((t) => t.symbol === symbol);
                        if (!token) return null;
                        return (
                            <button
                                key={symbol}
                                onClick={() => handleSelectToken(token)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-700/50 hover:bg-slate-700 border border-slate-600 hover:border-indigo-500 transition-all"
                            >
                                <span
                                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                                    style={{ backgroundColor: token.color + '30', color: token.color }}
                                >
                                    {token.icon}
                                </span>
                                <span className="text-sm font-medium text-white">{symbol}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Token list */}
            <div className="px-4 pb-4 max-h-80 overflow-y-auto">
                {filteredTokens.length === 0 ? (
                    <p className="text-center text-slate-500 py-8">No tokens found</p>
                ) : (
                    <div className="space-y-1">
                        {filteredTokens.map((token) => (
                            <button
                                key={token.symbol}
                                onClick={() => handleSelectToken(token)}
                                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-700/50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                                        style={{ backgroundColor: token.color + '30', color: token.color }}
                                    >
                                        {token.icon}
                                    </span>
                                    <div className="text-left">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white">{token.symbol}</span>
                                            <ChainBadge chain={token.chain} />
                                        </div>
                                        <span className="text-sm text-slate-400">{token.name}</span>
                                    </div>
                                </div>
                                {walletConnected && (
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-white">{token.balance}</p>
                                        <p className="text-xs text-slate-400">{formatUSD(token.usdValue)}</p>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </Modal>
    );
}

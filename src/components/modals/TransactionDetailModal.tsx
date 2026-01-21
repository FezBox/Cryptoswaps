import { useStore } from '../../store/appStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ChainBadge, StatusBadge } from '../ui/Badge';
import { Copy, ExternalLink, Share2, ArrowRight } from 'lucide-react';
import { formatFullDate } from '../../utils/formatters';

export function TransactionDetailModal() {
    const { activeModal, closeModal, selectedTransaction, copyToClipboard } = useStore();

    const isOpen = activeModal === 'transaction_details';
    const tx = selectedTransaction;

    if (!tx) return null;

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="Transaction Details" size="md">
            <div className="p-4 space-y-6">
                {/* Status header */}
                <div className="text-center">
                    <StatusBadge status={tx.status} size="md" />
                    <p className="text-slate-400 text-sm mt-2">{formatFullDate(tx.timestamp)}</p>
                </div>

                {/* Swap flow diagram */}
                <div className="flex items-center justify-center gap-4 p-6 rounded-xl bg-slate-900/50 border border-slate-700">
                    {/* From */}
                    <div className="text-center">
                        <span
                            className="w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center text-xl font-bold"
                            style={{ backgroundColor: tx.from.token.color + '30', color: tx.from.token.color }}
                        >
                            {tx.from.token.icon}
                        </span>
                        <p className="font-semibold text-white">{tx.from.amount}</p>
                        <p className="text-sm text-slate-400">{tx.from.token.symbol}</p>
                        <ChainBadge chain={tx.from.chain} />
                    </div>

                    {/* Arrow with solver */}
                    <div className="flex flex-col items-center gap-2">
                        <ArrowRight className="text-slate-500" size={24} />
                        <span className="px-2 py-1 rounded-full text-xs bg-indigo-500/20 text-indigo-400">
                            {tx.solver}
                        </span>
                        <ArrowRight className="text-slate-500" size={24} />
                    </div>

                    {/* To */}
                    <div className="text-center">
                        <span
                            className="w-14 h-14 mx-auto mb-2 rounded-full flex items-center justify-center text-xl font-bold"
                            style={{ backgroundColor: tx.to.token.color + '30', color: tx.to.token.color }}
                        >
                            {tx.to.token.icon}
                        </span>
                        <p className="font-semibold text-white">{tx.to.amount}</p>
                        <p className="text-sm text-slate-400">{tx.to.token.symbol}</p>
                        <ChainBadge chain={tx.to.chain} />
                    </div>
                </div>

                {/* Details list */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Transaction Hash</span>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-mono text-xs truncate max-w-[180px]">
                                {tx.hash}
                            </span>
                            <button
                                onClick={() => copyToClipboard(tx.hash)}
                                className="p-1 hover:bg-slate-700 rounded transition-colors"
                            >
                                <Copy size={14} className="text-slate-400" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Deposit Address</span>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-mono text-xs">{tx.depositAddress}</span>
                            <button
                                onClick={() => copyToClipboard(tx.depositAddress)}
                                className="p-1 hover:bg-slate-700 rounded transition-colors"
                            >
                                <Copy size={14} className="text-slate-400" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Exchange Rate</span>
                        <span className="text-white">{tx.rate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Network Fee</span>
                        <span className="text-white">{tx.fee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Execution Time</span>
                        <span className="text-white">{tx.executionTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Solver</span>
                        <span className="text-white">{tx.solver}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Timestamp</span>
                        <span className="text-white">{formatFullDate(tx.timestamp)}</span>
                    </div>
                </div>

                {/* External links */}
                <div className="flex flex-col gap-2">
                    <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        <ExternalLink size={14} />
                        View on {tx.from.chain} Explorer
                    </button>
                    <button className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        <ExternalLink size={14} />
                        View on {tx.to.chain} Explorer
                    </button>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 border-t border-slate-700">
                <Button variant="secondary" onClick={closeModal} className="flex-1">
                    Close
                </Button>
                <Button className="flex-1">
                    <Share2 size={16} />
                    Share
                </Button>
            </div>
        </Modal>
    );
}

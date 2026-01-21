import { useStore } from '../../store/appStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ChainBadge } from '../ui/Badge';
import { ArrowDown, Copy, Info } from 'lucide-react';
import { getDeadlineDate } from '../../utils/formatters';

export function ConfirmSwapModal() {
    const {
        activeModal,
        closeModal,
        fromToken,
        toToken,
        fromAmount,
        slippage,
        deadline,
        getQuote,
        executeSwap,
        copyToClipboard,
    } = useStore();

    const isOpen = activeModal === 'confirm_swap';
    const quote = getQuote();

    if (!fromToken || !toToken || !quote) return null;

    const depositAddress = `${fromToken.chain.substring(0, 3).toLowerCase()}1q...xyz123`;

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="Confirm Swap" size="sm">
            <div className="p-4 space-y-4">
                {/* Swap summary */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 space-y-4">
                    {/* From */}
                    <div>
                        <p className="text-xs text-slate-500 mb-2">From</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                                    style={{ backgroundColor: fromToken.color + '30', color: fromToken.color }}
                                >
                                    {fromToken.icon}
                                </span>
                                <div>
                                    <p className="text-xl font-semibold text-white">{fromAmount} {fromToken.symbol}</p>
                                </div>
                            </div>
                            <ChainBadge chain={fromToken.chain} />
                        </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                        <div className="p-2 rounded-full bg-slate-800">
                            <ArrowDown size={20} className="text-slate-400" />
                        </div>
                    </div>

                    {/* To */}
                    <div>
                        <p className="text-xs text-slate-500 mb-2">To (estimated)</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                                    style={{ backgroundColor: toToken.color + '30', color: toToken.color }}
                                >
                                    {toToken.icon}
                                </span>
                                <div>
                                    <p className="text-xl font-semibold text-white">{quote.toAmount} {toToken.symbol}</p>
                                </div>
                            </div>
                            <ChainBadge chain={toToken.chain} />
                        </div>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Exchange Rate</span>
                        <span className="text-white">{quote.rate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Price Impact</span>
                        <span className={parseFloat(quote.priceImpact) > 1 ? 'text-amber-400' : 'text-green-400'}>
                            {quote.priceImpact}%
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Minimum Received</span>
                        <span className="text-white">{quote.minReceived} {toToken.symbol}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Network Fee</span>
                        <span className="text-white">$0.50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Estimated Time</span>
                        <span className="text-white">2-3 seconds</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-1 text-slate-400">
                            <span>Deposit Address</span>
                            <Info size={14} className="text-slate-500" />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-mono text-xs">{depositAddress}</span>
                            <button
                                onClick={() => copyToClipboard(depositAddress)}
                                className="p-1 hover:bg-slate-700 rounded transition-colors"
                            >
                                <Copy size={14} className="text-slate-400" />
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Deadline</span>
                        <span className="text-white">{getDeadlineDate(deadline)}</span>
                    </div>
                </div>

                {/* Info banner */}
                <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={16} />
                    <p className="text-xs text-blue-400">
                        Output is estimated. You will receive at least {quote.minReceived} {toToken.symbol} or the transaction will revert.
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 border-t border-slate-700">
                <Button variant="secondary" onClick={closeModal} className="flex-1">
                    Cancel
                </Button>
                <Button onClick={executeSwap} className="flex-1">
                    Confirm Swap
                </Button>
            </div>
        </Modal>
    );
}

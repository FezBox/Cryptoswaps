import { useStore } from '../../store/appStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AlertTriangle } from 'lucide-react';

const SLIPPAGE_OPTIONS = [0.5, 1, 2];

export function SettingsModal() {
    const {
        activeModal,
        closeModal,
        slippage,
        deadline,
        swapMode,
        setSlippage,
        setDeadline,
        setSwapMode,
        resetSettings,
    } = useStore();

    const isOpen = activeModal === 'settings';

    return (
        <Modal isOpen={isOpen} onClose={closeModal} title="Swap Settings" size="sm">
            <div className="p-4 space-y-6">
                {/* Slippage Tolerance */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                        Slippage Tolerance
                    </label>
                    <div className="flex gap-2">
                        {SLIPPAGE_OPTIONS.map((value) => (
                            <button
                                key={value}
                                onClick={() => setSlippage(value)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${slippage === value
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                    }`}
                            >
                                {value}%
                            </button>
                        ))}
                        <div className="relative flex-1">
                            <input
                                type="number"
                                value={slippage}
                                onChange={(e) => setSlippage(parseFloat(e.target.value) || 0)}
                                placeholder="Custom"
                                className="w-full py-2 px-3 pr-8 rounded-lg bg-slate-700 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                step="0.1"
                                min="0"
                                max="50"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                                %
                            </span>
                        </div>
                    </div>
                    {slippage > 5 && (
                        <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={16} />
                            <p className="text-sm text-amber-400">
                                High slippage tolerance. Your transaction may be frontrun.
                            </p>
                        </div>
                    )}
                </div>

                {/* Transaction Deadline */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                        Transaction Deadline
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            value={deadline}
                            onChange={(e) => setDeadline(parseInt(e.target.value) || 20)}
                            className="w-24 py-2 px-3 rounded-lg bg-slate-700 text-white text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            min="1"
                            max="60"
                        />
                        <span className="text-slate-400 text-sm">minutes</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Transaction will revert if not completed within this time
                    </p>
                </div>

                {/* Swap Mode */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                        Swap Mode
                    </label>
                    <div className="space-y-2">
                        <button
                            onClick={() => setSwapMode('exact_input')}
                            className={`w-full p-4 rounded-xl border text-left transition-all ${swapMode === 'exact_input'
                                ? 'bg-indigo-500/10 border-indigo-500'
                                : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-4 h-4 rounded-full border-2 ${swapMode === 'exact_input'
                                        ? 'border-indigo-500 bg-indigo-500'
                                        : 'border-slate-500'
                                        }`}
                                >
                                    {swapMode === 'exact_input' && (
                                        <div className="w-full h-full rounded-full bg-white scale-50" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-white">Exact Input</p>
                                    <p className="text-xs text-slate-400">
                                        Specify exact input amount, receive approximate output
                                    </p>
                                </div>
                            </div>
                        </button>
                        <button
                            onClick={() => setSwapMode('exact_output')}
                            className={`w-full p-4 rounded-xl border text-left transition-all ${swapMode === 'exact_output'
                                ? 'bg-indigo-500/10 border-indigo-500'
                                : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-4 h-4 rounded-full border-2 ${swapMode === 'exact_output'
                                        ? 'border-indigo-500 bg-indigo-500'
                                        : 'border-slate-500'
                                        }`}
                                >
                                    {swapMode === 'exact_output' && (
                                        <div className="w-full h-full rounded-full bg-white scale-50" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-white">Exact Output</p>
                                    <p className="text-xs text-slate-400">
                                        Specify exact output amount, send approximate input
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 border-t border-slate-700">
                <Button variant="secondary" onClick={resetSettings} className="flex-1">
                    Reset to Defaults
                </Button>
                <Button onClick={closeModal} className="flex-1">
                    Save
                </Button>
            </div>
        </Modal>
    );
}

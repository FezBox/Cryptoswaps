import { useState, useEffect } from 'react';
import { useStore } from '../../store/appStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CheckCircle, Circle, Loader2, Copy, ExternalLink, PartyPopper } from 'lucide-react';
import { generateTxHash } from '../../data/mockData';

const STEPS = [
    { title: 'Depositing', description: 'Sending tokens...', completedDesc: 'Tokens sent' },
    { title: 'Processing', description: 'Solver executing swap...', completedDesc: 'Swap executed' },
    { title: 'Confirming', description: 'Finalizing on chain...', completedDesc: 'Confirmed' },
    { title: 'Complete', description: 'Waiting...', completedDesc: 'Tokens received!' },
];

export function SwapProgressModal() {
    const { activeModal, closeModal, swapStep, fromToken, toToken, fromAmount, getQuote, copyToClipboard } = useStore();
    const [countdown, setCountdown] = useState(3);
    const [txHash] = useState(generateTxHash());

    const isOpen = activeModal === 'swap_progress';
    const quote = getQuote();

    // Countdown for step 2
    useEffect(() => {
        if (swapStep === 2) {
            setCountdown(3);
            const interval = setInterval(() => {
                setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [swapStep]);

    const renderStep = (stepNum: number, step: typeof STEPS[0]) => {
        const isCompleted = swapStep > stepNum;
        const isActive = swapStep === stepNum;
        const isWaiting = swapStep < stepNum;

        return (
            <div key={stepNum} className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex flex-col items-center">
                    <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted
                                ? 'bg-green-500/20'
                                : isActive
                                    ? 'bg-indigo-500/20'
                                    : 'bg-slate-700'
                            }`}
                    >
                        {isCompleted ? (
                            <CheckCircle className="text-green-400" size={24} />
                        ) : isActive ? (
                            <Loader2 className="text-indigo-400 animate-spin" size={24} />
                        ) : (
                            <Circle className="text-slate-500" size={24} />
                        )}
                    </div>
                    {stepNum < 4 && (
                        <div
                            className={`w-0.5 h-12 ${isCompleted ? 'bg-green-500/50' : 'bg-slate-700'
                                }`}
                        />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-8">
                    <h4
                        className={`font-medium ${isCompleted
                                ? 'text-green-400'
                                : isActive
                                    ? 'text-white'
                                    : 'text-slate-500'
                            }`}
                    >
                        {step.title}
                    </h4>
                    <p className="text-sm text-slate-400">
                        {isCompleted
                            ? step.completedDesc
                            : isActive
                                ? step.description
                                : 'Waiting...'}
                    </p>
                    {isActive && stepNum === 2 && (
                        <p className="text-sm text-indigo-400 mt-1">
                            ~{countdown}s remaining
                        </p>
                    )}
                </div>
            </div>
        );
    };

    // Success state
    if (swapStep === 4) {
        return (
            <Modal isOpen={isOpen} onClose={closeModal} showCloseButton={false} size="sm">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                        <PartyPopper className="text-green-400" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Swap Completed!</h2>
                    <p className="text-slate-400 mb-6">
                        Received{' '}
                        <span className="text-white font-semibold">
                            {quote?.toAmount} {toToken?.symbol}
                        </span>
                    </p>

                    <div className="flex gap-3">
                        <Button variant="secondary" className="flex-1" onClick={() => window.open('#', '_blank')}>
                            <ExternalLink size={16} />
                            View on Explorer
                        </Button>
                        <Button className="flex-1" onClick={closeModal}>
                            Done
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal isOpen={isOpen} showCloseButton={false} title="Swap in Progress" size="sm">
            <div className="p-4">
                {/* Progress steps */}
                <div className="mb-6">
                    {STEPS.map((step, index) => renderStep(index + 1, step))}
                </div>

                {/* Transaction details */}
                <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Transaction Hash</span>
                        <div className="flex items-center gap-2">
                            <span className="text-white font-mono text-xs">
                                {txHash.slice(0, 10)}...{txHash.slice(-8)}
                            </span>
                            <button
                                onClick={() => copyToClipboard(txHash)}
                                className="p-1 hover:bg-slate-700 rounded transition-colors"
                            >
                                <Copy size={14} className="text-slate-400" />
                            </button>
                        </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                        <ExternalLink size={14} />
                        View on Explorer
                    </button>
                </div>
            </div>
        </Modal>
    );
}

import { useStore } from '../../store/appStore';
import type { Token } from '../../types';
import { ChevronDown } from 'lucide-react';
import { formatUSD } from '../../utils/formatters';

interface TokenInputProps {
    label: string;
    type: 'from' | 'to';
    token: Token | null;
    amount: string;
    showBalance?: boolean;
    onSelectToken: () => void;
    readOnly?: boolean;
}

export function TokenInput({
    label,
    type,
    token,
    amount,
    showBalance = false,
    onSelectToken,
    readOnly = false,
}: TokenInputProps) {
    const { setFromAmount, setMaxAmount } = useStore();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'from' && !readOnly) {
            setFromAmount(e.target.value);
        }
    };

    return (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">{label}</span>
                {showBalance && token && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">
                            Balance: {token.balance}
                        </span>
                        {type === 'from' && (
                            <button
                                onClick={setMaxAmount}
                                className="px-2 py-0.5 rounded text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                            >
                                MAX
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3">
                {/* Token selector */}
                <button
                    onClick={onSelectToken}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${token
                        ? 'bg-slate-700/50 hover:bg-slate-700'
                        : 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400'
                        }`}
                >
                    {token ? (
                        <>
                            <span
                                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                                style={{ backgroundColor: token.color + '30', color: token.color }}
                            >
                                {token.icon}
                            </span>
                            <span className="font-medium text-white">{token.symbol}</span>
                        </>
                    ) : (
                        <span className="font-medium">Select</span>
                    )}
                    <ChevronDown size={16} className="text-slate-400" />
                </button>

                {/* Amount input */}
                <div className="flex-1 text-right">
                    <input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0.00"
                        readOnly={readOnly}
                        className={`w-full text-right text-2xl font-semibold bg-transparent text-white placeholder-slate-500 focus:outline-none ${readOnly ? 'cursor-default' : ''
                            }`}
                    />
                    {token && amount && parseFloat(amount) > 0 && (
                        <p className="text-sm text-slate-500">
                            ≈ {formatUSD(parseFloat(amount) * (parseFloat(token.usdValue) / parseFloat(token.balance)))}
                        </p>
                    )}
                </div>
            </div>

            {/* Price impact for "to" token */}
            {type === 'to' && amount && parseFloat(amount) > 0 && (
                <div className="mt-2 flex justify-end">
                    <span className="text-sm text-slate-400">
                        Price impact: <span className="text-green-400">~0.5%</span>
                    </span>
                </div>
            )}
        </div>
    );
}

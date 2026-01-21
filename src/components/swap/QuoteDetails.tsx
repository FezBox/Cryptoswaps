import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Quote {
    rate: string;
    toAmount: string;
    minReceived: string;
    priceImpact: string;
}

interface QuoteDetailsProps {
    quote: Quote;
}

export function QuoteDetails({ quote }: QuoteDetailsProps) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="mt-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between text-sm text-slate-400 hover:text-white transition-colors"
            >
                <span>{quote.rate}</span>
                <div className="flex items-center gap-2">
                    <span className="text-green-400">{quote.priceImpact}% impact</span>
                    {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
            </button>

            {expanded && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2 animate-fade-in">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Estimated Time</span>
                        <span className="text-white">2-3 seconds</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Network Fee</span>
                        <span className="text-white">$0.50</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Minimum Received</span>
                        <span className="text-white">{quote.minReceived}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Route</span>
                        <span className="text-indigo-400">Via Solver #42</span>
                    </div>
                </div>
            )}
        </div>
    );
}

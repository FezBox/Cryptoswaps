import { useStore } from '../../store/appStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { TokenInput } from './TokenInput';
import { QuoteDetails } from './QuoteDetails';
import { ArrowUpDown, Settings } from 'lucide-react';

export function SwapWidget() {
    const {
        walletConnected,
        fromToken,
        toToken,
        fromAmount,
        isSwapping,
        getButtonState,
        getQuote,
        openModal,
        flipTokens,
        approveToken,
    } = useStore();

    const buttonState = getButtonState();
    const quote = getQuote();

    const buttonConfig: Record<string, { text: string; disabled: boolean; onClick: () => void }> = {
        connect_wallet: {
            text: 'Connect Wallet',
            disabled: false,
            onClick: () => openModal('wallet'),
        },
        select_token: {
            text: 'Select Token',
            disabled: true,
            onClick: () => { },
        },
        enter_amount: {
            text: 'Enter Amount',
            disabled: true,
            onClick: () => { },
        },
        insufficient_balance: {
            text: 'Insufficient Balance',
            disabled: true,
            onClick: () => { },
        },
        approve_token: {
            text: `Approve ${fromToken?.symbol || ''}`,
            disabled: false,
            onClick: approveToken,
        },
        swap: {
            text: 'Swap',
            disabled: false,
            onClick: () => openModal('confirm_swap'),
        },
        swapping: {
            text: 'Swapping...',
            disabled: true,
            onClick: () => { },
        },
    };

    const config = buttonConfig[buttonState];

    return (
        <Card className="w-full max-w-md mx-auto" padding="none">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
                <h2 className="text-lg font-semibold text-white">Swap</h2>
                <button
                    onClick={() => openModal('settings')}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                    aria-label="Settings"
                >
                    <Settings size={20} />
                </button>
            </div>

            <div className="p-4 space-y-2">
                {/* From Token */}
                <TokenInput
                    label="From"
                    type="from"
                    token={fromToken}
                    amount={fromAmount}
                    showBalance={walletConnected}
                    onSelectToken={() => openModal('token_from')}
                />

                {/* Flip button */}
                <div className="flex justify-center -my-1 relative z-10">
                    <button
                        onClick={flipTokens}
                        className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:border-indigo-500 hover:bg-slate-700 transition-all shadow-lg"
                        aria-label="Flip tokens"
                    >
                        <ArrowUpDown size={20} />
                    </button>
                </div>

                {/* To Token */}
                <TokenInput
                    label="To"
                    type="to"
                    token={toToken}
                    amount={quote?.toAmount || ''}
                    showBalance={walletConnected}
                    onSelectToken={() => openModal('token_to')}
                    readOnly
                />

                {/* Quote Details */}
                {quote && fromToken && toToken && <QuoteDetails quote={quote} />}

                {/* Action Button */}
                <Button
                    fullWidth
                    size="lg"
                    disabled={config.disabled}
                    loading={isSwapping && buttonState !== 'swapping'}
                    onClick={config.onClick}
                    className="mt-4"
                >
                    {config.text}
                </Button>
            </div>
        </Card>
    );
}

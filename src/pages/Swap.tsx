import { SwapWidget } from '../components/swap/SwapWidget';

export default function Swap() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 px-4">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            <SwapWidget />
        </div>
    );
}

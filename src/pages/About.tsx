import { Card } from '../components/ui/Card';
import { MessageSquare, Zap, CheckCircle } from 'lucide-react';

const STEPS = [
    {
        number: 1,
        icon: MessageSquare,
        title: 'Express Your Intent',
        description: 'Simply specify what tokens you want to swap and from which chain. No complex bridging required.',
    },
    {
        number: 2,
        icon: Zap,
        title: 'Solvers Compete',
        description: 'Multiple solvers compete to fulfill your swap with the best rate. Our protocol ensures you get the optimal price.',
    },
    {
        number: 3,
        icon: CheckCircle,
        title: 'Instant Settlement',
        description: 'Receive your tokens in 2-3 seconds. The swap is executed atomically with guaranteed delivery.',
    },
];

export default function About() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-white mb-4">About CryptoSwaps</h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    The most advanced cross-chain swap protocol powered by Sodax infrastructure
                </p>
            </div>

            {/* What is CryptoSwaps */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-6">What is CryptoSwaps?</h2>
                <div className="prose prose-invert max-w-none">
                    <p className="text-slate-400 text-lg leading-relaxed">
                        CryptoSwaps is a revolutionary cross-chain token swap platform that enables seamless trading across multiple blockchain networks. Using intent-based execution, we eliminate the complexity of traditional bridging while ensuring you always get the best rates.
                    </p>
                    <p className="text-slate-400 text-lg leading-relaxed mt-4">
                        Our protocol connects traders with a network of professional solvers who compete to fulfill swaps. This competitive marketplace ensures optimal pricing, fast execution, and guaranteed delivery of your tokens.
                    </p>
                </div>
            </section>

            {/* How It Works */}
            <section className="mb-16">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {STEPS.map((step) => (
                        <Card key={step.number} className="text-center relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                {step.number}
                            </div>
                            <div className="w-16 h-16 mx-auto mb-4 mt-4 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400">
                                <step.icon size={32} />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
                            <p className="text-slate-400">{step.description}</p>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Powered by Sodax */}
            <section className="text-center">
                <Card className="max-w-2xl mx-auto bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-3xl mb-6">
                            S
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Powered by Sodax</h2>
                        <p className="text-slate-400 max-w-lg">
                            Built on Sodax infrastructure for maximum security, efficiency, and reliability. Sodax provides the underlying intent execution layer that makes cross-chain swaps seamless and trustless.
                        </p>
                    </div>
                </Card>
            </section>
        </div>
    );
}

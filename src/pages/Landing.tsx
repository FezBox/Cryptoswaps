import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Zap, Shield, Network, DollarSign, ArrowRight } from 'lucide-react';
import { CHAINS } from '../data/mockData';
import { useInView } from '../hooks/useInView';

const FEATURES = [
    {
        icon: Zap,
        title: 'Lightning Fast',
        description: 'Swaps complete in 2-3 seconds across all chains',
        color: 'text-amber-400',
    },
    {
        icon: Shield,
        title: 'Secure & Trustless',
        description: 'Your keys, your crypto. Non-custodial swaps.',
        color: 'text-green-400',
    },
    {
        icon: Network,
        title: 'Cross-Chain',
        description: 'Trade BTC, ETH, SOL, DOGE, and 100+ tokens',
        color: 'text-blue-400',
    },
    {
        icon: DollarSign,
        title: 'Best Prices',
        description: 'Solvers compete to give you the best rate',
        color: 'text-purple-400',
    },
];

function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) {
    const { ref, isInView } = useInView({ threshold: 0.1 });

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 transform ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export default function Landing() {
    return (
        <div className="bg-bg-primary">
            {/* Hero Section - Full Screen */}
            <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center py-20">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <AnimatedSection>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">
                            The Smartest Way to{' '}
                            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Trade Aross Chains
                            </span>
                        </h1>
                    </AnimatedSection>

                    <AnimatedSection delay={200}>
                        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            Swap tokens seamlessly across Bitcoin, Ethereum, Solana, and more using intent-based execution powered by Sodax.
                        </p>
                    </AnimatedSection>

                    <AnimatedSection delay={400}>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/swap">
                                <Button size="xl" className="group rounded-full px-10">
                                    Start Swapping
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link to="/docs">
                                <Button variant="secondary" size="xl" className="rounded-full px-10">
                                    Learn More
                                </Button>
                            </Link>
                        </div>
                    </AnimatedSection>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                    <div className="w-1 h-12 rounded-full bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
                </div>
            </section>

            {/* Features Section - Full Screen Center */}
            <section className="min-h-screen flex flex-col items-center justify-center bg-slate-900/50 relative py-20">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <AnimatedSection className="flex flex-col items-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                            Why Choose CryptoSwaps?
                        </h2>
                    </AnimatedSection>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
                        {FEATURES.map((feature, index) => (
                            <AnimatedSection key={feature.title} delay={index * 150 + 200} className="w-full">
                                <Card hover className="text-center h-full p-8 border-slate-800 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center">
                                    <div className={`w-16 h-16 mb-6 rounded-2xl bg-slate-800/80 flex items-center justify-center transform transition-transform group-hover:scale-110 duration-300 ${feature.color}`}>
                                        <feature.icon size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                    <p className="text-slate-400">{feature.description}</p>
                                </Card>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* Supported Chains */}
            <section className="min-h-screen flex flex-col items-center justify-center py-20 relative">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
                    <AnimatedSection className="flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Supported Chains
                        </h2>
                        <p className="text-slate-400 mb-8 max-w-xl text-lg">
                            Trade seamlessly across the most popular blockchain networks
                        </p>
                    </AnimatedSection>

                    <div className="flex flex-wrap justify-center gap-6">
                        {CHAINS.map((chain, index) => (
                            <AnimatedSection key={chain.name} delay={index * 50}>
                                <div
                                    className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-slate-800/30 hover:bg-slate-800/80 border border-slate-700/30 hover:border-indigo-500/30 transition-all duration-300 transform hover:scale-105 min-w-[140px]"
                                >
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg"
                                        style={{ backgroundColor: chain.color + '20', color: chain.color }}
                                    >
                                        {chain.icon}
                                    </div>
                                    <span className="font-semibold text-white text-base">{chain.name}</span>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-900/20 to-bg-primary border-t border-white/5 relative">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
                    <AnimatedSection className="flex flex-col items-center">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Start Trading?
                        </h2>
                        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                            Join thousands of traders swapping tokens across chains with the best rates and fastest execution.
                        </p>
                        <Link to="/swap">
                            <Button size="xl" className="rounded-full px-12 py-6 text-xl shadow-2xl shadow-indigo-500/20 hover:shadow-indigo-500/40">
                                Launch App
                                <ArrowRight size={24} />
                            </Button>
                        </Link>
                    </AnimatedSection>
                </div>
            </section>
        </div>
    );
}

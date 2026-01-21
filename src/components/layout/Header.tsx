import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Copy, ExternalLink, LogOut } from 'lucide-react';
import { useStore } from '../../store/appStore';
import { Button } from '../ui/Button';
import { truncateAddress, formatUSD } from '../../utils/formatters';
import { TOKENS } from '../../data/mockData';

export function Header() {
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {
        walletConnected,
        walletAddress,
        openModal,
        disconnectWallet,
        copyToClipboard,
    } = useStore();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setWalletDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navLinks = [
        { to: '/swap', label: 'Swap' },
        { to: '/explorer', label: 'Explorer' },
        { to: '/docs', label: 'Docs' },
        { to: '/about', label: 'About' },
    ];

    // Calculate total balance
    const totalBalance = TOKENS.reduce((sum, t) => sum + parseFloat(t.usdValue), 0);

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 animate-slide-down">
            <div className="relative mx-auto bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl flex items-center justify-between transition-all duration-300 hover:bg-slate-900/80 hover:border-white/20">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group mr-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                        C
                    </div>
                    <span className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors hidden sm:inline-block">
                        CryptoSwaps
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${location.pathname === link.to
                                ? 'text-white bg-white/10'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Wallet Section */}
                <div className="hidden md:flex items-center gap-3 ml-4">
                    {walletConnected ? (
                        <>
                            {/* Network indicator */}
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-white/5">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs text-slate-300">ETH</span>
                            </div>

                            {/* Wallet dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setWalletDropdownOpen(!walletDropdownOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-white/5"
                                >
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                                    <span className="text-sm font-medium text-white">
                                        {truncateAddress(walletAddress || '')}
                                    </span>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>

                                {/* Dropdown menu */}
                                {walletDropdownOpen && (
                                    <div className="absolute right-0 mt-4 w-64 py-2 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl animate-scale-in origin-top-right">
                                        {/* Address section */}
                                        <div className="px-4 py-3 border-b border-white/5">
                                            <p className="text-xs text-slate-400 mb-1">Connected Wallet</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-white font-mono truncate">
                                                    {truncateAddress(walletAddress || '')}
                                                </p>
                                                <span className="text-xs text-green-400 font-medium">{formatUSD(totalBalance)}</span>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(walletAddress || '')}
                                                className="flex items-center gap-1.5 mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                            >
                                                <Copy size={12} />
                                                Copy Address
                                            </button>
                                        </div>

                                        {/* Actions */}
                                        <div className="py-2">
                                            <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors">
                                                <ExternalLink size={14} />
                                                View on Explorer
                                            </button>
                                            <Link
                                                to="/explorer"
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-white/5 transition-colors"
                                                onClick={() => setWalletDropdownOpen(false)}
                                            >
                                                <ExternalLink size={14} />
                                                Transaction History
                                            </Link>
                                        </div>

                                        {/* Disconnect */}
                                        <div className="pt-2 border-t border-white/5">
                                            <button
                                                onClick={() => {
                                                    disconnectWallet();
                                                    setWalletDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut size={14} />
                                                Disconnect
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Button onClick={() => openModal('wallet')} size="sm" className="rounded-full px-5">
                            Connect Wallet
                        </Button>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Mobile menu dropdown */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 mt-4 mx-4 md:hidden">
                    <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-4 shadow-xl animate-slide-up origin-top">
                        <nav className="flex flex-col gap-1 mb-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.to
                                        ? 'text-white bg-white/10'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="pt-4 border-t border-white/5">
                            {walletConnected ? (
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {truncateAddress(walletAddress || '')}
                                            </p>
                                            <p className="text-xs text-slate-400">{formatUSD(totalBalance)}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={disconnectWallet}
                                        className="text-red-400 hover:text-red-300 p-2"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            ) : (
                                <Button fullWidth onClick={() => {
                                    openModal('wallet');
                                    setMobileMenuOpen(false);
                                }} className="rounded-xl">
                                    Connect Wallet
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}


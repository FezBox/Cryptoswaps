import { Link } from 'react-router-dom';
import { Twitter, MessageCircle, Github } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { to: '/swap', label: 'Swap' },
            { to: '/explorer', label: 'Explorer' },
            { to: '/docs', label: 'Documentation' },
        ],
        company: [
            { to: '/about', label: 'About' },
            { to: '/docs', label: 'Docs' },
        ],
        legal: [
            { to: '#', label: 'Terms of Service' },
            { to: '#', label: 'Privacy Policy' },
        ],
    };

    const socialLinks = [
        { href: '#', icon: Twitter, label: 'Twitter' },
        { href: '#', icon: MessageCircle, label: 'Discord' },
        { href: '#', icon: Github, label: 'GitHub' },
    ];

    return (
        <footer className="bg-bg-secondary border-t border-slate-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                C
                            </div>
                            <span className="text-xl font-bold text-white">CryptoSwaps</span>
                        </Link>
                        <p className="text-slate-400 text-sm max-w-xs mb-4">
                            The smartest way to trade across chains. Swap tokens seamlessly using intent-based execution.
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                                    aria-label={link.label}
                                >
                                    <link.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
                        <ul className="space-y-3">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.to}
                                        className="text-sm text-slate-400 hover:text-white transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-slate-500">
                        © {currentYear} CryptoSwaps. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500">Powered by</span>
                        <span className="text-sm font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Sodax
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

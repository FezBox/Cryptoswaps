import { useState, useMemo } from 'react';
import { useStore } from '../store/appStore';
import { Card } from '../components/ui/Card';
import { StatusBadge, ChainBadge } from '../components/ui/Badge';
import { Search, TrendingUp, TrendingDown, Clock, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { timeAgo, truncateAddress } from '../utils/formatters';
import { TOKENS } from '../data/mockData';

const ITEMS_PER_PAGE = 10;

const STATS = [
    { label: 'Total Volume (24h)', value: '$12,456,789', change: '+12.5%', positive: true },
    { label: 'Total Swaps (24h)', value: '1,234', change: '+8.2%', positive: true },
    { label: 'Avg. Swap Time', value: '2.3s', change: '-0.5s', positive: true },
    { label: 'Active Solvers', value: '47', change: '—', positive: null },
];

export default function Explorer() {
    const { transactions, setSelectedTransaction } = useStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [tokenFilter, setTokenFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Filtered transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter((tx) => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesHash = tx.hash.toLowerCase().includes(query);
                const matchesToken =
                    tx.from.token.symbol.toLowerCase().includes(query) ||
                    tx.to.token.symbol.toLowerCase().includes(query);
                if (!matchesHash && !matchesToken) return false;
            }

            // Token filter
            if (tokenFilter !== 'all') {
                if (tx.from.token.symbol !== tokenFilter && tx.to.token.symbol !== tokenFilter) {
                    return false;
                }
            }

            // Status filter
            if (statusFilter !== 'all' && tx.status !== statusFilter) {
                return false;
            }

            return true;
        });
    }, [transactions, searchQuery, tokenFilter, statusFilter]);

    // Pagination
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Transaction Explorer</h1>
                <p className="text-slate-400">Track all CryptoSwaps transactions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {STATS.map((stat) => (
                    <Card key={stat.label} padding="md">
                        <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <p className="text-2xl font-bold text-white">{stat.value}</p>
                            <span
                                className={`flex items-center text-sm ${stat.positive === true
                                        ? 'text-green-400'
                                        : stat.positive === false
                                            ? 'text-red-400'
                                            : 'text-slate-400'
                                    }`}
                            >
                                {stat.positive === true && <TrendingUp size={14} className="mr-1" />}
                                {stat.positive === false && <TrendingDown size={14} className="mr-1" />}
                                {stat.change}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by transaction hash or token"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Token filter */}
                <select
                    value={tokenFilter}
                    onChange={(e) => {
                        setTokenFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="all">All Tokens</option>
                    {TOKENS.slice(0, 10).map((token) => (
                        <option key={token.symbol} value={token.symbol}>
                            {token.symbol}
                        </option>
                    ))}
                </select>

                {/* Status filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Transaction Table */}
            <Card padding="none" className="overflow-hidden mb-6">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-800/50 border-b border-slate-700">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Transaction</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">From</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">To</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-medium text-slate-400">Time</th>
                                <th className="text-right px-6 py-4 text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {paginatedTransactions.map((tx) => (
                                <tr
                                    key={tx.hash}
                                    onClick={() => setSelectedTransaction(tx)}
                                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-white">
                                            {truncateAddress(tx.hash, 6)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                                style={{ backgroundColor: tx.from.token.color + '30', color: tx.from.token.color }}
                                            >
                                                {tx.from.token.icon}
                                            </span>
                                            <span className="text-white">{tx.from.amount} {tx.from.token.symbol}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                                style={{ backgroundColor: tx.to.token.color + '30', color: tx.to.token.color }}
                                            >
                                                {tx.to.token.icon}
                                            </span>
                                            <span className="text-white">{tx.to.amount} {tx.to.token.symbol}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={tx.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-slate-400">
                                            <Clock size={14} />
                                            {timeAgo(tx.timestamp)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                                            View Details →
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-slate-700/50">
                    {paginatedTransactions.map((tx) => (
                        <div
                            key={tx.hash}
                            onClick={() => setSelectedTransaction(tx)}
                            className="p-4 hover:bg-slate-800/50 cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-mono text-sm text-white">
                                    {truncateAddress(tx.hash, 6)}
                                </span>
                                <StatusBadge status={tx.status} />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{ backgroundColor: tx.from.token.color + '30', color: tx.from.token.color }}
                                    >
                                        {tx.from.token.icon}
                                    </span>
                                    <span className="text-white text-sm">{tx.from.amount} {tx.from.token.symbol}</span>
                                    <span className="text-slate-500">→</span>
                                    <span
                                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                        style={{ backgroundColor: tx.to.token.color + '30', color: tx.to.token.color }}
                                    >
                                        {tx.to.token.icon}
                                    </span>
                                    <span className="text-white text-sm">{tx.to.amount} {tx.to.token.symbol}</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">{timeAgo(tx.timestamp)}</p>
                        </div>
                    ))}
                </div>

                {/* Empty state */}
                {paginatedTransactions.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-slate-400">No transactions found</p>
                    </div>
                )}
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                            pageNum = i + 1;
                        } else if (currentPage <= 3) {
                            pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                        } else {
                            pageNum = currentPage - 2 + i;
                        }
                        return (
                            <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === pageNum
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}

import React from 'react';

interface BadgeProps {
    variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    size?: 'sm' | 'md';
    children: React.ReactNode;
    className?: string;
}

export function Badge({
    variant = 'neutral',
    size = 'sm',
    children,
    className = '',
}: BadgeProps) {
    const variants = {
        success: 'bg-green-500/20 text-green-400 border-green-500/30',
        warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        error: 'bg-red-500/20 text-red-400 border-red-500/30',
        info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        neutral: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    };

    return (
        <span
            className={`
        inline-flex items-center font-medium rounded-full border
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}

interface ChainBadgeProps {
    chain: string;
    size?: 'sm' | 'md';
}

export function ChainBadge({ chain, size = 'sm' }: ChainBadgeProps) {
    const chainColors: Record<string, string> = {
        Bitcoin: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        Ethereum: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        Solana: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        Polygon: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        Arbitrum: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        NEAR: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        BSC: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        Avalanche: 'bg-red-500/20 text-red-400 border-red-500/30',
    };

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-sm',
    };

    return (
        <span
            className={`
        inline-flex items-center font-medium rounded-full border
        ${chainColors[chain] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}
        ${sizes[size]}
      `}
        >
            {chain}
        </span>
    );
}

interface StatusBadgeProps {
    status: 'completed' | 'pending' | 'failed';
    size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
    const statusConfig = {
        completed: { variant: 'success' as const, label: 'Completed' },
        pending: { variant: 'warning' as const, label: 'Pending' },
        failed: { variant: 'error' as const, label: 'Failed' },
    };

    const config = statusConfig[status];

    return (
        <Badge variant={config.variant} size={size}>
            {status === 'pending' && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse mr-1.5" />
            )}
            {config.label}
        </Badge>
    );
}

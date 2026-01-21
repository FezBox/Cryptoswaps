import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
    children,
    className = '',
    hover = false,
    padding = 'md'
}: CardProps) {
    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={`
        bg-slate-800/50 
        backdrop-blur-sm 
        rounded-2xl 
        border border-slate-700/50
        shadow-xl
        ${hover ? 'hover:shadow-2xl hover:border-slate-600 transition-all duration-200 cursor-pointer' : ''}
        ${paddings[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
    className?: string;
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
    return (
        <div className={`flex items-center justify-between mb-4 ${className}`}>
            <div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

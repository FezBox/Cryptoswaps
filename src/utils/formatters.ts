// Format address to truncated version
export function truncateAddress(address: string, chars = 4): string {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

// Format timestamp to "time ago" format
export function timeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    const intervals: [number, string][] = [
        [31536000, 'year'],
        [2592000, 'month'],
        [86400, 'day'],
        [3600, 'hour'],
        [60, 'minute'],
        [1, 'second'],
    ];

    for (const [intervalSeconds, unit] of intervals) {
        const count = Math.floor(seconds / intervalSeconds);
        if (count >= 1) {
            return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
        }
    }
    return 'just now';
}

// Format date to full format
export function formatFullDate(timestamp: number): string {
    return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
}

// Format number with commas
export function formatNumber(value: string | number, decimals = 2): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });
}

// Format USD value
export function formatUSD(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(num);
}

// Format crypto amount (smart decimals)
export function formatCryptoAmount(value: string | number): string {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';

    if (num >= 1000) return formatNumber(num, 2);
    if (num >= 1) return formatNumber(num, 4);
    if (num >= 0.0001) return formatNumber(num, 6);
    return num.toExponential(4);
}

// Get status color class
export function getStatusColor(status: string): string {
    switch (status) {
        case 'completed': return 'text-green-400';
        case 'pending': return 'text-amber-400';
        case 'failed': return 'text-red-400';
        default: return 'text-slate-400';
    }
}

// Get status badge class
export function getStatusBadgeClass(status: string): string {
    switch (status) {
        case 'completed': return 'badge-success';
        case 'pending': return 'badge-warning';
        case 'failed': return 'badge-error';
        default: return 'badge-info';
    }
}

// Calculate deadline date
export function getDeadlineDate(minutes: number): string {
    const deadline = new Date(Date.now() + minutes * 60 * 1000);
    return deadline.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}

// Sleep helper for async operations
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

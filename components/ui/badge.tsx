import * as React from 'react';
import { cn } from '@/lib/utils';
import { InvoiceStatus } from '@/types';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'draft' | 'sent' | 'overdue' | 'paid' | 'pending' | 'failed' | 'success';
    size?: 'sm' | 'md';
    className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
    const variants = {
        default: 'bg-gray-100 text-gray-700 border-gray-200',
        draft: 'bg-gray-100 text-gray-700 border-gray-200',
        sent: 'bg-blue-50 text-blue-700 border-blue-200',
        overdue: 'bg-red-50 text-red-700 border-red-200',
        paid: 'bg-green-50 text-green-700 border-green-200',
        pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        failed: 'bg-red-50 text-red-700 border-red-200',
        success: 'bg-green-50 text-green-700 border-green-200',
    };

    const sizes = {
        sm: 'px-2.5 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full border',
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </span>
    );
}

// Status-specific badge helper
interface StatusBadgeProps {
    status: InvoiceStatus | 'pending' | 'failed';
    size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
    const labels: Record<string, string> = {
        draft: 'Draft',
        sent: 'Sent',
        overdue: 'Overdue',
        paid: 'Paid',
        pending: 'Pending',
        failed: 'Failed',
    };

    return (
        <Badge variant={status as BadgeProps['variant']} size={size}>
            <span
                className={cn('w-1.5 h-1.5 rounded-full mr-1.5', {
                    'bg-gray-500': status === 'draft',
                    'bg-blue-500': status === 'sent',
                    'bg-red-500': status === 'overdue' || status === 'failed',
                    'bg-green-500': status === 'paid',
                    'bg-yellow-500': status === 'pending',
                })}
            />
            {labels[status]}
        </Badge>
    );
}

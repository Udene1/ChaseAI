import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    variant?: 'default' | 'glass' | 'bordered';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export function Card({
    children,
    className,
    variant = 'default',
    padding = 'md',
    hover = false,
    ...props
}: CardProps) {
    const variants = {
        default: 'bg-white rounded-2xl border border-gray-100 shadow-sm',
        glass: 'glass-card rounded-2xl',
        bordered: 'bg-white rounded-2xl border-2 border-gray-200',
    };

    const paddings = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    return (
        <div
            className={cn(
                variants[variant],
                paddings[padding],
                hover && 'hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

// Card subcomponents
export function CardHeader({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('pb-4 border-b border-gray-100', className)}>
            {children}
        </div>
    );
}

export function CardTitle({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h3 className={cn('text-lg font-semibold text-dark-900', className)}>
            {children}
        </h3>
    );
}

export function CardDescription({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <p className={cn('text-sm text-gray-500 mt-1', className)}>{children}</p>
    );
}

export function CardContent({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={cn('py-4', className)}>{children}</div>;
}

export function CardFooter({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn('pt-4 border-t border-gray-100 flex items-center gap-3', className)}>
            {children}
        </div>
    );
}

// Stat card variant for dashboard
interface StatCardProps {
    title: string;
    value: string | number;
    change?: {
        value: number;
        isPositive: boolean;
    };
    icon?: React.ReactNode;
    className?: string;
}

export function StatCard({ title, value, change, icon, className }: StatCardProps) {
    return (
        <Card className={cn('relative overflow-hidden', className)}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-dark-900">{value}</p>
                    {change && (
                        <p
                            className={cn(
                                'mt-2 text-sm font-medium flex items-center gap-1',
                                change.isPositive ? 'text-green-600' : 'text-red-600'
                            )}
                        >
                            <span>{change.isPositive ? '↑' : '↓'}</span>
                            {Math.abs(change.value)}%
                            <span className="text-gray-400 ml-1">vs last month</span>
                        </p>
                    )}
                </div>
                {icon && (
                    <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                        {icon}
                    </div>
                )}
            </div>
            {/* Decorative gradient */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full" />
        </Card>
    );
}

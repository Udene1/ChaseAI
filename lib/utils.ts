import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Currency } from '@/types';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency with proper symbol and locale
 */
export function formatCurrency(amount: number, currency: Currency = 'NGN'): string {
    const locales: Record<Currency, string> = {
        NGN: 'en-NG',
        USD: 'en-US',
        EUR: 'de-DE',
        GBP: 'en-GB',
    };

    return new Intl.NumberFormat(locales[currency], {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format date in a readable format
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
    }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 days")
 */
export function formatRelativeTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInMs = dateObj.getTime() - now.getTime();
    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays > 0) return `In ${diffInDays} days`;
    return `${Math.abs(diffInDays)} days ago`;
}

/**
 * Calculate days until due date (negative if overdue)
 */
export function daysUntilDue(dueDate: string | Date): number {
    const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return Math.floor((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Check if invoice is overdue
 */
export function isOverdue(dueDate: string | Date): boolean {
    return daysUntilDue(dueDate) < 0;
}

/**
 * Generate invoice number
 */
export function generateInvoiceNumber(): string {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `INV-${year}${month}-${random}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Parse error message from unknown error
 */
export function parseError(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (Nigerian format supported)
 */
export function isValidPhone(phone: string): boolean {
    // Supports Nigerian numbers and international format
    const phoneRegex = /^(\+?234|0)?[789][01]\d{8}$|^\+?[1-9]\d{6,14}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
}

/**
 * Format phone number for display
 */
export function formatPhone(phone: string): string {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Nigerian number formatting
    if (cleaned.startsWith('+234')) {
        return cleaned.replace(/(\+234)(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
    }
    if (cleaned.startsWith('0') && cleaned.length === 11) {
        return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    }

    return phone;
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Get status color for badges
 */
export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        draft: 'bg-gray-100 text-gray-700 border-gray-200',
        sent: 'bg-blue-100 text-blue-700 border-blue-200',
        overdue: 'bg-red-100 text-red-700 border-red-200',
        paid: 'bg-green-100 text-green-700 border-green-200',
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        failed: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status] || colors.draft;
}

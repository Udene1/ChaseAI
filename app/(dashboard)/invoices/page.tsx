import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { formatCurrency, formatDate, daysUntilDue } from '@/lib/utils';
import { Plus, Search, Filter, FileText } from 'lucide-react';
import { InvoiceWithClient } from '@/types';

async function getInvoices(searchParams: { status?: string; search?: string }) {
    const supabase = createClient();
    const profile = await getUserProfile();

    if (!profile) {
        return { invoices: [], profile: null };
    }

    let query = supabase
        .from('invoices')
        .select(`
      *,
      client:clients(*)
    `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

    if (searchParams.status && searchParams.status !== 'all') {
        query = query.eq('status', searchParams.status);
    }

    const { data: invoices } = await query;

    return {
        invoices: (invoices || []) as InvoiceWithClient[],
        profile
    };
}

export default async function InvoicesPage({
    searchParams,
}: {
    searchParams: { status?: string; search?: string };
}) {
    const { invoices, profile } = await getInvoices(searchParams);
    const currentStatus = searchParams.status || 'all';

    const statusFilters = [
        { value: 'all', label: 'All' },
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'paid', label: 'Paid' },
    ];

    const stats = {
        all: invoices.length,
        draft: invoices.filter((i) => i.status === 'draft').length,
        sent: invoices.filter((i) => i.status === 'sent').length,
        overdue: invoices.filter((i) => i.status === 'overdue').length,
        paid: invoices.filter((i) => i.status === 'paid').length,
    };

    return (
        <>
            <Header
                title="Invoices"
                subtitle={`Manage your invoices and track payments`}
                user={profile}
            />

            <div className="p-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
                    {/* Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                        {statusFilters.map((filter) => (
                            <Link
                                key={filter.value}
                                href={`/invoices${filter.value !== 'all' ? `?status=${filter.value}` : ''}`}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${currentStatus === filter.value
                                        ? 'bg-primary-100 text-primary-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {filter.label}
                                <span className="ml-2 text-xs opacity-70">
                                    {stats[filter.value as keyof typeof stats]}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* New Invoice Button */}
                    <Link href="/invoices/new">
                        <Button leftIcon={<Plus className="w-5 h-5" />}>
                            New Invoice
                        </Button>
                    </Link>
                </div>

                {/* Invoices Table */}
                <Card padding="none">
                    {invoices.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="mt-4 text-lg font-medium text-dark-900">
                                {currentStatus === 'all' ? 'No invoices yet' : `No ${currentStatus} invoices`}
                            </h4>
                            <p className="mt-2 text-gray-500">
                                {currentStatus === 'all'
                                    ? 'Create your first invoice to start tracking payments.'
                                    : `You don't have any ${currentStatus} invoices at the moment.`}
                            </p>
                            <Link href="/invoices/new" className="mt-4 inline-block">
                                <Button size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Invoice
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="table-header px-6 py-4">Invoice</th>
                                        <th className="table-header px-6 py-4">Client</th>
                                        <th className="table-header px-6 py-4">Amount</th>
                                        <th className="table-header px-6 py-4">Due Date</th>
                                        <th className="table-header px-6 py-4">Status</th>
                                        <th className="table-header px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {invoices.map((invoice) => {
                                        const days = daysUntilDue(invoice.due_date);
                                        return (
                                            <tr key={invoice.id} className="table-row">
                                                <td className="table-cell">
                                                    <div>
                                                        <p className="font-medium text-dark-900">{invoice.invoice_number}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(invoice.created_at)}</p>
                                                    </div>
                                                </td>
                                                <td className="table-cell">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                            {invoice.client?.name?.charAt(0) || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-dark-900">
                                                                {invoice.client?.name || 'Unknown'}
                                                            </p>
                                                            <p className="text-xs text-gray-500">{invoice.client?.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="table-cell">
                                                    <p className="font-semibold text-dark-900">
                                                        {formatCurrency(invoice.amount, invoice.currency as 'NGN' | 'USD')}
                                                    </p>
                                                </td>
                                                <td className="table-cell">
                                                    <p className="text-dark-700">{formatDate(invoice.due_date)}</p>
                                                    {invoice.status !== 'paid' && invoice.status !== 'draft' && (
                                                        <p className={`text-xs ${days < 0 ? 'text-red-500' : days <= 3 ? 'text-yellow-600' : 'text-gray-500'}`}>
                                                            {days < 0
                                                                ? `${Math.abs(days)} days overdue`
                                                                : days === 0
                                                                    ? 'Due today'
                                                                    : `${days} days left`}
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="table-cell">
                                                    <StatusBadge status={invoice.status} />
                                                </td>
                                                <td className="table-cell text-right">
                                                    <Link
                                                        href={`/invoices/${invoice.id}`}
                                                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                                    >
                                                        View →
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}

import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { StatCard, Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, daysUntilDue } from '@/lib/utils';
import {
    FileText,
    DollarSign,
    AlertTriangle,
    CheckCircle,
    Plus,
    ArrowUpRight,
    Clock,
    Send,
} from 'lucide-react';
import { InvoiceWithClient } from '@/types';

async function getDashboardData() {
    const supabase = createClient();
    const profile = await getUserProfile();

    if (!profile) {
        return { invoices: [], stats: null };
    }

    // Fetch recent invoices with client info
    const { data: invoices } = await supabase
        .from('invoices')
        .select(`
      *,
      client:clients(*)
    `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(10);

    // Calculate stats
    const { data: allInvoices } = await supabase
        .from('invoices')
        .select('amount, status, currency')
        .eq('user_id', profile.id);

    const stats = {
        totalInvoices: allInvoices?.length || 0,
        totalOutstanding: allInvoices
            ?.filter((i) => i.status === 'sent' || i.status === 'overdue')
            .reduce((acc, i) => acc + Number(i.amount), 0) || 0,
        overdueCount: allInvoices?.filter((i) => i.status === 'overdue').length || 0,
        paidThisMonth: allInvoices?.filter((i) => i.status === 'paid').length || 0,
    };

    return {
        invoices: (invoices || []) as InvoiceWithClient[],
        stats,
        profile,
        defaultCurrency: profile.default_currency || 'NGN',
    };
}

function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-gray-200 rounded-2xl" />
                ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl" />
        </div>
    );
}

export default async function DashboardPage() {
    const { invoices, stats, profile, defaultCurrency } = await getDashboardData();

    return (
        <>
            <Header
                title="Dashboard"
                subtitle="Welcome back! Here's your invoice overview."
                user={profile}
            />

            <div className="p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Invoices"
                        value={stats?.totalInvoices || 0}
                        icon={<FileText className="w-6 h-6" />}
                    />
                    <StatCard
                        title="Outstanding"
                        value={formatCurrency(stats?.totalOutstanding || 0, defaultCurrency as 'NGN' | 'USD')}
                        icon={<DollarSign className="w-6 h-6" />}
                    />
                    <StatCard
                        title="Overdue"
                        value={stats?.overdueCount || 0}
                        icon={<AlertTriangle className="w-6 h-6" />}
                    />
                    <StatCard
                        title="Paid This Month"
                        value={stats?.paidThisMonth || 0}
                        icon={<CheckCircle className="w-6 h-6" />}
                    />
                </div>

                {/* Quick Actions + Recent Invoices */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Quick Actions */}
                    <Card className="col-span-1">
                        <h3 className="text-lg font-semibold text-dark-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <Link href="/invoices/new" className="block">
                                <Button className="w-full justify-start" variant="secondary" leftIcon={<Plus className="w-5 h-5" />}>
                                    Create New Invoice
                                </Button>
                            </Link>
                            <Link href="/clients" className="block">
                                <Button className="w-full justify-start" variant="ghost" leftIcon={<ArrowUpRight className="w-5 h-5" />}>
                                    Manage Clients
                                </Button>
                            </Link>
                            <Link href="/reports" className="block">
                                <Button className="w-full justify-start" variant="ghost" leftIcon={<ArrowUpRight className="w-5 h-5" />}>
                                    View Reports
                                </Button>
                            </Link>
                        </div>

                        {/* Overdue Alert */}
                        {stats && stats.overdueCount > 0 && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">
                                            {stats.overdueCount} overdue invoice{stats.overdueCount > 1 ? 's' : ''}
                                        </p>
                                        <p className="text-sm text-red-600 mt-1">
                                            Send reminders to collect payments faster.
                                        </p>
                                        <Link
                                            href="/invoices?status=overdue"
                                            className="text-sm font-medium text-red-700 hover:underline mt-2 inline-block"
                                        >
                                            View overdue →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Recent Invoices */}
                    <Card className="col-span-2" padding="none">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-dark-900">Recent Invoices</h3>
                            <Link
                                href="/invoices"
                                className="text-sm text-primary-600 font-medium hover:underline"
                            >
                                View all
                            </Link>
                        </div>

                        {invoices.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                                    <FileText className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="mt-4 text-lg font-medium text-dark-900">No invoices yet</h4>
                                <p className="mt-2 text-gray-500">Create your first invoice to get started.</p>
                                <Link href="/invoices/new" className="mt-4 inline-block">
                                    <Button size="sm">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Invoice
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {invoices.slice(0, 5).map((invoice) => {
                                    const days = daysUntilDue(invoice.due_date);
                                    return (
                                        <Link
                                            key={invoice.id}
                                            href={`/invoices/${invoice.id}`}
                                            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium">
                                                    {invoice.client?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-dark-900">
                                                        {invoice.client?.name || 'Unknown Client'}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {invoice.invoice_number} • {formatDate(invoice.due_date)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <p className="font-semibold text-dark-900">
                                                        {formatCurrency(invoice.amount, invoice.currency as 'NGN' | 'USD')}
                                                    </p>
                                                    {invoice.status !== 'paid' && (
                                                        <p className={`text-xs ${days < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                                                            {days < 0 ? `${Math.abs(days)} days overdue` : days === 0 ? 'Due today' : `${days} days left`}
                                                        </p>
                                                    )}
                                                </div>
                                                <StatusBadge status={invoice.status} />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </>
    );
}

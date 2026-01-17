import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/badge';
import { formatCurrency, formatDate, daysUntilDue } from '@/lib/utils';
import { InvoiceActions } from '@/components/invoice/invoice-actions';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    Calendar,
    FileText,
    Clock,
    Send,
    CheckCircle,
    AlertTriangle,
} from 'lucide-react';
import { InvoiceWithClient, Reminder } from '@/types';

async function getInvoice(id: string) {
    const supabase = createClient();
    const profile = await getUserProfile();

    if (!profile) {
        return { invoice: null, reminders: [], profile: null };
    }

    const { data: invoice } = await supabase
        .from('invoices')
        .select(`
      *,
      client:clients(*)
    `)
        .eq('id', id)
        .eq('user_id', profile.id)
        .single();

    if (!invoice) {
        return { invoice: null, reminders: [], profile: null };
    }

    const { data: reminders } = await supabase
        .from('reminders')
        .select('*')
        .eq('invoice_id', id)
        .order('created_at', { ascending: false });

    return {
        invoice: invoice as InvoiceWithClient,
        reminders: (reminders || []) as Reminder[],
        profile
    };
}

export default async function InvoiceDetailPage({
    params,
}: {
    params: { id: string };
}) {
    const { invoice, reminders, profile } = await getInvoice(params.id);

    if (!invoice) {
        notFound();
    }

    const days = daysUntilDue(invoice.due_date);
    const isOverdue = invoice.status === 'overdue' || (invoice.status === 'sent' && days < 0);

    return (
        <>
            <Header
                title={`Invoice ${invoice.invoice_number}`}
                subtitle={invoice.client?.name || 'Unknown Client'}
                user={profile}
            />

            <div className="p-6 max-w-5xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/invoices"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Invoices
                </Link>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Invoice Summary */}
                        <Card>
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-dark-900">{invoice.invoice_number}</h2>
                                    <p className="text-gray-500">Created {formatDate(invoice.created_at)}</p>
                                </div>
                                <StatusBadge status={invoice.status} size="md" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Amount */}
                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <p className="text-sm text-gray-500">Amount Due</p>
                                    <p className="text-3xl font-bold text-dark-900 mt-1">
                                        {formatCurrency(invoice.amount, invoice.currency as 'NGN' | 'USD')}
                                    </p>
                                </div>

                                {/* Due Date */}
                                <div className={`p-4 rounded-xl ${isOverdue ? 'bg-red-50' : 'bg-gray-50'}`}>
                                    <p className="text-sm text-gray-500">Due Date</p>
                                    <p className={`text-lg font-semibold mt-1 ${isOverdue ? 'text-red-700' : 'text-dark-900'}`}>
                                        {formatDate(invoice.due_date)}
                                    </p>
                                    {invoice.status !== 'paid' && invoice.status !== 'draft' && (
                                        <p className={`text-sm mt-1 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
                                            {days < 0
                                                ? `${Math.abs(days)} days overdue`
                                                : days === 0
                                                    ? 'Due today'
                                                    : `${days} days remaining`}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {invoice.description && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                                    <p className="text-dark-700">{invoice.description}</p>
                                </div>
                            )}
                        </Card>

                        {/* Client Info */}
                        <Card>
                            <h3 className="text-lg font-semibold text-dark-900 mb-4">Client Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Name</p>
                                        <p className="font-medium text-dark-900">{invoice.client?.name || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Mail className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-dark-900">{invoice.client?.email || 'N/A'}</p>
                                    </div>
                                </div>
                                {invoice.client?.phone && (
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <Phone className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium text-dark-900">{invoice.client.phone}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Reminder History */}
                        <Card>
                            <h3 className="text-lg font-semibold text-dark-900 mb-4">Reminder History</h3>
                            {reminders.length === 0 ? (
                                <div className="text-center py-8">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto" />
                                    <p className="mt-3 text-gray-500">No reminders sent yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reminders.map((reminder) => (
                                        <div
                                            key={reminder.id}
                                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className={`p-2 rounded-lg ${reminder.status === 'sent'
                                                    ? 'bg-green-100 text-green-600'
                                                    : reminder.status === 'failed'
                                                        ? 'bg-red-100 text-red-600'
                                                        : 'bg-yellow-100 text-yellow-600'
                                                }`}>
                                                {reminder.status === 'sent' ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : reminder.status === 'failed' ? (
                                                    <AlertTriangle className="w-4 h-4" />
                                                ) : (
                                                    <Clock className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-medium text-dark-900 capitalize">
                                                        Level {reminder.escalation_level} {reminder.type}
                                                    </p>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${reminder.status === 'sent'
                                                            ? 'bg-green-100 text-green-700'
                                                            : reminder.status === 'failed'
                                                                ? 'bg-red-100 text-red-700'
                                                                : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {reminder.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {reminder.sent_date
                                                        ? `Sent ${formatDate(reminder.sent_date)}`
                                                        : reminder.scheduled_date
                                                            ? `Scheduled for ${formatDate(reminder.scheduled_date)}`
                                                            : 'Pending'}
                                                </p>
                                                {reminder.error_message && (
                                                    <p className="text-sm text-red-500 mt-1">{reminder.error_message}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <InvoiceActions invoice={invoice} />

                        {/* PDF Download */}
                        {invoice.pdf_url && (
                            <Card>
                                <h3 className="text-lg font-semibold text-dark-900 mb-4">Attached PDF</h3>
                                <a
                                    href={invoice.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <FileText className="w-8 h-8 text-primary-600" />
                                    <div>
                                        <p className="font-medium text-dark-900">View Invoice PDF</p>
                                        <p className="text-sm text-gray-500">Click to open</p>
                                    </div>
                                </a>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

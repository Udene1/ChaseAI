'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Modal, ConfirmDialog } from '@/components/ui/modal';
import { ReminderModal } from '@/components/reminder/reminder-modal';
import { Send, CheckCircle, XCircle, Trash2, Edit, Brain } from 'lucide-react';
import { Invoice } from '@/types';

interface InvoiceActionsProps {
    invoice: Invoice;
}

export function InvoiceActions({ invoice }: InvoiceActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showReminderModal, setShowReminderModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showMarkPaidConfirm, setShowMarkPaidConfirm] = useState(false);

    const updateStatus = async (status: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/invoices/${invoice.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update invoice');
            }

            toast.success(`Invoice marked as ${status}`);
            router.refresh();
        } catch (error) {
            toast.error('Failed to update invoice status');
        } finally {
            setIsLoading(false);
            setShowMarkPaidConfirm(false);
        }
    };

    const deleteInvoice = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/invoices/${invoice.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete invoice');
            }

            toast.success('Invoice deleted');
            router.push('/invoices');
        } catch (error) {
            toast.error('Failed to delete invoice');
        } finally {
            setIsLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const sendInvoice = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/invoices/${invoice.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'sent' }),
            });

            if (!response.ok) {
                throw new Error('Failed to send invoice');
            }

            toast.success('Invoice sent to client!');
            router.refresh();
        } catch (error) {
            toast.error('Failed to send invoice');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Card>
                <h3 className="text-lg font-semibold text-dark-900 mb-4">Actions</h3>
                <div className="space-y-3">
                    {/* Send Invoice (for draft) */}
                    {invoice.status === 'draft' && (
                        <Button
                            className="w-full"
                            onClick={sendInvoice}
                            isLoading={isLoading}
                            leftIcon={<Send className="w-5 h-5" />}
                        >
                            Send Invoice
                        </Button>
                    )}

                    {/* Send Reminder (for sent/overdue) */}
                    {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                        <Button
                            className="w-full"
                            onClick={() => setShowReminderModal(true)}
                            leftIcon={<Brain className="w-5 h-5" />}
                        >
                            Send AI Reminder
                        </Button>
                    )}

                    {/* Mark as Paid */}
                    {invoice.status !== 'paid' && invoice.status !== 'draft' && (
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => setShowMarkPaidConfirm(true)}
                            leftIcon={<CheckCircle className="w-5 h-5" />}
                        >
                            Mark as Paid
                        </Button>
                    )}

                    {/* Mark as Overdue (for sent invoices) */}
                    {invoice.status === 'sent' && (
                        <Button
                            variant="ghost"
                            className="w-full text-yellow-600 hover:bg-yellow-50"
                            onClick={() => updateStatus('overdue')}
                            isLoading={isLoading}
                        >
                            Mark as Overdue
                        </Button>
                    )}

                    {/* Edit (only for draft) */}
                    {invoice.status === 'draft' && (
                        <Button
                            variant="ghost"
                            className="w-full"
                            leftIcon={<Edit className="w-5 h-5" />}
                            onClick={() => router.push(`/invoices/${invoice.id}/edit`)}
                        >
                            Edit Invoice
                        </Button>
                    )}

                    {/* Delete */}
                    <Button
                        variant="ghost"
                        className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setShowDeleteConfirm(true)}
                        leftIcon={<Trash2 className="w-5 h-5" />}
                    >
                        Delete Invoice
                    </Button>
                </div>
            </Card>

            {/* Reminder Modal */}
            <ReminderModal
                isOpen={showReminderModal}
                onClose={() => setShowReminderModal(false)}
                invoiceId={invoice.id}
            />

            {/* Mark as Paid Confirm */}
            <ConfirmDialog
                isOpen={showMarkPaidConfirm}
                onClose={() => setShowMarkPaidConfirm(false)}
                onConfirm={() => updateStatus('paid')}
                title="Mark as Paid?"
                message="This will mark the invoice as paid. Make sure you've received the payment."
                confirmText="Yes, Mark as Paid"
                isLoading={isLoading}
            />

            {/* Delete Confirm */}
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={deleteInvoice}
                title="Delete Invoice?"
                message="This action cannot be undone. The invoice and all its reminders will be permanently deleted."
                confirmText="Delete"
                variant="danger"
                isLoading={isLoading}
            />
        </>
    );
}

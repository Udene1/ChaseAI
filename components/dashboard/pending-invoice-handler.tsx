'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { generateInvoiceNumber } from '@/lib/utils';

export function PendingInvoiceHandler() {
    const router = useRouter();
    const processedRef = useRef(false);

    useEffect(() => {
        const processPendingInvoice = async () => {
            if (processedRef.current) return;

            try {
                const pendingData = sessionStorage.getItem('pendingInvoice');
                if (!pendingData) return;

                const data = JSON.parse(pendingData);
                processedRef.current = true; // Prevent double submission

                toast.loading('Creating your invoice...', { id: 'create-invoice' });

                // Construct invoice payload matches the API expected format
                // We need to map quick invoice fields to full invoice structure
                // Assuming the API handles client creation if just email is provided or we might need to adjust

                // Let's look at the QuickInvoiceData structure:
                // { clientEmail, amount, currency, dueDate }

                // The API likely expects clientName as well. 
                // We'll use the email as name for now or "New Client"

                const payload = {
                    clientName: data.clientEmail.split('@')[0], // Fallback name from email
                    clientEmail: data.clientEmail,
                    amount: parseFloat(data.amount),
                    currency: data.currency,
                    dueDate: data.dueDate,
                    description: 'Invoice created from quick start',
                    status: 'draft',
                    invoiceNumber: generateInvoiceNumber(),
                };

                const response = await fetch('/api/invoices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error('Failed to create invoice');
                }

                const result = await response.json();

                // Cleanup
                sessionStorage.removeItem('pendingInvoice');

                toast.success('Invoice created successfully!', { id: 'create-invoice' });

                // Redirect to the new invoice
                router.refresh();
                router.push(`/invoices/${result.data.id}`);

            } catch (error) {
                console.error('Error processing pending invoice:', error);
                toast.error('Could not create invoice from quick start', { id: 'create-invoice' });
                // Don't remove from specific storage so they can maybe try again? 
                // Or maybe we should remove to prevent loop. 
                // valid decision: remove it to be safe.
                sessionStorage.removeItem('pendingInvoice');
            }
        };

        processPendingInvoice();
    }, [router]);

    return null; // This component doesn't render anything
}

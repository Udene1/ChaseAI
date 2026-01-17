'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Textarea, Select } from '@/components/ui/input';
import { UploadPDF } from '@/components/invoice/upload-pdf';
import {
    User,
    Mail,
    Phone,
    DollarSign,
    Calendar,
    FileText,
    ArrowLeft,
    Save,
    Send,
} from 'lucide-react';
import { generateInvoiceNumber } from '@/lib/utils';

const invoiceSchema = z.object({
    clientName: z.string().min(2, 'Client name is required'),
    clientEmail: z.string().email('Valid email is required'),
    clientPhone: z.string().optional(),
    amount: z.string().min(1, 'Amount is required').transform((val) => parseFloat(val)),
    currency: z.enum(['NGN', 'USD', 'EUR', 'GBP']),
    dueDate: z.string().min(1, 'Due date is required'),
    description: z.string().optional(),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

export default function NewInvoicePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [pdfData, setPdfData] = useState<{ url: string; amount?: number; dueDate?: string } | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<InvoiceFormData>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            currency: 'NGN',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
    });

    const currency = watch('currency');

    const handlePDFUpload = (data: { url: string; amount?: number; dueDate?: string }) => {
        setPdfData(data);
        if (data.amount) {
            setValue('amount', data.amount.toString() as unknown as number);
        }
        if (data.dueDate) {
            setValue('dueDate', data.dueDate);
        }
        toast.success('PDF uploaded and parsed successfully!');
    };

    const saveInvoice = async (data: InvoiceFormData, status: 'draft' | 'sent') => {
        const invoiceNumber = generateInvoiceNumber();

        try {
            const response = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    invoiceNumber,
                    status,
                    pdfUrl: pdfData?.url,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create invoice');
            }

            const result = await response.json();

            if (status === 'sent') {
                toast.success('Invoice created and sent to client!');
            } else {
                toast.success('Invoice saved as draft!');
            }

            router.push(`/invoices/${result.data.id}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to create invoice');
        }
    };

    const onSubmitDraft = async (data: InvoiceFormData) => {
        setIsLoading(true);
        await saveInvoice(data, 'draft');
        setIsLoading(false);
    };

    const onSubmitSend = async (data: InvoiceFormData) => {
        setIsSending(true);
        await saveInvoice(data, 'sent');
        setIsSending(false);
    };

    return (
        <>
            <Header title="Create Invoice" subtitle="Add a new invoice to track payments" />

            <div className="p-6 max-w-4xl mx-auto">
                {/* Back Link */}
                <Link
                    href="/invoices"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Invoices
                </Link>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <Card className="lg:col-span-2">
                        <h2 className="text-xl font-semibold text-dark-900 mb-6">Invoice Details</h2>

                        <form className="space-y-6">
                            {/* Client Info */}
                            <div className="pb-6 border-b border-gray-100">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                                    Client Information
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        {...register('clientName')}
                                        label="Client Name"
                                        placeholder="Enter client name"
                                        error={errors.clientName?.message}
                                        leftIcon={<User className="w-5 h-5" />}
                                    />
                                    <Input
                                        {...register('clientEmail')}
                                        type="email"
                                        label="Client Email"
                                        placeholder="client@example.com"
                                        error={errors.clientEmail?.message}
                                        leftIcon={<Mail className="w-5 h-5" />}
                                    />
                                </div>
                                <div className="mt-4">
                                    <Input
                                        {...register('clientPhone')}
                                        label="Phone Number (Optional)"
                                        placeholder="+234 8XX XXX XXXX"
                                        helper="For SMS/WhatsApp reminders"
                                        leftIcon={<Phone className="w-5 h-5" />}
                                    />
                                </div>
                            </div>

                            {/* Invoice Info */}
                            <div className="pb-6 border-b border-gray-100">
                                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                                    Invoice Information
                                </h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <Input
                                            {...register('amount')}
                                            type="number"
                                            step="0.01"
                                            label="Amount"
                                            placeholder="0.00"
                                            error={errors.amount?.message}
                                            leftIcon={<DollarSign className="w-5 h-5" />}
                                        />
                                    </div>
                                    <Select
                                        {...register('currency')}
                                        label="Currency"
                                        options={[
                                            { value: 'NGN', label: '🇳🇬 NGN - Naira' },
                                            { value: 'USD', label: '🇺🇸 USD - Dollar' },
                                            { value: 'EUR', label: '🇪🇺 EUR - Euro' },
                                            { value: 'GBP', label: '🇬🇧 GBP - Pound' },
                                        ]}
                                    />
                                </div>
                                <div className="mt-4">
                                    <Input
                                        {...register('dueDate')}
                                        type="date"
                                        label="Due Date"
                                        error={errors.dueDate?.message}
                                        leftIcon={<Calendar className="w-5 h-5" />}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <Textarea
                                    {...register('description')}
                                    label="Description (Optional)"
                                    placeholder="Describe the services or products..."
                                    helper="This will be included in the invoice"
                                />
                            </div>
                        </form>
                    </Card>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* PDF Upload */}
                        <Card>
                            <h3 className="text-lg font-semibold text-dark-900 mb-4">Upload Invoice PDF</h3>
                            <UploadPDF onUpload={handlePDFUpload} />
                            {pdfData && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <FileText className="w-4 h-4" />
                                        <span className="text-sm font-medium">PDF attached</span>
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Actions */}
                        <Card>
                            <h3 className="text-lg font-semibold text-dark-900 mb-4">Actions</h3>
                            <div className="space-y-3">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="w-full"
                                    onClick={handleSubmit(onSubmitDraft)}
                                    isLoading={isLoading}
                                    leftIcon={<Save className="w-5 h-5" />}
                                >
                                    Save as Draft
                                </Button>
                                <Button
                                    type="button"
                                    className="w-full"
                                    onClick={handleSubmit(onSubmitSend)}
                                    isLoading={isSending}
                                    leftIcon={<Send className="w-5 h-5" />}
                                >
                                    Create & Send
                                </Button>
                            </div>
                            <p className="mt-4 text-xs text-gray-500">
                                Sending will email the invoice to the client and schedule automatic reminders.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';

const quickInvoiceSchema = z.object({
    clientEmail: z.string().email('Please enter a valid email'),
    amount: z.string().min(1, 'Amount is required'),
    currency: z.enum(['NGN', 'USD', 'EUR', 'GBP']),
    dueDate: z.string().min(1, 'Due date is required'),
});

type QuickInvoiceData = z.infer<typeof quickInvoiceSchema>;

export function QuickInvoice() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<QuickInvoiceData>({
        resolver: zodResolver(quickInvoiceSchema),
        defaultValues: {
            currency: 'NGN',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
    });

    const onSubmit = (data: QuickInvoiceData) => {
        setIsLoading(true);
        // Store in sessionStorage to pick up after signup
        sessionStorage.setItem('pendingInvoice', JSON.stringify(data));
        
        // Redirect to signup
        router.push('/signup?source=quick-invoice');
    };

    return (
        <div className="bg-white rounded-[32px] shadow-2xl shadow-primary-500/10 border border-gray-100 p-8 md:p-10 w-full max-w-xl mx-auto">
            <h3 className="text-2xl font-bold text-dark-900 mb-6 text-center">Create your first invoice</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                    {...register('clientEmail')}
                    type="email"
                    label="Client Email"
                    placeholder="client@example.com"
                    error={errors.clientEmail?.message}
                    leftIcon={<Mail className="w-5 h-5 text-gray-400" />}
                />
                
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        {...register('amount')}
                        type="number"
                        label="Amount"
                        placeholder="0.00"
                        error={errors.amount?.message}
                        leftIcon={<DollarSign className="w-5 h-5 text-gray-400" />}
                    />
                    <Select
                        {...register('currency')}
                        label="Currency"
                        options={[
                            { value: 'NGN', label: '🇳🇬 NGN' },
                            { value: 'USD', label: '🇺🇸 USD' },
                            { value: 'EUR', label: '🇪🇺 EUR' },
                            { value: 'GBP', label: '🇬🇧 GBP' },
                        ]}
                    />
                </div>

                <Input
                    {...register('dueDate')}
                    type="date"
                    label="Due Date"
                    error={errors.dueDate?.message}
                    leftIcon={<Calendar className="w-5 h-5 text-gray-400" />}
                />

                <Button type="submit" className="w-full text-lg py-6 mt-4 group" isLoading={isLoading}>
                    Create & Get Paid
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <p className="text-center text-xs text-gray-400 mt-4">
                    Takes less than 30 seconds. No credit card required.
                </p>
            </form>
        </div>
    );
}

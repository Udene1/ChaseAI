'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle2, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { PricingRegion } from '@/lib/geo';

interface PricingSectionProps {
    detectedRegion: PricingRegion;
    countryName: string;
    showTitle?: boolean;
}

export default function PricingSection({ detectedRegion, countryName, showTitle = true }: PricingSectionProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleCheckout = async (plan: string) => {
        setIsLoading(plan);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push(`/signup?plan=${plan}`);
                return;
            }

            const response = await fetch('/api/paystack/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to create checkout session');

            if (data.data?.authorization_url) {
                window.location.href = data.data.authorization_url;
            } else {
                throw new Error('No authorization URL received');
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Failed to start checkout. Please try again.');
        } finally {
            setIsLoading(null);
        }
    };

    const regions = [
        {
            key: 'nigeria',
            name: 'Nigeria',
            monthly: '₦2,999',
            lifetime: '₦29,999',
            monthlyKey: 'nigeria_monthly',
            lifetimeKey: 'nigeria_lifetime',
            isLocal: true,
            features: [
                'Unlimited invoices',
                'AI Email Chasing',
                'Paystack Integration',
                'Basic Analytics',
                'Email Support'
            ]
        },
        {
            key: 'usa',
            name: 'United States',
            monthly: '$7',
            lifetime: '$199',
            monthlyKey: 'usa_monthly',
            lifetimeKey: 'usa_lifetime',
            isGlobal: true,
            features: [
                'Everything in Local',
                'Priority Support',
                'Global Currencies',
                'AI Historical Context',
                'Early Alpha Features'
            ]
        },
        {
            key: 'intl',
            name: 'International',
            monthly: '$5',
            lifetime: '$149',
            monthlyKey: 'intl_monthly',
            lifetimeKey: 'intl_lifetime',
            isPPP: true,
            features: [
                'Everything in Global',
                'PPP Adjusted Rate',
                'Regional Support',
                'Custom AI Tone',
                'Team Collaboration'
            ]
        }
    ];

    const displayRegion = regions.find(r => r.key === detectedRegion) || regions[2];

    return (
        <section id="pricing" className="py-20 px-6">
            <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold mb-6 border border-primary-100">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                    </span>
                    Detected Location: {countryName}
                </div>

                {showTitle && (
                    <>
                        <h2 className="text-4xl md:text-5xl font-bold text-dark-900 mb-4 text-balance">
                            Fair Regional Pricing
                        </h2>
                        <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
                            We use Purchasing Power Parity to ensure ChaseAI is accessible to businesses everywhere.
                        </p>
                    </>
                )}

                <div className="max-w-md mx-auto">
                    <div className={`bg-white rounded-3xl border-2 p-8 transition-all flex flex-col border-primary-500 shadow-2xl relative`}>
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-500 text-white text-xs font-bold rounded-full uppercase tracking-widest shadow-lg">
                            Recommended for you
                        </div>

                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-dark-900">{displayRegion.name}</h3>
                            {displayRegion.isPPP && <p className="text-xs text-primary-600 font-bold mt-1 uppercase tracking-wider">PPP Adjusted</p>}
                        </div>

                        <div className="space-y-6 flex-grow">
                            {/* Monthly Option */}
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 text-left">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500">Monthly Plan</p>
                                        <p className="text-3xl font-black text-dark-900">{displayRegion.monthly}</p>
                                        {!displayRegion.isLocal && (
                                            <p className="text-[10px] text-gray-400 mt-1 max-w-[150px] leading-tight font-medium">
                                                * Processed in NGN. Bank handles conversion automatically.
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => handleCheckout(displayRegion.monthlyKey)}
                                        isLoading={isLoading === displayRegion.monthlyKey}
                                        size="sm"
                                        variant="primary"
                                    >
                                        Start Trial
                                    </Button>
                                </div>
                            </div>

                            {/* Lifetime Option */}
                            <div className="p-4 rounded-2xl bg-dark-900 text-white relative overflow-hidden group text-left">
                                <div className="absolute top-0 right-0 p-2">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lifetime Access</p>
                                        <p className="text-3xl font-black text-white">{displayRegion.lifetime}</p>
                                        {!displayRegion.isLocal && (
                                            <p className="text-[10px] text-gray-400 mt-1 max-w-[150px] leading-tight font-medium">
                                                * One-time in NGN. Bank converts automatically.
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleCheckout(displayRegion.lifetimeKey)}
                                        disabled={!!isLoading}
                                        className="bg-white text-dark-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-50 min-w-[100px] flex items-center justify-center"
                                    >
                                        {isLoading === displayRegion.lifetimeKey ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Forever'}
                                    </button>
                                </div>
                            </div>

                            <ul className="mt-8 space-y-4 text-sm text-left">
                                {displayRegion.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-primary-500" />
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <p className="mt-8 text-sm text-gray-500">
                        🔒 Secure payment via Paystack • 💳 All cards accepted
                    </p>
                </div>
            </div>
        </section>
    );
}

'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Zap, CheckCircle2, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

function PricingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedPlan = searchParams.get('plan');
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
            name: 'Intl (Eur/Asia/Africa)',
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

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">ChaseAI</span>
                    </Link>
                    <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-dark-900">
                            Transparent Regional Pricing
                        </h1>
                        <p className="mt-4 text-xl text-gray-600">
                            Fair access for businesses worldwide with Purchasing Power Parity.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {regions.map((region) => (
                            <div key={region.name} className={`bg-white rounded-3xl border-2 p-8 transition-all flex flex-col ${region.isGlobal ? 'border-primary-500 shadow-2xl scale-105 z-10' : 'border-gray-100 hover:border-gray-200 shadow-sm'}`}>
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-dark-900">{region.name}</h3>
                                    {region.isPPP && <p className="text-xs text-primary-600 font-bold mt-1 uppercase tracking-wider">PPP Adjusted</p>}
                                </div>

                                <div className="space-y-6 flex-grow">
                                    {/* Monthly Option */}
                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="flex justify-between items-center mb-4">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-500">Monthly</p>
                                                <p className="text-3xl font-black text-dark-900">{region.monthly}</p>
                                            </div>
                                            <Button
                                                onClick={() => handleCheckout(region.monthlyKey)}
                                                isLoading={isLoading === region.monthlyKey}
                                                size="sm"
                                                variant={region.isGlobal ? 'primary' : 'secondary'}
                                            >
                                                Subscribe
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Lifetime Option */}
                                    <div className="p-4 rounded-2xl bg-dark-900 text-white relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-2">
                                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lifetime</p>
                                                <p className="text-3xl font-black text-white">{region.lifetime}</p>
                                            </div>
                                            <button
                                                onClick={() => handleCheckout(region.lifetimeKey)}
                                                disabled={!!isLoading}
                                                className="bg-white text-dark-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors disabled:opacity-50"
                                            >
                                                {isLoading === region.lifetimeKey ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Get Forever'}
                                            </button>
                                        </div>
                                    </div>

                                    <ul className="mt-8 space-y-4 text-sm">
                                        {region.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${region.isGlobal ? 'text-primary-500' : 'text-gray-400'}`} />
                                                <span className="text-gray-700 font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-gray-500">
                            🔒 Secure payment via Paystack • 💳 All Nigerian cards accepted • 🇳🇬 Proudly built for Nigeria
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function PricingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        }>
            <PricingContent />
        </Suspense>
    );
}

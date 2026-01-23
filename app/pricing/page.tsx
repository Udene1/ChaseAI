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
    const [isLoadingMonthly, setIsLoadingMonthly] = useState(false);
    const [isLoadingEarlyBird, setIsLoadingEarlyBird] = useState(false);
    const [isLoadingLifetime, setIsLoadingLifetime] = useState(false);

    const handleCheckout = async (plan: 'monthly' | 'early-bird' | 'lifetime') => {
        let setLoading;
        if (plan === 'monthly') setLoading = setIsLoadingMonthly;
        else if (plan === 'early-bird') setLoading = setIsLoadingEarlyBird;
        else setLoading = setIsLoadingLifetime;

        setLoading(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push(`/signup?plan=${plan}`);
                return;
            }

            // Create Paystack checkout session
            const response = await fetch('/api/paystack/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Redirect to Paystack Authorization URL
            if (data.data?.authorization_url) {
                window.location.href = data.data.authorization_url;
            } else {
                throw new Error('No authorization URL received');
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            toast.error(error.message || 'Failed to start checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

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
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-dark-900">
                            Choose Your Plan
                        </h1>
                        <p className="mt-4 text-xl text-gray-600">
                            Simple, local pricing for Nigerian businesses.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Monthly Plan */}
                        <div className={`bg-white rounded-2xl border-2 p-8 transition-all flex flex-col ${preselectedPlan === 'monthly' ? 'border-primary-500 shadow-xl' : 'border-gray-200 hover:shadow-xl hover:border-gray-300'}`}>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-dark-900">Monthly</h3>
                                <p className="mt-2 text-gray-500">7-day free trial</p>
                                <div className="mt-6">
                                    <span className="text-4xl font-bold text-dark-900">₦2,999</span>
                                    <span className="text-gray-500">/month</span>
                                </div>
                            </div>
                            <ul className="mt-8 space-y-4 flex-grow">
                                {[
                                    'Unlimited invoices',
                                    'Email & SMS reminders',
                                    'AI personalization',
                                    'Basic reports',
                                    'Email support',
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className="mt-8 w-full"
                                variant="secondary"
                                size="lg"
                                onClick={() => handleCheckout('monthly')}
                                isLoading={isLoadingMonthly}
                            >
                                {isLoadingMonthly ? 'Processing...' : 'Start 7-Day Trial'}
                            </Button>
                        </div>

                        {/* Early Bird Special */}
                        <div className={`bg-white rounded-2xl border-2 p-8 transition-all relative flex flex-col ${preselectedPlan === 'early-bird' || !preselectedPlan ? 'border-primary-500 shadow-xl scale-105 z-10' : 'border-gray-200 hover:shadow-xl hover:border-gray-300'}`}>
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-500 text-white text-xs font-bold px-4 py-1.5 rounded-full border-4 border-white whitespace-nowrap">
                                LIMITED: FIRST 20 USERS
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-dark-900">Early Bird</h3>
                                <p className="mt-2 text-primary-600 font-medium">₦1,999 FOREVER</p>
                                <div className="mt-6 flex items-baseline justify-center gap-2">
                                    <span className="text-4xl font-bold text-dark-900">₦1,999</span>
                                    <span className="text-gray-500">/month</span>
                                </div>
                            </div>
                            <ul className="mt-8 space-y-4 flex-grow">
                                {[
                                    'Everything in Monthly',
                                    'WhatsApp reminders',
                                    'Founding member badge',
                                    'Priority support',
                                    'Price locked for life',
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className="mt-8 w-full"
                                variant="primary"
                                size="lg"
                                onClick={() => handleCheckout('early-bird')}
                                isLoading={isLoadingEarlyBird}
                            >
                                {isLoadingEarlyBird ? 'Processing...' : 'Claim Early Bird Spot'}
                            </Button>
                        </div>

                        {/* Lifetime Deal */}
                        <div className={`bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col ${preselectedPlan === 'lifetime' ? 'ring-4 ring-yellow-400' : ''}`}>
                            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                BEST VALUE
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold">Lifetime Access</h3>
                                <p className="mt-2 text-primary-100">Pay once, use forever</p>
                                <div className="mt-6">
                                    <span className="text-4xl font-bold text-white">₦29,999</span>
                                    <span className="text-primary-200 line-through ml-2">₦150k</span>
                                </div>
                            </div>
                            <ul className="mt-8 space-y-4 flex-grow">
                                {[
                                    'Everything PLUS:',
                                    'All future updates',
                                    'Custom domain support',
                                    'Unlimited team members',
                                    'Premium support',
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary-300 flex-shrink-0" />
                                        <span className="text-primary-50">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handleCheckout('lifetime')}
                                disabled={isLoadingLifetime}
                                className="mt-8 bg-white text-primary-600 font-bold py-4 rounded-xl w-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {isLoadingLifetime ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Get Lifetime Deal'
                                )}
                            </button>
                        </div>
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

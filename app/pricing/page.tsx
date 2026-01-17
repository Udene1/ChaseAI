'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'sonner';
import { Zap, CheckCircle2, Star, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PricingPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedPlan = searchParams.get('plan');
    const [isLoadingMonthly, setIsLoadingMonthly] = useState(false);
    const [isLoadingLifetime, setIsLoadingLifetime] = useState(false);

    const handleCheckout = async (plan: 'monthly' | 'lifetime') => {
        const setLoading = plan === 'monthly' ? setIsLoadingMonthly : setIsLoadingLifetime;
        setLoading(true);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push(`/signup?plan=${plan}`);
                return;
            }

            // Create checkout session
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { sessionId, url } = await response.json();

            // Redirect to Stripe Checkout
            if (url) {
                window.location.href = url;
            } else {
                const stripe = await stripePromise;
                if (stripe) {
                    const { error } = await stripe.redirectToCheckout({ sessionId });
                    if (error) {
                        throw error;
                    }
                }
            }
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to start checkout. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
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

            {/* Pricing Content */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-dark-900">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="mt-4 text-xl text-gray-600">
                            Choose the plan that works for you. No hidden fees, no surprises.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Monthly Plan */}
                        <div className={`bg-white rounded-2xl border-2 p-8 transition-all ${preselectedPlan === 'monthly' ? 'border-primary-500 shadow-xl' : 'border-gray-200 hover:shadow-xl hover:border-gray-300'
                            }`}>
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-dark-900">Monthly</h3>
                                <p className="mt-2 text-gray-500">Perfect for getting started</p>
                                <div className="mt-6">
                                    <span className="text-5xl font-bold text-dark-900">$19</span>
                                    <span className="text-gray-500">/month</span>
                                </div>
                            </div>

                            <ul className="mt-8 space-y-4">
                                {[
                                    'Unlimited invoices',
                                    'Email & SMS reminders',
                                    'AI personalization',
                                    'Basic reports',
                                    'Email support',
                                    'NGN & USD currencies',
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
                                {isLoadingMonthly ? 'Processing...' : 'Start Monthly Plan'}
                            </Button>

                            <p className="mt-4 text-center text-sm text-gray-500">
                                Cancel anytime. No questions asked.
                            </p>
                        </div>

                        {/* Lifetime Deal */}
                        <div className={`bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl ${preselectedPlan === 'lifetime' ? 'ring-4 ring-yellow-400' : ''
                            }`}>
                            <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3" />
                                BEST VALUE
                            </div>

                            <div className="text-center">
                                <h3 className="text-2xl font-bold">Lifetime Deal</h3>
                                <p className="mt-2 text-primary-100">Pay once, use forever</p>
                                <div className="mt-6">
                                    <span className="text-5xl font-bold">$199</span>
                                    <span className="text-primary-200 line-through ml-2">$599</span>
                                </div>
                                <p className="mt-2 text-sm text-primary-200">Limited time offer - Save 67%</p>
                            </div>

                            <ul className="mt-8 space-y-4">
                                {[
                                    'Everything in Monthly',
                                    'WhatsApp reminders',
                                    'Advanced AI insights',
                                    'Priority support',
                                    'All future updates',
                                    'Unlimited team members',
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary-200 flex-shrink-0" />
                                        <span className="text-white">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleCheckout('lifetime')}
                                disabled={isLoadingLifetime}
                                className="mt-8 bg-white text-primary-600 font-semibold py-4 rounded-xl w-full flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {isLoadingLifetime ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Get Lifetime Access'
                                )}
                            </button>

                            <p className="mt-4 text-center text-sm text-primary-200">
                                One-time payment. No recurring fees.
                            </p>
                        </div>
                    </div>

                    {/* FAQ or Trust Badges */}
                    <div className="mt-16 text-center">
                        <p className="text-gray-500">
                            🔒 Secure payment via Stripe • 💳 All major cards accepted • 🌍 Available worldwide
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}

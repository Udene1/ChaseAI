import Link from 'next/link';
import Image from 'next/image';
import {
    Zap,
    Mail,
    MessageSquare,
    Brain,
    BarChart3,
    Shield,
    ArrowRight,
    CheckCircle2,
    Star,
} from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/10 overflow-hidden relative border border-gray-100">
                            <Image
                                src="/logo.png"
                                alt="ChaseAI Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-xl font-bold gradient-text">ChaseAI</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8">
                        <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Features
                        </a>
                        <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Pricing
                        </a>
                        <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/signup" className="btn-primary">
                            Get Started Free
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6 animate-fade-in">
                            <Zap className="w-4 h-4" />
                            AI-Powered Payment Reminders
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-dark-900 leading-tight animate-in stagger-1">
                            Stop Chasing
                            <span className="gradient-text"> Invoices.</span>
                            <br />
                            Let AI Do It.
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto animate-in stagger-2">
                            Automate late payment reminders with intelligent, personalized messages that get you
                            paid faster. Perfect for freelancers and small businesses in Nigeria and worldwide.
                        </p>
                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in stagger-3">
                            <Link href="/signup" className="btn-primary text-lg px-8 py-4">
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                            <Link href="#pricing" className="btn-secondary text-lg px-8 py-4">
                                View Pricing
                            </Link>
                        </div>
                        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 animate-in stagger-4">
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                                14-day free trial
                            </span>
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                                No credit card required
                            </span>
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-primary-500" />
                                NGN & USD support
                            </span>
                        </div>
                    </div>

                    {/* Hero Image/Demo */}
                    <div className="mt-16 relative">
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent z-10 pointer-events-none h-20 bottom-0 top-auto" />
                        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden mx-auto max-w-5xl">
                            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="p-8 bg-gradient-to-br from-gray-50 to-white min-h-[400px] flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-primary-500/10 overflow-hidden relative border border-gray-100">
                                        <Image
                                            src="/logo.png"
                                            alt="ChaseAI Logo"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <p className="mt-4 text-gray-500">Dashboard Preview Coming Soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-dark-900">
                            Everything You Need to Get Paid Faster
                        </h2>
                        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed specifically for freelancers and small businesses.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Brain,
                                title: 'AI-Powered Personalization',
                                description:
                                    'Smart messages that adapt to each client\'s payment history and behavior patterns.',
                            },
                            {
                                icon: Mail,
                                title: 'Multi-Channel Reminders',
                                description:
                                    'Reach clients via Email, SMS, or WhatsApp with escalating urgency levels.',
                            },
                            {
                                icon: Zap,
                                title: 'Automated Scheduling',
                                description:
                                    'Set it and forget it. Reminders go out automatically based on your schedule.',
                            },
                            {
                                icon: BarChart3,
                                title: 'Insightful Reports',
                                description:
                                    'Track payment trends and get AI-powered insights to improve cash flow.',
                            },
                            {
                                icon: Shield,
                                title: 'Secure & Private',
                                description:
                                    'Bank-grade security. Your data is encrypted and never shared.',
                            },
                            {
                                icon: MessageSquare,
                                title: 'WhatsApp Support',
                                description:
                                    'Perfect for Nigerian businesses—reach clients on their preferred platform.',
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-dark-900">{feature.title}</h3>
                                <p className="mt-3 text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-dark-900">Simple, Transparent Pricing</h2>
                        <p className="mt-4 text-xl text-gray-600">
                            Choose the plan that works for you. No hidden fees.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Monthly Plan */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl transition-shadow">
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
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/signup?plan=monthly"
                                className="mt-8 btn-secondary w-full flex items-center justify-center"
                            >
                                Start Monthly Plan
                            </Link>
                        </div>

                        {/* Lifetime Deal */}
                        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl shadow-primary-500/25">
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
                            </div>
                            <ul className="mt-8 space-y-4">
                                {[
                                    'Everything in Monthly',
                                    'WhatsApp reminders',
                                    'Advanced AI insights',
                                    'Priority support',
                                    'All future updates',
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary-200 flex-shrink-0" />
                                        <span className="text-white">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/signup?plan=lifetime"
                                className="mt-8 bg-white text-primary-600 font-semibold py-3 rounded-xl w-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                            >
                                Get Lifetime Access
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-dark-900">Ready to Get Paid Faster?</h2>
                    <p className="mt-4 text-xl text-gray-600">
                        Join thousands of freelancers who are saving time and getting paid on time.
                    </p>
                    <Link href="/signup" className="mt-8 btn-primary inline-flex text-lg px-8 py-4">
                        Start Your Free Trial
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 bg-dark-900 text-gray-400">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden relative">
                            <Image
                                src="/logo.png"
                                alt="ChaseAI Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-lg font-bold text-white">ChaseAI</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                        <a href="#" className="hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Contact
                        </a>
                    </div>
                    <p className="text-sm">© 2024 ChaseAI. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

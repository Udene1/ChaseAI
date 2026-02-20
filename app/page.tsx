import Link from 'next/link';
import Image from 'next/image';
import { headers } from 'next/headers';
import { Mail, CheckCircle2 } from 'lucide-react';
import { QuickInvoice } from '@/components/invoice/quick-invoice';
import PricingSection from '@/components/pricing/PricingSection';
import { getRegionByCountry } from '@/lib/geo';

export default function LandingPage() {
    const countryCode = headers().get('x-vercel-ip-country') || 'US';
    const region = getRegionByCountry(countryCode);

    return (
        <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-900 flex flex-col">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Image
                            src="/logo.png"
                            alt="ChaseAI Logo"
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-lg shadow-lg shadow-primary-500/10"
                        />
                        <span className="text-xl font-bold text-dark-900">ChaseAI</span>
                    </Link>
                    <nav className="flex items-center gap-6 font-medium text-sm">
                        <Link href="#pricing" className="text-gray-500 hover:text-primary-600 transition-colors">
                            Pricing
                        </Link>
                        <Link href="/login" className="text-gray-500 hover:text-primary-600 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/signup" className="btn-primary text-xs px-4 py-2">
                            Get Started
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-grow pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-br from-primary-50 to-transparent -z-10 rounded-b-[4rem] opacity-50" />

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Column: Copy */}
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold mb-6 border border-primary-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            Now supporting USD & NGN
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-dark-900 tracking-tight leading-[1.1] mb-6 text-balance">
                            Get your first invoice <span className="text-primary-600">paid today.</span>
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                            Create professional invoices in seconds. ChaseAI automatically follows up with clients so you don&apos;t have to.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-gray-400 font-medium">
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                No credit card required
                            </span>
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                Free forever plan
                            </span>
                        </div>

                        <div className="mt-12 hidden lg:flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mr-2">Trusted by</p>
                            {['Lagos Tech', 'Abuja Creative', 'Rivers Global'].map((brand, i) => (
                                <span key={i} className="text-sm font-bold text-gray-400">{brand}</span>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Quick Invoice Form */}
                    <div className="relative">
                        <div className="absolute top-10 -right-10 w-72 h-72 bg-yellow-200 rounded-full blur-[120px] opacity-20 -z-10" />
                        <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-primary-200 rounded-full blur-[120px] opacity-20 -z-10" />

                        <QuickInvoice />
                    </div>
                </div>
            </main>

            {/* Pricing Section */}
            <PricingSection
                detectedRegion={region}
            />

            {/* Simple Footer */}
            <footer className="py-8 px-6 border-t border-gray-50">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">
                        © 2024 ChaseAI. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
                        <Link href="/privacy" className="hover:text-primary-600">Privacy</Link>
                        <Link href="/terms" className="hover:text-primary-600">Terms</Link>
                        <a href="mailto:support@verimut.icu" className="hover:text-primary-600">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

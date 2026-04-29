'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, CheckCircle2, ArrowRight, Zap, Shield, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { QuickInvoice } from '@/components/invoice/quick-invoice';
import { AILogicDemo } from '@/components/landing/ai-logic-demo';
import PricingSection from '@/components/pricing/PricingSection';
import { getRegionByCountry } from '@/lib/geo';

export default function LandingPage() {
    // In a real app we'd get this from headers, but for the client component we'll default
    const region = 'NG'; 

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: any = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-premium-mesh selection:bg-primary-100 selection:text-primary-900 flex flex-col font-sans">
            {/* Header */}
            <motion.header 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20"
            >
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                            <Image
                                src="/logo.png"
                                alt="ChaseAI Logo"
                                width={36}
                                height={36}
                                className="relative w-9 h-9 rounded-xl shadow-sm"
                            />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-dark-900">Chase<span className="text-primary-600">AI</span></span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 font-semibold text-sm">
                        <Link href="#features" className="text-dark-500 hover:text-primary-600 transition-colors">Features</Link>
                        <Link href="#pricing" className="text-dark-500 hover:text-primary-600 transition-colors">Pricing</Link>
                        <div className="h-4 w-px bg-gray-200" />
                        <Link href="/login" className="text-dark-500 hover:text-primary-600 transition-colors">Sign In</Link>
                        <Link href="/signup" className="px-5 py-2.5 bg-dark-900 text-white rounded-xl hover:bg-dark-800 transition-all shadow-lg shadow-dark-900/10 active:scale-95">
                            Get Started
                        </Link>
                    </nav>
                </div>
            </motion.header>

            {/* Hero Section */}
            <main className="flex-grow pt-40 pb-24 px-6 relative">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Copy */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center lg:text-left"
                    >
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/50 backdrop-blur-md text-primary-700 rounded-full text-xs font-bold mb-8 border border-primary-100 shadow-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                            </span>
                            Smart Invoicing for Global Teams
                        </motion.div>
                        
                        <motion.h1 variants={itemVariants} className="text-6xl lg:text-8xl font-black text-dark-900 tracking-tighter leading-[0.95] mb-8 text-balance">
                            Invoices that <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">chase themselves.</span>
                        </motion.h1>
                        
                        <motion.p variants={itemVariants} className="text-xl text-dark-500 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 font-medium">
                            ChaseAI combines predictive ML with human-like LLMs to get your invoices paid 3x faster. No awkward follow-ups required.
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/25 flex items-center justify-center gap-2 group">
                                Start Chasing Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <div className="flex flex-col gap-1 px-4 text-left border-l border-gray-200 ml-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                                            <div className={`w-full h-full bg-gradient-to-br from-gray-200 to-gray-300`} />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Joined by 2k+ freelancers</p>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 gap-6 opacity-40 grayscale pointer-events-none">
                            {['Lagos Tech', 'Rivers Global', 'Abuja Creative'].map((brand, i) => (
                                <span key={i} className="text-sm font-black text-dark-900 tracking-widest uppercase">{brand}</span>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Column: Quick Invoice Preview */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="relative perspective-1000"
                    >
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-300 rounded-full blur-[120px] opacity-20 -z-10 animate-pulse-soft" />
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-300 rounded-full blur-[120px] opacity-20 -z-10" />

                        <div className="relative premium-glass p-1 rounded-[2.5rem] shadow-2xl">
                            <QuickInvoice />
                        </div>
                        
                        {/* Floating Metric Card */}
                        <motion.div 
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            className="absolute -right-8 bottom-12 glass-card p-4 rounded-2xl shadow-xl hidden md:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Avg. Pay Time</p>
                                    <p className="text-xl font-black text-dark-900">-4.2 Days</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </main>

            {/* AI Logic Demo Section */}
            <section className="bg-gray-50/50 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                <AILogicDemo />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            </section>

            {/* Features Brief */}
            <section id="features" className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            { icon: Shield, title: "Privacy First", desc: "Data is hashed before any AI processing. Your client names stay your secret." },
                            { icon: BarChart3, title: "Predictive ML", desc: "Our models predict which clients will be late before it even happens." },
                            { icon: Zap, title: "Hybrid LLM", desc: "Combines strict ML signals with empathetic LLM generation for perfect tone." }
                        ].map((f, i) => (
                            <div key={i} className="group">
                                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                    <f.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-dark-900 mb-3">{f.title}</h3>
                                <p className="text-gray-500 leading-relaxed font-medium">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <PricingSection detectedRegion={region} />

            {/* Simple Footer */}
            <footer className="py-12 px-6 border-t border-gray-100 bg-gray-50/30">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Logo" width={24} height={24} className="opacity-50" />
                        <span className="text-sm font-bold text-gray-400">ChaseAI</span>
                    </div>
                    <div className="flex items-center gap-10 text-xs text-gray-500 font-bold uppercase tracking-widest">
                        <Link href="/privacy" className="hover:text-primary-600 transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-primary-600 transition-colors">Terms</Link>
                        <a href="mailto:support@verimut.icu" className="hover:text-primary-600 transition-colors">Support</a>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                        © 2024 ChaseAI. Optimized for the modern economy.
                    </p>
                </div>
            </footer>
        </div>
    );
}

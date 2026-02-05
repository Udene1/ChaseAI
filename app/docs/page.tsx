'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    Book,
    Code2,
    Shield,
    Zap,
    Terminal,
    Key,
    Copy,
    HelpCircle,
    ArrowRight,
    MessageSquare,
    BrainCircuit,
    Lock,
    Globe
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function DocumentationPage() {
    const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python'>('curl');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Snippet copied to clipboard!');
    };

    const codeSamples = {
        curl: `curl -X POST https://chase-ai.vercel.app/api/v1/external/invoices \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_name": "Senior Man Ltd",
    "client_email": "client@example.com",
    "amount": 150000,
    "currency": "NGN",
    "due_date": "2026-02-15",
    "description": "Premium Branding Services"
  }'`,
        js: `const response = await fetch('https://chase-ai.vercel.app/api/v1/external/invoices', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    client_name: "Senior Man Ltd",
    client_email: "client@example.com",
    amount: 150000,
    currency: "NGN",
    due_date: "2026-02-15",
    description: "Premium Branding Services"
  })
});

const data = await response.json();
console.log(data);`,
        python: `import requests

url = "https://chase-ai.vercel.app/api/v1/external/invoices"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "client_name": "Senior Man Ltd",
    "client_email": "client@example.com",
    "amount": 150000,
    "currency": "NGN",
    "due_date": "2026-02-15",
    "description": "Premium Branding Services"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans selection:bg-primary-100 selection:text-primary-900">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 py-6 sticky top-0 z-50 backdrop-blur-md bg-white/80">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/10 overflow-hidden relative border border-gray-100 group-hover:scale-105 transition-transform">
                            <Image
                                src="/logo.png"
                                alt="ChaseAI Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <span className="text-2xl font-black text-dark-900 tracking-tighter">ChaseAI <span className="text-primary-600">Docs</span></span>
                    </Link>
                    <Link href="/signup" className="hidden md:flex btn-primary text-sm px-6 py-2.5">
                        Get Started Free
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Sidebar Navigation */}
                <aside className="lg:col-span-3 space-y-8 hidden lg:block">
                    <nav className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Getting Started</h4>
                        <a href="#welcome" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-dark-900 hover:bg-white rounded-xl transition-all">
                            <Book className="w-4 h-4 text-primary-500" /> Welcome to ChaseAI
                        </a>
                        <a href="#features" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-500 hover:text-dark-900 hover:bg-white rounded-xl transition-all">
                            <Zap className="w-4 h-4" /> Core Features
                        </a>
                        <a href="#smart-chasing" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-500 hover:text-dark-900 hover:bg-white rounded-xl transition-all">
                            <BrainCircuit className="w-4 h-4" /> Smart Chasing AI
                        </a>
                        <a href="#security" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-500 hover:text-dark-900 hover:bg-white rounded-xl transition-all">
                            <Shield className="w-4 h-4" /> Security & Privacy
                        </a>
                    </nav>

                    <nav className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Developers</h4>
                        <a href="#api-connect" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-400 hover:text-dark-900 hover:bg-white rounded-xl transition-all">
                            <Terminal className="w-4 h-4" /> API Connect
                        </a>
                        <a href="#authentication" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-400 hover:text-dark-900 hover:bg-white rounded-xl transition-all ml-4">
                            Authentication
                        </a>
                        <a href="#endpoints" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-400 hover:text-dark-900 hover:bg-white rounded-xl transition-all ml-4">
                            Endpoints
                        </a>
                    </nav>

                    <nav className="space-y-1">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Support</h4>
                        <a href="#faq" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-400 hover:text-dark-900 hover:bg-white rounded-xl transition-all">
                            <HelpCircle className="w-4 h-4" /> FAQ
                        </a>
                        <a href="mailto:support@verimut.icu" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-gray-400 hover:text-dark-900 hover:bg-white rounded-xl transition-all">
                            <MessageSquare className="w-4 h-4" /> Contact Support
                        </a>
                    </nav>
                </aside>

                {/* Content */}
                <div className="lg:col-span-9 space-y-24">
                    {/* Welcome Section */}
                    <section id="welcome" className="scroll-mt-32">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-xs font-bold mb-6">
                            <Globe className="w-3 h-3" />
                            Global Accounts Receivable
                        </div>
                        <h1 className="text-5xl font-black text-dark-900 tracking-tight leading-tight mb-8">
                            Everything you need to <span className="text-primary-600">recover payments</span> faster.
                        </h1>
                        <p className="text-xl text-gray-500 leading-relaxed font-medium mb-12">
                            ChaseAI is an intelligent automation platform designed for freelancers and businesses
                            who are tired of chasing late payments manually. We combine behavioral psychology
                            with Large Language Models (LLMs) to ensure your invoices are paid on time.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold text-dark-900 mb-3">Reduce Support Load</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">90% of your billing questions are already answered here. We provide your clients with a transparent and professional payment experience.</p>
                            </div>
                            <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-bold text-dark-900 mb-3">Instant Integration</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-medium">Use our REST API or CSV imports to connect ChaseAI with your existing stack in minutes.</p>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section id="features" className="scroll-mt-32 space-y-8">
                        <h2 className="text-3xl font-black text-dark-900">Core Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Automated Workflows", desc: "Set it and forget it. Reminders trigger based on due dates.", icon: Zap },
                                { title: "Human-Like AI", desc: "No boring templates. Reminders feel personal and professional.", icon: MessageSquare },
                                { title: "Paystack/Stripe", desc: "Native integration for instant global settlements.", icon: Lock }
                            ].map((feature, i) => (
                                <div key={i} className="space-y-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-dark-900">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-lg font-bold text-dark-900">{feature.title}</h4>
                                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Smart Chasing Section */}
                    <section id="smart-chasing" className="scroll-mt-32 p-12 bg-dark-900 rounded-[48px] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-[100px] opacity-20 -z-0" />
                        <div className="relative z-10 space-y-6">
                            <h2 className="text-3xl font-black">Smart Chasing AI 🧠</h2>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl font-medium">
                                How it works: Our hybrid AI system combines the linguistic power of **Groq/OpenAI**
                                with a custom **behavioral ML model**.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                                <div className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                                    <h4 className="font-bold text-primary-400">Phase 1: Analysis</h4>
                                    <p className="text-sm text-gray-400">We analyze client risk scores and optimal delivery times based on historical outcomes.</p>
                                </div>
                                <div className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                                    <h4 className="font-bold text-primary-400">Phase 2: Generation</h4>
                                    <p className="text-sm text-gray-400">Signals are injected into an LLM prompt to generate a tone-perfect reminder.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Security & Privacy Section */}
                    <section id="security" className="scroll-mt-32 space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-black text-dark-900">Security & Privacy Architecture</h2>
                        </div>

                        <div className="prose prose-slate max-w-none text-gray-500 font-medium leading-relaxed">
                            <p className="text-lg">
                                Trust is our most important feature. We have designed ChaseAI from the ground up to ensure that your sensitive client data never leaves your control in a readable format.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                                <div className="space-y-4">
                                    <h4 className="text-dark-900 font-bold flex items-center gap-2">
                                        <Lock className="w-4 h-4 text-primary-500" /> Data Anonymization (Hashing)
                                    </h4>
                                    <p className="text-sm">
                                        Before your invoice data is sent to our Machine Learning models, we perform a <strong>one-way SHA-256 hash</strong> on sensitive identifiers like Client IDs. This process turns a readable ID into a random string of characters that cannot be reversed.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-dark-900 font-bold flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-primary-500" /> The &quot;Secret Salt&quot;
                                    </h4>
                                    <p className="text-sm">
                                        To prevent &quot;rainbow table&quot; attacks, we combine your Client IDs with a unique <strong>Environment Salt</strong> kept securely in your private server. This ensures that even if two different businesses have the same client, their hashes will be completely different.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-12 p-8 bg-primary-50 border border-primary-100 rounded-[32px]">
                                <h4 className="text-primary-900 font-bold mb-4 flex items-center gap-2">
                                    <Globe className="w-5 h-5" /> Global Compliance
                                </h4>
                                <p className="text-sm text-primary-800">
                                    Our architecture is designed to exceed the requirements of <strong>Nigeria&apos;s NDPA</strong>, <strong>Europe&apos;s GDPR</strong>, and <strong>California&apos;s CCPA</strong>. By never storing PII (Personally Identifiable Information) in our prediction engine, we eliminate the primary risk associated with AI data processing.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Developer Documentation - API Connect */}
                    <section id="api-connect" className="scroll-mt-32 space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black text-dark-900 flex items-center gap-3">
                                <Code2 className="w-8 h-8 text-primary-600" /> API Connect
                            </h2>
                            <p className="text-gray-500 font-medium">Build powerful integrations. Automate your invoicing workflow programmatically.</p>
                        </div>

                        {/* Authentication */}
                        <div id="authentication" className="scroll-mt-32 p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                            <h3 className="text-xl font-bold text-dark-900 flex items-center gap-2">
                                <Key className="w-5 h-5 text-primary-500" /> Authentication
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                ChaseAI Connect uses **Bearer Token Authentication**. Include your API key in the `Authorization` header of every request.
                            </p>
                            <div className="p-5 bg-gray-50 rounded-2xl font-mono text-xs border border-gray-100 flex items-center justify-between group">
                                <span className="text-gray-500">Authorization: Bearer <span className="text-dark-900 font-bold tracking-widest uppercase">YOUR_API_KEY</span></span>
                                <button onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY')} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-lg transition-all text-gray-400">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Endpoints */}
                        <div id="endpoints" className="scroll-mt-32 space-y-8">
                            <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded uppercase tracking-wider">POST</span>
                                            <code className="text-sm font-bold text-dark-900">/api/v1/external/invoices</code>
                                        </div>
                                        <h3 className="text-xl font-bold text-dark-900">Create External Invoice</h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {(['curl', 'js', 'python'] as const).map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === tab
                                                    ? 'bg-dark-900 text-white shadow-lg'
                                                    : 'text-gray-400 hover:text-dark-900 hover:bg-gray-50'}`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-dark-900 rounded-[24px] p-6 relative group border border-white/5">
                                    <pre className="text-[11px] font-mono text-gray-300 leading-relaxed overflow-x-auto whitespace-pre">
                                        {codeSamples[activeTab]}
                                    </pre>
                                    <button
                                        onClick={() => copyToClipboard(codeSamples[activeTab])}
                                        className="absolute top-4 right-4 p-2.5 bg-white/10 hover:bg-primary-500 hover:text-white rounded-xl text-white/50 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="overflow-x-auto rounded-3xl border border-gray-100">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                                            <tr>
                                                <th className="px-6 py-4">Field</th>
                                                <th className="px-6 py-4">Type</th>
                                                <th className="px-6 py-4">Required</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-sm font-medium">
                                            {[
                                                { k: "client_email", t: "string", r: "Yes" },
                                                { k: "amount", t: "number", r: "Yes" },
                                                { k: "due_date", t: "YYYY-MM-DD", r: "Yes" },
                                                { k: "client_name", t: "string", r: "No" },
                                                { k: "currency", t: "NGN | USD", r: "No" }
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-xs text-primary-600 font-bold italic">{row.k}</td>
                                                    <td className="px-6 py-4 text-gray-500 lowercase">{row.t}</td>
                                                    <td className={`px-6 py-4 ${row.r === 'Yes' ? 'text-green-600' : 'text-gray-400'}`}>{row.r}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ Section */}
                    <section id="faq" className="scroll-mt-32 space-y-12 pb-32">
                        <h2 className="text-3xl font-black text-dark-900 text-center">Frequently Asked Questions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { q: "Will the AI offend my clients?", a: "No. We fetch 'Risk Signals' before every generation. If a client has a 100% on-time rate, the AI uses a 'Gentle Partner' tone." },
                                { q: "How secure is my billing data?", a: "Extremely. IDs are hashed using SHA-256 before leaving our core database. No PII is shared with the ML microservice." },
                                { q: "Does this replace my accountant?", a: "No, ChaseAI is a tool for your accountant to recover cash flow faster without making 50 manual phone calls a week." },
                                { q: "Can I use my own API keys?", a: "Yes. In the Settings page, you can provide your own Groq/Gemini/OpenAI API keys for full control." }
                            ].map((item, i) => (
                                <div key={i} className="space-y-3">
                                    <h4 className="font-bold text-dark-900 flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4 text-primary-500" /> {item.q}
                                    </h4>
                                    <p className="text-gray-500 text-sm leading-relaxed font-semibold">{item.a}</p>
                                </div>
                            ))}
                        </div>

                        {/* Final Support CTA */}
                        <div className="p-12 glass-card rounded-[40px] text-center border-primary-100 mt-20">
                            <h3 className="text-2xl font-black text-dark-900 mb-4">Still have questions?</h3>
                            <p className="text-gray-500 font-medium mb-8">Our support team is ready to help you recover your first 1M NGN.</p>
                            <a href="mailto:support@verimut.icu" className="inline-flex items-center gap-2 px-8 py-4 bg-dark-900 text-white rounded-2xl font-bold hover:scale-105 transition-all">
                                <MessageSquare className="w-5 h-5" />
                                support@verimut.icu
                            </a>
                        </div>
                    </section>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm text-gray-400 font-bold">© 2026 ChaseAI. Recoving cash flow globally. 🌍</p>
                    <div className="flex gap-8">
                        <Link href="/privacy" className="text-xs font-bold text-gray-500 hover:text-primary-600">Privacy</Link>
                        <Link href="/terms" className="text-xs font-bold text-gray-500 hover:text-primary-600">Terms</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

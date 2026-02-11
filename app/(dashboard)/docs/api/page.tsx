'use client';

import { Header } from '@/components/layout/header';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Key,
    Code2,
    Terminal,
    Play,
    Copy,
    Check,
    Shield,
    Info,
    AlertCircle,
    Copy as CopyIcon
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function APIDocsPage() {
    const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python'>('curl');

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Snippet copied to clipboard!');
    };

    const codeSamples = {
        curl: {
            create: `curl -X POST https://chase-ai.vercel.app/api/v1/external/invoices \\
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
            list: `curl -X GET "https://chase-ai.vercel.app/api/v1/external/invoices?status=overdue&limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
            signals: `curl -X GET "https://chase-ai.vercel.app/api/v1/external/clients/CLIENT_ID/signals" \\
  -H "Authorization: Bearer YOUR_API_KEY"`
        },
        js: {
            create: `const response = await fetch('https://chase-ai.vercel.app/api/v1/external/invoices', {
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
});`,
            list: `const response = await fetch('https://chase-ai.vercel.app/api/v1/external/invoices?limit=5', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});`,
            signals: `const response = await fetch('https://chase-ai.vercel.app/api/v1/external/clients/ID/signals', {
  headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
});`
        },
        python: {
            create: `import requests

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

response = requests.post(url, json=payload, headers=headers)`,
            list: `response = requests.get(
    "https://chase-ai.vercel.app/api/v1/external/invoices",
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)`,
            signals: `response = requests.get(
    "https://chase-ai.vercel.app/api/v1/external/clients/ID/signals",
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)`
        }
    };

    const [activeMethod, setActiveMethod] = useState<'create' | 'list' | 'signals'>('create');

    return (
        <>
            <Header title="API Documentation" subtitle="Build powerful integrations with ChaseAI Connect" />

            <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-8 pb-20">
                {/* Introduction */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-dark-900">Welcome to ChaseAI Connect</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Our Public API allows you to automate invoice chasing by pushing data directly from your existing billing software,
                        eCommerce platforms, or custom internal tools.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 p-3 bg-primary-50 text-primary-700 rounded-xl text-sm font-medium">
                            <Shield className="w-4 h-4" />
                            Secure REST API
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-700 rounded-xl text-sm font-medium">
                            <Play className="w-4 h-4" />
                            Instant Chasing
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Authentication */}
                        <Card className="border-none shadow-sm bg-white overflow-hidden">
                            <CardHeader className="bg-dark-900 text-white">
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="w-5 h-5" />
                                    Authentication
                                </CardTitle>
                                <CardDescription className="text-gray-400">How to authenticate your requests</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                <p className="text-sm text-gray-600">
                                    ChaseAI uses **Bearer Token Authentication**. Include your API key in the `Authorization` header of every request.
                                </p>
                                <div className="p-4 bg-gray-50 rounded-xl font-mono text-xs border border-gray-100 break-all">
                                    Authorization: Bearer YOUR_API_KEY
                                </div>
                                <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                    <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-blue-700">
                                        You can generate your API Key in the <Link href="/settings" className="font-bold underline">Settings</Link> page. Never share your key or expose it in client-side code.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Endpoints */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-dark-900 flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-primary-500" />
                                Endpoints
                            </h3>

                            {/* Create Invoice */}
                            <Card id="create-invoice">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">POST</span>
                                                <code className="text-sm font-bold text-dark-900">/api/v1/external/invoices</code>
                                            </div>
                                            <CardTitle className="text-lg">Create Invoice</CardTitle>
                                        </div>
                                    </div>
                                    <CardDescription>Upload an invoice and automatically start the AI chasing sequence.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="overflow-hidden border border-gray-100 rounded-xl font-medium">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                <tr>
                                                    <th className="px-4 py-3">Parameter</th>
                                                    <th className="px-4 py-3">Type</th>
                                                    <th className="px-4 py-3">Required</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-primary-600 uppercase">client_email</td>
                                                    <td className="px-4 py-3 text-gray-500">string</td>
                                                    <td className="px-4 py-3 text-green-600 font-bold">Yes</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-primary-600 uppercase">amount</td>
                                                    <td className="px-4 py-3 text-gray-500">number</td>
                                                    <td className="px-4 py-3 text-green-600 font-bold">Yes</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-primary-600 uppercase">due_date</td>
                                                    <td className="px-4 py-3 text-gray-500">string (YYYY-MM-DD)</td>
                                                    <td className="px-4 py-3 text-green-600 font-bold">Yes</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-primary-600 uppercase">client_name</td>
                                                    <td className="px-4 py-3 text-gray-500">string</td>
                                                    <td className="px-4 py-3 text-gray-400 font-medium whitespace-nowrap">No</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* List Invoices */}
                            <Card id="list-invoices">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">GET</span>
                                                <code className="text-sm font-bold text-dark-900">/api/v1/external/invoices</code>
                                            </div>
                                            <CardTitle className="text-lg">List Invoices</CardTitle>
                                        </div>
                                    </div>
                                    <CardDescription>Retrieve all invoices with optional filtering and pagination.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="overflow-hidden border border-gray-100 rounded-xl font-medium">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                                                <tr>
                                                    <th className="px-4 py-3">Query Param</th>
                                                    <th className="px-4 py-3">Type</th>
                                                    <th className="px-4 py-3">Details</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-primary-600 lowercase">status</td>
                                                    <td className="px-4 py-3 text-gray-500">string</td>
                                                    <td className="px-4 py-3 text-gray-500 uppercase text-[10px]">sent, paid, overdue</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-primary-600 lowercase">limit</td>
                                                    <td className="px-4 py-3 text-gray-500">number</td>
                                                    <td className="px-4 py-3 text-gray-500">Default: 20, Max: 100</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Update Invoice */}
                            <Card id="update-invoice">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">PATCH</span>
                                                <code className="text-sm font-bold text-dark-900">/api/v1/external/invoices/&#123;id&#125;</code>
                                            </div>
                                            <CardTitle className="text-lg">Update Invoice</CardTitle>
                                        </div>
                                    </div>
                                    <CardDescription>Update status or details for a specific invoice.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 mb-4">Use this to mark invoices as **paid** in ChaseAI when they are paid in your external system.</p>
                                    <pre className="p-3 bg-gray-50 rounded-lg text-xs font-mono border border-gray-100">
                                        &123; &quot;status&quot;: &quot;paid&quot; &125;
                                    </pre>
                                </CardContent>
                            </Card>

                            {/* AI Signals */}
                            <Card id="ai-signals" className="border-primary-200 bg-primary-50/10">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">GET</span>
                                                <code className="text-sm font-bold text-dark-900">/api/v1/external/clients/&#123;id&#125;/signals</code>
                                            </div>
                                            <CardTitle className="text-lg flex items-center gap-2">
                                                AI Intelligence Sharing
                                                <span className="text-[10px] bg-primary-500 text-white px-1.5 py-0.5 rounded font-bold uppercase italic">Unique</span>
                                            </CardTitle>
                                        </div>
                                    </div>
                                    <CardDescription>Export ChaseAI&apos;s unique risk scores and payment behavior insights.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-gray-600">Integrate these insights into your own CRM or dashboard to highlight high-risk clients before they default.</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-white border border-primary-100 rounded-xl">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase">Risk Score</div>
                                            <div className="text-xs font-medium text-dark-900">0.0 - 1.0 Late Probability</div>
                                        </div>
                                        <div className="p-3 bg-white border border-primary-100 rounded-xl">
                                            <div className="text-[10px] font-bold text-gray-400 uppercase">Best Channel</div>
                                            <div className="text-xs font-medium text-dark-900">WhatsApp vs Email</div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Code Examples */}
                <div className="space-y-6">
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                            <Code2 className="w-4 h-4" />
                            Code Samples
                        </h3>

                        <div className="bg-dark-900 rounded-2xl overflow-hidden shadow-xl border border-white/10">
                            <div className="flex border-b border-white/10 overflow-x-auto scrollbar-hide">
                                {(['curl', 'js', 'python'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-3 text-xs font-bold transition-all uppercase tracking-widest whitespace-nowrap ${activeTab === tab
                                            ? 'bg-primary-500 text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {tab === 'js' ? 'JavaScript' : tab}
                                    </button>
                                ))}
                            </div>
                            <div className="flex border-b border-white/5 bg-white/5">
                                {(['create', 'list', 'signals'] as const).map((method) => (
                                    <button
                                        key={method}
                                        onClick={() => setActiveMethod(method)}
                                        className={`px-4 py-2 text-[10px] font-bold transition-all uppercase tracking-tighter ${activeMethod === method
                                            ? 'text-primary-400 border-b-2 border-primary-400'
                                            : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        {method}
                                    </button>
                                ))}
                            </div>
                            <div className="p-4 relative group min-h-[200px]">
                                <pre className="text-[11px] font-mono text-gray-300 leading-relaxed overflow-x-auto whitespace-pre">
                                    {codeSamples[activeTab][activeMethod]}
                                </pre>
                                <button
                                    onClick={() => copyToClipboard(codeSamples[activeTab][activeMethod])}
                                    className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-opacity opacity-0 group-hover:opacity-100"
                                >
                                    <CopyIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Credits / Billing */}
                    <Card className="bg-primary-600 text-white border-none shadow-lg mt-8">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2 uppercase tracking-tighter italic">
                                Billing & Credits
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                            <p className="text-sm text-primary-100 leading-relaxed uppercase uppercase text-[10px] font-bold tracking-widest">
                                Free Tier imports are limited by your credit balance.
                                Each API import costs **5 credits**.
                            </p>
                            <div className="p-4 bg-white/10 rounded-xl border border-white/10">
                                <div className="text-xs font-bold text-primary-200">PRO TIP</div>
                                <p className="text-xs mt-1 text-white">Upgrade to a Premium plan (Monthly or Lifetime) for unlimited API imports and no credit costs.</p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full bg-white text-primary-600 border-none hover:bg-primary-50"
                                onClick={() => window.location.href = '/pricing'}
                            >
                                View Pricing
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Error Handling */}
                    <section className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            Common Error Codes
                        </h3>
                        <div className="space-y-2">
                            {[
                                { code: 401, msg: "Invalid or missing API key" },
                                { code: 402, msg: "Insufficient credits/Upgrade required" },
                                { code: 400, msg: "Missing required fields" },
                                { code: 500, msg: "Internal server error" }
                            ].map((err) => (
                                <div key={err.code} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl text-xs">
                                    <span className="font-bold text-dark-900 w-8">{err.code}</span>
                                    <span className="text-gray-500">{err.msg}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-6">
                    <Link href="/settings" className="text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors">
                        Settings
                    </Link>
                    <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors">
                        Dashboard
                    </Link>
                    <a href="mailto:support@verimut.icu" className="text-sm font-bold text-gray-500 hover:text-primary-600 transition-colors">
                        Support
                    </a>
                </div>
                <p className="text-xs font-medium text-gray-400">
                    © 2026 ChaseAI Connect. All rights reserved.
                </p>
            </footer>
        </>
    );
}

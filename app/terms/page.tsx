import Link from 'next/link';
import { FileText, Gavel, AlertCircle, RefreshCw } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <header className="bg-white border-b border-gray-100 py-6">
                <div className="max-w-4xl mx-auto px-6">
                    <Link href="/" className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors">
                        ← Back to ChaseAI
                    </Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-8 md:p-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Gavel className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Terms of Service</h1>
                    </div>

                    <p className="text-gray-500 mb-12 font-medium">Last Updated: January 29, 2026</p>

                    <div className="prose prose-slate max-w-none space-y-12 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing or using ChaseAI, you agree to be bound by these Terms of Service and all applicable laws and regulations in Nigeria. If you do not agree with any of these terms, you are prohibited from using the Service.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                            <p>ChaseAI provides an AI-powered automated invoice chasing assistant that sends reminders to your clients for outstanding payments. Our Service integrates with third-party providers including Paystack for payment processing.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. AI Responsibility Disclaimer</h2>
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4 items-start">
                                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                <p className="text-sm text-amber-900 font-medium">
                                    ChaseAI uses Artificial Intelligence to generate communication. While we strive for professional and accurate messaging, the <strong>User is ultimately responsible</strong> for the content of messages sent through our platform and the maintenance of their client relationships.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Subscriptions and Payments</h2>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>7-Day Free Trial:</strong> New users are eligible for a 7-day trial. After the trial, your chosen plan will be billed automatically via Paystack.</li>
                                <li><strong>Cancellations:</strong> You may cancel your subscription at any time. Your access will continue until the end of the current billing cycle.</li>
                                <li><strong>Non-Refundable:</strong> Unless required by law, subscription fees are non-refundable.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Acceptable Use</h2>
                            <p>You agree not to use ChaseAI to:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Harass clients or use abusive language.</li>
                                <li>Engage in illegal debt collection practices.</li>
                                <li>Send spam or unauthorized commercial communications.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Governing Law</h2>
                            <p>These terms are governed by and construed in accordance with the laws of the <strong>Federal Republic of Nigeria</strong>, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.</p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
                            <p>For legal inquiries, please contact:</p>
                            <p className="font-bold text-indigo-600 mt-2">support@verimut.icu</p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-400 font-medium">
                    © 2026 ChaseAI. All rights reserved.
                </div>
            </footer>
        </div>
    );
}

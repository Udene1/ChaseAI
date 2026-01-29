import Link from 'next/link';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
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
                        <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
                    </div>

                    <p className="text-gray-500 mb-12 font-medium">Last Updated: January 29, 2026</p>

                    <div className="prose prose-slate max-w-none space-y-12 text-gray-600 leading-relaxed">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                            <p>To provide ChaseAI's invoice chasing services, we collect several types of information from and about users of our Service, including:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Account Information:</strong> Name, email address, and company details provided during registration.</li>
                                <li><strong>Invoice Data:</strong> Details of the invoices you upload or sync, including client names, email addresses, payment due dates, and amounts.</li>
                                <li><strong>Payment Metadata:</strong> Transaction statuses via Paystack (ChaseAI does not store your credit card details).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                            <p>We use the information we collect to:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Generate and send personalized payment reminders to your clients.</li>
                                <li>Analyze payment behaviors to improve our "Smart Chasing" AI engine.</li>
                                <li>Communicate with you regarding your account and service updates.</li>
                                <li>Comply with regulatory requirements in Nigeria.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. AI Processing and Data Security</h2>
                            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 flex gap-4 items-start">
                                <Lock className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                                <p className="text-sm text-primary-900 font-medium">
                                    Your data is processed by our AI engine (using partners like Groq) to craft personalized messages. We ensure that our AI partners do not use your data for their own training purposes outside of your specific service needs.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sharing of Information</h2>
                            <p>We do not sell your personal or client data. We share information only with:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Service Providers:</strong> Resend (for emails), Paystack (for payments), and Groq (for AI processing).</li>
                                <li><strong>Legal Compliance:</strong> When required by Nigerian law or to protect our rights.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights (NDPR)</h2>
                            <p>In accordance with the <strong>Nigeria Data Protection Regulation (NDPR)</strong>, you have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at the address below.</p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
                            <p>If you have questions about this Privacy Policy, please contact us at:</p>
                            <p className="font-bold text-primary-600 mt-2">support@verimut.icu</p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-400 font-medium">
                    © 2026 ChaseAI. All rights reserved. Built for the future of work in Africa.
                </div>
            </footer>
        </div>
    );
}

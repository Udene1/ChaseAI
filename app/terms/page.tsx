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

                    <p className="text-gray-500 mb-12 font-medium">Last Updated: February 05, 2026</p>

                    <div className="prose prose-slate max-w-none space-y-12 text-gray-600 leading-relaxed">
                        <p className="text-lg">
                            These Terms apply to all users of ChaseAI, regardless of location. By using the service, you agree to these terms and our Privacy Policy.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Eligibility & Accounts</h2>
                            <p>You must be 18+ (or legal age in your country) and provide accurate info. US users: No use if under COPPA age without consent.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services & Subscriptions</h2>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Access:</strong> Global, but features may vary (e.g., NGN focus).</li>
                                <li><strong>Payments:</strong> Via Stripe (US-based); no refunds except as required (e.g., CCPA rights).</li>
                                <li><strong>AI Features:</strong> Reminders use hybrid LLM/ML; results not guaranteed.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Acceptable Use</h2>
                            <p>No illegal activities, spam, or misuse (e.g., fraudulent invoices). Comply with export laws (e.g., US ITAR if applicable).</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Content & IP</h2>
                            <p>You own your data; grant us license to process for services. We own platform IP.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation of Liability</h2>
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 flex gap-4 items-start">
                                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                <p className="text-sm text-amber-900 font-medium">
                                    &quot;As is&quot; service. No liability for indirect damages, lost profits (capped at fees paid last 12 months). US users: No class actions; individual arbitration only (AAA rules).
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Termination</h2>
                            <p>We may suspend for violations; you can cancel anytime.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Governing Law & Disputes</h2>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Nigeria law for NG users; California law for US users; applicable local law elsewhere.</li>
                                <li>Disputes: Arbitration in Lagos (NG) or San Francisco (US); courts for small claims.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Users</h2>
                            <p>Service available globally, but you must comply with local laws (e.g., GDPR export restrictions).</p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes</h2>
                            <p>We notify via email/site. Continued use = acceptance. Questions?</p>
                            <p className="font-bold text-primary-600 mt-2">support@verimut.icu</p>
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

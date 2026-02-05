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

                    <p className="text-gray-500 mb-12 font-medium">Last Updated: February 05, 2026</p>

                    <div className="prose prose-slate max-w-none space-y-12 text-gray-600 leading-relaxed">
                        <p className="text-lg">
                            ChaseAI (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a global SaaS platform for accounts receivable management, accessible worldwide. We prioritize your privacy and comply with key laws, including Nigeria&apos;s NDPA 2023, California&apos;s CCPA/CPRA, EU GDPR (where applicable), and equivalents in other jurisdictions.
                        </p>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                            <p>We collect:</p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Personal Information:</strong> Email, phone, business name (for auth/reminders). [US CCPA Category: Identifiers]</li>
                                <li><strong>Financial/Invoice Data:</strong> Amounts, descriptions, due dates, client details (anonymized/hashed for AI processing). [US CCPA Category: Commercial information]</li>
                                <li><strong>Sensitive Data:</strong> None directly (e.g., no health/racial data), but inferred from invoices (handled securely). [US CCPA: Sensitive personal info – opt-out available]</li>
                                <li><strong>Usage Data:</strong> Login times, interactions, IP addresses (for security). [US CCPA Category: Internet activity]</li>
                                <li><strong>No Children&apos;s Data:</strong> We do not knowingly collect data from under-13s (US COPPA compliance).</li>
                            </ul>
                            <p className="mt-4 italic">Sources: Directly from you (sign-up/invoices), automatically (logs), or third parties (Stripe for payments).</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Core services:</strong> Invoice creation, AI-personalized reminders (via LLM like Groq/OpenAI).</li>
                                <li><strong>Analytics:</strong> Improve predictions (anonymized data to separate microservice).</li>
                                <li><strong>Legal basis:</strong> Consent (marketing), contract (services), legitimate interests (fraud prevention).</li>
                                <li><strong>Automated decisions:</strong> AI models use your data for risk/timing predictions; you can request human review.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Sharing & Disclosures</h2>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Third parties:</strong> Supabase (hosting – US/EU servers), Twilio/Resend (messaging – global), Stripe (payments – US), Groq/OpenAI (AI – US).</li>
                                <li><strong>No selling/sharing for ads:</strong> [US CCPA: We do not &quot;sell&quot; or &quot;share&quot; personal info as defined; opt-out link below.]</li>
                                <li><strong>Cross-border transfers:</strong> Data may go to US/EU (e.g., AI providers). We use Standard Contractual Clauses (SCCs) or equivalents for adequacy.</li>
                            </ul>
                            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6 flex gap-4 items-start mt-6">
                                <Lock className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                                <p className="text-sm text-primary-900 font-medium">
                                    In the last 12 months (US CCPA disclosure): We disclosed identifiers/commercial info to service providers for business purposes.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Your Privacy Rights</h2>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Global:</strong> Access, correct, delete data; object to processing; withdraw consent.</li>
                                <li><strong>US CCPA/CPRA:</strong> Right to know (categories/sources), delete, opt-out of sales/sharing, limit sensitive data use. Non-discrimination for exercising rights.</li>
                                <li><strong>EU GDPR (if applicable):</strong> Portability, automated decision explanations.</li>
                                <li><strong>Exercise rights:</strong> Email <span className="font-bold text-primary-600">privacy@yourdomain.com</span> (response within 45 days, extendable).</li>
                            </ul>
                            <p className="mt-4">Opt-out of &quot;sales/sharing&quot; (US): [Link to opt-out form or email].</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Security</h2>
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 flex gap-4 items-start">
                                <Shield className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                                <p>Encryption (AES-256), access controls (Supabase RLS), hashing for AI data, regular audits. We report breaches per NDPA/CCPA timelines.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Retention & Deletion</h2>
                            <p>Data retained for service needs + legal (e.g., 7 years for financials). Delete on request unless required by law.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies & Tracking</h2>
                            <p>We use essential cookies only (no tracking pixels yet). Opt-out via browser settings.</p>
                        </section>

                        <section className="pt-8 border-t border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes & Contact</h2>
                            <p>We notify of material changes. Questions? Email us at:</p>
                            <p className="font-bold text-primary-600 mt-2">privacy@yourdomain.com</p>
                            <p className="mt-4 text-sm italic">You may also contact NDPC (Nigeria) or CA AG (US CCPA complaints).</p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-100 py-12">
                <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-400 font-medium">
                    © 2026 ChaseAI. All rights reserved. Built for the future of work.
                </div>
            </footer>
        </div>
    );
}

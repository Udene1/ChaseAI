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
        <div className="min-h-screen bg-white selection:bg-primary-100 selection:text-primary-900">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-200/20 rounded-full blur-[120px] animate-pulse-subtle" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent-200/20 rounded-full blur-[120px] animate-pulse-subtle delay-1000" />
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/50 backdrop-blur-xl border-b border-gray-100/50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/10 overflow-hidden relative border border-gray-100 group-hover:scale-105 transition-transform">
                            <Image
                                src="/logo.png"
                                alt="ChaseAI Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <span className="text-xl font-bold gradient-text">ChaseAI</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-8 font-medium">
                        <a href="#features" className="text-gray-500 hover:text-primary-600 transition-colors">
                            Features
                        </a>
                        <a href="#pricing" className="text-gray-500 hover:text-primary-600 transition-colors">
                            Pricing
                        </a>
                        <Link href="/login" className="text-gray-500 hover:text-primary-600 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/signup" className="btn-primary space-x-2">
                            <span>Get Started Free</span>
                        </Link>
                    </nav>
                    {/* Mobile Sign In */}
                    <div className="md:hidden flex items-center gap-3">
                        <Link href="/login" className="text-sm font-bold text-gray-500 hover:text-primary-600 px-3 py-2 transition-colors">
                            Sign In
                        </Link>
                        <Link href="/signup" className="btn-primary text-xs px-4 py-2">
                            Join
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50/50 text-primary-700 rounded-full text-sm font-semibold mb-8 animate-in shadow-sm border border-primary-100/50">
                            <Zap className="w-4 h-4 text-primary-500" />
                            <span className="tracking-wide">AI-Powered Payment Intelligence</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-extrabold text-dark-900 leading-[1.1] animate-in stagger-1 tracking-tight text-balance">
                            Stop Chasing
                            <span className="gradient-text drop-shadow-sm"> Invoices.</span>
                            <br />
                            Let <span className="relative">AI<div className="absolute -bottom-2 left-0 w-full h-1 bg-primary-200/50 -rotate-1" /></span> Do It.
                        </h1>
                        <p className="mt-8 text-xl text-gray-500 max-w-2xl mx-auto animate-in stagger-2 leading-relaxed">
                            Automate your accounts receivable with intelligent, personalized reminders that preserve client relationships while getting you paid <span className="text-dark-900 font-semibold underline decoration-primary-300 decoration-2 underline-offset-4">faster than ever.</span>
                        </p>
                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 animate-in stagger-3">
                            <Link href="/signup" className="btn-primary text-lg px-10 py-4.5 group">
                                Start Free Trial
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="#pricing" className="btn-secondary text-lg px-10 py-4.5">
                                View Pricing
                            </Link>
                        </div>
                        <div className="mt-10 flex items-center justify-center gap-8 text-sm text-gray-400 animate-in stagger-4 font-medium">
                            <span className="flex items-center gap-2">
                                <div className="p-1 bg-primary-100 rounded-full"><CheckCircle2 className="w-4 h-4 text-primary-600" /></div>
                                7-day free trial
                            </span>
                            <span className="flex items-center gap-2">
                                <div className="p-1 bg-primary-100 rounded-full"><CheckCircle2 className="w-4 h-4 text-primary-600" /></div>
                                Paystack Secure
                            </span>
                            <span className="flex items-center gap-2">
                                <div className="p-1 bg-primary-100 rounded-full"><CheckCircle2 className="w-4 h-4 text-primary-600" /></div>
                                NGN & USD support
                            </span>
                        </div>
                    </div>

                    {/* Hero Image/Demo Replacement */}
                    <div className="mt-24 relative animate-in stagger-4">
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-20 pointer-events-none h-40 bottom-0 top-auto" />

                        {/* Interactive Dashboard Element */}
                        <div className="relative group/dashboard mx-auto max-w-6xl">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-indigo-500 rounded-3xl blur opacity-10 group-hover/dashboard:opacity-20 transition duration-1000 group-hover/dashboard:duration-200 shadow-2xl" />
                            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden ring-1 ring-gray-900/5 backdrop-blur-3xl">
                                <div className="bg-gray-50/80 px-4 py-4 flex items-center justify-between border-b border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                                    </div>
                                    <div className="px-3 py-1 bg-white border border-gray-100 rounded-md text-[10px] text-gray-400 font-mono shadow-sm">
                                        chase-ai.vercel.app/dashboard
                                    </div>
                                    <div className="w-6" />
                                </div>

                                <div className="p-6 md:p-10 lg:p-14 bg-white grid lg:grid-cols-[1fr_320px] gap-8 md:gap-12">
                                    <div className="space-y-6 md:space-y-8 animate-float">
                                        <div className="flex items-end justify-between border-b border-gray-50 pb-6 overflow-hidden">
                                            <div className="min-w-0">
                                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">Total Outstanding</p>
                                                <h3 className="text-2xl md:text-4xl font-extrabold text-dark-900 truncate">₦1,240,500</h3>
                                            </div>
                                            <div className="text-right flex-shrink-0 ml-4">
                                                <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">AI Savings</p>
                                                <h3 className="text-lg md:text-2xl font-bold text-primary-600">+₦450k <span className="hidden sm:inline text-xs font-normal text-gray-400 font-medium">returned</span></h3>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-xs md:text-sm font-bold text-dark-900">Recent Automatic Chases</p>
                                            {[
                                                { client: 'Ace Design Agency', amount: '₦250,000', status: 'Sent L2', time: '2m ago' },
                                                { client: 'Global Connect Ltd', amount: '₦120,500', status: 'Paid', time: '1h ago', isPaid: true },
                                                { client: 'Sarah Williams', amount: '₦45,000', status: 'Drafting L1', time: 'Just now' }
                                            ].map((item, i) => (
                                                <div key={i} className={`flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl border ${item.isPaid ? 'bg-primary-50/30 border-primary-100' : 'bg-white border-gray-100'} shadow-sm overflow-hidden`}>
                                                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xs md:text-base ${item.isPaid ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                                                            {item.client[0]}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-xs md:text-sm font-bold text-dark-900 truncate">{item.client}</p>
                                                            <p className="text-[10px] text-gray-400">{item.time}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0 ml-2">
                                                        <p className="text-xs md:text-sm font-bold text-dark-900">{item.amount}</p>
                                                        <span className={`text-[8px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full uppercase tracking-tighter ${item.isPaid ? 'bg-primary-200 text-primary-700' : 'bg-blue-50 text-blue-600'}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="hidden lg:flex bg-gray-50/50 rounded-3xl p-6 border border-gray-100 flex-col justify-between relative overflow-hidden group/ai">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/ai:opacity-10 transition-opacity">
                                            <Brain className="w-32 h-32" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-6">
                                                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                                                    <Brain className="w-4 h-4" />
                                                </div>
                                                <p className="text-sm font-bold text-dark-900">AI Personalization Engine</p>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                                    <p className="text-[10px] uppercase font-bold text-primary-500 mb-2">Analyzing Tone...</p>
                                                    <p className="text-[13px] text-gray-600 italic">&quot;I noticed Sarah always pays on Tuesdays. Scheduling reminder for Monday 9AM...&quot;</p>
                                                </div>
                                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                                    <p className="text-[10px] uppercase font-bold text-indigo-500 mb-2">Confidence Level</p>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="text-2xl font-bold text-dark-900">92%</span>
                                                        <span className="text-[10px] font-medium text-gray-400">Faster payment expected</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="w-full mt-8 py-3 bg-dark-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors shadow-xl">
                                            Enable Smart Chasing
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="py-12 border-y border-gray-100 bg-gray-50/30 overflow-hidden relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">Empowering professionals from</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale group">
                        {['Lagos Tech', 'Abuja Creative', 'Rivers Global', 'Kano Fintech', 'Enugu Media'].map((brand, i) => (
                            <span key={i} className="text-xl font-black text-dark-900 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 cursor-default">
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-32 px-6 bg-white relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 animate-in">
                        <span className="text-primary-600 font-bold text-sm uppercase tracking-widest">Capabilities</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-dark-900 mt-3 text-balance">
                            Engineered for Modern Commerce
                        </h2>
                        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                            Stop manually following up. ChaseAI manages the entire collection cycle with zero friction.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Brain,
                                title: 'Behavioral AI',
                                description:
                                    'Our engine learns when your clients are most likely to pay and adjusts tone and timing automatically.',
                                color: 'bg-primary-500'
                            },
                            {
                                icon: MessageSquare,
                                title: 'Multi-Channel Reach',
                                description:
                                    'Gentle nudges via Email, firm alerts via SMS, and personal follow-ups on WhatsApp.',
                                color: 'bg-indigo-500'
                            },
                            {
                                icon: Zap,
                                title: 'Instant Integration',
                                description:
                                    'Connect your bank or accounting software in minutes. We start chasing immediately.',
                                color: 'bg-primary-500'
                            },
                            {
                                icon: BarChart3,
                                title: 'Cashflow Insights',
                                description:
                                    'Predictive analytics show you exactly when money will arrive so you can plan with confidence.',
                                color: 'bg-indigo-500'
                            },
                            {
                                icon: Shield,
                                title: 'Enterprise Security',
                                description:
                                    'Your data and client relationships are protected by bank-level encryption and privacy protocols.',
                                color: 'bg-primary-500'
                            },
                            {
                                icon: Star,
                                title: 'Premium Experience',
                                description:
                                    'Every touchpoint is designed to reflect your brand quality while being remarkably persistent.',
                                color: 'bg-indigo-500'
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="group p-10 bg-white rounded-[32px] border border-gray-100 hover:border-primary-100 hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] transition-all duration-500 relative overflow-hidden"
                            >
                                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold text-dark-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm font-medium">{feature.description}</p>
                                <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-gray-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 -z-10" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-dark-900 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-[100px]" />
                </div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">Trusted by entrepreneurs who value their time.</h2>
                            <p className="mt-6 text-xl text-gray-400">Join 500+ businesses across Nigeria using ChaseAI to recover billions in outstanding payments.</p>
                            <div className="mt-10 flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-12 h-12 rounded-full border-4 border-dark-900 bg-gray-800" />
                                    ))}
                                </div>
                                <p className="text-sm font-bold text-white"><span className="text-primary-400">4.9/5</span> from verified users</p>
                            </div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[40px] relative">
                            <Star className="w-12 h-12 text-primary-500 mb-6 fill-primary-500" />
                            <p className="text-2xl text-white font-medium leading-relaxed italic">
                                &quot;ChaseAI literally paid for itself in the first 48 hours. I had an invoice 6 months overdue that got paid after the second AI reminder. It handled the &apos;awkward&apos; conversation so I didn&rsquo;t have to.&quot;
                            </p>
                            <div className="mt-10 flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary-500 rounded-full" />
                                <div>
                                    <p className="text-lg font-bold text-white">Tunde Adebayo</p>
                                    <p className="text-sm text-gray-500">Founder, Kreative Edge</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <span className="text-primary-600 font-bold text-sm uppercase tracking-widest">Pricing</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-dark-900 mt-3">Simple Investment, Infinite Return</h2>
                        <p className="mt-6 text-xl text-gray-500">Start with a 7-day trial. Cancel anytime.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                name: 'Monthly',
                                price: '₦2,999',
                                sub: '/ month',
                                features: ['Unlimited Invoices', 'AI Email Chasing', 'Paystack Integration', 'Standard Analytics'],
                                button: 'Start Free Trial',
                                type: 'secondary'
                            },
                            {
                                name: 'Early Bird',
                                price: '₦1,999',
                                sub: '/ month',
                                tag: 'Limited: First 20 Users',
                                features: ['Everything in Monthly', 'WhatsApp Reminders', 'SMS Support', 'Priority Support', 'Lifetime Price Lock'],
                                button: 'Secure Spot Now',
                                type: 'primary',
                                popular: true
                            },
                            {
                                name: 'Lifetime',
                                price: '₦29,999',
                                sub: 'one-time',
                                features: ['Founder Access Forever', 'All Future AI Models', 'Unlimited Team Seats', 'Custom Domain Support'],
                                button: 'Get Lifetime Access',
                                type: 'dark'
                            }
                        ].map((plan, i) => (
                            <div key={i} className={`relative flex flex-col p-10 rounded-[40px] border transition-all duration-500 ${plan.popular ? 'bg-white border-primary-200 shadow-2xl shadow-primary-500/10 scale-105 z-10' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl'}`}>
                                {plan.tag && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg">
                                        {plan.tag}
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-dark-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-dark-900">{plan.price}</span>
                                        <span className="text-gray-400 text-sm font-medium">{plan.sub}</span>
                                    </div>
                                </div>
                                <ul className="space-y-4 mb-10 flex-grow">
                                    {plan.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm font-semibold text-gray-600">
                                            <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                                <CheckCircle2 className="w-3 h-3 text-primary-600" />
                                            </div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href={`/signup?plan=${plan.name.toLowerCase().replace(' ', '-')}`}
                                    className={`w-full py-4 rounded-2xl text-sm font-bold transition-all duration-300 text-center ${plan.type === 'primary'
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:bg-primary-700'
                                        : plan.type === 'dark'
                                            ? 'bg-dark-900 text-white hover:bg-black shadow-lg shadow-dark-900/20'
                                            : 'bg-gray-50 text-dark-900 hover:bg-gray-100 border border-gray-100'
                                        }`}
                                >
                                    {plan.button}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-32 px-6 bg-white border-t border-gray-50 relative z-10">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold text-dark-900 text-center mb-16">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "How does the AI know how to talk to my clients?", a: "The AI analyzes current invoice status, past payment behavior, and the relationship duration to craft a message that ranges from 'friendly nudge' to 'formal legal notice' automatically." },
                            { q: "Is it safe for my clients to receive NGN/Paystack links?", a: "Yes. We use Paystack's enterprise-grade secure gateway. Your clients will see a professional interface they already trust for most Nigerian payments." },
                            { q: "Can I customize the reminder schedule?", a: "Absolutely. You can choose exactly which days reminders are sent, or let our 'Smart Scheduling' pick the optimal times based on data." },
                            { q: "Does ChaseAI work for international (USD) clients?", a: "Yes. ChaseAI supports both NGN and USD invoicing and can send reminders globally via Email and WhatsApp." }
                        ].map((faq, i) => (
                            <div key={i} className="group p-8 rounded-[32px] bg-gray-50/50 border border-gray-100 hover:border-primary-100 hover:bg-white transition-all duration-300">
                                <h4 className="text-lg font-bold text-dark-900 mb-3">{faq.q}</h4>
                                <p className="text-gray-500 leading-relaxed font-medium">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 bg-white relative z-10 overflow-hidden">
                <div className="max-w-5xl mx-auto glass-card p-12 lg:p-20 rounded-[48px] text-center border-primary-50 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full blur-[100px] opacity-30 -z-10" />
                    <h2 className="text-4xl md:text-6xl font-black text-dark-900 tracking-tight leading-tight">Ready to fix your cash flow?</h2>
                    <p className="mt-8 text-xl text-gray-500 max-w-2xl mx-auto font-medium">Join hundreds of Nigerian freelancers getting paid on time, every time.</p>
                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/signup" className="btn-primary text-lg px-12 py-5 w-full sm:w-auto">
                            Get Started Now
                        </Link>
                        <p className="text-sm font-bold text-gray-400">Join 500+ professionals</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-20 px-6 bg-dark-900 overflow-hidden relative">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-16 mb-20">
                        <div className="max-w-xs">
                            <Link href="/" className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden relative">
                                    <Image src="/logo.png" alt="ChaseAI Logo" fill className="object-cover" />
                                </div>
                                <span className="text-2xl font-black text-white">ChaseAI</span>
                            </Link>
                            <p className="text-gray-500 font-medium leading-relaxed">Recovering outstanding payments for modern businesses with human-centered AI.</p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
                            <div>
                                <h4 className="text-white font-bold mb-6">Product</h4>
                                <ul className="space-y-4 text-sm font-medium text-gray-400">
                                    <li><a href="#features" className="hover:text-primary-400 transition-colors">Features</a></li>
                                    <li><a href="#pricing" className="hover:text-primary-400 transition-colors">Pricing</a></li>
                                    <li><a href="#" className="hover:text-primary-400 transition-colors">Documentation</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-6">Company</h4>
                                <ul className="space-y-4 text-sm font-medium text-gray-400">
                                    <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">Privacy</Link></li>
                                    <li><Link href="/terms" className="hover:text-primary-400 transition-colors">Terms</Link></li>
                                    <li><a href="https://x.com/ChaseAi35571" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">Twitter (X)</a></li>
                                    <li>
                                        <a href="mailto:support@verimut.icu" className="flex items-center gap-2 hover:text-primary-400 transition-colors group">
                                            <Mail className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition-colors" />
                                            <span>Support</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-6">
                        <p className="text-sm font-bold text-gray-600">Built for the future of work in Africa 🌍</p>
                        <p className="text-sm font-bold text-gray-600">© 2024 ChaseAI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

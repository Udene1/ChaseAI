import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ChaseAI - AI-Powered Invoice Chaser',
    description:
        'Automate late payment reminders with AI personalization. Get paid faster with intelligent invoice chasing for freelancers and small businesses.',
    keywords: [
        'invoice',
        'payment reminder',
        'freelancer',
        'small business',
        'AI',
        'automated reminders',
        'Nigeria',
        'Naira',
        'NGN',
    ],
    authors: [{ name: 'ChaseAI' }],
    metadataBase: new URL('https://chase-ai.vercel.app'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'ChaseAI - AI-Powered Invoice Chaser',
        description: 'Get paid faster with intelligent invoice chasing',
        url: 'https://chase-ai.vercel.app',
        siteName: 'ChaseAI',
        images: [
            {
                url: '/logo.png',
                width: 800,
                height: 600,
                alt: 'ChaseAI Logo',
            },
        ],
        locale: 'en_NG',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ChaseAI - AI-Powered Invoice Chaser',
        description: 'Automate your late payment reminders with AI.',
        images: ['/logo.png'],
        creator: '@chaseai',
    },
    icons: {
        icon: '/logo.png',
        shortcut: '/logo.png',
        apple: '/logo.png',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <head>
                {/* Google Analytics */}
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-6WH7QMF0T0"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-6WH7QMF0T0');
                    `}
                </Script>
            </head>
            <body className={inter.className}>
                {children}
                <Analytics />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            padding: '16px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                        },
                    }}
                    richColors
                    closeButton
                />
            </body>
        </html>
    );
}

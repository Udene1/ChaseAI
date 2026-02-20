'use client';

import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import { PricingRegion } from '@/lib/geo';
import PricingSection from './PricingSection';

interface PricingContentProps {
    detectedRegion: PricingRegion;
}

export default function PricingContent({ detectedRegion }: PricingContentProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                            <Zap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">ChaseAI</span>
                    </Link>
                    <Link href="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <div className="pt-20">
                <PricingSection
                    detectedRegion={detectedRegion}
                />
            </div>
        </div>
    );
}

import { Suspense } from 'react';
import { headers } from 'next/headers';
import { Loader2 } from 'lucide-react';
import PricingContent from '@/components/pricing/PricingContent';
import { getRegionByCountry, getCountryName } from '@/lib/geo';

export default function PricingPage() {
    // Detect country from Vercel headers
    // Default to 'US' if header is missing
    const countryCode = headers().get('x-vercel-ip-country') || 'US';
    const region = getRegionByCountry(countryCode);
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        }>
            <PricingContent
                detectedRegion={region}
            />
        </Suspense>
    );
}

export type PricingRegion = 'nigeria' | 'usa' | 'intl';

export function getRegionByCountry(countryCode?: string | null): PricingRegion {
    if (!countryCode) return 'intl';

    const code = countryCode.toUpperCase();

    if (code === 'NG') return 'nigeria';
    if (code === 'US') return 'usa';

    // Default to 'intl' for all other countries
    return 'intl';
}

export function getCountryName(countryCode?: string | null): string {
    if (!countryCode) return 'International';

    const code = countryCode.toUpperCase();
    const names: Record<string, string> = {
        'NG': 'Nigeria',
        'US': 'United States',
        'GB': 'United Kingdom',
        'CA': 'Canada',
        'AU': 'Australia',
        'DE': 'Germany',
        'FR': 'France',
        // Add more common ones if needed, but 'International' is a safe fallback
    };

    return names[code] || 'International';
}

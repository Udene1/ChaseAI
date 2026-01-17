import { NextResponse } from 'next/server';
import { getUser, getUserProfile } from '@/lib/supabase/server';
import { createPortalSession } from '@/lib/stripe';

// POST /api/stripe/portal - Create Stripe customer portal session
export async function POST(request: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profile = await getUserProfile();
        if (!profile?.stripe_customer_id) {
            return NextResponse.json({ error: 'No subscription found' }, { status: 404 });
        }

        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const { url } = await createPortalSession(
            profile.stripe_customer_id,
            `${origin}/settings`
        );

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Portal error:', error);
        return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 });
    }
}

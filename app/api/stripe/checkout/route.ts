import { NextResponse } from 'next/server';
import { getUser, getUserProfile } from '@/lib/supabase/server';
import { createCheckoutSession, PlanType } from '@/lib/stripe';

// POST /api/stripe/checkout - Create Stripe checkout session
export async function POST(request: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const profile = await getUserProfile();
        if (!profile) {
            return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
        }

        const body = await request.json();
        const { plan } = body as { plan?: PlanType };

        if (!plan || !['monthly', 'lifetime'].includes(plan)) {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const { sessionId, url } = await createCheckoutSession(
            user.id,
            user.email!,
            plan,
            `${origin}/dashboard?checkout=success`,
            `${origin}/pricing?checkout=cancelled`
        );

        return NextResponse.json({ sessionId, url });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
    }
}

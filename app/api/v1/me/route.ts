import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        let apiKey = request.headers.get('authorization')?.split(' ')[1];

        // Fallback: Check query parameter (Zapier sometimes sends it here by default)
        if (!apiKey) {
            const { searchParams } = new URL(request.url);
            apiKey = searchParams.get('api_key') || undefined;
        }

        console.log('Received API Key:', apiKey ? `${apiKey.substring(0, 5)}...` : 'None');

        if (!apiKey) {
            return NextResponse.json({
                error: 'Unauthorized: Missing API Key',
                hint: 'Get your API key from ChaseAI Settings page (Settings → API & Integrations)'
            }, { status: 401 });
        }
        const supabase = createAdminClient();

        // Verify API Key and get basic user info
        const { data: user, error } = await (supabase
            .from('users') as any)
            .select('id, email, full_name, subscription_type, credits_balance')
            .eq('api_key', apiKey.trim()) // Ensure no whitespace
            .single();

        if (error || !user) {
            console.error('API Key Lookup Error:', error);
            return NextResponse.json({
                error: 'Unauthorized: Invalid API Key',
                hint: 'Make sure you copied the full API key from ChaseAI Settings. Generate a new one if needed.'
            }, { status: 401 });
        }

        // 2. Billing Check (Gate)
        const isPaidUser = ['monthly', 'early-bird', 'lifetime'].includes(user.subscription_type);
        const hasCredits = (user.credits_balance || 0) >= 5;

        if (!isPaidUser && !hasCredits) {
            return NextResponse.json({
                error: 'Premium Feature',
                hint: 'Zapier integration requires an active Premium subscription or at least 5 credits.'
            }, { status: 402 });
        }

        // Return user details for Zapier "Connection Label"
        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.full_name || 'ChaseAI User',
            subscription: user.subscription_type,
            credits: user.credits_balance
        });

    } catch (error) {
        console.error('Auth test endpoint error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

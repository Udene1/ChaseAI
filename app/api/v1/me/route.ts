import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        let apiKey = request.headers.get('authorization')?.split(' ')[1];

        // Fallback: Check query parameter (Zapier sometimes sends it here by default)
        if (!apiKey) {
            const { searchParams } = new URL(request.url);
            apiKey = searchParams.get('api_key') || undefined;
        }

        if (!apiKey) {
            return NextResponse.json({ error: 'Unauthorized: Missing API Key' }, { status: 401 });
        }
        const supabase = createClient();

        // Verify API Key and get basic user info
        const { data: user, error } = await (supabase
            .from('users') as any)
            .select('id, email, full_name, subscription_type')
            .eq('api_key', apiKey)
            .single();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
        }

        // Return user details for Zapier "Connection Label"
        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.full_name || 'ChaseAI User',
            subscription: user.subscription_type
        });

    } catch (error) {
        console.error('Auth test endpoint error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

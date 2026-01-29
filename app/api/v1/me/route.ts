import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing or invalid Bearer token' }, { status: 401 });
        }

        const apiKey = authHeader.split(' ')[1];
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

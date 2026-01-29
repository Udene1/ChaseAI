import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/server';
import { crypto } from 'crypto';

export async function POST() {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Generate a new UUID for the API key
        const newKey = crypto.randomUUID();
        const supabase = createClient();

        const { error } = await supabase
            .from('users')
            .update({
                api_key: newKey,
                api_key_created_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (error) {
            console.error('API key generation error:', error);
            return NextResponse.json({ error: 'Failed to generate API key' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            api_key: newKey
        });
    } catch (error) {
        console.error('Server error generating API key:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

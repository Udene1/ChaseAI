import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { predictBehavior, optimizeTiming, extractIndustry } from '@/lib/ai';

async function authenticate(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) return null;
    const apiKey = authHeader.split(' ')[1];

    const supabase = createAdminClient();
    const { data: user } = await (supabase
        .from('users') as any)
        .select('id')
        .eq('api_key', apiKey)
        .single();

    return user ? { id: user.id, supabase } : null;
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const auth = await authenticate(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 1. Verify client belongs to user
    const { data: client, error: clientError } = await (auth.supabase
        .from('clients') as any)
        .select('*')
        .eq('id', params.id)
        .eq('user_id', auth.id)
        .single();

    if (clientError || !client) {
        return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // 2. Fetch recent invoice for industry context
    const { data: recentInvoice } = await (auth.supabase
        .from('invoices') as any)
        .select('amount, description, currency')
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    try {
        // 3. Aggregate AI Signals
        const [behavior, timing, industryRes] = await Promise.all([
            predictBehavior(client.id, recentInvoice?.amount || 0),
            optimizeTiming(client.id),
            recentInvoice?.description ? extractIndustry(recentInvoice.description) : Promise.resolve({ industry: 'General' })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                client_id: client.id,
                name: client.name,
                signals: {
                    risk_score: behavior.risk_score || 0.5,
                    predicted_days_overdue: behavior.predicted_days_overdue || 0,
                    confidence: behavior.confidence || 0,
                    best_hour_to_contact: timing.best_hour || 9,
                    preferred_channel: timing.best_channel || 'email',
                    industry: industryRes.industry || 'General'
                },
                metadata: {
                    last_updated: new Date().toISOString()
                }
            }
        });
    } catch (error) {
        console.error('AI Signals export failed:', error);
        return NextResponse.json({ error: 'Failed to generate AI signals' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hashClientId } from '@/lib/utils';

const AI_SERVICE_URL = process.env.AI_API_URL?.replace(/\/$/, '') || 'https://web-production-2893d.up.railway.app';
const AI_API_KEY = process.env.AI_API_KEY;

export async function GET(request: Request) {
    // 1. Security Check (Vercel Cron protection)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    // 2. Initialize Supabase Admin for deep fetching
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        // 3. Fetch invoices paid in the last 24 hours
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: invoices, error } = await supabase
            .from('invoices')
            .select('user_id, client_id, amount, currency, due_date, paid_at, status, description, reminder_count, updated_at, id, created_at')
            .eq('payment_status', 'paid')
            .gte('updated_at', yesterday);

        if (error) throw error;
        if (!invoices || invoices.length === 0) {
            return NextResponse.json({ message: 'No new outcomes to sync' });
        }

        // 4. Anonymize and map data to Railway schema
        const payload = invoices.map((inv) => ({
            user_id: inv.user_id,  // Needed for Stage 2 relative amount percentiles
            invoice_id: inv.id,
            client_id: hashClientId(inv.client_id), // CRITICAL: Privacy
            invoice_amount: inv.amount,
            currency: inv.currency,
            payment_status: 'paid',
            reminder_count: inv.reminder_count || 0,
            days_to_due: Math.floor((new Date(inv.due_date).getTime() - new Date(inv.created_at).getTime()) / (1000 * 3600 * 24)),
            paid_at: inv.updated_at,
        }));

        // 5. Push to Railway ML Service
        const syncRes = await fetch(`${AI_SERVICE_URL}/api/sync-data`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${AI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!syncRes.ok) throw new Error('Failed to sync with Railway');

        // 6. Trigger background model retraining
        fetch(`${AI_SERVICE_URL}/api/train-models`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${AI_API_KEY}` },
        }).catch((e) => console.error('Model retraining trigger failed', e));

        return NextResponse.json({
            status: 'success',
            synced_count: payload.length,
        });
    } catch (err) {
        console.error('Sync failed:', err);
        return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    return GET(request);
}

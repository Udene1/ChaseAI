import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { InvoiceInsert, ClientInsert } from '@/types';

// Rate limiting and security checks
export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing or invalid Bearer token' }, { status: 401 });
        }

        const apiKey = authHeader.split(' ')[1];
        const supabase = createClient();

        // 1. Authenticate user by API Key
        const { data: user, error: authError } = await supabase
            .from('users')
            .select('id, subscription_type, credits_balance')
            .eq('api_key', apiKey)
            .single();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
        }

        // 2. Billing Check (Gate)
        const isPaidUser = ['monthly', 'early-bird', 'lifetime'].includes(user.subscription_type);
        const hasCredits = (user.credits_balance || 0) >= 5;

        if (!isPaidUser && !hasCredits) {
            return NextResponse.json({
                error: 'Insufficient credits or membership required',
                current_balance: user.credits_balance
            }, { status: 402 });
        }

        // 3. Parse and Validate Body
        const body = await request.json();
        const {
            client_name,
            client_email,
            amount,
            currency = 'NGN',
            due_date,
            description
        } = body;

        if (!client_email || !amount || !due_date) {
            return NextResponse.json({ error: 'Missing required fields: client_email, amount, due_date' }, { status: 400 });
        }

        // 4. Find or Create Client
        let clientId: string;
        const { data: existingClient } = await supabase
            .from('clients')
            .select('id')
            .eq('user_id', user.id)
            .eq('email', client_email)
            .single();

        if (existingClient) {
            clientId = existingClient.id;
        } else {
            const { data: newClient, error: clientError } = await supabase
                .from('clients')
                .insert({
                    user_id: user.id,
                    name: client_name || client_email.split('@')[0],
                    email: client_email,
                })
                .select('id')
                .single();

            if (clientError || !newClient) {
                return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
            }
            clientId = newClient.id;
        }

        // 5. Create Invoice
        const { data: invoice, error: invError } = await supabase
            .from('invoices')
            .insert({
                user_id: user.id,
                client_id: clientId,
                amount: Number(amount),
                currency,
                due_date,
                description: description || 'Imported via API',
                status: 'sent', // Auto-start as sent
            })
            .select('id, invoice_number')
            .single();

        if (invError) {
            console.error('Invoice creation error:', invError);
            return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
        }

        // 6. Deduct Credits (if applicable)
        if (!isPaidUser && hasCredits) {
            await (supabase
                .from('users') as any)
                .update({ credits_balance: (user.credits_balance || 0) - 5 })
                .eq('id', user.id);
        }

        // 7. Log Usage
        await (supabase
            .from('users') as any)
            .update({ api_key_last_used: new Date().toISOString() })
            .eq('id', user.id);

        return NextResponse.json({
            success: true,
            invoice_id: invoice.id,
            invoice_number: invoice.invoice_number,
            status: 'success'
        });

    } catch (error) {
        console.error('Public API crash:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

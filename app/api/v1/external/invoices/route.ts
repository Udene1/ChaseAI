import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { InvoiceInsert, ClientInsert } from '@/types';

// Rate limiting and security checks
export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing or invalid Bearer token' }, { status: 401 });
        }

        const apiKey = authHeader.split(' ')[1];
        const supabase = createAdminClient();

        // 1. Authenticate user by API Key
        const { data: user, error: authError } = await (supabase
            .from('users') as any)
            .select('id, subscription_type, credits_balance')
            .eq('api_key', apiKey)
            .single();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
        }

        // 2. Billing Check (Gate)
        const isPaidUser = [
            'nigeria_monthly', 'nigeria_lifetime',
            'usa_monthly', 'usa_lifetime',
            'intl_monthly', 'intl_lifetime',
            'early-bird', 'monthly', 'lifetime'
        ].includes(user.subscription_type as string);
        const hasCredits = (user.credits_balance || 0) >= 5;

        if (!isPaidUser && !hasCredits) {
            return NextResponse.json({
                error: 'Insufficient credits or membership required',
                current_balance: user.credits_balance
            }, { status: 402 });
        }

        // 3. Parse and Validate Body
        const body = await request.json();
        let {
            client_name,
            client_email,
            amount,
            currency,
            due_date,
            description
        } = body;

        // Smart Defaults
        currency = currency || 'NGN';

        // Validate required fields
        if (!client_email || !amount) {
            return NextResponse.json({
                error: 'Missing required fields',
                details: {
                    client_email: !client_email ? 'Required. Example: client@domain.com' : undefined,
                    amount: !amount ? 'Required. Example: 50000' : undefined
                }
            }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(client_email)) {
            return NextResponse.json({
                error: 'Invalid email format',
                details: 'client_email must be a valid email. Example: client@domain.com'
            }, { status: 400 });
        }

        // Smart default for due_date: use today if not provided or invalid
        if (!due_date) {
            const today = new Date();
            due_date = today.toISOString().split('T')[0]; // YYYY-MM-DD format
        } else {
            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(due_date)) {
                return NextResponse.json({
                    error: 'Invalid date format',
                    details: 'due_date must be in YYYY-MM-DD format. Example: 2026-01-30'
                }, { status: 400 });
            }
        }

        // 4. Find or Create Client
        let clientId: string;
        const { data: existingClient } = await (supabase
            .from('clients') as any)
            .select('id')
            .eq('user_id', user.id)
            .eq('email', client_email)
            .single();

        if (existingClient) {
            clientId = existingClient.id;
        } else {
            const { data: newClient, error: clientError } = await (supabase
                .from('clients') as any)
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
        const { data: invoice, error: invError } = await (supabase
            .from('invoices') as any)
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

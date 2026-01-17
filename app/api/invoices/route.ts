import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/server';

// GET /api/invoices - List user's invoices
export async function GET(request: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');

        const supabase = createClient();

        let query = supabase
            .from('invoices')
            .select(`
        *,
        client:clients(*)
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (status && status !== 'all') {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching invoices:', error);
            return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Invoices GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/invoices - Create new invoice
export async function POST(request: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            clientName,
            clientEmail,
            clientPhone,
            invoiceNumber,
            amount,
            currency = 'NGN',
            dueDate,
            description,
            status = 'draft',
            pdfUrl,
        } = body;

        // Validation
        if (!clientName || !clientEmail || !invoiceNumber || !amount || !dueDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const supabase = createClient();

        // Check if client exists or create new one
        let clientId: string;

        const { data: existingClient } = await supabase
            .from('clients')
            .select('id')
            .eq('user_id', user.id)
            .eq('email', clientEmail)
            .single();

        if (existingClient) {
            clientId = existingClient.id;
        } else {
            // Create new client
            const { data: newClient, error: clientError } = await supabase
                .from('clients')
                .insert({
                    user_id: user.id,
                    name: clientName,
                    email: clientEmail,
                    phone: clientPhone || null,
                    whatsapp_enabled: !!clientPhone,
                })
                .select('id')
                .single();

            if (clientError || !newClient) {
                console.error('Error creating client:', clientError);
                return NextResponse.json({ error: 'Failed to create client' }, { status: 500 });
            }

            clientId = newClient.id;
        }

        // Create invoice
        const { data: invoice, error: invoiceError } = await supabase
            .from('invoices')
            .insert({
                user_id: user.id,
                client_id: clientId,
                invoice_number: invoiceNumber,
                amount: parseFloat(amount),
                currency,
                due_date: dueDate,
                description: description || null,
                status,
                pdf_url: pdfUrl || null,
            })
            .select('*')
            .single();

        if (invoiceError || !invoice) {
            console.error('Error creating invoice:', invoiceError);
            return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
        }

        // If status is 'sent', schedule reminders
        if (status === 'sent') {
            const dueDateObj = new Date(dueDate);

            // Schedule Level 1 reminder for due date
            await supabase.from('reminders').insert({
                invoice_id: invoice.id,
                type: 'email',
                escalation_level: 1,
                scheduled_date: dueDateObj.toISOString(),
                status: 'pending',
            });

            // Schedule Level 2 reminder for 7 days after due date
            const level2Date = new Date(dueDateObj);
            level2Date.setDate(level2Date.getDate() + 7);
            await supabase.from('reminders').insert({
                invoice_id: invoice.id,
                type: 'email',
                escalation_level: 2,
                scheduled_date: level2Date.toISOString(),
                status: 'pending',
            });

            // Schedule Level 3 reminder for 14 days after due date
            const level3Date = new Date(dueDateObj);
            level3Date.setDate(level3Date.getDate() + 14);
            await supabase.from('reminders').insert({
                invoice_id: invoice.id,
                type: 'email',
                escalation_level: 3,
                scheduled_date: level3Date.toISOString(),
                status: 'pending',
            });
        }

        return NextResponse.json({ success: true, data: invoice }, { status: 201 });
    } catch (error) {
        console.error('Invoice POST error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

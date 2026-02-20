import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/server';

// GET /api/invoices/[id] - Get single invoice
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient();

        const { data, error } = await (supabase
            .from('invoices') as any)
            .select(`
        *,
        client:clients(*),
        reminders(*)
      `)
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Invoice GET error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT /api/invoices/[id] - Update invoice
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            status,
            amount,
            currency,
            dueDate,
            description,
            clientName,
            clientEmail,
            clientPhone,
            pdfUrl
        } = body;

        const supabase = createClient();

        // Verify ownership and get current client_id
        const { data: existingInvoice } = await (supabase
            .from('invoices') as any)
            .select('id, status, client_id')
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single();

        if (!existingInvoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        let clientId = existingInvoice.client_id;

        // Handle client updates if provided
        if (clientEmail || clientName) {
            const { data: existingClient } = await supabase
                .from('clients')
                .select('id, email')
                .eq('user_id', user.id)
                .eq('email', clientEmail || '')
                .single();

            if (existingClient) {
                clientId = existingClient.id;
                // Update client details if it's the same or another existing client
                await (supabase.from('clients') as any)
                    .update({
                        name: clientName,
                        phone: clientPhone || null,
                        whatsapp_enabled: !!clientPhone,
                    })
                    .eq('id', clientId);
            } else if (clientEmail) {
                // Create new client if it's a new email
                const { data: newClient } = await (supabase.from('clients') as any)
                    .insert({
                        user_id: user.id,
                        name: clientName,
                        email: clientEmail,
                        phone: clientPhone || null,
                        whatsapp_enabled: !!clientPhone,
                    })
                    .select('id')
                    .single();

                if (newClient) {
                    clientId = (newClient as any).id;
                }
            }
        }

        // Build update object
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
            client_id: clientId,
        };

        if (status) updateData.status = status;
        if (amount !== undefined) updateData.amount = parseFloat(amount);
        if (currency) updateData.currency = currency;
        if (dueDate) updateData.due_date = dueDate;
        if (description !== undefined) updateData.description = description;
        if (pdfUrl) updateData.pdf_url = pdfUrl;

        const { data, error } = await (supabase
            .from('invoices') as any)
            .update(updateData)
            .eq('id', params.id)
            .select('*')
            .single();

        if (error) {
            console.error('Error updating invoice:', error);
            return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
        }

        // If status changed to 'sent' from 'draft', schedule reminders
        if (status === 'sent' && existingInvoice.status === 'draft') {
            const dueDateObj = new Date(updateData.due_date as string || (data as any).due_date);

            // Schedule reminders
            await (supabase.from('reminders') as any).insert([
                {
                    invoice_id: params.id,
                    type: 'email',
                    escalation_level: 1,
                    scheduled_date: dueDateObj.toISOString(),
                    status: 'pending',
                },
                {
                    invoice_id: params.id,
                    type: 'email',
                    escalation_level: 2,
                    scheduled_date: new Date(dueDateObj.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'pending',
                },
                {
                    invoice_id: params.id,
                    type: 'email',
                    escalation_level: 3,
                    scheduled_date: new Date(dueDateObj.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'pending',
                },
            ]);
        }

        // If marked as paid, cancel pending reminders
        if (status === 'paid') {
            await (supabase.from('reminders') as any)
                .update({ status: 'cancelled' })
                .eq('invoice_id', params.id)
                .eq('status', 'pending');
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Invoice PUT error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/invoices/[id] - Delete invoice
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createClient();

        // Verify ownership
        const { data: existingInvoice } = await supabase
            .from('invoices')
            .select('id')
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single();

        if (!existingInvoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Delete reminders first (cascade should handle this, but being explicit)
        await supabase.from('reminders').delete().eq('invoice_id', params.id);

        // Delete invoice
        const { error } = await supabase.from('invoices').delete().eq('id', params.id);

        if (error) {
            console.error('Error deleting invoice:', error);
            return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Invoice DELETE error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

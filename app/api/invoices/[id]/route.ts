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

        const { data, error } = await supabase
            .from('invoices')
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
        const { status, amount, dueDate, description } = body;

        const supabase = createClient();

        // Verify ownership
        const { data: existingInvoice } = await supabase
            .from('invoices')
            .select('id, status')
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single();

        if (!existingInvoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Build update object
        const updateData: Record<string, unknown> = {
            updated_at: new Date().toISOString(),
        };

        if (status) updateData.status = status;
        if (amount !== undefined) updateData.amount = parseFloat(amount);
        if (dueDate) updateData.due_date = dueDate;
        if (description !== undefined) updateData.description = description;

        const { data, error } = await supabase
            .from('invoices')
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
            const { data: invoice } = await supabase
                .from('invoices')
                .select('due_date')
                .eq('id', params.id)
                .single();

            if (invoice) {
                const dueDateObj = new Date(invoice.due_date);

                // Schedule reminders
                await supabase.from('reminders').insert([
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
        }

        // If marked as paid, cancel pending reminders
        if (status === 'paid') {
            await supabase
                .from('reminders')
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

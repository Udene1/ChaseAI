import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

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

    const { data: invoice, error } = await (auth.supabase
        .from('invoices') as any)
        .select('*, client:clients(*)')
        .eq('id', params.id)
        .eq('user_id', auth.id)
        .single();

    if (error || !invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: invoice });
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const auth = await authenticate(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { status, amount, description, due_date } = body;

    const updateData: any = {};
    if (status) updateData.status = status;
    if (amount) updateData.amount = Number(amount);
    if (description) updateData.description = description;
    if (due_date) updateData.due_date = due_date;

    const { data: invoice, error } = await (auth.supabase
        .from('invoices') as any)
        .update(updateData)
        .eq('id', params.id)
        .eq('user_id', auth.id)
        .select()
        .single();

    if (error || !invoice) return NextResponse.json({ error: 'Failed to update invoice' }, { status: 400 });

    return NextResponse.json({ success: true, data: invoice });
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const auth = await authenticate(request);
    if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { error } = await (auth.supabase
        .from('invoices') as any)
        .delete()
        .eq('id', params.id)
        .eq('user_id', auth.id);

    if (error) return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 400 });

    return NextResponse.json({ success: true, message: 'Invoice deleted' });
}

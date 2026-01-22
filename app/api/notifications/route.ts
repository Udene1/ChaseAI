import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * GET /api/notifications
 * Fetch latest notifications for the current user
 */
export async function GET() {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(20);

        if (error) throw error;

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Error fetching notifications:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * PATCH /api/notifications
 * Mark notifications as read
 */
export async function PATCH(request: Request) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id, markAllAsRead } = await request.json();

        if (markAllAsRead) {
            const { error } = await (supabase
                .from('notifications') as any)
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('is_read', false);

            if (error) throw error;
        } else if (id) {
            const { error } = await (supabase
                .from('notifications') as any)
                .update({ is_read: true })
                .eq('user_id', user.id)
                .eq('id', id);

            if (error) throw error;
        } else {
            return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating notifications:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

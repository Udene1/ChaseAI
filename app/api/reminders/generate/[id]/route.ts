import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser, getUserProfile } from '@/lib/supabase/server';
import { generateReminder } from '@/lib/ai';
import { EscalationLevel, Client, Invoice } from '@/types';

// POST /api/reminders/generate/[id] - Generate AI reminder for invoice
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const escalationLevel = (body.escalationLevel || 1) as EscalationLevel;

        const supabase = createClient();

        // Get invoice with client
        const { data: invoice } = await supabase
            .from('invoices')
            .select(`
        *,
        client:clients(*)
      `)
            .eq('id', params.id)
            .eq('user_id', user.id)
            .single();

        if (!invoice) {
            return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
        }

        // Get user profile for AI settings
        const profile = await getUserProfile();
        const settings = profile?.settings as Record<string, string> | undefined;

        // Generate AI reminder
        const reminderContent = await generateReminder(
            invoice as Invoice,
            (invoice as any).client as Client | null,
            escalationLevel,
            {
                aiProvider: settings?.aiProvider,
                groqApiKey: settings?.groqApiKey,
                openaiApiKey: settings?.openaiApiKey,
            }
        );

        return NextResponse.json({
            success: true,
            data: {
                subject: reminderContent.subject,
                message: reminderContent.message,
                tone: reminderContent.tone,
                suggestedAction: reminderContent.suggestedAction,
            },
        });
    } catch (error) {
        console.error('Reminder generation error:', error);
        return NextResponse.json({ error: 'Failed to generate reminder' }, { status: 500 });
    }
}

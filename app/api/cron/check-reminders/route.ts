import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';
import { getEmailTemplate } from '@/lib/templates';
import { Invoice, Client, EscalationLevel, UserSettings } from '@/types';

// POST /api/cron/check-reminders - Daily cron job to check and send reminders
export async function POST(request: Request) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const supabase = createAdminClient();
        const now = new Date();
        const results = { processed: 0, sent: 0, failed: 0, skipped: 0 };

        // 1. Check for invoices that should be marked as overdue
        const { data: overdueInvoices } = await supabase
            .from('invoices')
            .select('id')
            .eq('status', 'sent')
            .lt('due_date', now.toISOString().split('T')[0]);

        if (overdueInvoices && overdueInvoices.length > 0) {
            await (supabase.from('invoices') as any)
                .update({ status: 'overdue' })
                .in('id', (overdueInvoices as any[]).map((i) => i.id));

            console.log(`Marked ${overdueInvoices.length} invoices as overdue`);
        }

        // 2. Get pending reminders that are due
        const { data: pendingReminders } = await (supabase
            .from('reminders') as any)
            .select(`
        *,
        invoice:invoices(
          *,
          client:clients(*),
          user:users(settings)
        )
      `)
            .eq('status', 'pending')
            .lte('scheduled_date', now.toISOString())
            .limit(100);

        if (!pendingReminders || pendingReminders.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No pending reminders',
                results,
            });
        }

        // 3. Process each reminder
        for (const reminder of (pendingReminders as any[])) {
            results.processed++;

            const invoice = (reminder as any).invoice as Invoice & {
                client: Client | null;
                user: { settings: UserSettings } | null;
            };

            // Skip if invoice is already paid
            if (invoice.status === 'paid') {
                await (supabase.from('reminders') as any)
                    .update({ status: 'cancelled' })
                    .eq('id', (reminder as any).id);
                results.skipped++;
                continue;
            }

            // Skip if no client
            if (!invoice.client) {
                await (supabase.from('reminders') as any)
                    .update({ status: 'failed', error_message: 'No client found' })
                    .eq('id', (reminder as any).id);
                results.failed++;
                continue;
            }

            const settings = invoice.user?.settings || {};

            try {
                // Get email template
                const template = getEmailTemplate(
                    (reminder as any).escalation_level as EscalationLevel,
                    invoice,
                    invoice.client,
                    undefined,
                    settings.businessName
                );

                // Send email
                const result = await sendEmail(
                    {
                        to: invoice.client.email,
                        subject: template.subject,
                        html: template.html,
                        text: template.text,
                        replyTo: settings.replyToEmail,
                    }
                );

                if (result.success) {
                    await (supabase.from('reminders') as any)
                        .update({
                            status: 'sent',
                            sent_date: now.toISOString(),
                        })
                        .eq('id', (reminder as any).id);
                    results.sent++;
                } else {
                    await (supabase.from('reminders') as any)
                        .update({
                            status: 'failed',
                            error_message: result.error,
                        })
                        .eq('id', (reminder as any).id);
                    results.failed++;
                }
            } catch (error) {
                console.error(`Failed to send reminder ${reminder.id}:`, error);
                await (supabase.from('reminders') as any)
                    .update({
                        status: 'failed',
                        error_message: error instanceof Error ? error.message : 'Unknown error',
                    })
                    .eq('id', (reminder as any).id);
                results.failed++;
            }
        }

        console.log('Cron job completed:', results);

        return NextResponse.json({
            success: true,
            message: 'Reminders processed',
            results,
        });
    } catch (error) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
    }
}

// Also allow GET for Vercel Cron
export async function GET(request: Request) {
    return POST(request);
}

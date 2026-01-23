import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email';
import { getEmailTemplate, getSMSTemplate, getWhatsAppTemplate } from '@/lib/templates';
import { sendSMS, sendWhatsApp } from '@/lib/sms';
import { Invoice, Client, EscalationLevel, UserSettings } from '@/types';
import { createNotification } from '@/lib/notifications';
import { generateReminder } from '@/lib/ai';

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

            // Notifications for overdue invoices
            for (const inv of (overdueInvoices as any[])) {
                // We need the user_id for the notification
                const { data: fullInvoice }: any = await supabase
                    .from('invoices')
                    .select('user_id, invoice_number')
                    .eq('id', inv.id)
                    .single();

                if (fullInvoice) {
                    await createNotification({
                        userId: fullInvoice.user_id,
                        title: 'Invoice Overdue',
                        message: `Invoice ${fullInvoice.invoice_number} is now overdue.`,
                        type: 'warning',
                        link: `/invoices/${inv.id}`,
                        supabaseClient: supabase
                    });
                }
            }
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
                // Generate AI reminder message
                let aiMessage = null;
                try {
                    const aiResult = await generateReminder(
                        invoice,
                        invoice.client,
                        (reminder as any).escalation_level as EscalationLevel,
                        {
                            aiProvider: settings.aiProvider,
                            groqApiKey: settings.groqApiKey,
                            openaiApiKey: settings.openaiApiKey,
                            geminiApiKey: settings.geminiApiKey,
                        }
                    );
                    aiMessage = aiResult.message;
                } catch (aiError) {
                    console.error(`AI generation failed for reminder ${reminder.id}, falling back to template:`, aiError);
                }

                // Get email template
                const template = getEmailTemplate(
                    (reminder as any).escalation_level as EscalationLevel,
                    invoice,
                    invoice.client,
                    aiMessage || undefined,
                    settings.businessName
                );

                let result: { success: boolean; error?: string };

                // Send based on type
                if (reminder.type === 'email') {
                    result = await sendEmail({
                        to: invoice.client.email,
                        subject: template.subject,
                        html: template.html,
                        text: template.text,
                        replyTo: settings.replyToEmail,
                    });
                } else if (reminder.type === 'sms') {
                    if (!invoice.client.phone) {
                        throw new Error(`Client ${invoice.client.name} has no phone number for SMS`);
                    }
                    const smsTemplate = getSMSTemplate((reminder as any).escalation_level as EscalationLevel, invoice, invoice.client);
                    result = await sendSMS(
                        { to: invoice.client.phone, message: aiMessage || smsTemplate.message },
                        {
                            accountSid: settings.twilioAccountSid,
                            authToken: settings.twilioAuthToken,
                            phoneNumber: settings.twilioPhoneNumber,
                        }
                    );
                } else if (reminder.type === 'whatsapp') {
                    if (!invoice.client.phone) {
                        throw new Error(`Client ${invoice.client.name} has no phone number for WhatsApp`);
                    }
                    const waTemplate = getWhatsAppTemplate((reminder as any).escalation_level as EscalationLevel, invoice, invoice.client);
                    result = await sendWhatsApp(
                        { to: invoice.client.phone, message: aiMessage || waTemplate.message },
                        {
                            accountSid: settings.twilioAccountSid,
                            authToken: settings.twilioAuthToken,
                            whatsappNumber: settings.twilioPhoneNumber,
                        }
                    );
                } else {
                    throw new Error(`Unsupported reminder type: ${reminder.type}`);
                }

                if (result.success) {
                    await (supabase.from('reminders') as any)
                        .update({
                            status: 'sent',
                            sent_date: now.toISOString(),
                            ai_message: aiMessage,
                        })
                        .eq('id', (reminder as any).id);
                    results.sent++;

                    // Create notification
                    await createNotification({
                        userId: invoice.user_id,
                        title: 'Scheduled Reminder Sent',
                        message: `Automatic level ${(reminder as any).escalation_level} ${reminder.type} reminder for invoice ${invoice.invoice_number} sent to ${invoice.client.name}.`,
                        type: 'success',
                        link: `/invoices/${invoice.id}`,
                        supabaseClient: supabase
                    });
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

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser, getUserProfile } from '@/lib/supabase/server';
import { generateReminder } from '@/lib/ai';
import { getEmailTemplate, getSMSTemplate, getWhatsAppTemplate } from '@/lib/templates';
import { sendEmail } from '@/lib/email';
import { sendSMS, sendWhatsApp } from '@/lib/sms';
import { EscalationLevel, Client, Invoice, ReminderType, UserSettings } from '@/types';

// POST /api/reminders/send/[id] - Send reminder for invoice
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
        const {
            type = 'email',
            escalationLevel = 1,
            customMessage,
        } = body as {
            type?: ReminderType;
            escalationLevel?: EscalationLevel;
            customMessage?: string;
        };

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

        const client = (invoice as any).client as Client | null;

        if (!client) {
            return NextResponse.json({ error: 'No client associated with invoice' }, { status: 400 });
        }

        // Get user profile for API settings
        const profile = await getUserProfile();
        const settings = (profile?.settings || {}) as UserSettings;

        // Create reminder record
        const { data: reminder, error: reminderError } = await (supabase.from('reminders') as any)
            .insert({
                invoice_id: params.id,
                type,
                escalation_level: escalationLevel,
                status: 'pending',
            })
            .select('id')
            .single();

        if (reminderError || !reminder) {
            return NextResponse.json({ error: 'Failed to create reminder record' }, { status: 500 });
        }

        let sendResult: { success: boolean; error?: string };
        let aiMessage: string | null = null;

        try {
            // Get or generate message
            let message = customMessage;

            if (!message) {
                const aiResult = await generateReminder(
                    invoice as Invoice,
                    client,
                    escalationLevel,
                    {
                        aiProvider: settings.aiProvider,
                        groqApiKey: settings.groqApiKey,
                        openaiApiKey: settings.openaiApiKey,
                    }
                );
                message = aiResult.message;
                aiMessage = aiResult.message;
            }

            // Send based on type
            if (type === 'email') {
                const template = getEmailTemplate(escalationLevel, invoice as Invoice, client, message, settings.businessName);
                sendResult = await sendEmail(
                    {
                        to: client.email,
                        subject: template.subject,
                        html: template.html,
                        text: template.text,
                        replyTo: settings.replyToEmail,
                    }
                );
            } else if (type === 'sms') {
                if (!client.phone) {
                    throw new Error('Client has no phone number');
                }
                const template = getSMSTemplate(escalationLevel, invoice as Invoice, client);
                sendResult = await sendSMS(
                    { to: client.phone, message: message || template.message },
                    {
                        accountSid: settings.twilioAccountSid,
                        authToken: settings.twilioAuthToken,
                        phoneNumber: settings.twilioPhoneNumber,
                    }
                );
            } else if (type === 'whatsapp') {
                if (!client.phone) {
                    throw new Error('Client has no phone number');
                }
                const template = getWhatsAppTemplate(escalationLevel, invoice as Invoice, client);
                sendResult = await sendWhatsApp(
                    { to: client.phone, message: message || template.message },
                    {
                        accountSid: settings.twilioAccountSid,
                        authToken: settings.twilioAuthToken,
                        whatsappNumber: settings.twilioPhoneNumber,
                    }
                );
            } else {
                throw new Error('Invalid reminder type');
            }

            // Update reminder status
            if (sendResult.success) {
                await (supabase.from('reminders') as any)
                    .update({
                        status: 'sent',
                        sent_date: new Date().toISOString(),
                        ai_message: aiMessage,
                    })
                    .eq('id', (reminder as any).id);

                // Add to client history
                const historyNotes = (client.history_notes as Array<Record<string, unknown>>) || [];
                historyNotes.push({
                    date: new Date().toISOString(),
                    type: 'reminder',
                    message: `Level ${escalationLevel} ${type} reminder sent`,
                    invoiceId: params.id,
                });

                await (supabase.from('clients') as any)
                    .update({ history_notes: historyNotes })
                    .eq('id', client.id);

                // Update invoice status to overdue if past due date
                const dueDate = new Date((invoice as any).due_date);
                if (dueDate < new Date() && (invoice as any).status === 'sent') {
                    await (supabase.from('invoices') as any)
                        .update({ status: 'overdue' })
                        .eq('id', params.id);
                }
            } else {
                await (supabase.from('reminders') as any)
                    .update({
                        status: 'failed',
                        error_message: sendResult.error,
                    })
                    .eq('id', (reminder as any).id);

                return NextResponse.json({ error: sendResult.error || 'Failed to send' }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                data: { reminderId: reminder.id },
            });
        } catch (error) {
            // Update reminder as failed
            await (supabase.from('reminders') as any)
                .update({
                    status: 'failed',
                    error_message: error instanceof Error ? error.message : 'Unknown error',
                })
                .eq('id', (reminder as any).id);

            throw error;
        }
    } catch (error) {
        console.error('Reminder send error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to send reminder' },
            { status: 500 }
        );
    }
}

import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { Invoice, Client, EscalationLevel, AIReminderResponse, ClientHistoryNote } from '@/types';
import { formatCurrency, formatDate } from './utils';

/**
 * Get AI client based on provider preference
 */
function getAIClient(settings?: { aiProvider?: string; groqApiKey?: string; openaiApiKey?: string; xaiApiKey?: string; geminiApiKey?: string }) {
    let provider = settings?.aiProvider || process.env.AI_PROVIDER || 'groq';
    const groqKey = (settings?.groqApiKey && settings.groqApiKey.length > 0) ? settings.groqApiKey : process.env.GROQ_API_KEY;
    const xaiKey = (settings?.xaiApiKey && settings.xaiApiKey.length > 0) ? settings.xaiApiKey : process.env.XAI_API_KEY;

    console.log('[AI Debug] Settings received:', JSON.stringify(settings, null, 2));
    console.log('[AI Debug] Initial Provider:', provider);

    // Auto-detection: If using an xAI key in Groq field, switch provider
    if (groqKey?.startsWith('xai-') && provider === 'groq') {
        provider = 'xai';
    }

    if (provider === 'openai') {
        return {
            provider: 'openai' as const,
            client: new OpenAI({
                apiKey: settings?.openaiApiKey || process.env.OPENAI_API_KEY,
            }),
        };
    }

    if (provider === 'xai') {
        return {
            provider: 'xai' as const,
            client: new OpenAI({
                apiKey: xaiKey || groqKey, // Fallback to groqKey if auto-detected
                baseURL: 'https://api.x.ai/v1',
            }),
        };
    }

    if (provider === 'gemini') {
        const geminiKey = settings?.geminiApiKey || process.env.GEMINI_API_KEY;
        return {
            provider: 'gemini' as const,
            client: new GoogleGenerativeAI(geminiKey || ''),
        };
    }

    console.log('[AI Debug] Falling back to Groq. Key present:', !!groqKey);

    return {
        provider: 'groq' as const,
        client: new Groq({
            apiKey: groqKey,
        }),
    };
}

/**
 * Get escalation context for the prompt
 */
function getEscalationContext(level: EscalationLevel): { tone: string; urgency: string; action: string } {
    const contexts = {
        1: {
            tone: 'polite and friendly',
            urgency: 'gentle nudge',
            action: 'kindly remind them of the upcoming/recent due date',
        },
        2: {
            tone: 'professional but firm',
            urgency: 'important follow-up',
            action: 'emphasize the importance of timely payment and potential impacts',
        },
        3: {
            tone: 'urgent and direct',
            urgency: 'final notice',
            action: 'warn about late fees, service suspension, or collection actions',
        },
    };
    return contexts[level];
}

/**
 * Build client history summary for AI context
 */
function buildHistoryContext(client: Client | null): string {
    if (!client?.history_notes) return 'No previous interaction history available.';

    const notes = (client.history_notes as unknown as ClientHistoryNote[]) || [];
    if (!Array.isArray(notes) || notes.length === 0) {
        return 'This is a new client with no payment history.';
    }

    const paymentNotes = notes.filter((n) => n.type === 'payment');
    const latePayments = paymentNotes.filter((n) => n.daysLate && n.daysLate > 0);

    let summary = `Client has ${paymentNotes.length} previous payment(s). `;

    if (latePayments.length > 0) {
        const avgDaysLate = latePayments.reduce((acc, n) => acc + (n.daysLate || 0), 0) / latePayments.length;
        summary += `${latePayments.length} were late (avg ${Math.round(avgDaysLate)} days late). `;
    } else if (paymentNotes.length > 0) {
        summary += 'All previous payments were on time. ';
    }

    return summary;
}

/**
 * Generate AI-personalized reminder message
 */
export async function generateReminder(
    invoice: Invoice,
    client: Client | null,
    escalationLevel: EscalationLevel,
    settings?: { aiProvider?: string; groqApiKey?: string; openaiApiKey?: string; xaiApiKey?: string; geminiApiKey?: string }
): Promise<AIReminderResponse> {
    const { provider, client: aiClient } = getAIClient(settings);
    const context = getEscalationContext(escalationLevel);
    const historyContext = buildHistoryContext(client);

    const prompt = `You are an AI assistant helping a freelancer/business owner send payment reminders. Generate a personalized reminder email for an overdue invoice.

INVOICE DETAILS:
- Invoice Number: ${invoice.invoice_number}
- Amount: ${formatCurrency(invoice.amount, invoice.currency as 'NGN' | 'USD')}
- Due Date: ${formatDate(invoice.due_date)}
- Description: ${invoice.description || 'Professional services'}

CLIENT INFO:
- Name: ${client?.name || 'Valued Client'}
- ${historyContext}

ESCALATION LEVEL: ${escalationLevel}/3 (${context.urgency})
TONE: ${context.tone}
OBJECTIVE: ${context.action}

Generate a reminder with:
1. A compelling subject line (max 60 chars)
2. A personalized message body (2-3 paragraphs, professional)
3. If client has late payment history, subtly reference wanting to maintain a good relationship
4. For level 3, mention potential late fees or next steps

Respond in JSON format:
{
  "subject": "Subject line here",
  "message": "Full email body here",
  "tone": "${context.tone.split(' ')[0]}",
  "suggestedAction": "Optional suggestion for sender (e.g., 'Consider offering 5% discount for immediate payment')"
}`;

    try {
        let response: string;

        if (provider === 'openai') {
            const completion = await (aiClient as OpenAI).chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant that generates professional payment reminder emails. Always respond with valid JSON.' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 500,
            });
            response = completion.choices[0]?.message?.content || '';
        } else if (provider === 'gemini') {
            const model = (aiClient as GoogleGenerativeAI).getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(prompt + "\n\nRespond with ONLY valid JSON.");
            response = result.response.text();

            // Clean markdown code blocks if present
            response = response.replace(/^```json\n|\n```$/g, '').trim();
        } else if (provider === 'xai') {
            const completion = await (aiClient as OpenAI).chat.completions.create({
                model: 'grok-2-latest',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant that generates professional payment reminder emails. Always respond with valid JSON.' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 500,
            });
            response = completion.choices[0]?.message?.content || '';
        } else {
            const completion = await (aiClient as Groq).chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant that generates professional payment reminder emails. Always respond with valid JSON.' },
                    { role: 'user', content: prompt },
                ],
                temperature: 0.7,
                max_tokens: 500,
            });
            response = completion.choices[0]?.message?.content || '';
        }

        // Parse JSON response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]) as AIReminderResponse;
            return parsed;
        }

        throw new Error('Invalid AI response format');
    } catch (error) {
        console.error('AI generation error:', error);

        // Fallback to template-based response
        return getFallbackReminder(invoice, client, escalationLevel);
    }
}

/**
 * Fallback reminder when AI fails
 */
function getFallbackReminder(
    invoice: Invoice,
    client: Client | null,
    level: EscalationLevel
): AIReminderResponse {
    const clientName = client?.name || 'Valued Client';
    const amount = formatCurrency(invoice.amount, invoice.currency as 'NGN' | 'USD');
    const dueDate = formatDate(invoice.due_date);

    const templates: Record<EscalationLevel, AIReminderResponse> = {
        1: {
            subject: `Friendly Reminder: Invoice ${invoice.invoice_number} Due`,
            message: `Dear ${clientName},

I hope this message finds you well. This is a friendly reminder that invoice ${invoice.invoice_number} for ${amount} was due on ${dueDate}.

If you've already sent payment, please disregard this message. Otherwise, I would appreciate it if you could process the payment at your earliest convenience.

Please let me know if you have any questions or need any clarification regarding the invoice.

Best regards`,
            tone: 'polite',
        },
        2: {
            subject: `Important: Invoice ${invoice.invoice_number} Payment Overdue`,
            message: `Dear ${clientName},

I'm following up regarding invoice ${invoice.invoice_number} for ${amount}, which was due on ${dueDate}. As of today, we have not yet received payment.

Timely payments help us maintain our service quality and continue our professional relationship. I kindly request that you prioritize this payment or reach out if there are any issues we should discuss.

Please process the payment within the next 7 days to avoid any service impacts.

Thank you for your attention to this matter.

Best regards`,
            tone: 'firm',
        },
        3: {
            subject: `URGENT: Final Notice for Invoice ${invoice.invoice_number}`,
            message: `Dear ${clientName},

This is a final notice regarding invoice ${invoice.invoice_number} for ${amount}, which has been overdue since ${dueDate}.

Despite our previous reminders, we have not received payment. Please note that continued non-payment may result in:
- Late fees being applied to your account
- Suspension of services
- Referral to a collection agency

To avoid these consequences, please process the payment immediately or contact us to discuss a payment arrangement.

This matter requires your urgent attention.

Regards`,
            tone: 'urgent',
            suggestedAction: 'Consider calling the client directly if no response within 48 hours',
        },
    };

    return templates[level];
}

/**
 * Generate AI insights for reports
 */
export async function generateInsights(
    stats: {
        totalPaid: number;
        totalOverdue: number;
        avgDaysToPayment: number;
        clientData: Array<{ name: string; onTimeRate: number; totalInvoices: number }>;
    },
    settings?: { aiProvider?: string; groqApiKey?: string; openaiApiKey?: string; xaiApiKey?: string; geminiApiKey?: string }
): Promise<string[]> {
    const { provider, client: aiClient } = getAIClient(settings);

    const prompt = `Analyze these invoice/payment statistics and provide 3-4 brief, actionable insights for a freelancer/small business:

STATS:
- Total Paid (This Month): ${formatCurrency(stats.totalPaid, 'NGN')}
- Total Overdue: ${formatCurrency(stats.totalOverdue, 'NGN')}
- Average Days to Payment: ${stats.avgDaysToPayment} days

CLIENT BREAKDOWN:
${stats.clientData.map((c) => `- ${c.name}: ${c.onTimeRate}% on-time rate (${c.totalInvoices} invoices)`).join('\n')}

Provide insights as a JSON array of strings. Focus on:
1. Patterns in payment behavior
2. Suggestions for improving collection
3. Client relationship recommendations
4. Cash flow observations

Example format: ["Insight 1", "Insight 2", "Insight 3"]`;

    try {
        let response: string;

        if (provider === 'openai') {
            const completion = await (aiClient as OpenAI).chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 300,
            });
            response = completion.choices[0]?.message?.content || '[]';
        } else if (provider === 'gemini') {
            const model = (aiClient as GoogleGenerativeAI).getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(prompt + "\n\nRespond with ONLY valid JSON array.");
            response = result.response.text();

            // Clean markdown code blocks
            response = response.replace(/^```json\n|\n```$/g, '').trim();
        } else if (provider === 'xai') {
            const completion = await (aiClient as OpenAI).chat.completions.create({
                model: 'grok-2-latest',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 300,
            });
            response = completion.choices[0]?.message?.content || '[]';
        } else {
            const completion = await (aiClient as Groq).chat.completions.create({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 300,
            });
            response = completion.choices[0]?.message?.content || '[]';
        }

        const jsonMatch = response.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]) as string[];
        }

        return ['Unable to generate insights at this time.'];
    } catch (error) {
        console.error('AI insights error:', error);
        return [
            'Review clients with low on-time rates and consider adjusting payment terms.',
            'Send reminders 3 days before due dates to improve collection rates.',
            'Consider offering early payment discounts to improve cash flow.',
        ];
    }
}

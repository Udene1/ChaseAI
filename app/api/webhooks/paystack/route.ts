import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';
import { createNotification } from '@/lib/notifications';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = req.headers.get('x-paystack-signature');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        // Verify signature
        const hash = crypto
            .createHmac('sha512', PAYSTACK_SECRET_KEY)
            .update(body)
            .digest('hex');

        if (hash !== signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        const event = JSON.parse(body);
        const supabase = await createAdminClient();

        console.log('Paystack Webhook Event:', event.event);

        switch (event.event) {
            case 'charge.success': {
                const { metadata, customer, subscription, reference } = event.data;
                const userId = metadata?.user_id;

                // 1. Handle Invoice Payment (from automated reminders)
                if (metadata?.type === 'invoice_reminder_payment' && metadata.invoice_id) {
                    const invoiceId = metadata.invoice_id;
                    const { error: invError } = await (supabase.from('invoices') as any)
                        .update({
                            status: 'paid',
                            paystack_reference: reference
                        } as any)
                        .eq('id', invoiceId);

                    if (invError) {
                        console.error('Error updating invoice on charge.success:', invError);
                    } else {
                        // Create notification for user
                        await createNotification({
                            userId: userId || metadata.user_id,
                            title: 'Invoice Paid',
                            message: `Invoice ${metadata.invoice_number || 'remitted'} has been paid via Paystack.`,
                            type: 'success',
                            link: `/invoices/${invoiceId}`,
                            supabaseClient: supabase
                        });
                    }
                }

                // 2. Handle Subscription / User Profile Updates
                if (userId && (metadata.plan || metadata.type === 'subscription')) {
                    const updateData: any = {
                        paystack_customer_code: customer.customer_code,
                        subscription_status: 'active',
                    };

                    // If it's a subscription, store the code
                    if (subscription) {
                        updateData.paystack_subscription_code = subscription;
                    }

                    // If it's a one-time lifetime payment
                    if (metadata.plan === 'lifetime') {
                        updateData.subscription_type = 'lifetime';
                    } else if (metadata.plan) {
                        updateData.subscription_type = metadata.plan;
                    }

                    const { error } = await (supabase.from('users') as any)
                        .update(updateData)
                        .eq('id', userId);

                    if (error) console.error('Error updating user on charge.success:', error);
                }
                break;
            }

            case 'subscription.create': {
                const { customer, subscription_code, plan, email } = event.data;

                // Try to find user by email if metadata is missing (though our checkout sends it)
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select('id')
                    .eq('email', email)
                    .single();

                if (userData) {
                    const { error } = await (supabase.from('users') as any)
                        .update({
                            paystack_customer_code: customer.customer_code,
                            paystack_subscription_code: subscription_code,
                            subscription_status: 'active',
                            // We might want to map Paystack plan codes to our plan names
                        })
                        .eq('id', (userData as any).id);

                    if (error) console.error('Error updating user on subscription.create:', error);
                }
                break;
            }

            case 'subscription.disable': {
                const { subscription_code } = event.data;

                const { error } = await (supabase.from('users') as any)
                    .update({
                        subscription_status: 'cancelled',
                    })
                    .eq('paystack_subscription_code', subscription_code);

                if (error) console.error('Error updating user on subscription.disable:', error);
                break;
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error('Paystack webhook error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}

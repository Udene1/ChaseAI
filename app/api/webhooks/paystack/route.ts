import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';

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
                const { metadata, customer, subscription } = event.data;
                const userId = metadata?.user_id;

                if (userId) {
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

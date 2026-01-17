import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { constructWebhookEvent, getEventData } from '@/lib/stripe';
import Stripe from 'stripe';

// POST /api/webhooks/stripe - Handle Stripe webhook events
export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = headers().get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'No signature' }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = constructWebhookEvent(body, signature);
        } catch (error) {
            console.error('Webhook signature verification failed:', error);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        const supabase = createAdminClient();
        const eventData = getEventData(event);

        console.log(`Processing Stripe event: ${event.type}`, eventData);

        switch (event.type) {
            case 'checkout.session.completed': {
                const { userId, customerId, plan } = eventData;

                if (!userId || !customerId) {
                    console.error('Missing userId or customerId in checkout session');
                    break;
                }

                // Update user subscription
                const subscriptionType = plan === 'lifetime' ? 'lifetime' : 'monthly';

                const { error } = await supabase
                    .from('users')
                    .update({
                        subscription_type: subscriptionType,
                        stripe_customer_id: customerId,
                    })
                    .eq('id', userId);

                if (error) {
                    console.error('Failed to update user subscription:', error);
                } else {
                    console.log(`User ${userId} upgraded to ${subscriptionType}`);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const { customerId } = eventData;

                if (!customerId) break;

                // Downgrade to free
                const { error } = await supabase
                    .from('users')
                    .update({ subscription_type: 'free' })
                    .eq('stripe_customer_id', customerId);

                if (error) {
                    console.error('Failed to downgrade user:', error);
                } else {
                    console.log(`User with customer ${customerId} downgraded to free`);
                }
                break;
            }

            case 'invoice.paid': {
                // Subscription renewal - no action needed for now
                console.log('Invoice paid:', eventData);
                break;
            }

            case 'invoice.payment_failed': {
                // Could send notification to user
                console.log('Payment failed:', eventData);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
    }
}

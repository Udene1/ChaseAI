import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyTransaction } from '@/lib/paystack';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=Missing reference`);
    }

    try {
        const data = await verifyTransaction(reference);

        if (data.status && data.data.status === 'success') {
            const supabase = await createAdminClient();
            const { metadata, customer, subscription, plan } = data.data;
            const userId = metadata?.user_id;

            if (userId) {
                const updateData: any = {
                    paystack_customer_code: customer.customer_code,
                    subscription_status: 'active',
                };

                if (subscription) {
                    updateData.paystack_subscription_code = subscription;
                }

                if (metadata.plan === 'lifetime') {
                    updateData.subscription_type = 'lifetime';
                } else if (metadata.plan) {
                    updateData.subscription_type = metadata.plan;
                }

                await (supabase.from('users') as any)
                    .update(updateData)
                    .eq('id', userId);

                return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=Payment successful`);
            }
        }

        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=Payment verification failed`);
    } catch (error) {
        console.error('Paystack verification error:', error);
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=Payment verification failed`);
    }
}

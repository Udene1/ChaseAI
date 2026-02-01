import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { initializeTransaction } from '@/lib/paystack';

export async function POST(req: Request) {
    try {
        const { plan } = await req.json();
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        let amount = 0;
        let planCode = '';

        if (plan === 'nigeria_monthly') {
            amount = 2999;
            planCode = process.env.PAYSTACK_NG_MONTHLY_PLAN_CODE || process.env.PAYSTACK_MONTHLY_PLAN_CODE!;
        } else if (plan === 'nigeria_lifetime') {
            amount = 29999;
        } else if (plan === 'usa_monthly') {
            amount = 11200; // $7 @ 1600
            planCode = process.env.PAYSTACK_US_MONTHLY_PLAN_CODE || process.env.PAYSTACK_GLOBAL_PLAN_CODE!;
        } else if (plan === 'usa_lifetime') {
            amount = 318400; // $199 @ 1600
        } else if (plan === 'intl_monthly') {
            amount = 8000; // $5 @ 1600
            planCode = process.env.PAYSTACK_INTL_MONTHLY_PLAN_CODE || process.env.PAYSTACK_ASIA_PLAN_CODE!;
        } else if (plan === 'intl_lifetime') {
            amount = 238400; // $149 @ 1600
        } else {
            return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
        }

        const data = await initializeTransaction({
            email: user.email!,
            amount,
            plan: plan !== 'lifetime' ? planCode : undefined,
            metadata: {
                user_id: user.id,
                plan,
            },
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/paystack/verify`,
        });

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('Paystack checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

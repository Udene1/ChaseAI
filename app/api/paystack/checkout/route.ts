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

        if (plan === 'monthly') {
            amount = 2999;
            planCode = process.env.PAYSTACK_MONTHLY_PLAN_CODE!;
        } else if (plan === 'early-bird') {
            amount = 1999;
            planCode = process.env.PAYSTACK_EARLY_BIRD_PLAN_CODE!;
        } else if (plan === 'lifetime') {
            amount = 29999;
            // Lifetime doesn't need a plan code as it's a one-time payment
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

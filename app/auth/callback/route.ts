import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const plan = requestUrl.searchParams.get('plan');
    const origin = requestUrl.origin;

    if (code) {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Check if user profile exists, create if not
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('users')
                    .select('id')
                    .eq('id', user.id)
                    .single();

                if (!profile) {
                    // Create user profile
                    await supabase.from('users').insert({
                        id: user.id,
                        email: user.email!,
                        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
                    });
                }
            }

            // Redirect to pricing if plan was selected, otherwise dashboard
            if (plan) {
                return NextResponse.redirect(`${origin}/pricing?plan=${plan}`);
            }
            return NextResponse.redirect(`${origin}/dashboard`);
        }
    }

    // Return to login on error
    return NextResponse.redirect(`${origin}/login?message=Could not authenticate user`);
}

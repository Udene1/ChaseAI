import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { getWelcomeEmail } from '@/lib/templates';

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
                    const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'User';
                    const marketingOptIn = user.user_metadata?.marketing_opt_in === true;

                    // Create user profile
                    const { error: insertError } = await supabase.from('users').insert({
                        id: user.id,
                        email: user.email!,
                        full_name: fullName,
                        marketing_opt_in: marketingOptIn,
                    } as any);

                    if (!insertError) {
                        // Send welcome email
                        try {
                            const welcomeTemplate = getWelcomeEmail(fullName);
                            await sendEmail({
                                to: user.email!,
                                subject: welcomeTemplate.subject,
                                html: welcomeTemplate.html,
                                text: welcomeTemplate.text,
                            });
                        } catch (emailError) {
                            console.error('Error sending welcome email:', emailError);
                        }
                    } else {
                        console.error('Error creating user profile:', insertError);
                    }
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

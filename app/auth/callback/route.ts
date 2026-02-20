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
                const { data: profile } = await (supabase
                    .from('users') as any)
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                const fullName = user.user_metadata?.full_name || user.user_metadata?.name || 'User';
                let shouldSendWelcome = false;

                if (!profile) {
                    // Fallback: Create user profile if trigger failed
                    const { error: insertError } = await supabase.from('users').insert({
                        id: user.id,
                        email: user.email!,
                        full_name: fullName,
                        marketing_opt_in: user.user_metadata?.marketing_opt_in === true,
                        welcome_sent: true, // Mark as sent since we'll do it now
                    } as any);

                    if (!insertError) {
                        shouldSendWelcome = true;
                    } else {
                        console.error('Error creating user profile fallback:', insertError);
                        return NextResponse.redirect(`${origin}/login?message=Database error saving new user`);
                    }
                } else if (!(profile as any).welcome_sent) {
                    // Profile exists (likely from trigger) but welcome email not yet sent
                    shouldSendWelcome = true;
                    // Mark as sent in DB first to avoid race conditions/double sends
                    await supabase.from('users').update({ welcome_sent: true }).eq('id', user.id);
                }

                if (shouldSendWelcome) {
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

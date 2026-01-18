import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function GET(request: Request) {
    try {
        const to = process.env.EMAIL_FROM || 'admin@example.com';

        console.log('Sending test email to:', to);

        const result = await sendEmail({
            to,
            subject: 'ChaseAI Email Test',
            html: `
                <h1>Email System Test</h1>
                <p>If you're reading this, your Resend configuration is working correctly!</p>
                <p><strong>From:</strong> ${process.env.EMAIL_FROM}</p>
                <p><strong>To:</strong> ${to}</p>
                <p><strong>Time:</strong> ${new Date().toISOString()}</p>
            `,
            text: `Email System Test successful for ${to}`,
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: 'Test email sent successfully',
                messageId: result.messageId,
                details: `Sent to ${to} using ${process.env.RESEND_API_KEY ? 'Resend' : 'Fallback'}`
            });
        } else {
            return NextResponse.json({
                success: false,
                error: result.error,
                details: 'Check if your Resend domain is verified and API key is correct.'
            }, { status: 500 });
        }
    } catch (error) {
        console.error('Test email error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

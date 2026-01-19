import { NextResponse } from 'next/server';
import { getUser, getUserProfile } from '@/lib/supabase/server';
import { generateInsights } from '@/lib/ai';
import { UserSettings } from '@/types';

// POST /api/reports/insights - Generate AI insights for reports
export async function POST(request: Request) {
    try {
        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { totalPaid, totalOverdue, avgDaysToPayment, clientData } = body;

        const profile = await getUserProfile();
        const settings = (profile?.settings || {}) as UserSettings;

        const insights = await generateInsights(
            {
                totalPaid: totalPaid || 0,
                totalOverdue: totalOverdue || 0,
                avgDaysToPayment: avgDaysToPayment || 0,
                clientData: clientData || [],
            },
            {
                aiProvider: settings.aiProvider,
                groqApiKey: settings.groqApiKey,
                openaiApiKey: settings.openaiApiKey,
                geminiApiKey: settings.geminiApiKey,
            }
        );

        return NextResponse.json({ success: true, insights });
    } catch (error) {
        console.error('Insights error:', error);
        return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
    }
}

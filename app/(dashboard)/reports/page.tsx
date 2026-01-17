'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { formatCurrency } from '@/lib/utils';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';
import { Brain, Loader2, TrendingUp, TrendingDown, RefreshCw, Lightbulb } from 'lucide-react';
import { User, Invoice } from '@/types';

interface ReportData {
    monthlyData: Array<{ month: string; paid: number; overdue: number; total: number }>;
    statusData: Array<{ name: string; value: number; color: string }>;
    totalPaid: number;
    totalOverdue: number;
    avgDaysToPayment: number;
}

export default function ReportsPage() {
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(true);
    const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [insights, setInsights] = useState<string[]>([]);
    const [defaultCurrency, setDefaultCurrency] = useState<'NGN' | 'USD'>('NGN');

    useEffect(() => {
        loadReportData();
    }, []);

    const loadReportData = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return;

            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profile) {
                const typedProfile = profile as User;
                setUser(typedProfile);
                setDefaultCurrency((typedProfile.default_currency as 'NGN' | 'USD') || 'NGN');
            }

            // Fetch all invoices
            const { data: invoices } = await supabase
                .from('invoices')
                .select('*')
                .eq('user_id', authUser.id);

            if (!invoices) {
                setReportData(null);
                return;
            }

            // Process data for charts
            const monthlyMap = new Map<string, { monthName: string; paid: number; overdue: number; total: number }>();
            const now = new Date();

            // Initialize last 6 months with keys like "2024-01"
            for (let i = 5; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                monthlyMap.set(key, { monthName, paid: 0, overdue: 0, total: 0 });
            }

            let totalPaid = 0;
            let totalOverdue = 0;
            let paidCount = 0;
            let totalDaysToPayment = 0;

            invoices.forEach((inv: Invoice) => {
                const amount = Number(inv.amount);
                const invDate = new Date(inv.created_at);
                const key = `${invDate.getFullYear()}-${String(invDate.getMonth() + 1).padStart(2, '0')}`;

                // Global totals (independent of the 6-month chart window)
                if (inv.status === 'paid') {
                    totalPaid += amount;
                    paidCount++;

                    // Improved calculation: Use difference between updated_at and created_at if paid
                    // updated_at usually changes when status changes to 'paid'
                    const created = new Date(inv.created_at);
                    const updated = new Date(inv.updated_at);
                    const days = Math.max(0.5, (updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
                    totalDaysToPayment += days;
                } else if (inv.status === 'overdue') {
                    totalOverdue += amount;
                }

                // Chart data (only for the 6-month window)
                if (monthlyMap.has(key)) {
                    const data = monthlyMap.get(key)!;
                    data.total += amount;
                    if (inv.status === 'paid') {
                        data.paid += amount;
                    } else if (inv.status === 'overdue') {
                        data.overdue += amount;
                    }
                }
            });

            const monthlyData = Array.from(monthlyMap.values()).map((data) => ({
                month: data.monthName,
                paid: data.paid,
                overdue: data.overdue,
                total: data.total,
            }));

            const statusCounts = {
                draft: (invoices as Invoice[]).filter((i) => i.status === 'draft').length,
                sent: (invoices as Invoice[]).filter((i) => i.status === 'sent').length,
                overdue: (invoices as Invoice[]).filter((i) => i.status === 'overdue').length,
                paid: (invoices as Invoice[]).filter((i) => i.status === 'paid').length,
            };

            const statusData = [
                { name: 'Draft', value: statusCounts.draft, color: '#9ca3af' },
                { name: 'Sent', value: statusCounts.sent, color: '#3b82f6' },
                { name: 'Overdue', value: statusCounts.overdue, color: '#ef4444' },
                { name: 'Paid', value: statusCounts.paid, color: '#10b981' },
            ].filter((d) => d.value > 0);

            setReportData({
                monthlyData,
                statusData,
                totalPaid,
                totalOverdue,
                avgDaysToPayment: paidCount > 0 ? Math.round(totalDaysToPayment / paidCount) : 0,
            });
        } catch (error) {
            console.error('Error loading report data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateInsights = async () => {
        if (!reportData) return;

        setIsGeneratingInsights(true);
        try {
            const response = await fetch('/api/reports/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    totalPaid: reportData.totalPaid,
                    totalOverdue: reportData.totalOverdue,
                    avgDaysToPayment: reportData.avgDaysToPayment,
                }),
            });

            if (!response.ok) throw new Error('Failed to generate insights');

            const data = await response.json();
            setInsights(data.insights || []);
        } catch (error) {
            console.error('Error generating insights:', error);
            // Fallback insights
            setInsights([
                'Consider sending reminders 3 days before due dates to improve on-time payments.',
                'Clients who receive WhatsApp reminders tend to pay 40% faster.',
                'Offering a 2% early payment discount could improve cash flow.',
            ]);
        } finally {
            setIsGeneratingInsights(false);
        }
    };

    if (isLoading) {
        return (
            <>
                <Header title="Reports" subtitle="Track your invoice performance" />
                <div className="p-6 flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Reports" subtitle="Track your invoice performance" user={user} />

            <div className="p-6 space-y-6">
                {/* Stats Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Collected</p>
                                <p className="text-2xl font-bold text-green-600 mt-1">
                                    {formatCurrency(reportData?.totalPaid || 0, defaultCurrency)}
                                </p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Outstanding</p>
                                <p className="text-2xl font-bold text-red-600 mt-1">
                                    {formatCurrency(reportData?.totalOverdue || 0, defaultCurrency)}
                                </p>
                            </div>
                            <div className="p-3 bg-red-100 rounded-xl">
                                <TrendingDown className="w-6 h-6 text-red-600" />
                            </div>
                        </div>
                    </Card>
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Avg. Days to Payment</p>
                                <p className="text-2xl font-bold text-dark-900 mt-1">
                                    {reportData?.avgDaysToPayment || 0} days
                                </p>
                            </div>
                            <div className="p-3 bg-primary-100 rounded-xl">
                                <RefreshCw className="w-6 h-6 text-primary-600" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Monthly Performance */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-dark-900 mb-4">Monthly Performance</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={reportData?.monthlyData || []}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value, defaultCurrency)}
                                    />
                                    <Bar dataKey="paid" name="Paid" fill="#10b981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="overdue" name="Overdue" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Invoice Status Distribution */}
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold text-dark-900 mb-4">Invoice Status</h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={reportData?.statusData || []}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {(reportData?.statusData || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>

                {/* AI Insights */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Brain className="w-5 h-5 text-primary-600" />
                            <h3 className="text-lg font-semibold text-dark-900">AI Insights</h3>
                        </div>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={generateInsights}
                            isLoading={isGeneratingInsights}
                            leftIcon={<Lightbulb className="w-4 h-4" />}
                        >
                            Generate Insights
                        </Button>
                    </div>

                    {insights.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                            <Brain className="w-12 h-12 text-gray-300 mx-auto" />
                            <p className="mt-3 text-gray-500">Click &quot;Generate Insights&quot; to get AI-powered recommendations</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {insights.map((insight, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 bg-primary-50 border border-primary-100 rounded-xl"
                                >
                                    <Lightbulb className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-primary-800">{insight}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}

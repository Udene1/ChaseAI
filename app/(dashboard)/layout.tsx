import { redirect } from 'next/navigation';
import { getUser, getUserProfile } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/sidebar';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <main className="pl-64">
                {children}
            </main>
        </div>
    );
}

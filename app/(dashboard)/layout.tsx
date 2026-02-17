import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/server';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNavProvider } from '@/lib/context/mobile-nav';
import { PendingInvoiceHandler } from '@/components/dashboard/pending-invoice-handler';

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
        <MobileNavProvider>
            <PendingInvoiceHandler />
            <div className="min-h-screen bg-gray-50 flex">
                <Sidebar />
                <main className="flex-1 md:pl-64 transition-all duration-300">
                    {children}
                </main>
            </div>
        </MobileNavProvider>
    );
}

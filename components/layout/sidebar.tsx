'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    Settings,
    BarChart3,
    Users,
    Bell,
    LogOut,
    Plus,
    Zap,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col z-40">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold gradient-text">ChaseAI</span>
                </Link>
            </div>

            {/* Quick action */}
            <div className="p-4">
                <Link
                    href="/invoices/new"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Invoice
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto custom-scrollbar">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn('sidebar-link', isActive && 'sidebar-link-active')}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleSignOut}
                    className="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

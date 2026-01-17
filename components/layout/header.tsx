'use client';

import { useState } from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User as UserType } from '@/types';

interface HeaderProps {
    title: string;
    subtitle?: string;
    user?: UserType | null;
}

export function Header({ title, subtitle, user }: HeaderProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Left side - Title */}
            <div>
                <h1 className="text-xl font-semibold text-dark-900">{title}</h1>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search invoices..."
                        className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showProfileMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowProfileMenu(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-slide-down">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-sm font-medium text-dark-900">
                                        {user?.full_name || 'User'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                                <a
                                    href="/settings"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Account Settings
                                </a>
                                <a
                                    href="/settings#subscription"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Manage Subscription
                                </a>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

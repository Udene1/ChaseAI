'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bell, Search, User, ChevronDown, Menu, Check, Loader2, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { User as UserType } from '@/types';
import { useMobileNav } from '@/lib/context/mobile-nav';
import Link from 'next/link';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    is_read: boolean;
    link?: string | null;
    created_at: string;
}

interface HeaderProps {
    title: string;
    subtitle?: string;
    user?: UserType | null;
}

export function Header({ title, subtitle, user }: HeaderProps) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
    const { toggle } = useMobileNav();

    const fetchNotifications = useCallback(async () => {
        try {
            setIsLoadingNotifications(true);
            const response = await fetch('/api/notifications');
            if (response.ok) {
                const data = await response.json();
                setNotifications(data);
                const unread = data.filter((n: Notification) => !n.is_read).length;
                setUnreadCount(unread);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoadingNotifications(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        // Set up polling every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const markAsRead = async (id?: string, markAll = false) => {
        try {
            const response = await fetch('/api/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, markAllAsRead: markAll }),
            });

            if (response.ok) {
                if (markAll) {
                    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
                    setUnreadCount(0);
                } else if (id) {
                    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <header className="h-16 bg-white border-b border-gray-100 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Left side - Menu toggle & Title */}
            <div className="flex items-center gap-3">
                <button
                    onClick={toggle}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg md:hidden"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-lg md:text-xl font-semibold text-dark-900 leading-tight">{title}</h1>
                    {subtitle && <p className="text-xs md:text-sm text-gray-500 line-clamp-1">{subtitle}</p>}
                </div>
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
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowProfileMenu(false);
                        }}
                        className={cn(
                            "relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors",
                            showNotifications && "bg-gray-100 text-gray-900"
                        )}
                    >
                        <Bell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <>
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-slide-down max-h-[500px] flex flex-col">
                                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-dark-900">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={() => markAsRead(undefined, true)}
                                            className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                                        >
                                            <Check className="w-3 h-3" />
                                            Mark all as read
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    {isLoadingNotifications && notifications.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                                            <Loader2 className="w-6 h-6 animate-spin mb-2" />
                                            <p className="text-sm">Loading alerts...</p>
                                        </div>
                                    ) : notifications.length > 0 ? (
                                        <div className="divide-y divide-gray-50">
                                            {notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    onClick={() => {
                                                        if (!notification.is_read) markAsRead(notification.id);
                                                    }}
                                                    className={cn(
                                                        "p-4 hover:bg-gray-50 transition-colors cursor-pointer group",
                                                        !notification.is_read && "bg-primary-50/30"
                                                    )}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="mt-0.5">
                                                            {getIconForType(notification.type)}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between gap-2">
                                                                <p className={cn(
                                                                    "text-sm font-medium",
                                                                    notification.is_read ? "text-dark-900" : "text-primary-900"
                                                                )}>
                                                                    {notification.title}
                                                                </p>
                                                                <time className="text-[10px] text-gray-400 whitespace-nowrap">
                                                                    {new Date(notification.created_at).toLocaleDateString()}
                                                                </time>
                                                            </div>
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                                {notification.message}
                                                            </p>
                                                            {notification.link && (
                                                                <Link
                                                                    href={notification.link}
                                                                    className="text-[10px] text-primary-600 font-medium mt-2 flex items-center gap-1 hover:underline"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setShowNotifications(false);
                                                                    }}
                                                                >
                                                                    View Details
                                                                </Link>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                                            <Bell className="w-8 h-8 opacity-20 mb-2" />
                                            <p className="text-sm">No notifications yet</p>
                                        </div>
                                    )}
                                </div>

                                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50 rounded-b-xl text-center">
                                    <p className="text-[10px] text-gray-400">
                                        You'll get notified here about sent reminders and invoices.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Profile dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowProfileMenu(!showProfileMenu);
                            setShowNotifications(false);
                        }}
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

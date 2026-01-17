'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Header } from '@/components/layout/header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';
import {
    Settings,
    Key,
    Mail,
    MessageSquare,
    Brain,
    CreditCard,
    Shield,
    Loader2,
    ExternalLink,
    Check,
} from 'lucide-react';
import { User, UserSettings } from '@/types';

export default function SettingsPage() {
    const router = useRouter();
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [settings, setSettings] = useState<UserSettings>({
        aiProvider: 'groq',
        defaultCurrency: 'NGN',
        preferWhatsApp: false,
    });

    const loadUserSettings = useCallback(async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                router.push('/login');
                return;
            }

            const { data: profile } = await supabase
                .from('users')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profile) {
                const typedProfile = profile as User;
                setUser(typedProfile);
                setSettings({
                    ...settings,
                    ...(typedProfile.settings as UserSettings),
                });
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setIsLoading(false);
        }
    }, [supabase, router, settings]);

    useEffect(() => {
        loadUserSettings();
    }, [loadUserSettings]);

    const saveSettings = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            const { error } = await (supabase.from('users') as any)
                .update({
                    settings: settings as any,
                    default_currency: settings.defaultCurrency || 'NGN',
                })
                .eq('id', user.id);

            if (error) throw error;

            toast.success('Settings saved successfully!');
        } catch (error) {
            toast.error('Failed to save settings');
            console.error('Save error:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const updateSetting = (key: keyof UserSettings, value: string | boolean) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleManageSubscription = async () => {
        try {
            const response = await fetch('/api/stripe/portal', {
                method: 'POST',
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            toast.error('Failed to open subscription portal');
        }
    };

    if (isLoading) {
        return (
            <>
                <Header title="Settings" subtitle="Manage your account and integrations" />
                <div className="p-6 flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Settings" subtitle="Manage your account and integrations" user={user} />

            <div className="p-6 max-w-4xl mx-auto space-y-6">
                {/* Subscription Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Subscription
                        </CardTitle>
                        <CardDescription>Manage your subscription plan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-semibold text-dark-900 capitalize">
                                    {user?.subscription_type === 'lifetime'
                                        ? '🎉 Lifetime Deal'
                                        : user?.subscription_type === 'monthly'
                                            ? 'Monthly Plan'
                                            : 'Free Plan'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {user?.subscription_type === 'free'
                                        ? 'Upgrade to unlock all features'
                                        : 'You have access to all features'}
                                </p>
                            </div>
                            {user?.subscription_type === 'free' ? (
                                <Button onClick={() => router.push('/pricing')} size="sm">
                                    Upgrade
                                </Button>
                            ) : user?.stripe_customer_id ? (
                                <Button variant="secondary" size="sm" onClick={handleManageSubscription}>
                                    Manage
                                    <ExternalLink className="w-4 h-4 ml-2" />
                                </Button>
                            ) : null}
                        </div>
                    </CardContent>
                </Card>

                {/* Default Currency */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Preferences
                        </CardTitle>
                        <CardDescription>Set your default preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select
                            label="Default Currency"
                            value={settings.defaultCurrency || 'NGN'}
                            onChange={(e) => updateSetting('defaultCurrency', e.target.value)}
                            options={[
                                { value: 'NGN', label: '🇳🇬 Nigerian Naira (NGN)' },
                                { value: 'USD', label: '🇺🇸 US Dollar (USD)' },
                                { value: 'EUR', label: '🇪🇺 Euro (EUR)' },
                                { value: 'GBP', label: '🇬🇧 British Pound (GBP)' },
                            ]}
                        />
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div>
                                <p className="font-medium text-dark-900">Prefer WhatsApp</p>
                                <p className="text-sm text-gray-500">Send reminders via WhatsApp when available</p>
                            </div>
                            <button
                                onClick={() => updateSetting('preferWhatsApp', !settings.preferWhatsApp)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${settings.preferWhatsApp ? 'bg-primary-500' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.preferWhatsApp ? 'translate-x-7' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Brain className="w-5 h-5" />
                            AI Configuration
                        </CardTitle>
                        <CardDescription>Configure AI for personalized reminders</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select
                            label="AI Provider"
                            value={settings.aiProvider || 'groq'}
                            onChange={(e) => updateSetting('aiProvider', e.target.value)}
                            options={[
                                { value: 'groq', label: 'Groq (Recommended - Fast & Free)' },
                                { value: 'xai', label: 'xAI (Grok - Versatile)' },
                                { value: 'openai', label: 'OpenAI (GPT-4)' },
                            ]}
                        />
                        {settings.aiProvider === 'groq' ? (
                            <Input
                                label="Groq API Key"
                                type="password"
                                value={settings.groqApiKey || ''}
                                onChange={(e) => updateSetting('groqApiKey', e.target.value)}
                                placeholder="gsk_..."
                                helper="Get your API key from console.groq.com. (Tip: xAI keys starting with xai- also work here!)"
                                leftIcon={<Key className="w-5 h-5" />}
                            />
                        ) : settings.aiProvider === 'xai' ? (
                            <Input
                                label="xAI API Key"
                                type="password"
                                value={settings.xaiApiKey || ''}
                                onChange={(e) => updateSetting('xaiApiKey', e.target.value)}
                                placeholder="xai-..."
                                helper="Get your API key from console.x.ai"
                                leftIcon={<Key className="w-5 h-5" />}
                            />
                        ) : (
                            <Input
                                label="OpenAI API Key"
                                type="password"
                                value={settings.openaiApiKey || ''}
                                onChange={(e) => updateSetting('openaiApiKey', e.target.value)}
                                placeholder="sk-..."
                                helper="Get your API key from platform.openai.com"
                                leftIcon={<Key className="w-5 h-5" />}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Email Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Email Configuration
                        </CardTitle>
                        <CardDescription>Configure how your emails appear to clients</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            label="Business Name"
                            value={settings.businessName || ''}
                            onChange={(e) => updateSetting('businessName', e.target.value)}
                            placeholder="e.g. Verimut Financial Services"
                            helper="This will appear in the email footer"
                            leftIcon={<Settings className="w-5 h-5" />}
                        />
                        <Input
                            label="Reply-To Email"
                            type="email"
                            value={settings.replyToEmail || ''}
                            onChange={(e) => updateSetting('replyToEmail', e.target.value)}
                            placeholder="support@yourdomain.com"
                            helper="Client replies will be sent to this address"
                            leftIcon={<Mail className="w-5 h-5" />}
                        />
                    </CardContent>
                </Card>

                {/* SMS/WhatsApp Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            SMS/WhatsApp Configuration
                        </CardTitle>
                        <CardDescription>Configure Twilio for SMS and WhatsApp reminders</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            label="Twilio Account SID"
                            type="password"
                            value={settings.twilioAccountSid || ''}
                            onChange={(e) => updateSetting('twilioAccountSid', e.target.value)}
                            placeholder="AC..."
                            leftIcon={<Key className="w-5 h-5" />}
                        />
                        <Input
                            label="Twilio Auth Token"
                            type="password"
                            value={settings.twilioAuthToken || ''}
                            onChange={(e) => updateSetting('twilioAuthToken', e.target.value)}
                            placeholder="••••••••"
                            leftIcon={<Key className="w-5 h-5" />}
                        />
                        <Input
                            label="Twilio Phone Number"
                            value={settings.twilioPhoneNumber || ''}
                            onChange={(e) => updateSetting('twilioPhoneNumber', e.target.value)}
                            placeholder="+1234567890"
                            helper="Your Twilio phone number for SMS/WhatsApp"
                        />
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button onClick={saveSettings} isLoading={isSaving} size="lg">
                        <Check className="w-5 h-5 mr-2" />
                        Save Settings
                    </Button>
                </div>
            </div>
        </>
    );
}

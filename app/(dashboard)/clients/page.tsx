import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getUserProfile } from '@/lib/supabase/server';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Plus, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { Client } from '@/types';

async function getClients() {
    const supabase = createClient();
    const profile = await getUserProfile();

    if (!profile) {
        return { clients: [], profile: null };
    }

    const userId = profile.id;

    const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    return { clients: (clients || []) as Client[], profile };
}

export default async function ClientsPage() {
    const { clients, profile } = await getClients();

    return (
        <>
            <Header
                title="Clients"
                subtitle={`${clients.length} client${clients.length !== 1 ? 's' : ''}`}
                user={profile}
            />

            <div className="p-4 md:p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div />
                    <Link href="/invoices/new">
                        <Button leftIcon={<Plus className="w-5 h-5" />}>
                            Add Client
                        </Button>
                    </Link>
                </div>

                {/* Clients Grid */}
                {clients.length === 0 ? (
                    <Card className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <h4 className="mt-4 text-lg font-medium text-dark-900">No clients yet</h4>
                        <p className="mt-2 text-gray-500">Clients are created automatically when you create invoices.</p>
                        <Link href="/invoices/new" className="mt-4 inline-block">
                            <Button size="sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Create Invoice
                            </Button>
                        </Link>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {clients.map((client) => (
                            <Card key={client.id} className="hover:shadow-lg transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-lg font-semibold">
                                        {client.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-dark-900 truncate">{client.name}</h3>
                                        <div className="mt-2 space-y-1">
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                <span className="truncate">{client.email}</span>
                                            </p>
                                            {client.phone && (
                                                <p className="text-sm text-gray-500 flex items-center gap-2">
                                                    {client.whatsapp_enabled ? (
                                                        <MessageSquare className="w-4 h-4 text-green-500" />
                                                    ) : (
                                                        <Phone className="w-4 h-4" />
                                                    )}
                                                    {client.phone}
                                                </p>
                                            )}
                                        </div>
                                        <p className="mt-3 text-xs text-gray-400">
                                            Added {formatDate(client.created_at)}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

// Database types matching Supabase schema

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    subscription_type: 'free' | 'monthly' | 'early-bird' | 'lifetime';
                    subscription_status: string | null;
                    stripe_customer_id: string | null;
                    paystack_customer_code: string | null;
                    paystack_subscription_code: string | null;
                    default_currency: string;
                    settings: Json;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    subscription_type?: 'free' | 'monthly' | 'early-bird' | 'lifetime';
                    subscription_status?: string | null;
                    stripe_customer_id?: string | null;
                    paystack_customer_code?: string | null;
                    paystack_subscription_code?: string | null;
                    default_currency?: string;
                    settings?: Json;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    subscription_type?: 'free' | 'monthly' | 'early-bird' | 'lifetime';
                    subscription_status?: string | null;
                    stripe_customer_id?: string | null;
                    paystack_customer_code?: string | null;
                    paystack_subscription_code?: string | null;
                    default_currency?: string;
                    settings?: Json;
                    created_at?: string;
                };
            };
            clients: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    email: string;
                    phone: string | null;
                    whatsapp_enabled: boolean;
                    history_notes: Json;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    email: string;
                    phone?: string | null;
                    whatsapp_enabled?: boolean;
                    history_notes?: Json;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    email?: string;
                    phone?: string | null;
                    whatsapp_enabled?: boolean;
                    history_notes?: Json;
                    created_at?: string;
                };
            };
            invoices: {
                Row: {
                    id: string;
                    user_id: string;
                    client_id: string | null;
                    invoice_number: string;
                    amount: number;
                    currency: string;
                    due_date: string;
                    description: string | null;
                    status: 'draft' | 'sent' | 'overdue' | 'paid';
                    pdf_url: string | null;
                    stripe_payment_intent_id: string | null;
                    paystack_payment_url: string | null;
                    paystack_reference: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    client_id?: string | null;
                    invoice_number: string;
                    amount: number;
                    currency?: string;
                    due_date: string;
                    description?: string | null;
                    status?: 'draft' | 'sent' | 'overdue' | 'paid';
                    pdf_url?: string | null;
                    stripe_payment_intent_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    client_id?: string | null;
                    invoice_number?: string;
                    amount?: number;
                    currency?: string;
                    due_date?: string;
                    description?: string | null;
                    status?: 'draft' | 'sent' | 'overdue' | 'paid';
                    pdf_url?: string | null;
                    stripe_payment_intent_id?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            reminders: {
                Row: {
                    id: string;
                    invoice_id: string;
                    type: 'email' | 'sms' | 'whatsapp';
                    escalation_level: number;
                    scheduled_date: string | null;
                    sent_date: string | null;
                    status: 'pending' | 'sent' | 'failed';
                    ai_message: string | null;
                    error_message: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    invoice_id: string;
                    type: 'email' | 'sms' | 'whatsapp';
                    escalation_level?: number;
                    scheduled_date?: string | null;
                    sent_date?: string | null;
                    status?: 'pending' | 'sent' | 'failed';
                    ai_message?: string | null;
                    error_message?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    invoice_id?: string;
                    type?: 'email' | 'sms' | 'whatsapp';
                    escalation_level?: number;
                    scheduled_date?: string | null;
                    sent_date?: string | null;
                    status?: 'pending' | 'sent' | 'failed';
                    ai_message?: string | null;
                    error_message?: string | null;
                    created_at?: string;
                };
            };
            notifications: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    message: string;
                    type: 'info' | 'success' | 'warning' | 'error';
                    is_read: boolean;
                    link: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    message: string;
                    type?: 'info' | 'success' | 'warning' | 'error';
                    is_read?: boolean;
                    link?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    message?: string;
                    type?: 'info' | 'success' | 'warning' | 'error';
                    is_read?: boolean;
                    link?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
        Views: {};
        Functions: {};
        Enums: {};
    };
}

// Shared application types

import { Database } from './database';

// Extract row types from database
export type User = Database['public']['Tables']['users']['Row'];
export type Client = Database['public']['Tables']['clients']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type Reminder = Database['public']['Tables']['reminders']['Row'];

// Insert types
export type UserInsert = Database['public']['Tables']['users']['Insert'];
export type ClientInsert = Database['public']['Tables']['clients']['Insert'];
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
export type ReminderInsert = Database['public']['Tables']['reminders']['Insert'];

// Update types
export type UserUpdate = Database['public']['Tables']['users']['Update'];
export type ClientUpdate = Database['public']['Tables']['clients']['Update'];
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];
export type ReminderUpdate = Database['public']['Tables']['reminders']['Update'];

// Invoice status enum
export type InvoiceStatus = 'draft' | 'sent' | 'overdue' | 'paid';

// Reminder type enum
export type ReminderType = 'email' | 'sms' | 'whatsapp';

// Escalation levels
export type EscalationLevel = 1 | 2 | 3;

// Currency options
export type Currency = 'NGN' | 'USD' | 'EUR' | 'GBP';

// Subscription types
export type SubscriptionType = 'free' | 'monthly' | 'lifetime';

// Client history note structure
export interface ClientHistoryNote {
    date: string;
    type: 'payment' | 'reminder' | 'note';
    message: string;
    invoiceId?: string;
    daysLate?: number;
}

// User settings structure
export interface UserSettings {
    groqApiKey?: string;
    openaiApiKey?: string;
    geminiApiKey?: string;
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioPhoneNumber?: string;
    businessName?: string;
    replyToEmail?: string;
    preferWhatsApp?: boolean;
    aiProvider?: 'groq' | 'openai' | 'xai' | 'gemini';
    defaultCurrency?: Currency;
    xaiApiKey?: string;
}

// Invoice with client details
export interface InvoiceWithClient extends Invoice {
    client: Client | null;
    reminders?: Reminder[];
}

// Dashboard stats
export interface DashboardStats {
    totalInvoices: number;
    totalOutstanding: number;
    overdueCount: number;
    paidThisMonth: number;
    collectionRate: number;
}

// AI Reminder response
export interface AIReminderResponse {
    subject: string;
    message: string;
    tone: 'polite' | 'firm' | 'urgent';
    suggestedAction?: string;
}

// Report data types
export interface PaymentTrend {
    month: string;
    paid: number;
    overdue: number;
    total: number;
}

export interface ClientReliability {
    clientId: string;
    clientName: string;
    avgDaysToPayment: number;
    onTimeRate: number;
    totalInvoices: number;
}

// API response types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
}

// Form schemas for validation
export interface InvoiceFormData {
    clientId?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    amount: number;
    currency: Currency;
    dueDate: string;
    description?: string;
    createNewClient?: boolean;
}

export interface ClientFormData {
    name: string;
    email: string;
    phone?: string;
    whatsappEnabled?: boolean;
}

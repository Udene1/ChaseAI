/**
 * ChaseAI Seed Script
 * 
 * Run with: npm run seed
 * 
 * This script creates sample data for testing.
 * Make sure to set your Supabase credentials in .env.local first.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
    console.log('🌱 Starting seed...\n');

    // Check if test user exists (you'll need to create this user first via signup)
    const testEmail = 'test@chaseai.app';

    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', testEmail)
        .single();

    let userId: string;

    if (existingUser) {
        userId = existingUser.id;
        console.log('✓ Using existing test user:', testEmail);
    } else {
        console.log('⚠ No test user found. Please sign up first with:', testEmail);
        console.log('  Then run this script again.\n');

        // Create a placeholder user for demo purposes
        // In production, users are created via auth.signUp
        console.log('Creating demo data with a sample user ID...\n');
        userId = '00000000-0000-0000-0000-000000000001';

        // Insert demo user
        const { error: userError } = await supabase
            .from('users')
            .upsert({
                id: userId,
                email: testEmail,
                full_name: 'Demo User',
                subscription_type: 'lifetime',
                default_currency: 'NGN',
            });

        if (userError) {
            console.error('Error creating demo user:', userError.message);
            console.log('Note: This might fail if the user ID doesn\'t exist in auth.users');
        }
    }

    // Sample clients
    const clients = [
        {
            user_id: userId,
            name: 'Acme Corporation',
            email: 'billing@acme.com',
            phone: '+2348012345678',
            whatsapp_enabled: true,
            history_notes: [
                { date: '2024-01-15', type: 'payment', message: 'Paid on time', daysLate: 0 },
                { date: '2024-02-20', type: 'payment', message: 'Paid 3 days late', daysLate: 3 },
            ],
        },
        {
            user_id: userId,
            name: 'TechStart Nigeria',
            email: 'finance@techstart.ng',
            phone: '+2349087654321',
            whatsapp_enabled: true,
            history_notes: [],
        },
        {
            user_id: userId,
            name: 'Global Exports Ltd',
            email: 'accounts@globalexports.com',
            phone: null,
            whatsapp_enabled: false,
            history_notes: [
                { date: '2024-01-01', type: 'payment', message: 'Always pays late', daysLate: 14 },
            ],
        },
    ];

    console.log('Creating sample clients...');

    const { data: insertedClients, error: clientsError } = await supabase
        .from('clients')
        .upsert(clients, { onConflict: 'id' })
        .select('id, name');

    if (clientsError) {
        console.error('Error creating clients:', clientsError.message);
    } else {
        console.log(`✓ Created ${insertedClients?.length || 0} clients\n`);
    }

    // Sample invoices
    const now = new Date();
    const invoices = [
        {
            user_id: userId,
            client_id: insertedClients?.[0]?.id,
            invoice_number: 'INV-2401-A1B2',
            amount: 250000,
            currency: 'NGN',
            due_date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days ago
            description: 'Web development services - January 2024',
            status: 'overdue',
        },
        {
            user_id: userId,
            client_id: insertedClients?.[1]?.id,
            invoice_number: 'INV-2401-C3D4',
            amount: 150000,
            currency: 'NGN',
            due_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
            description: 'Mobile app consultation',
            status: 'sent',
        },
        {
            user_id: userId,
            client_id: insertedClients?.[2]?.id,
            invoice_number: 'INV-2401-E5F6',
            amount: 500,
            currency: 'USD',
            due_date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
            description: 'API integration project',
            status: 'draft',
        },
        {
            user_id: userId,
            client_id: insertedClients?.[0]?.id,
            invoice_number: 'INV-2312-G7H8',
            amount: 180000,
            currency: 'NGN',
            due_date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
            description: 'December retainer',
            status: 'paid',
        },
    ];

    console.log('Creating sample invoices...');

    const { data: insertedInvoices, error: invoicesError } = await supabase
        .from('invoices')
        .upsert(invoices, { onConflict: 'id' })
        .select('id, invoice_number');

    if (invoicesError) {
        console.error('Error creating invoices:', invoicesError.message);
    } else {
        console.log(`✓ Created ${insertedInvoices?.length || 0} invoices\n`);
    }

    // Sample reminders for overdue invoice
    if (insertedInvoices?.[0]) {
        const reminders = [
            {
                invoice_id: insertedInvoices[0].id,
                type: 'email',
                escalation_level: 1,
                scheduled_date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                sent_date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'sent',
                ai_message: 'Hi, this is a friendly reminder about invoice INV-2401-A1B2...',
            },
            {
                invoice_id: insertedInvoices[0].id,
                type: 'email',
                escalation_level: 2,
                scheduled_date: new Date().toISOString(),
                status: 'pending',
            },
        ];

        console.log('Creating sample reminders...');

        const { error: remindersError } = await supabase
            .from('reminders')
            .upsert(reminders, { onConflict: 'id' });

        if (remindersError) {
            console.error('Error creating reminders:', remindersError.message);
        } else {
            console.log('✓ Created sample reminders\n');
        }
    }

    console.log('🎉 Seed completed!\n');
    console.log('You can now run: npm run dev');
}

seed().catch(console.error);

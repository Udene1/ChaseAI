import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://ycjkhmnhyghtvmwlotjx.supabase.co',
    'sb_secret_t-WWMV2oGVunZBPXOiwDMA_ZCSktMBn'
);

const userId = '67b9e2be-e9ae-40c3-928b-70bfdc6a7eb6';

async function findData() {
    const { data: clients } = await supabase.from('clients').select('id, name').eq('user_id', userId).limit(1);
    const { data: invoices } = await supabase.from('invoices').select('id, invoice_number').eq('user_id', userId).limit(1);

    console.log('Test Client:', JSON.stringify(clients?.[0], null, 2));
    console.log('Test Invoice:', JSON.stringify(invoices?.[0], null, 2));
}

findData();

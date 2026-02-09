import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://ycjkhmnhyghtvmwlotjx.supabase.co',
    'sb_secret_t-WWMV2oGVunZBPXOiwDMA_ZCSktMBn'
);

async function findUser() {
    const { data: users, error } = await supabase.from('users').select('id, api_key').limit(5);
    if (error) {
        console.error('Error fetching users:', error);
        return;
    }
    console.log('Available users:', JSON.stringify(users, null, 2));
}

findUser();

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

/**
 * Create Supabase client for browser/client-side usage
 */
export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing env variables when creating supabase');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: typeof window !== 'undefined' },
});

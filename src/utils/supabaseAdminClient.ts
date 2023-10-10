import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Needed for deleting auth users
const supabaseSecretServiceRoleKey = process.env.NEXT_SECRET_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseSecretServiceRoleKey) {
  throw new Error('Missing env variables when creating supabase');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseSecretServiceRoleKey,
  { auth: { persistSession: typeof window !== 'undefined' } },
);

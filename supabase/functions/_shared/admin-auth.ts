import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// This is a shared Supabase client that uses the service role key for admin operations.
export const adminAuthClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

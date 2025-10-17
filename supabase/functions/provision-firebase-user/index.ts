import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()
    if (!token) throw new Error('Firebase token is missing.')

    // Admin client (service role)
    const supabaseAdmin = createClient(
      Deno.env.get('RUG_SUPABASE_URL') ?? '',
      Deno.env.get('RUG_SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Sign in or provision via external ID token (Firebase)
    const { data: session, error: sessionError } = await supabaseAdmin.auth.signInWithIdToken({
      provider: 'firebase',
      token,
    })
    if (sessionError || !session?.user) throw (sessionError ?? new Error('Failed to establish session'))

    // Ensure a profile row exists
    await supabaseAdmin.from('profiles').upsert({ id: session.user.id })

    // Return access/refresh tokens expected by client
    return new Response(
      JSON.stringify({
        access_token: session.session?.access_token,
        refresh_token: session.session?.refresh_token,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

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

    // Admin client (service role) — prefer standard env names with fallback
    const url = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('RUG_SUPABASE_URL') ?? ''
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('RUG_SUPABASE_SERVICE_ROLE_KEY') ?? ''
    if (!url || !serviceKey) {
      throw new Error('Service role environment not configured (SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY).')
    }
    const supabaseAdmin = createClient(url, serviceKey)

    // Sign in or provision via external ID token (Firebase)
    const { data: session, error: sessionError } = await supabaseAdmin.auth.signInWithIdToken({
      provider: 'firebase',
      token,
    })
    if (sessionError || !session?.user) throw (sessionError ?? new Error('Failed to establish session (signInWithIdToken).'))

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
    console.error('provision-firebase-user error', error)
    const message = (error as any)?.message ?? 'Unknown error'
    return new Response(
      JSON.stringify({ error: { message } }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

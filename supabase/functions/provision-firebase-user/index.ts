import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { adminAuthClient } from '../_shared/admin-auth.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()
    if (!token) throw new Error("Firebase token is missing.")

    // 1. Get the Firebase user from the token
    const { data: { user: firebaseUser }, error: userError } = await adminAuthClient.auth.admin.getUserByJwt(token)
    if (userError) throw userError
    if (!firebaseUser) throw new Error("Invalid Firebase token.")

    // 2. Check if a user with this Firebase UID already exists in Supabase auth
    const { data: { user: existingSupabaseUser } } = await adminAuthClient.auth.admin.getUserById(firebaseUser.id)

    let supabaseUser = existingSupabaseUser;
    if (!existingSupabaseUser) {
      // 3. If user doesn't exist, create them in Supabase auth
      const { data: { user: newSupabaseUser }, error: createError } = await adminAuthClient.auth.admin.createUser({
        user_metadata: { provider: 'firebase' },
        email: firebaseUser.email, // Can be null
        phone: firebaseUser.phone_number,
        id: firebaseUser.id, // Use the Firebase UID as the Supabase UID
      })
      if (createError) throw createError
      supabaseUser = newSupabaseUser
    }
    
    if (!supabaseUser) throw new Error("Failed to create or find Supabase user.")

    // 4. Ensure a profile row exists (id primary key matches auth user id)
    await adminAuthClient.from('profiles').upsert({
      id: supabaseUser.id,
      phone: firebaseUser.phone_number,
      // full_name may be set later by client after OTP flow; keep nullable here
    })

    // 5. Generate a session for the Supabase user
    const { data: session, error: sessionError } = await adminAuthClient.auth.signInWithIdToken({
      provider: 'firebase',
      token: token,
    })
    if (sessionError) throw sessionError

    // Return a flat shape compatible with client expectations
    return new Response(
      JSON.stringify({
        access_token: session.session?.access_token,
        refresh_token: session.session?.refresh_token,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    const message = (error as Error)?.message ?? 'Unknown error'
    return new Response(
      JSON.stringify({ error: { message } }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

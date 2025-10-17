import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()
    if (!token) throw new Error("Firebase token is missing.")

    // Initialize the Admin Supabase client within the function
    // This uses the SERVICE_ROLE_KEY to perform admin actions
    const supabaseAdmin = createClient(
  Deno.env.get('RUG_SUPABASE_URL') ?? '',
  Deno.env.get('RUG_SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

    // 1. Get the user identity from the Firebase token
    const { data: { user: identity }, error: identityError } = await supabaseAdmin.auth.getUser(token)
    if (identityError) throw identityError
    if (!identity) throw new Error("Could not get user identity from token.")

    let supabaseUser = identity;

    // 2. Check if the user already exists in Supabase Auth
    const { data: { user: existingUser }, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(identity.id)
    
    if (!existingUser) {
      // 3. If they don't exist, create them
      const { data: { user: newUser }, error: createError } = await supabaseAdmin.auth.admin.createUser({
        id: identity.id,
        phone: identity.phone,
        email: identity.email,
        user_metadata: { provider: 'firebase' }
      })
      if (createError) throw createError
      supabaseUser = newUser
    }

    if (!supabaseUser) throw new Error("Failed to create or find Supabase user.")

    // 4. The user now exists in Supabase. Return a success message.
    // The client will handle the next steps.
    return new Response(
      JSON.stringify({ message: "User provisioned successfully", user: supabaseUser }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

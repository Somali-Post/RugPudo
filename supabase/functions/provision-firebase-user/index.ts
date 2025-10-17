import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'
import { serve } from 'serve'
import jwt from 'jsonwebtoken'

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { token } = await req.json()
    if (!token) throw new Error("Firebase token is missing.")

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const decodedToken = jwt.decode(token) as Record<string, unknown> | null
    if (!decodedToken || typeof decodedToken !== 'object' || !('sub' in decodedToken)) {
      throw new Error("Invalid Firebase token.")
    }
    
    const firebase_uid = (decodedToken as any).sub as string
    const phone = (decodedToken as any).phone_number as string | undefined

    // Check if user exists in Supabase Auth
    const { data: { user: existingUser } } = await supabaseAdmin.auth.admin.getUserById(firebase_uid)

    if (existingUser) {
      // If user exists, just return a success message. The client will handle login.
      return new Response(JSON.stringify({ message: "User already exists." }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // If user does not exist, create them
    const { data: { user: newUser }, error: createError } = await supabaseAdmin.auth.admin.createUser({
      id: firebase_uid,
      phone: phone,
      phone_confirm: true,
    })
    if (createError) throw createError
    if (!newUser) throw new Error("Failed to create Supabase user.")

    return new Response(JSON.stringify({ message: "User created successfully.", user: newUser }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as any).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

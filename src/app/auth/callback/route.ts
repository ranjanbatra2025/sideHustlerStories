import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server"; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      const { user } = data;
      // Upsert the profile with details from Google
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: user.user_metadata?.full_name || 'User',
          // Add other necessary details if available
          email: user.email,
          avatar_url: user.user_metadata?.avatar_url,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (profileError) {
        console.error('Profile upsert error:', profileError);
        // Optionally handle error, but proceed to redirect
      }

      return NextResponse.redirect(`${process.env.SITE_URL}${next}`);
    }
  }

  return NextResponse.redirect(`${process.env.SITE_URL}/auth/error`);
}
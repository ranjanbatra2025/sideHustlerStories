import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server"; 

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${process.env.SITE_URL}${next}`);
    }
  }

  return NextResponse.redirect(`${process.env.SITE_URL}/auth/error`);
}
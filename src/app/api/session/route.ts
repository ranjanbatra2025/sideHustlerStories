import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/utils/supabase/server";
export async function GET(request: Request) {
const supabase = await createSupabaseServerClient();
const { data: { session } } = await supabase.auth.getSession();
return NextResponse.json({ session });
}
// app/api/stats/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('stats')
      .select('inspired_readers, stories_shared, total_earnings')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return NextResponse.json(data || { inspiredReaders: 0, storiesShared: 0, totalEarnings: 0 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
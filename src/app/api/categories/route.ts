// app/api/categories/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  try {
    // Fetch all categories with full details
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('id, name, description, subcategories, date')
      .order('date', { ascending: true });

    if (catError) throw catError;

    // For each category, compute count of stories
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const { count, error: countError } = await supabase
          .from('stories')
          .select('id', { count: 'exact' })
          .eq('category', cat.id);

        if (countError) throw countError;

        return {
          ...cat,
          count: count || 0,
        };
      })
    );

    return NextResponse.json(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
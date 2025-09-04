import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client (runs on server-side)
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');  // Get the category query param if present

  try {
    let query = supabase.from('stories').select('*');

    if (category) {
      query = query.eq('category', category);  // Filter by category if provided
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const story = await request.json();

    // Basic validation
    if (!story.title || !story.name || !story.hustle || !story.story || !story.category || !story.image) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Rating should be between 1 and 5
    story.rating = parseFloat(story.rating);
    if (isNaN(story.rating) || story.rating < 1 || story.rating > 5) {
      story.rating = 5; // Default to 5 if invalid
    }

    const { data, error } = await supabase
      .from('stories')
      .insert([story])
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client (runs on server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; // Use NEXT_PUBLIC_ prefix for URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const { data: storyData, error: storyError } = await supabase
      .from('stories')
      .select('*')
      .eq('id', id)
      .single();  // Fetch single row by ID

    if (storyError) {
      throw storyError;
    }

    if (!storyData) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Fetch ratings for this story
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('user_story_ratings')
      .select('rating')
      .eq('story_id', id);

    if (ratingsError) {
      throw ratingsError;
    }

    let averageRating = storyData.rating; // Use initial rating if no user ratings
    if (ratingsData && ratingsData.length > 0) {
      const sum = ratingsData.reduce((acc, r) => acc + r.rating, 0);
      averageRating = sum / ratingsData.length;
    }

    const story = {
      ...storyData,
      rating: averageRating,
    };

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
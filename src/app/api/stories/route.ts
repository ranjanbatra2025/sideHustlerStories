import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase client (runs on server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; // Use NEXT_PUBLIC_ prefix for URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role key to bypass RLS
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');  // Get the category query param if present

  try {
    let query = supabase.from('stories').select('*');

    if (category) {
      query = query.eq('category', category);  // Filter by category if provided
    }

    const { data: storiesData, error: storiesError } = await query;

    if (storiesError) {
      throw storiesError;
    }

    if (!storiesData || storiesData.length === 0) {
      return NextResponse.json([]);
    }

    // Fetch all ratings
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('user_story_ratings')
      .select('story_id, rating');

    if (ratingsError) {
      throw ratingsError;
    }

    // Compute averages per story
    const ratingMap = new Map<number, number[]>();
    if (ratingsData) {
      for (const r of ratingsData) {
        if (!ratingMap.has(r.story_id)) {
          ratingMap.set(r.story_id, []);
        }
        ratingMap.get(r.story_id)!.push(r.rating);
      }
    }

    const stories = storiesData.map((s) => {
      const ratings = ratingMap.get(s.id);
      let averageRating = s.rating; // Use initial rating if no user ratings
      if (ratings && ratings.length > 0) {
        const sum = ratings.reduce((acc, val) => acc + val, 0);
        averageRating = sum / ratings.length;
      }
      return {
        ...s,
        rating: averageRating,
      };
    });

    return NextResponse.json(stories);
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
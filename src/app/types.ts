export interface Story {
  id: number;
  title: string;
  name: string;
  hustle: string;
  rating: number;
  image: string;
  story: string;
  category: string;
  views?: number;
  updated_at?: string;  // Add based on error mentions; adjust if needed
  readTime?: number;    // Add based on error mentions; adjust if needed
  viewsStr?: string;    // Add based on error mentions; adjust if needed
  upvoted?: boolean;    // Add based on error mentions; adjust if needed
  upvoteCount?: number; // Add based on error mentions; adjust if needed
}

export interface StoryData {
  id?: string;  // Made optional and string to match potential API response/form data
  title: string;
  name: string;
  hustle: string;
  rating: number;
  image: string;
  story: string;
  category: string;
  views?: number;
  updated_at?: string;
  readTime?: number;
  viewsStr?: string;
  upvoted?: boolean;
  upvoteCount?: number;
}
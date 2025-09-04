"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Quote, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import SubmitStoryModal from "../SubmitStoryModal";
// Define Story type
interface Story {
  id: number;
  title: string;
  name: string;
  hustle: string;
  rating: number;
  image: string;
  story: string;
}
export default function StoryDetailPage() {
  const params = useParams();
  const storyId = parseInt(params.id as string, 10);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    if (isNaN(storyId)) {
      setError("Invalid story ID");
      setLoading(false);
      return;
    }
    // Fetch story from API route (which queries Supabase)
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories/${storyId}`);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data: Story = await response.json();
        setStory(data);

        // Increment views
        await supabase.rpc('increment_views', { story_id: storyId });

        // Mark as read if user
        if (user) {
          await supabase.from('user_stories_reads').upsert({ user_id: user.id, story_id: storyId }, { onConflict: 'user_id, story_id' });
        }
      } catch (err) {
        setError("Story not found or error fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchStory();
  }, [storyId, user, supabase]);
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <p className="text-muted-foreground mb-8">Loading story...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  if (error || !story) {
    return (
      <>
        <Navbar />
        <main className="py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Coming Soon</h1>
            <p className="text-muted-foreground mb-8">
              {error || "The requested side hustle story is coming soon."}
            </p>
            <Button asChild variant="outline">
              <Link href="/stories">Back to Stories</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Navbar />
      {/* Header */}
      <section
        className="relative pt-24 pb-20 md:pt-32 md:pb-24 gradient-bg text-white overflow-hidden particle-bg"
        role="banner"
        aria-labelledby="story-heading"
      >
        {/* Particle elements */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/20 to-transparent pointer-events-none"></div>
        <div
          className="container mx-auto px-4 relative z-10"
        >
          <div className="mb-6">
            <Button
              asChild
              variant="ghost"
              className="text-white hover:bg-white/10 mb-4"
              aria-label="Back to stories"
            >
              <Link href="/stories">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Stories
              </Link>
            </Button>
          </div>
          <h1
            id="story-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center md:text-left"
          >
            {story.title}
          </h1>
          <h2
            className="text-2xl md:text-3xl font-semibold mb-4 text-primary-foreground text-center md:text-left"
          >
            {story.name} - {story.hustle}
          </h2>
          <div
            className="flex items-center gap-2 text-lg text-white/90 max-w-3xl mb-8 text-center md:text-left"
          >
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span>{story.rating.toFixed(1)}</span>
          </div>
          <div className="relative mx-auto w-full max-w-[800px] h-[400px] md:h-auto aspect-[2/1]">
            <Image
              src={story.image}
              alt={story.title}
              fill
              className="rounded-lg object-cover"
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
      </section>
      {/* Story Content */}
      <main
        className="py-16 bg-background"
        role="region"
        aria-labelledby="story-content-heading"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 id="story-content-heading" className="sr-only">
            Story Details
          </h2>
          <div>
            <Card className="border-neutral-200 dark:border-neutral-800 shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-card-foreground">The Journey</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative p-6 bg-muted/50 rounded-lg">
                  <Quote className="absolute top-4 left-4 h-8 w-8 text-muted-foreground/50" />
                  <p className="text-lg text-foreground leading-relaxed italic whitespace-pre-line">{story.story}</p>
                  <Quote className="absolute bottom-4 right-4 h-8 w-8 text-muted-foreground/50 rotate-180" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Separator />
      {/* CTA Section */}
      <section
        className="py-16 bg-muted/40"
        role="region"
        aria-labelledby="cta-heading"
      >
        <div
          className="container mx-auto px-4 text-center"
        >
          <div>
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Inspired? Share Your Story
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              If this story motivated you, submit your own side hustle experience and join our community of hustlers.
            </p>
            <Button 
              size="lg" 
              className="rounded-full px-8 py-3 text-base group"
              onClick={() => setShowSubmitModal(true)}
              aria-label="Submit your side hustle story"
            >
              Submit Your Story
              <ArrowLeft className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200 rotate-180" />
            </Button>
          </div>
        </div>
      </section>
      <SubmitStoryModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmitted={() => {}}
      />
      <Footer />
    </>
  );
}
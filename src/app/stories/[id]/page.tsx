// id page
"use client";
import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Quote, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

// Hardcoded stories for reference
const hardcodedStories: Story[] = [
  {
    id: 1,
    title: "From Side Gig to Full-Time: My Freelance Writing Success",
    name: "Sarah Chen",
    hustle: "Freelance Writing",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    story: `It all started during the pandemic when I lost my job as a marketing coordinator. With bills piling up, I decided to try freelance writing on the side. I had always enjoyed writing but never thought it could pay the bills.

In the beginning, I signed up for platforms like Upwork and Fiverr. My first gig was writing product descriptions for an e-commerce store - $50 for 10 descriptions. It wasn't much, but it was a start. I spent evenings after job hunting honing my skills, reading books on copywriting, and building a portfolio.

After three months, I landed my first big client: a tech blog paying $200 per article. That's when things started to change. I was making $1,000-1,500 extra per month while job searching. But I realized I enjoyed the freedom of freelancing more than my old 9-5.

Six months in, I went full-time. Now, two years later, my side hustle has become a six-figure business. I specialize in SaaS content marketing, with clients from Silicon Valley startups. The key was consistent networking on LinkedIn, delivering quality work, and gradually increasing rates.

My advice: Start small, build momentum, and don't be afraid to niche down. Your side hustle could change your life!`,
  },
  {
    id: 2,
    title: "Turning Photography Passion into Profit",
    name: "Alex Rodriguez",
    hustle: "Stock Photography",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    story: `I've always loved photography, but it was just a hobby until last year. With a full-time job in IT, I started uploading my photos to stock sites like Shutterstock and Getty Images as a side hustle.

My first sale was exciting - $0.25 for a download! But I kept at it, learning about trending topics and SEO for images. I invested in better equipment and dedicated weekends to shooting.

Within six months, I was earning $500/month passively. Now, it's over $2,000/month, and I've quit my job to pursue photography full-time. The freedom is incredible!

Key lessons: Consistency is key, understand market demands, and build a diverse portfolio. Your hobby could be your next career!`,
  },
  {
    id: 3,
    title: "Building a Dropshipping Empire After Hours",
    name: "Emily Patel",
    hustle: "E-commerce Dropshipping",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    story: `Working as a nurse, my shifts were exhausting, but I needed extra income. I discovered dropshipping and started a Shopify store selling eco-friendly kitchenware.

Initial setup took two weeks, and I launched with $200 in ads. First month: $800 in sales, $300 profit. I reinvested and learned Facebook ads.

A year later, my store does $10k/month in revenue. I've hired a VA and am planning to go full-time.

Advice: Research niches thoroughly, focus on customer service, and test products quickly. Start small and scale!`,
  },
  {
    id: 4,
    title: "Creating Online Courses While Working Full-Time",
    name: "Michael Johnson",
    hustle: "Online Education",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    story: `As a software engineer, I had knowledge to share but limited time. I started creating online courses on Udemy about web development during weekends.

My first course took a month to create and earned $100 in the first week. I promoted it on Reddit and LinkedIn.

Now, with 5 courses, I'm making $3,000/month passively. It's allowed me to save for a house down payment.

Tips: Choose topics you're expert in, use free tools for recording, and engage with students for reviews.`,
  },
  {
    id: 5,
    title: "Pet Sitting Side Business Boom",
    name: "Lisa Wong",
    hustle: "Pet Services",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1450778869180-41d060f44b04?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    story: `Loving animals, I started pet sitting via Rover app after my day job as a teacher. First client was a neighbor's dog for $20/day.

Word spread, and soon I had weekends booked. I expanded to dog walking and overnight stays.

In 18 months, it's $1,500/month extra. I've even started a small blog about pet care tips.

Advice: Get certified in pet first aid, use apps for booking, and build trust with great service.`,
  },
  {
    id: 6,
    title: "Handmade Jewelry on Etsy",
    name: "David Kim",
    hustle: "Artisan Crafts",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    story: `With a passion for crafts, I began making jewelry at home. Listed on Etsy with basic photos.

First sale was a necklace for $15. I improved listings with better images and SEO.

Now, averaging $800/month, I've quit part-time retail. Attending craft fairs boosted visibility.

Key: Unique designs, excellent customer service, and consistent posting on social media.`,
  },
];

export default function StoryDetailPage() {
  const params = useParams();
  const storyId = parseInt(params.id as string, 10);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    if (isNaN(storyId)) {
      setError("Invalid story ID");
      setLoading(false);
      return;
    }

    // Find story by ID from hardcoded stories
    const foundStory = hardcodedStories.find(s => s.id === storyId);
    if (foundStory) {
      setStory(foundStory);
      setLoading(false);
    } else {
      setError("Story not found");
      setLoading(false);
    }
  }, [storyId]);

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
              onClick={() => setShowComingSoon(true)}
              aria-label="Submit your side hustle story"
            >
              Submit Your Story
              <ArrowLeft className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200 rotate-180" />
            </Button>
            {showComingSoon && (
              <p
                className="mt-4 text-lg text-primary"
              >
                Coming Soon
              </p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
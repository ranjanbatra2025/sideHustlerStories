"use client";
import { useRef, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Quote, Star, Bookmark, Eye, Target, Flame, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import { User } from '@supabase/supabase-js';
import SubmitStoryModal, { type StoryData } from "./SubmitStoryModal";
// Define Story type
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
}
// Categories mapping (duplicated from categories page for name lookup; consider sharing in a util file)
const categoriesMap: { [key: string]: string } = {
  "digital-online": "Digital & Online Hustles",
  "creative-artistic": "Creative & Artistic Hustles",
  "business-entrepreneurship": "Business & Entrepreneurship",
  "tech-skills": "Tech & Skills-based Hustles",
  "gig-economy": "Gig Economy Hustles",
  "passive-income": "Passive Income Hustles",
  "lifestyle-service": "Lifestyle & Service Hustles",
  "student-parttime": "Student & Part-time Friendly Hustles",
};
const categoryEmojis: { [key: string]: string } = {
  "digital-online": "🌐",
  "creative-artistic": "🎨",
  "business-entrepreneurship": "📊",
  "tech-skills": "💻",
  "gig-economy": "🛵",
  "passive-income": "💰",
  "lifestyle-service": "🏡",
  "student-parttime": "📚",
};
// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, rotate: -3 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6, ease: "easeOut" as const, type: "spring" as const, stiffness: 100 },
  },
  hover: {
    scale: 1.03,
    rotate: 0.5,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 },
  },
};
export default function StoriesContent() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  const categoryName = categoryId ? categoriesMap[categoryId] || 'Unknown Category' : null;
  const categoryEmoji = categoryId ? categoryEmojis[categoryId] || '' : '';
  const [stories, setStories] = useState<Story[]>([]);
  const [savedStories, setSavedStories] = useState<Set<number>>(new Set());
  const [readStories, setReadStories] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ left: number; delay: number; duration: number }>
  >([]);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({
    storiesRead: 0,
    categoriesExplored: 0,
    savedCount: 0,
  });
  const [communityInsights, setCommunityInsights] = useState({
    mostViewed: '',
    topCategory: '',
  });
  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);
  const headerRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);
  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isGridInView = useInView(gridRef, { once: true, amount: 0.1 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.2 });
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, [supabase]);
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const url = categoryId ? `/api/stories?category=${categoryId}` : '/api/stories';
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data: Story[] = await response.json();
        setStories(data);
        // Compute community insights
        if (data.length > 0) {
          const sortedByViews = [...data].sort((a, b) => (b.views || 0) - (a.views || 0));
          const categoryCounts = data.reduce((acc: Record<string, number>, s) => {
            acc[s.category] = (acc[s.category] || 0) + 1;
            return acc;
          }, {});
          const sortedCategories = Object.entries(categoryCounts).sort((a: [string, number], b: [string, number]) => b[1] - a[1]);
          const topCat = sortedCategories[0]?.[0] || '';
          setCommunityInsights({
            mostViewed: sortedByViews[0]?.title || '',
            topCategory: topCat,
          });
        }
      } catch (err) {
        setError("Error fetching stories");
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [categoryId]);
  useEffect(() => {
    if (user) {
      const fetchSavedAndRead = async () => {
        const { data: savedData } = await supabase.from('user_stories_saves').select('story_id').eq('user_id', user.id);
        setSavedStories(new Set(savedData?.map(d => d.story_id) || []));
        const { data: readData } = await supabase.from('user_stories_reads').select('story_id').eq('user_id', user.id);
        setReadStories(new Set(readData?.map(d => d.story_id) || []));
      };
      fetchSavedAndRead();
    }
  }, [user, supabase]);
  useEffect(() => {
    if (stories.length > 0 && readStories.size > 0) {
      const readCategories = new Set(Array.from(readStories).map(id => stories.find(s => s.id === id)?.category).filter(Boolean));
      setStats({
        storiesRead: readStories.size,
        categoriesExplored: readCategories.size,
        savedCount: savedStories.size,
      });
    }
  }, [stories, readStories, savedStories]);
  // Generate particles only on client-side after mount
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 5 + Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);
  const toggleSaveStory = async (storyId: number) => {
    if (!user) {
      // Prompt login or handle
      return;
    }
    if (savedStories.has(storyId)) {
      await supabase.from('user_stories_saves').delete().eq('user_id', user.id).eq('story_id', storyId);
      setSavedStories(prev => {
        const newSet = new Set(prev);
        newSet.delete(storyId);
        return newSet;
      });
    } else {
      await supabase.from('user_stories_saves').insert({ user_id: user.id, story_id: storyId });
      setSavedStories(prev => new Set([...prev, storyId]));
    }
  };
  const featuredStories = [...stories].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const savedStoriesList = stories.filter(s => savedStories.has(s.id));
  const handleStorySubmitted = (newStory: StoryData) => {
    const story: Story = {
      ...newStory,
      id: newStory.id ? parseInt(newStory.id) : 0,
      rating: 0, // Add default rating to satisfy the Story type
    };
    setStories(prev => [...prev, story]);
  };
  return (
    <>
      <Navbar />
      {/* Header */}
      <section
        className="relative pt-24 pb-20 md:pt-32 md:pb-24 gradient-bg text-white overflow-hidden particle-bg"
        ref={headerRef}
        role="banner"
        aria-labelledby="stories-heading"
      >
        {/* Particle elements (rendered only on client) */}
        {particles.map((p, i) => (
          <div
            key={`particle-${i}`}
            className="particle"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/20 to-transparent pointer-events-none"></div>
        <motion.div
          className="container mx-auto px-4 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
        >
          <motion.h1
            id="stories-heading"
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center md:text-left"
          >
            {categoryEmoji} {categoryName ? `${categoryName} Stories` : 'Side Hustle Stories'}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/90 max-w-3xl mb-8 text-center md:text-left"
          >
            {categoryName
              ? `Explore inspiring stories from real people in the ${categoryName} category.`
              : 'Read inspiring stories from real people who turned their side hustles into sources of extra income, passion, and success.'}
          </motion.p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
        {/* Decorative Blurs */}
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" as const }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" as const, delay: 1 }}
        />
      </section>
      {/* User Progress Snapshot (if logged in) */}
      {user && (
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Eye className="mr-2" /> Stories Read</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.storiesRead}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Target className="mr-2" /> Categories Explored</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.categoriesExplored}/8</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><Flame className="mr-2" /> Saved Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.savedCount}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}
      {/* Featured Stories */}
      <section className="py-8 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Featured Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredStories.map((story) => (
              <motion.div key={story.id} variants={cardVariants} whileHover="hover">
                <Card className="h-full flex flex-col">
                  <Image
                    src={story.image.trim()}
                    alt={story.title}
                    width={400}
                    height={200}
                    className="rounded-t-lg object-cover w-full h-48"
                  />
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{story.title}</CardTitle>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span>{story.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{categoryEmojis[story.category] || ''} {categoriesMap[story.category] || story.category}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-4">{story.story}</p>
                  </CardContent>
                  <CardContent className="mt-auto">
                    <Button asChild variant="ghost">
                      <Link href={`/stories/${story.id}`}>Read More <ArrowRight className="ml-2" /></Link>
                    </Button>
                    <Button variant="ghost" onClick={() => toggleSaveStory(story.id)}>
                      <Bookmark fill={savedStories.has(story.id) ? 'currentColor' : 'none'} />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Stories Grid */}
      <main
        className="py-16 bg-background"
        ref={gridRef}
        role="region"
        aria-labelledby="stories-grid-heading"
      >
        <div className="container mx-auto px-4">
          <h2 id="stories-grid-heading" className="sr-only">
            Side Hustle Stories List
          </h2>
          {loading ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-8">Loading stories...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-8">Coming soon</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center">
              <p className="text-muted-foreground mb-8">No stories found in this category. Coming soon!</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate={isGridInView ? "visible" : "hidden"}
            >
              {stories.map((story: Story) => (
                <motion.div
                  key={story.id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="h-full"
                >
                  <Card className="card-gradient border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col bg-card">
                    <Image
                      src={story.image.trim()}
                      alt={story.title}
                      width={400}
                      height={200}
                      className="rounded-t-lg object-cover w-full h-48"
                    />
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <CardTitle className="text-xl font-semibold text-card-foreground">{story.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span>{story.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-medium text-primary">{story.hustle}</h3>
                      <p className="text-sm text-muted-foreground">{categoryEmojis[story.category] || ''} {categoriesMap[story.category] || story.category}</p>
                    </CardHeader>
                    <CardContent className="flex-grow pb-4">
                      <div className="relative">
                        <Quote className="absolute top-0 left-0 h-6 w-6 text-muted-foreground/50 transform -translate-x-2 -translate-y-2" />
                        <p className="text-sm text-muted-foreground italic line-clamp-4">{story.story}</p>
                        <Quote className="absolute bottom-0 right-0 h-6 w-6 text-muted-foreground/50 transform translate-x-2 translate-y-2 rotate-180" />
                      </div>
                    </CardContent>
                    <CardContent className="pt-0 mt-auto flex justify-between">
                      <Button
                        asChild
                        variant="ghost"
                        className="justify-center text-primary hover:bg-primary/10 hover:text-primary font-semibold group"
                        aria-label={`Read more about ${story.name}'s story`}
                      >
                        <Link href={`/stories/${story.id}`}>
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </Button>
                      <Button variant="ghost" onClick={() => toggleSaveStory(story.id)}>
                        <Bookmark fill={savedStories.has(story.id) ? 'currentColor' : 'none'} />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      {/* Saved Stories (if logged in) */}
      {user && savedStoriesList.length > 0 && (
        <section className="py-8 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6">Your Saved Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {savedStoriesList.map((story) => (
                <Card key={story.id}>
                  <CardHeader>
                    <CardTitle>{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/stories/${story.id}`}>Read</Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
      {/* Community Insights */}
      <section className="py-8 bg-muted/40">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 flex items-center"><Users className="mr-2" /> Community Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader><CardTitle>Most Viewed Story</CardTitle></CardHeader>
              <CardContent><p>{communityInsights.mostViewed || 'None yet'}</p></CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Top Category</CardTitle></CardHeader>
              <CardContent><p>{communityInsights.topCategory ? `${categoryEmojis[communityInsights.topCategory] || ''} ${categoriesMap[communityInsights.topCategory] || communityInsights.topCategory}` : 'None yet'}</p></CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Separator />
      {/* CTA Section */}
      <section
        className="py-16 bg-muted/40"
        ref={ctaRef}
        role="region"
        aria-labelledby="cta-heading"
      >
        <motion.div
          className="container mx-auto px-4 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isCtaInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants}>
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Share Your Side Hustle Story
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Inspired by these stories? Submit your own side hustle journey and inspire others in our community.
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 py-3 text-base group"
              onClick={() => setShowSubmitModal(true)}
              aria-label="Submit your side hustle story"
            >
              Submit Your Story
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </motion.div>
        </motion.div>
      </section>
      <SubmitStoryModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmitted={handleStorySubmitted}
      />
      <Footer />
    </>
  );
}
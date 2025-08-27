// page
"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Quote, Star } from "lucide-react";

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
    transition: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 },
  },
  hover: {
    scale: 1.03,
    rotate: 0.5,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 },
  },
};

export default function SideHustleStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const headerRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isGridInView = useInView(gridRef, { once: true, amount: 0.1 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.2 });

  useEffect(() => {
    // Use hardcoded stories
    setStories(hardcodedStories);
    setLoading(false);
  }, []);

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
            Side Hustle Stories
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/90 max-w-3xl mb-8 text-center md:text-left"
          >
            Read inspiring stories from real people who turned their side hustles into sources of extra income, passion, and success.
          </motion.p>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
        {/* Decorative Blurs */}
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/20 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1 }}
        />
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
              <p className="text-muted-foreground mb-8">Coming soon</p>
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
                      src={story.image}
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
                    </CardHeader>
                    <CardContent className="flex-grow pb-4">
                      <div className="relative">
                        <Quote className="absolute top-0 left-0 h-6 w-6 text-muted-foreground/50 transform -translate-x-2 -translate-y-2" />
                        <p className="text-sm text-muted-foreground italic line-clamp-4">{story.story}</p>
                        <Quote className="absolute bottom-0 right-0 h-6 w-6 text-muted-foreground/50 transform translate-x-2 translate-y-2 rotate-180" />
                      </div>
                    </CardContent>
                    <CardContent className="pt-0 mt-auto">
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-center text-primary hover:bg-primary/10 hover:text-primary font-semibold group"
                        aria-label={`Read more about ${story.name}'s story`}
                      >
                        <Link href={`/stories/${story.id}`}>
                          Read More
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

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
              onClick={() => setShowComingSoon(true)}
              aria-label="Submit your side hustle story"
            >
              Submit Your Story
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
            {showComingSoon && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-lg text-primary"
              >
                Coming Soon
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
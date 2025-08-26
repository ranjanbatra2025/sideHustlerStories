"use client";
import { useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
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

export default function StoryDetailPage() {
  const params = useParams();
  const storyId = parseInt(params.id as string, 10);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLElement | null>(null);
  const ctaRef = useRef<HTMLElement | null>(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isContentInView = useInView(contentRef, { once: true, amount: 0.1 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (!storyId) {
      setError("Invalid story ID");
      setLoading(false);
      return;
    }

    fetch(`/api/stories/${storyId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch story");
        }
        return res.json();
      })
      .then((data) => {
        setStory(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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
            <h1 className="text-3xl font-bold mb-4">Story Not Found</h1>
            <p className="text-muted-foreground mb-8">
              {error || "The requested side hustle story could not be found."}
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
        ref={headerRef}
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
        <motion.div
          className="container mx-auto px-4 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="mb-6">
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
          </motion.div>
          <motion.h1
            id="story-heading"
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-center md:text-left"
          >
            {story.title}
          </motion.h1>
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-semibold mb-4 text-primary-foreground text-center md:text-left"
          >
            {story.name} - {story.hustle}
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 text-lg text-white/90 max-w-3xl mb-8 text-center md:text-left"
          >
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span>{story.rating.toFixed(1)}</span>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Image
              src={story.image}
              alt={story.title}
              width={800}
              height={400}
              className="mx-auto rounded-lg object-cover"
            />
          </motion.div>
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
      {/* Story Content */}
      <main
        className="py-16 bg-background"
        ref={contentRef}
        role="region"
        aria-labelledby="story-content-heading"
      >
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 id="story-content-heading" className="sr-only">
            Story Details
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isContentInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
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
            </motion.div>
          </motion.div>
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
              Inspired? Share Your Story
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              If this story motivated you, submit your own side hustle experience and join our community of hustlers.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 py-3 text-base group">
              <Link href="/submit-story" aria-label="Submit your side hustle story">
                Submit Your Story
                <ArrowLeft className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200 rotate-180" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
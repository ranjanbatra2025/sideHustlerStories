"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { ArrowRight, Clock, DollarSign, LineChart, TrendingUp, Briefcase, Sparkles, Star, Users, Search } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { debounce } from "lodash";
import Image from "next/image";

import { type Story } from "@/lib/stories";

// No more static import for stories data

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [particleStyles, setParticleStyles] = useState<{ left: string; top: string; animationDelay: string; animationDuration: string; }[]>([]);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0]);

  const [stories, setStories] = useState<Story[]>([]);
  const [categoriesData, setCategoriesData] = useState<{ id: string; name: string; count: number }[]>([]);
  const [testimonialsData, setTestimonialsData] = useState<{ quote: string; author: string; rating: number }[]>([]);
  const [statsData, setStatsData] = useState({ inspiredReaders: 0, storiesShared: 0, totalEarnings: 0 });

  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const whyRef = useRef(null);
  const statsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const categoriesRef = useRef(null);
  const ctaRef = useRef(null);
  const searchInputRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const isFeaturedInView = useInView(featuredRef, { once: true, amount: 0.2 });
  const isWhyInView = useInView(whyRef, { once: true, amount: 0.2 });
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.2 });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });
  const isCategoriesInView = useInView(categoriesRef, { once: true, amount: 0.2 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.2 });

  const router = useRouter();

  const featuredStories = useMemo(() => stories.slice(0, 4), [stories]);
  const categories = categoriesData;
  const testimonials = testimonialsData;
  const stats = useMemo(
    () => [
      { icon: <Users className="h-8 w-8 text-primary" />, value: statsData.inspiredReaders, label: "Inspired Readers" },
      { icon: <Briefcase className="h-8 w-8 text-primary" />, value: statsData.storiesShared, label: "Stories Shared" },
      { icon: <DollarSign className="h-8 w-8 text-primary" />, value: statsData.totalEarnings, label: "Total Earnings Inspired" },
    ],
    [statsData]
  );

  // Fetch stories from API
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch("/api/stories");
        if (res.ok) {
          const data = await res.json();
          setStories(data);
        }
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        // Fallback to empty array if fetch fails
      }
    };
    fetchStories();
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategoriesData(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // Fallback to empty array if fetch fails
      }
    };
    fetchCategories();
  }, []);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (res.ok) {
          const data = await res.json();
          setTestimonialsData(data);
        }
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        // Fallback to empty array if fetch fails
      }
    };
    fetchTestimonials();
  }, []);

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStatsData(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        // Fallback to zeros if fetch fails
      }
    };
    fetchStats();
  }, []);

  // Generate client-side particle styles to avoid hydration errors
  useEffect(() => {
    const generateParticles = () => {
      return Array.from({ length: 15 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 3}s`,
      }));
    };
    setParticleStyles(generateParticles());
  }, []);

  // Animate stats counter
  useEffect(() => {
    if (isStatsInView) {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 frames
      const increments = stats.map((stat) => stat.value / steps);

      const interval = setInterval(() => {
        setAnimatedStats((prev) =>
          prev.map((value, i) => {
            const next = value + increments[i];
            return next >= stats[i].value ? stats[i].value : next;
          })
        );
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [isStatsInView, stats]);

  // Carousel auto-advance for testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Debounced search handler
  const handleSearch = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/stories?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
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

  const featuredCardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 },
    },
    hover: {
      scale: 1.05,
      rotate: 2,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  const categoryCardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut", type: "spring", stiffness: 100 },
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  const heroTextVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <>
      <Head>
        <title>SideHustlingStories - Inspiring Side Hustle Stories</title>
        <meta
          name="description"
          content="Explore inspiring stories of side hustles to motivate your journey towards extra income and passion projects with SideHustlingStories."
        />
        <meta name="keywords" content="side hustle stories, success stories, freelancing stories, blogging stories, e-commerce stories" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="SideHustlingStories - Inspiring Side Hustle Stories" />
        <meta
          property="og:description"
          content="Discover inspiring stories of side hustles and achieve motivation for your own journey."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sidehustlingstories.com" />
        <meta property="og:image" content="/og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "SideHustlingStories",
            url: "https://sidehustlingstories.com",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://sidehustlingstories.com/stories?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </script>
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section
        className="relative py-28 md:py-40 gradient-bg text-white overflow-hidden particle-bg"
        ref={heroRef}
        role="banner"
        aria-labelledby="hero-heading"
      >
        {particleStyles.map((style, i) => (
          <motion.div
            key={`hero-particle-${i}`}
            className="particle"
            style={style}
            animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
          />
        ))}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/20 to-transparent" />
        <motion.div
          className="container mx-auto px-4 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              id="hero-heading"
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
              variants={containerVariants}
            >
              {"Discover Inspiring ".split("").map((char, i) => (
                <motion.span key={`hero-char-${i}`} variants={heroTextVariants} custom={i}>
                  {char}
                </motion.span>
              ))}
              <motion.span
                className="text-hero-foreground underline decoration-4 decoration-primary/70"
                variants={heroTextVariants}
                custom={20}
              >
                Side Hustle Stories
              </motion.span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-white/90"
            >
              Read real stories of people earning extra income, building skills, and pursuing passions through side hustles.
            </motion.p>
            <motion.form
              onSubmit={handleSearchSubmit}
              variants={itemVariants}
              className="relative max-w-md mx-auto mb-8"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
              <Input
                ref={searchInputRef}
                placeholder="Search stories..."
                className="pl-10 py-6 text-base rounded-full bg-white/10 text-white placeholder:text-white/70 border-white/20 focus:border-primary search-glow"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="Search stories by title or description"
              />
            </motion.form>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full text-lg px-8 bg-white text-primary hover:bg-white/90 hover:text-primary"
                aria-label="Browse story categories"
              >
                <Link href="/categories">Browse Stories</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full text-lg px-8 bg-transparent border-white hover:bg-white/20 text-white"
                aria-label="Learn more about SideHustlingStories"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/30 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-blue-500/30 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
      </section>

      {/* Featured Stories */}
      <section
        className="py-20 md:py-32 bg-muted/5"
        ref={featuredRef}
        role="region"
        aria-labelledby="featured-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isFeaturedInView ? "visible" : "hidden"}
        >
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-[1px] w-12 bg-primary/70"></div>
              <span className="mx-3 text-sm font-medium text-primary">FEATURED</span>
              <div className="h-[1px] w-12 bg-primary/70"></div>
            </div>
            <motion.h2
              id="featured-heading"
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Popular Stories
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Discover some of the most inspiring side hustle stories.
            </motion.p>
          </motion.div>
          <motion.div
            className="relative overflow-hidden"
            variants={containerVariants}
          >
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              animate={{ x: `-${featuredIndex * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {featuredStories.map((story) => (
                <motion.div 
                  key={story.id} 
                  variants={featuredCardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="min-w-full lg:min-w-[calc(25%-1.5rem)]"
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
                      <p className="text-sm text-muted-foreground italic line-clamp-4">{story.story}</p>
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
            <motion.div
              className="flex justify-center gap-2 mt-6"
              variants={itemVariants}
            >
              {featuredStories.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${index === featuredIndex ? "bg-primary" : "bg-muted"}`}
                  onClick={() => setFeaturedIndex(index)}
                  aria-label={`Go to featured story ${index + 1}`}
                />
              ))}
            </motion.div>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="text-center mt-14"
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8"
              aria-label="View all stories"
            >
              <Link href="/stories">View All Stories</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Read Stories Section */}
      <section
        className="py-20 bg-primary/5 relative overflow-hidden"
        ref={whyRef}
        role="region"
        aria-labelledby="why-heading"
      >
        <motion.div
          className="container mx-auto px-4 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={isWhyInView ? "visible" : "hidden"}
        >
          <motion.div
            className="max-w-3xl mx-auto text-center mb-16"
            variants={containerVariants}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-[1px] w-12 bg-primary/70"></div>
              <span className="mx-3 text-sm font-medium text-primary">WHY READ</span>
              <div className="h-[1px] w-12 bg-primary/70"></div>
            </div>
            <motion.h2
              id="why-heading"
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Why Read Side Hustle Stories?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground"
            >
              These stories can inspire and guide your own side hustle journey in many ways.
            </motion.p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              {
                icon: <DollarSign className="h-6 w-6 text-primary" />,
                title: "Motivation",
                description:
                  "Get inspired by real journeys, overcome challenges, and see the potential for extra income.",
              },
              {
                icon: <Sparkles className="h-6 w-6 text-primary" />,
                title: "Insights",
                description:
                  "Learn valuable tips and strategies from those who have succeeded in side hustles.",
              },
              {
                icon: <Briefcase className="h-6 w-6 text-primary" />,
                title: "Community",
                description:
                  "Join a community of like-minded individuals sharing experiences and support.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={featuredCardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <div className="bg-background rounded-2xl p-8 shadow-sm card-gradient">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-bl-[200px]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/3 rounded-tr-[200px]"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        />
      </section>

      {/* Stats Section */}
      <section
        className="py-20 bg-muted/10"
        ref={statsRef}
        role="region"
        aria-labelledby="stats-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isStatsInView ? "visible" : "hidden"}
        >
          <motion.h2
            id="stats-heading"
            variants={itemVariants}
            className="sr-only"
          >
            Platform Statistics
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            variants={containerVariants}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <motion.div
                  className="mb-4"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                >
                  {stat.icon}
                </motion.div>
                <h3 className="text-3xl font-bold">
                  {Math.round(animatedStats[index]).toLocaleString()}+
                </h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section
        className="py-20"
        ref={testimonialsRef}
        role="region"
        aria-labelledby="testimonials-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isTestimonialsInView ? "visible" : "hidden"}
        >
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-[1px] w-12 bg-primary/70"></div>
              <span className="mx-3 text-sm font-medium text-primary">TESTIMONIALS</span>
              <div className="h-[1px] w-12 bg-primary/70"></div>
            </div>
            <motion.h2
              id="testimonials-heading"
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              What Our Readers Say
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Hear from real people who’ve been inspired by SideHustlingStories.
            </motion.p>
          </motion.div>
          <motion.div
            className="relative overflow-hidden"
            variants={containerVariants}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                className="flex justify-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="card-gradient border-0 shadow-md max-w-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center mb-4">
                      {Array.from({ length: testimonials[testimonialIndex]?.rating || 0 }).map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                    <p className="text-lg text-center italic">“{testimonials[testimonialIndex]?.quote}”</p>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">{testimonials[testimonialIndex]?.author}</p>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
            <motion.div
              className="flex justify-center gap-2 mt-6"
              variants={itemVariants}
            >
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${index === testimonialIndex ? "bg-primary" : "bg-muted"}`}
                  onClick={() => setTestimonialIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section
        className="py-20 md:py-32"
        ref={categoriesRef}
        role="region"
        aria-labelledby="categories-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isCategoriesInView ? "visible" : "hidden"}
        >
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-[1px] w-12 bg-primary/70"></div>
              <span className="mx-3 text-sm font-medium text-primary">CATEGORIES</span>
              <div className="h-[1px] w-12 bg-primary/70"></div>
            </div>
            <motion.h2
              id="categories-heading"
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Browse Stories by Category
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Find inspiring stories based on different types of side hustles.
            </motion.p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={categoryCardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <Link href={`/stories?category=${category.id}`} className="block">
                  <Card className="card-gradient border-0 shadow-sm h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {category.name}
                        <span className="text-sm font-normal bg-primary/10 text-primary px-3 py-1 rounded-full">
                          {category.count}
                        </span>
                      </CardTitle>
                      <CardDescription>Explore stories in this category</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between text-primary pt-0">
                      <span className="text-sm font-medium">View Stories</span>
                      <ArrowRight className="h-4 w-4" />
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 md:py-32 gradient-bg text-white relative overflow-hidden particle-bg"
        ref={ctaRef}
        role="region"
        aria-labelledby="cta-heading"
      >
        {particleStyles.map((style, i) => (
          <motion.div
            key={`cta-particle-${i}`}
            className="particle"
            style={style}
            animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
          />
        ))}
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />
        <motion.div
          className="container mx-auto px-4 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={isCtaInView ? "visible" : "hidden"}
        >
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={containerVariants}
          >
            <motion.div
              className="mb-6"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-12 w-12 mx-auto text-white/90" />
            </motion.div>
            <motion.h2
              id="cta-heading"
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Ready to Share Your Story?
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="text-xl text-white/90 max-w-2xl mx-auto mb-10"
            >
              Join thousands of people who have shared their side hustle stories on SideHustlingStories and inspire others today.
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button
                asChild
                size="lg"
                className="rounded-full text-lg px-10 bg-white text-primary hover:bg-white/90 hover:text-primary"
                aria-label="Submit your story"
              >
                <Link href="/submit-story">Submit Your Story</Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary/30 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-blue-500/30 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
      </section>

      <Footer />
    </>
  );
}
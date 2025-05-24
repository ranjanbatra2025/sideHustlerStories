"use client";

import { useState, useMemo, useRef } from "react"; // Added useRef
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Clock, DollarSign, Search, Star, TrendingUp } from "lucide-react";

import { sideHustles, type SideHustle } from "./sideHustles"; // Assuming sideHustles.ts is in the same directory
import { Navbar } from "@/components/layout/Navbar"; // Assuming these exist
import { Footer } from "@/components/layout/Footer"; // Assuming these exist
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Animation variants (no changes, these are good)
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
    scale: 1.03, // Slightly reduced hover scale for subtlety
    rotate: 0.5, // Slightly reduced hover rotate
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)", // Adjusted shadow
    transition: { duration: 0.3 },
  },
};

export default function SideHustlesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  const headerRef = useRef<HTMLElement | null>(null); // Typed ref
  const gridRef = useRef<HTMLElement | null>(null);   // Typed ref
  const ctaRef = useRef<HTMLElement | null>(null);    // Typed ref

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isGridInView = useInView(gridRef, { once: true, amount: 0.1 }); // Adjusted amount for earlier trigger
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.2 });

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(sideHustles.map((hustle) => hustle.category)));
    return ["All", ...uniqueCategories.sort()]; // Sort categories alphabetically
  }, []);

  const difficulties = ["All", "Low", "Medium", "Hard"]; // Consider making this dynamic if needed

  const filteredHustles = useMemo(() => {
    return sideHustles.filter((hustle: SideHustle) => {
      const lowerSearchQuery = searchQuery.toLowerCase();
      const matchesSearch =
        hustle.title.toLowerCase().includes(lowerSearchQuery) ||
        hustle.description.toLowerCase().includes(lowerSearchQuery) ||
        hustle.popularSkills.some(skill => skill.toLowerCase().includes(lowerSearchQuery)); // Search in skills too
      const matchesCategory = categoryFilter === "All" || hustle.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === "All" || hustle.difficulty === difficultyFilter;
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, categoryFilter, difficultyFilter]);

  return (
    <>
      <Navbar />

      {/* Header */}
      <section
        className="relative pt-24 pb-20 md:pt-32 md:pb-24 gradient-bg text-white overflow-hidden particle-bg"
        ref={headerRef}
        role="banner"
        aria-labelledby="sidehustles-heading"
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
            id="sidehustles-heading"
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center md:text-left" // Responsive text alignment
          >
            Explore Side Hustles
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/90 max-w-3xl mb-8 text-center md:text-left" // Responsive text alignment
          >
            Discover a variety of side hustle opportunities to earn extra income and pursue your passions.
          </motion.p>
          <motion.div
            className="flex flex-col md:flex-row gap-4 max-w-4xl md:mx-0 mx-auto" // Centered on mobile
            variants={itemVariants}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by title, description, or skill..."
                className="pl-12 pr-4 py-3 text-base rounded-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 w-full h-12" // Enhanced styling
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search side hustles"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger 
                className="w-full md:w-48 rounded-lg bg-white/10 border-white/20 text-white data-[placeholder]:text-white/60 focus:bg-white/20 focus:border-white/40 h-12"
                aria-label="Filter by category"
              >
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger 
                className="w-full md:w-48 rounded-lg bg-white/10 border-white/20 text-white data-[placeholder]:text-white/60 focus:bg-white/20 focus:border-white/40 h-12"
                aria-label="Filter by difficulty"
              >
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none"></div>
        {/* Decorative Blurs - no functional changes */}
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

      {/* Side Hustles Grid */}
      <main // Changed to main for semantic HTML
        className="py-16 bg-background"
        ref={gridRef}
        role="region"
        aria-labelledby="hustles-grid-heading"
      >
        <div className="container mx-auto px-4">
          <h2 id="hustles-grid-heading" className="sr-only">
            Side Hustles List
          </h2>
          {filteredHustles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center text-muted-foreground py-10"
            >
              <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-xl font-semibold mb-2">No Side Hustles Found</p>
              <p className="mb-6">Try adjusting your search query or filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("All");
                  setDifficultyFilter("All");
                }}
                aria-label="Reset all filters"
              >
                Reset Filters
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" // Increased gap
              variants={containerVariants}
              initial="hidden"
              animate={isGridInView ? "visible" : "hidden"}
            >
              {filteredHustles.map((hustle: SideHustle) => (
                <motion.div 
                  key={hustle.id} 
                  variants={cardVariants}
                  whileHover="hover" // Apply hover variant from framer-motion
                  className="h-full" // Ensure motion.div takes full height for card
                >
                  <Card className="card-gradient border-neutral-200 dark:border-neutral-800 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col bg-card"> {/* Added bg-card for theming */}
                    <CardHeader className="pb-4"> {/* Reduced padding */}
                      <div className="flex justify-between items-start mb-3"> {/* items-start for better alignment */}
                        <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                          {hustle.category}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span>{hustle.rating.toFixed(1)} ({hustle.reviewCount})</span> {/* .toFixed(1) for consistency */}
                        </div>
                      </div>
                      <CardTitle className="text-xl font-semibold text-card-foreground">{hustle.title}</CardTitle> {/* Added text-card-foreground */}
                      <CardDescription className="line-clamp-2 text-sm text-muted-foreground pt-1"> {/* Ensure consistent text size */}
                        {hustle.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pb-4"> {/* Reduced padding, flex-grow */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span>{hustle.income}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500" />
                          <span>{hustle.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span>{hustle.timeCommitment}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-orange-500" />
                          <span>{hustle.startupCost}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardContent className="pt-0 mt-auto"> {/* mt-auto to push button to bottom */}
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-center text-primary hover:bg-primary/10 hover:text-primary font-semibold group" // Centered text, added group for icon animation
                        aria-label={`Learn more about ${hustle.title}`}
                      >
                        <Link href={`/sidehustles/${hustle.id}`}>
                          Learn More
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
        className="py-16 bg-muted/40" // Changed background for subtlety
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
              Find Your Perfect Side Hustle
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              Not sure where to start? Take our quiz to discover the side hustle that best matches your skills, interests, and goals.
            </p>
            <Button asChild size="lg" className="rounded-full px-8 py-3 text-base group">
              <Link href="/quiz" aria-label="Take the side hustle quiz">
                Take the Quiz
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
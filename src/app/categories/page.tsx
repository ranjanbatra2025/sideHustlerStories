"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useState, useRef, useMemo, useEffect } from "react";
import { debounce } from "lodash";
import SubmitStoryModal from "../stories/SubmitStoryModal"; // Adjust path based on actual location; assuming relative to stories

// Define StoryData type (aligned for consistency with modal props)
interface StoryData {
  id?: string;
  title: string;
  name: string;
  hustle: string;
  rating?: number;
  image: string;
  story: string;
  category: string;
  views?: number;
}

interface Category {
  id: string;
  name: string;
  description: string;
  count: number;
  subcategories: string[];
  date: string;
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("count"); // "count", "name" or "date"
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const headerRef = useRef(null);
  const categoriesRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isCategoriesInView = useInView(categoriesRef, { once: true, amount: 0.2 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
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
      scale: 1.05,
      rotate: 1,
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = debounce((value) => {
    setSearchTerm(value.toLowerCase());
  }, 100); // Reduced debounce time for faster response

  const filteredCategories = useMemo(() => {
    const result = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm) ||
        category.description.toLowerCase().includes(searchTerm) ||
        category.subcategories.some((sub) => sub.toLowerCase().includes(searchTerm))
    );

    if (sortBy === "count") {
      result.sort((a, b) => b.count - a.count);
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "date") {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return result;
  }, [searchTerm, sortBy, categories]);

  const featuredCategory = useMemo(() => 
    categories.find(cat => cat.id === "digital-online") || categories[0],
  [categories]);

  const handleStorySubmitted = (newStory: StoryData) => {
    // No local stories state to update on categories page; can add logic if needed (e.g., refresh categories)
  };

  return (
    <>
      <style jsx global>{`
        @keyframes particle {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) scale(0.5);
            opacity: 0;
          }
        }
        .particle-bg::before {
          content: "";
          position: absolute;
          inset: 0;
          background: url("/noise.png") repeat;
          opacity: 0.1;
          pointer-events: none;
        }
        .particle-bg::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle, transparent 10%, rgba(0, 0, 0, 0.5) 100%);
        }
        .particle {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: particle 10s linear infinite;
          pointer-events: none;
        }
        .search-glow:focus {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
        }
        .card-gradient {
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(0, 0, 0, 0.05));
          backdrop-filter: blur(5px);
        }
      `}</style>

      <Navbar />

      {/* Header - With search */}
      <section
        className="relative pt-24 pb-20 md:pt-32 md:pb-24 gradient-bg text-white overflow-hidden particle-bg"
        ref={headerRef}
        role="banner"
        aria-labelledby="categories-heading"
      >
        {/* Removed particles for faster loading */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background/20 to-transparent"></div>
        <motion.div
          className="container mx-auto px-4 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
        >
          <div className="max-w-3xl">
            <motion.div variants={itemVariants} className="flex items-center gap-2 text-sm font-medium text-white/70 mb-4">
              <Link href="/" className="hover:text-white" aria-label="Back to home">
                Home
              </Link>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span>Categories</span>
            </motion.div>
            <motion.h1
              id="categories-heading"
              variants={itemVariants}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Side Hustle Story Categories
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-white/90 max-w-3xl">
              Browse our comprehensive collection of side hustle stories organized by category. Find inspiring tales that match your interests and goals.
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="relative max-w-md mt-8 sticky top-16 z-20 bg-gradient-to-b from-background/80 to-background/60 p-4 rounded-xl"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" aria-hidden="true" />
              <Input
                placeholder="Search categories..."
                className="pl-10 py-6 text-base rounded-full border-white/20 bg-gray-600/80 text-white placeholder:text-white/70 focus:border-white focus:bg-gray-700 search-glow"
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="Search categories by name or subcategory"
              />
              <div className="flex gap-2 mt-2">
                <Button
                  variant={sortBy === "count" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSortBy("count")}
                  className="rounded-full text-white bg-primary/80 hover:bg-primary"
                  aria-label="Sort categories by count"
                >
                  By Count
                </Button>
                <Button
                  variant={sortBy === "name" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSortBy("name")}
                  className="rounded-full text-white bg-primary/80 hover:bg-primary"
                  aria-label="Sort categories by name"
                >
                  By Name
                </Button>
                <Button
                  variant={sortBy === "date" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSortBy("date")}
                  className="rounded-full text-white bg-primary/80 hover:bg-primary"
                  aria-label="Sort categories by date"
                >
                  By Date
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
        {/* Removed glow motions for faster loading */}
      </section>

      {/* Categories Grid */}
      <section
        className="py-16 md:py-24"
        ref={categoriesRef}
        role="region"
        aria-labelledby="categories-grid-heading"
        aria-live="polite"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isCategoriesInView ? "visible" : "hidden"}
        >
          <motion.h2
            id="categories-grid-heading"
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6 text-center sr-only"
          >
            Side Hustle Story Categories
          </motion.h2>
          {loading ? (
            <motion.p
              variants={itemVariants}
              className="text-center text-lg text-muted-foreground"
            >
              Loading categories...
            </motion.p>
          ) : filteredCategories.length === 0 ? (
            <motion.p
              variants={itemVariants}
              className="text-center text-lg text-muted-foreground"
              role="alert"
            >
              No categories found. Try a different search term.
            </motion.p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {filteredCategories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  onHoverStart={() => setHoveredCategory(category.id)}
                  onHoverEnd={() => setHoveredCategory(null)}
                >
                  <Link href={`/stories?category=${category.id}`} className="block group">
                    <Card className="card-gradient border-0 shadow-sm h-full transition-all duration-300 relative">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {category.name}
                          <span className="text-sm font-normal bg-primary/10 text-primary px-3 py-1 rounded-full">
                            {category.count}
                          </span>
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-base">
                          {category.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {category.subcategories.slice(0, 3).map((subcategory) => (
                            <span
                              key={subcategory}
                              className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary/80 text-secondary-foreground"
                            >
                              {subcategory}
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                              +{category.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button
                          asChild
                          variant="ghost"
                          className="w-full justify-between text-primary hover:bg-primary/5 group-hover:bg-primary/5"
                          aria-label={`Explore ${category.name} category`}
                        >
                          <div>
                            <span>Explore Stories</span>
                            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                          </div>
                        </Button>
                      </CardFooter>
                      {hoveredCategory === category.id && (
                        <motion.div
                          className="absolute top-0 left-full ml-2 p-4 bg-background rounded-lg shadow-lg z-10 w-64"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <h3 className="text-sm font-bold mb-2">{category.name}</h3>
                          <ul className="text-sm text-muted-foreground">
                            {category.subcategories.map((sub, index) => (
                              <li key={index} className="mb-1">
                                • {sub}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* Featured Category Spotlight */}
      <section
        className="py-16 bg-muted/10"
        role="region"
        aria-labelledby="featured-category-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isCategoriesInView ? "visible" : "hidden"}
        >
          <motion.h2
            id="featured-category-heading"
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6 text-center"
          >
            Featured Category: {featuredCategory?.name || "Digital & Online Hustles"}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 text-center">
            Discover inspiring stories of side hustles that you can start from anywhere with just a laptop and an internet connection.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href={`/stories?category=${featuredCategory?.id || "digital-online"}`} className="block">
              <Card className="card-gradient border-0 shadow-lg h-full transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {featuredCategory?.name || "Digital & Online Hustles"}
                    <span className="text-sm font-normal bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {featuredCategory?.count || 28}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-base">
                    {featuredCategory?.description || "Stories of side hustles that can be done completely online"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(featuredCategory?.subcategories || []).map((subcategory) => (
                      <span
                        key={subcategory}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/20 text-primary"
                      >
                        {subcategory}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    From freelancing to digital products, explore inspiring stories that leverage the power of the internet.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    variant="default"
                    className="w-full rounded-full"
                    aria-label={`Explore ${featuredCategory?.name || "Digital & Online Hustles"} category`}
                  >
                    <div>
                      <span>Explore Stories</span>
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </div>
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 bg-primary/5 relative overflow-hidden"
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
          <motion.h2
            id="cta-heading"
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Share Your Story
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Inspired by these stories? Submit your own side hustle journey and inspire others in our community.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button
              size="lg"
              className="rounded-full px-8"
              aria-label="Submit your story"
              onClick={() => setShowSubmitModal(true)}
            >
              Submit Your Story
            </Button>
          </motion.div>
        </motion.div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-br-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/3 rounded-tl-[100px]"></div>
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
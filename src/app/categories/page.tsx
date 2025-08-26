"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, ChevronRight, Search, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useState, useRef, useMemo } from "react";
import { debounce } from "lodash";

const categories = [
  {
    id: "digital",
    name: "Digital & Online",
    description: "Stories of side hustles that can be done completely online",
    count: 24,
    subcategories: ["Blogging", "Social Media", "Digital Products", "SaaS", "Affiliate Marketing"],
  },
  {
    id: "creative",
    name: "Creative & Design",
    description: "Stories for creatively inclined individuals",
    count: 18,
    subcategories: ["Graphic Design", "Photography", "Video Production", "Writing", "Art"],
  },
  {
    id: "freelancing",
    name: "Freelancing & Services",
    description: "Stories of offering skills and services to clients",
    count: 22,
    subcategories: ["Web Development", "Content Creation", "Virtual Assistant", "Consulting", "Marketing"],
  },
  {
    id: "physical",
    name: "Physical Products",
    description: "Stories involving selling or creating physical items",
    count: 15,
    subcategories: ["E-commerce", "Handmade Crafts", "Dropshipping", "Print-on-Demand", "Local Selling"],
  },
  {
    id: "finance",
    name: "Finance & Investing",
    description: "Stories related to money management and investments",
    count: 10,
    subcategories: ["Stock Trading", "Cryptocurrency", "Real Estate", "P2P Lending", "Financial Content Creation"],
  },
  {
    id: "education",
    name: "Education & Coaching",
    description: "Stories focused on teaching and mentoring others",
    count: 12,
    subcategories: ["Online Courses", "Tutoring", "Coaching", "Workshops", "Writing Educational Content"],
  },
  {
    id: "misc",
    name: "Miscellaneous",
    description: "Other unique and interesting side hustle stories",
    count: 8,
    subcategories: ["Rental Business", "Task Services", "Local Services", "Event Planning", "Seasonal Work"],
  },
  {
    id: "passive",
    name: "Passive Income",
    description: "Stories that generate income with minimal ongoing work",
    count: 16,
    subcategories: ["Dividend Investing", "Content Royalties", "Apps & Software", "Print-on-Demand", "Automated Digital Products"],
  },
];

const testimonials = [
  {
    quote: "The Digital & Online stories helped me launch my blog and earn passive income!",
    author: "Alex M., Blogger",
  },
  {
    quote: "I found my calling in graphic design thanks to the Creative & Design stories.",
    author: "Lisa R., Freelance Designer",
  },
  {
    quote: "The Freelancing stories gave me the tools to start my consulting business.",
    author: "Mark T., Consultant",
  },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("count"); // "count" or "name"
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const headerRef = useRef(null);
  const categoriesRef = useRef(null);
  const ctaRef = useRef(null);
  const testimonialRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isCategoriesInView = useInView(categoriesRef, { once: true, amount: 0.2 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.2 });
  const isTestimonialInView = useInView(testimonialRef, { once: true, amount: 0.2 });

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
      transition: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 },
    },
    hover: {
      scale: 1.05,
      rotate: 1,
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value.toLowerCase());
  }, 300);

  const filteredCategories = useMemo(() => {
    const result = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm) ||
        category.description.toLowerCase().includes(searchTerm) ||
        category.subcategories.some((sub) => sub.toLowerCase().includes(searchTerm))
    );

    if (sortBy === "count") {
      result.sort((a, b) => b.count - a.count);
    } else {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [searchTerm, sortBy]);

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

      {/* Header */}
      <section
        className="relative pt-24 pb-20 md:pt-32 md:pb-24 gradient-bg text-white overflow-hidden particle-bg"
        ref={headerRef}
        role="banner"
        aria-labelledby="categories-heading"
      >
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
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
                className="pl-10 py-6 text-base rounded-full border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:border-white focus:bg-white/20 search-glow"
                onChange={(e) => handleSearch(e.target.value)}
                aria-label="Search categories by name or subcategory"
              />
              <div className="flex gap-2 mt-2">
                <Button
                  variant={sortBy === "count" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("count")}
                  className="rounded-full"
                  aria-label="Sort categories by count"
                >
                  By Count
                </Button>
                <Button
                  variant={sortBy === "name" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSortBy("name")}
                  className="rounded-full"
                  aria-label="Sort categories by name"
                >
                  By Name
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/30 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-blue-500/30 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />
      </section>

      {/* Featured Category Spotlight */}
      <section
        className="py-16 bg-muted/10"
        ref={categoriesRef}
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
            Featured Category: Digital & Online
          </motion.h2>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 text-center">
            Discover inspiring stories of side hustles that you can start from anywhere with just a laptop and an internet connection.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="/categories/digital" className="block">
              <Card className="card-gradient border-0 shadow-lg h-full transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Digital & Online
                    <span className="text-sm font-normal bg-primary/10 text-primary px-3 py-1 rounded-full">
                      24
                    </span>
                  </CardTitle>
                  <CardDescription className="text-base">
                    Stories of side hustles that can be done completely online
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories[0].subcategories.map((subcategory) => (
                      <span
                        key={subcategory}
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/20 text-primary"
                      >
                        {subcategory}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    From blogging to SaaS, explore inspiring stories that leverage the power of the internet.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    asChild
                    variant="default"
                    className="w-full rounded-full"
                    aria-label="Explore Digital & Online category"
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

      {/* Categories Grid */}
      <section
        className="py-16 md:py-24"
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
          <div className="flex items-center justify-center mb-12">
            <div className="h-[1px] w-12 bg-primary/70"></div>
            <span className="mx-3 text-sm font-medium text-primary">EXPLORE</span>
            <div className="h-[1px] w-12 bg-primary/70"></div>
          </div>
          <motion.h2
            id="categories-grid-heading"
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6 text-center sr-only"
          >
            All Categories
          </motion.h2>
          {filteredCategories.length === 0 ? (
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

      {/* Testimonial Slider */}
      <section
        className="py-16 bg-primary/5"
        ref={testimonialRef}
        role="region"
        aria-labelledby="testimonials-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isTestimonialInView ? "visible" : "hidden"}
        >
          <motion.h2
            id="testimonials-heading"
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-6 text-center"
          >
            Success Stories
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12 text-center"
          >
            Hear from users who found inspiration through our stories.
          </motion.p>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-background rounded-2xl p-6 shadow-sm"
              >
                <Star className="h-6 w-6 text-primary mb-4" aria-hidden="true" />
                <p className="text-lg italic text-muted-foreground mb-4">"{testimonial.quote}"</p>
                <p className="font-medium">{testimonial.author}</p>
              </motion.div>
            ))}
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
              asChild
              size="lg"
              className="rounded-full px-8"
              aria-label="Submit your story"
            >
              <Link href="/submit-story">Submit Your Story</Link>
            </Button>
          </motion.div>
        </motion.div>
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary/5 rounded-br-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary/3 rounded-tl-[100px]"></div>
      </section>

      <Footer />
    </>
  );
}
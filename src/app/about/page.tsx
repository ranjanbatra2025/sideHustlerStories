"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Head from "next/head";
import { ArrowRight, BookOpen, DollarSign, Users, Lightbulb, Mail } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const teamMembers = [
  {
    name: "Jane Doe",
    role: "Founder & CEO",
    bio: "A serial entrepreneur who shares her side hustle journey to inspire others.",
  },
  {
    name: "John Smith",
    role: "Co-Founder & CTO",
    bio: "A tech enthusiast who built the platform to enable sharing of side hustle stories worldwide.",
  },
  {
    name: "Emily Brown",
    role: "Head of Content",
    bio: "A content creator passionate about curating and sharing inspiring side hustle stories.",
  },
];

const timelineEvents = [
  {
    year: "2024",
    description: "Side Hustle Stories founded by passionate side hustlers.",
  },
  {
    year: "2025",
    description: "Launched platform for users to add and discover inspiring side hustle stories.",
  },
  {
    year: "Future",
    description: "Building a global community of inspired side hustlers sharing their journeys.",
  },
];

export default function AboutPage() {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [particleStyles, setParticleStyles] = useState<{ left: string; top: string; animationDelay: string; animationDuration: string; }[]>([]);

  const missionRef = useRef(null);
  const storyRef = useRef(null);
  const teamRef = useRef(null);
  const contactRef = useRef(null);

  const isMissionInView = useInView(missionRef, { once: true, amount: 0.2 });
  const isStoryInView = useInView(storyRef, { once: true, amount: 0.2 });
  const isTeamInView = useInView(teamRef, { once: true, amount: 0.2 });
  const isContactInView = useInView(contactRef, { once: true, amount: 0.2 });

  // Generate client-side particle styles
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

  // Team carousel auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % teamMembers.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const teamCardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  const timelineVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const headerTextVariants = {
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
        <title>Side Hustle Stories - About Us</title>
        <meta
          name="description"
          content="Learn about Side Hustle Stories' mission to empower people to share and discover inspiring side hustle journeys."
        />
        <meta
          name="keywords"
          content="side hustle stories, about us, mission, team, inspiration, community"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Side Hustle Stories - About Us" />
        <meta
          property="og:description"
          content="Discover the mission, story, and team behind Side Hustle Stories."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sidehustlestories.com/about" />
        <meta property="og:image" content="/og-image.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "Side Hustle Stories About",
            url: "https://sidehustlestories.com/about",
            publisher: {
              "@type": "Organization",
              name: "Side Hustle Stories",
            },
          })}
        </script>
      </Head>

      <Navbar />

      {/* Header */}
      <section
        className="relative pt-24 pb-16 md:pt-32 md:pb-20 gradient-bg text-white overflow-hidden particle-bg"
        role="banner"
        aria-labelledby="header-heading"
      >
        {particleStyles.map((style, i) => (
          <motion.div
            key={`header-particle-${i}`}
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
          animate="visible"
        >
          <motion.h1
            id="header-heading"
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-center"
            variants={containerVariants}
          >
            {"About Side Hustle Stories".split("").map((char, i) => (
              <motion.span key={`header-char-${i}`} variants={headerTextVariants} custom={i}>
                {char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-center"
          >
            Learn more about our mission to inspire through shared side hustle stories.
          </motion.p>
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

      {/* Mission Section */}
      <section
        className="py-20 md:py-32 bg-muted/5"
        ref={missionRef}
        role="region"
        aria-labelledby="mission-heading"
        aria-describedby="mission-description"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isMissionInView ? "visible" : "hidden"}
        >
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-[1px] w-12 bg-primary/70"></div>
              <span className="mx-3 text-sm font-medium text-primary">OUR MISSION</span>
              <div className="h-[1px] w-12 bg-primary/70"></div>
            </div>
            <motion.h2
              id="mission-heading"
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Our Mission
            </motion.h2>
            <motion.p
              id="mission-description"
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Inspiring others through shared side hustle stories.
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <p className="text-lg mb-4">
                At Side Hustle Stories, we believe everyone has a story worth sharing that can inspire others on their side hustle journey.
              </p>
              <p className="text-lg mb-4">
                We're dedicated to providing a platform where people can add their side hustle stories, discover inspiring tales, and connect with like-minded individuals.
              </p>
              <p className="text-lg">
                Whether you're starting your first side hustle or scaling your venture, our community of stories is here to motivate and guide you.
              </p>
            </motion.div>
            <motion.div className="grid grid-cols-2 gap-6" variants={containerVariants}>
              {[
                {
                  icon: <DollarSign className="h-12 w-12 text-primary" />,
                  title: "Income Inspiration",
                  description: "Stories of creating additional income streams",
                },
                {
                  icon: <BookOpen className="h-12 w-12 text-primary" />,
                  title: "Learning Journeys",
                  description: "Tales of skill development through side hustles",
                },
                {
                  icon: <Lightbulb className="h-12 w-12 text-primary" />,
                  title: "Creative Sparks",
                  description: "Inspiring stories of passion projects",
                },
                {
                  icon: <Users className="h-12 w-12 text-primary" />,
                  title: "Community Building",
                  description: "Connecting through shared experiences",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={teamCardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-background card-gradient shadow-sm"
                >
                  <motion.div
                    className="mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Separator className="bg-primary/10" />

      {/* Story Section */}
      <section
        className="py-20 md:py-32"
        ref={storyRef}
        role="region"
        aria-labelledby="story-heading"
        aria-describedby="story-description"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isStoryInView ? "visible" : "hidden"}
        >
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-[1px] w-12 bg-primary/70"></div>
              <span className="mx-3 text-sm font-medium text-primary">OUR STORY</span>
              <div className="h-[1px] w-12 bg-primary/70"></div>
            </div>
            <motion.h2
              id="story-heading"
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Our Story
            </motion.h2>
            <motion.p
              id="story-description"
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              From one inspiring tale to a community of shared experiences.
            </motion.p>
          </motion.div>
          <motion.div className="relative max-w-3xl mx-auto" variants={containerVariants}>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary/20 h-full"></div>
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                variants={timelineVariants}
                initial="hidden"
                animate="visible"
                className={`mb-12 flex justify-between items-center w-full ${
                  index % 2 === 0 ? "flex-row-reverse" : ""
                }`}
              >
                <div className="w-5/12"></div>
                <motion.div
                  className="z-10 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {event.year}
                </motion.div>
                <div className="w-5/12">
                  <motion.div
                    className="bg-background p-6 rounded-2xl card-gradient shadow-sm"
                    whileHover={{ scale: 1.03 }}
                  >
                    <p className="text-lg text-muted-foreground">{event.description}</p>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.div variants={itemVariants} className="flex justify-center mt-12">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 bg-primary text-white hover:bg-primary/90 search-glow"
              aria-label="Explore stories"
            >
              <Link href="/stories">Explore Stories</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <Separator className="bg-primary/10" />

      {/* Team Section */}
      <section
        className="py-20 md:py-32 bg-primary/5 relative overflow-hidden"
        ref={teamRef}
        role="region"
        aria-labelledby="team-heading"
        aria-describedby="team-description"
      >
        <motion.div
          className="container mx-auto px-4 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={isTeamInView ? "visible" : "hidden"}
        >
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-[1px] w-12 bg-primary/70"></div>
              <span className="mx-3 text-sm font-medium text-primary">OUR TEAM</span>
              <div className="h-[1px] w-12 bg-primary/70"></div>
            </div>
            <motion.h2
              id="team-heading"
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Meet Our Team
            </motion.h2>
            <motion.p
              id="team-description"
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              The passionate individuals curating inspiring side hustle stories.
            </motion.p>
          </motion.div>
          <motion.div
            className="relative overflow-hidden max-w-lg mx-auto"
            variants={containerVariants}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  variants={teamCardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="bg-background rounded-2xl p-8 card-gradient shadow-md text-center"
                >
                  <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto mb-6"></div>
                  <h3 className="text-xl font-bold mb-2">{teamMembers[carouselIndex].name}</h3>
                  <p className="text-sm text-primary mb-4">{teamMembers[carouselIndex].role}</p>
                  <p className="text-muted-foreground">{teamMembers[carouselIndex].bio}</p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <motion.div
              className="flex justify-center gap-2 mt-6"
              variants={itemVariants}
            >
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === carouselIndex ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={() => setCarouselIndex(index)}
                  aria-label={`View team member ${index + 1}`}
                />
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
        </motion.div>
      </section>

      <Separator className="bg-primary/10" />

      {/* Contact Section */}
      <section
        className="py-20 md:py-32 gradient-bg text-white relative overflow-hidden particle-bg"
        ref={contactRef}
        role="region"
        aria-labelledby="contact-heading"
        aria-describedby="contact-description"
      >
        {particleStyles.map((style, i) => (
          <motion.div
            key={`contact-particle-${i}`}
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
          animate={isContactInView ? "visible" : "hidden"}
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
              <Mail className="h-12 w-12 mx-auto text-white/90" />
            </motion.div>
            <motion.h2
              id="contact-heading"
              variants={itemVariants}
              className="text-3xl md:text-5xl font-bold mb-6"
            >
              Get In Touch
            </motion.h2>
            <motion.p
              id="contact-description"
              variants={itemVariants}
              className="text-xl text-white/90 max-w-2xl mx-auto mb-10"
            >
              Have a side hustle story to share? Questions or suggestions? We'd love to hear from you!
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col md:flex-row justify-center gap-4"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 bg-white text-primary hover:bg-white/90 hover:text-primary search-glow"
                aria-label="Email us"
              >
                <Link href="mailto:contact@sidehustlestories.com">
                  <Mail className="h-5 w-5 mr-2" /> Email Us
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 bg-transparent border-white hover:bg-white/20 text-white search-glow"
                aria-label="Go to contact form"
              >
                <Link href="/contact">
                  Contact Form <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
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
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
  ArrowRight, Clock, DollarSign, Star, TrendingUp,
  CheckCircle2, XCircle, Lightbulb, Landmark, GraduationCap, Users
} from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useState, useRef } from "react";
import { sideHustles } from "../sideHustles";

// Client component
export function SideHustlePage({
  sideHustle,
}: {
  sideHustle: typeof sideHustles[number];
}) {
  const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null);

  const headerRef = useRef(null);
  const overviewRef = useRef(null);
  const skillsRef = useRef(null);
  const stepsRef = useRef(null);
  const platformsRef = useRef(null);
  const resourcesRef = useRef(null);
  const successRef = useRef(null);
  const relatedRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isOverviewInView = useInView(overviewRef, { once: true, amount: 0.2 });
  const isSkillsInView = useInView(skillsRef, { once: true, amount: 0.2 });
  const isStepsInView = useInView(stepsRef, { once: true, amount: 0.2 });
  const isPlatformsInView = useInView(platformsRef, { once: true, amount: 0.2 });
  const isResourcesInView = useInView(resourcesRef, { once: true, amount: 0.2 });
  const isSuccessInView = useInView(successRef, { once: true, amount: 0.2 });
  const isRelatedInView = useInView(relatedRef, { once: true, amount: 0.2 });
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
      transition: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 },
    },
    hover: {
      scale: 1.05,
      rotate: 1,
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  const relatedHustles = sideHustles
    .filter((hustle) => hustle.id !== sideHustle.id)
    .slice(0, 3);

  return (
    <>
      <Navbar />

      {/* Header */}
      <section
        className="relative pt-24 pb-20 md:pt-32 md:pb-24 gradient-bg text-white overflow-hidden particle-bg"
        ref={headerRef}
        role="banner"
        aria-labelledby="sidehustle-heading"
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
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 mb-4"
          >
            <Link href="/sidehustles" className="hover:text-white" aria-label="Back to side hustles">
              <ArrowRight className="h-4 w-4 rotate-180" /> Back to Side Hustles
            </Link>
          </motion.div>
          <motion.div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            variants={itemVariants}
          >
            <h1 id="sidehustle-heading" className="text-4xl md:text-6xl font-bold">
              {sideHustle.title}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(sideHustle.rating) ? "text-yellow-500 fill-yellow-500" : "text-white/50"}`}
                  />
                ))}
              </div>
              <span className="font-medium">{sideHustle.rating}</span>
              <span className="text-white/70">({sideHustle.reviewCount} reviews)</span>
            </div>
          </motion.div>
          <motion.p variants={itemVariants} className="text-xl text-white/90 max-w-3xl">
            {sideHustle.description}
          </motion.p>
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

      {/* Overview */}
      <section
        className="py-12"
        ref={overviewRef}
        role="region"
        aria-labelledby="overview-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isOverviewInView ? "visible" : "hidden"}
        >
          <motion.h2
            id="overview-heading"
            variants={itemVariants}
            className="text-3xl font-bold mb-6"
          >
            Overview
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div variants={itemVariants}>
              <p className="text-lg mb-6">{sideHustle.longDescription}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Income Potential</p>
                    <p className="text-sm text-muted-foreground">{sideHustle.income}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Difficulty</p>
                    <p className="text-sm text-muted-foreground">{sideHustle.difficulty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Time Commitment</p>
                    <p className="text-sm text-muted-foreground">{sideHustle.timeCommitment}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Startup Costs</p>
                    <p className="text-sm text-muted-foreground">{sideHustle.startupCost}</p>
                  </div>
                </div>
              </div>
              <motion.div className="flex gap-4" variants={itemVariants}>
                <Button asChild size="lg" className="rounded-full">
                  <Link href="#get-started" aria-label="How to get started with this side hustle">
                    How to Get Started
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full">
                  <Link href="#platforms" aria-label="Top platforms for this side hustle">
                    Top Platforms
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
            <motion.div className="grid grid-cols-1 gap-6" variants={containerVariants}>
              <Card className="card-gradient border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" /> Pros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sideHustle.pros.map((pro, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="card-gradient border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" /> Cons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {sideHustle.cons.map((con, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <Separator />

      {/* Popular Skills */}
      <section
        className="py-12"
        ref={skillsRef}
        role="region"
        aria-labelledby="skills-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isSkillsInView ? "visible" : "hidden"}
        >
          <motion.h2
            id="skills-heading"
            variants={itemVariants}
            className="text-3xl font-bold mb-6"
          >
            Popular {sideHustle.title} Skills
          </motion.h2>
          <motion.div className="flex flex-wrap gap-3" variants={containerVariants}>
            {sideHustle.popularSkills.map((skill, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {skill}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <Separator />

      {/* How to Get Started */}
      <section
        className="py-12"
        ref={stepsRef}
        role="region"
        aria-labelledby="get-started-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isStepsInView ? "visible" : "hidden"}
        >
          <motion.h2
            id="get-started-heading"
            variants={itemVariants}
            className="text-3xl font-bold mb-6"
          >
            How to Get Started with {sideHustle.title}
          </motion.h2>
          <motion.div className="mb-8" variants={itemVariants}>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full progress-bar"
                style={{ "--progress": "100%" } as React.CSSProperties & { [key: string]: string }}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {sideHustle.steps.length} Steps to Success
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {sideHustle.steps.map((step, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card className="card-gradient border-0 shadow-sm h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <Separator />

      {/* Top Platforms */}
      <section
        className="py-12 bg-muted/10"
        ref={platformsRef}
        role="region"
        aria-labelledby="platforms-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isPlatformsInView ? "visible" : "hidden"}
        >
          <motion.h2
            id="platforms-heading"
            variants={itemVariants}
            className="text-3xl font-bold mb-6"
          >
            Top {sideHustle.title} Platforms
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {sideHustle.platforms.map((platform, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                onHoverStart={() => setHoveredPlatform(platform.name)}
                onHoverEnd={() => setHoveredPlatform(null)}
              >
                <Card className="card-gradient border-0 shadow-sm h-full relative">
                  <CardHeader>
                    <CardTitle>{platform.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{platform.description}</p>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-full"
                      aria-label={`Visit ${platform.name} website`}
                    >
                      <Link href={platform.url} target="_blank" rel="noopener noreferrer">
                        Visit Website <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                  {hoveredPlatform === platform.name && (
                    <motion.div
                      className="absolute top-0 left-full ml-2 p-4 bg-background rounded-lg shadow-lg z-10 w-64"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h3 className="text-sm font-bold mb-2">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <Separator />

      {/* Resources */}
      <section
        className="py-12"
        ref={resourcesRef}
        role="region"
        aria-labelledby="resources-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isResourcesInView ? "visible" : "hidden"}
        >
          <motion.h2
            id="resources-heading"
            variants={itemVariants}
            className="text-3xl font-bold mb-6"
          >
            Helpful Resources
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {sideHustle.resources.map((resource, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card className="card-gradient border-0 shadow-sm h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{resource.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <Separator />

      {/* Success Factors */}
      <section
        className="py-12 bg-muted/10"
        ref={successRef}
        role="region"
        aria-labelledby="success-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isSuccessInView ? "visible" : "hidden"}
        >
          <motion.h2
            id="success-heading"
            variants={itemVariants}
            className="text-3xl font-bold mb-8 text-center"
          >
            Keys to Success in {sideHustle.title}
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Continuous Learning</h3>
              <p>Stay current with industry trends and regularly improve your skills to remain competitive.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Networking</h3>
              <p>Build relationships with clients, other freelancers, and industry professionals to expand your opportunities.</p>
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                <Landmark className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Professionalism</h3>
              <p>Maintain high standards of communication, reliability, and quality to build a strong reputation.</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <Separator />

      {/* Related Side Hustles */}
      <section
        className="py-12"
        ref={relatedRef}
        role="region"
        aria-labelledby="related-heading"
      >
        <motion.div
          className="container mx-auto px-4"
          variants={containerVariants}
          initial="hidden"
          animate={isRelatedInView ? "visible" : "hidden"}
        >
          <motion.h2
            id="related-heading"
            variants={itemVariants}
            className="text-3xl font-bold mb-6"
          >
            Explore Related Side Hustles
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {relatedHustles.map((hustle) => (
              <motion.div key={hustle.id} variants={cardVariants}>
                <Link href={`/sidehustles/${hustle.id}`} className="block">
                  <Card className="card-gradient border-0 shadow-sm h-full">
                    <CardHeader>
                      <CardTitle>{hustle.title}</CardTitle>
                      <CardDescription>{hustle.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span>{hustle.rating} ({hustle.reviewCount} reviews)</span>
                      </div>
                    </CardContent>
                    <CardContent className="pt-0">
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-between text-primary hover:bg-primary/5"
                        aria-label={`Explore ${hustle.title}`}
                      >
                        <div>
                          <span>Explore</span>
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </div>
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <Separator />

      {/* CTA Section */}
      <section
        className="py-12 bg-primary/5"
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
          <motion.div className="max-w-3xl mx-auto" variants={itemVariants}>
            <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 id="cta-heading" className="text-3xl font-bold mb-4">
              Ready to Start Your {sideHustle.title} Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {sideHustle.title} offers a flexible way to earn income while building valuable skills. Take the first step today by exploring our guide and top platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="rounded-full">
                <Link href="#get-started" aria-label="Get started guide">
                  Get Started Guide
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href={`/categories/${sideHustle.category.toLowerCase().replace(/ & /g, '-')}`} aria-label={`Explore ${sideHustle.category} category`}>
                  Explore {sideHustle.category}
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
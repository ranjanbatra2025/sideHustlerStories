// app/resources/guides/page.tsx
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen } from "lucide-react"; // Using BookOpen as a relevant icon; adjust if needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming Card components are available

export default function GuidesPage() {
  const headerRef = useRef(null);
  const guidesRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isGuidesInView = useInView(guidesRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const guides = [
    { name: "How to Start a Side Hustle", description: "Step-by-step guide to launching your first side hustle while keeping your day job." },
    { name: "Monetizing Your Skills", description: "Learn how to turn your hobbies and skills into profitable side income streams." },
    { name: "Time Management for Hustlers", description: "Tips and strategies for balancing your side hustle with full-time work and life." },
    // Add more guides as needed
  ];

  return (
    <>
      <Navbar />
      <section ref={headerRef} className="py-20 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isHeaderInView ? "visible" : "hidden"}
        >
          <motion.h1 variants={itemVariants} className="text-4xl font-bold mb-4">
            Side Hustle Guides
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
            Comprehensive guides to help you start, grow, and succeed in your side hustle journey.
          </motion.p>
        </motion.div>
      </section>
      <section ref={guidesRef} className="py-16">
        <motion.div
          className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isGuidesInView ? "visible" : "hidden"}
        >
          {guides.map((guide, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card>
                <CardHeader>
                  <BookOpen className="h-8 w-8 mb-2" />
                  <CardTitle>{guide.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{guide.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
// app/resources/case-studies/page.tsx
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react"; // Using Star as a relevant icon for success; adjust if needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming Card components are available

export default function CaseStudiesPage() {
  const headerRef = useRef(null);
  const studiesRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isStudiesInView = useInView(studiesRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const caseStudies = [
    { name: "From Freelance Writer to Six-Figure Blogger", description: "How one user turned their passion for writing into a thriving side hustle blog." },
    { name: "E-commerce Side Hustle Success", description: "A story of building an online store that generates passive income." },
    { name: "Gig Economy Triumph", description: "Turning ride-sharing into a full-time income while sharing experiences." },
    // Add more case studies as needed
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
            Side Hustle Success Stories
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
            Inspiring case studies from real users who have shared their side hustle journeys.
          </motion.p>
        </motion.div>
      </section>
      <section ref={studiesRef} className="py-16">
        <motion.div
          className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isStudiesInView ? "visible" : "hidden"}
        >
          {caseStudies.map((study, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card>
                <CardHeader>
                  <Star className="h-8 w-8 mb-2" />
                  <CardTitle>{study.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{study.description}</p>
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
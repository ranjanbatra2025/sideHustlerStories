// app/resources/tools/page.tsx
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Wrench } from "lucide-react"; // Replaced ToolIcon with Wrench as a valid lucide icon; adjust if needed
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Added imports for Card components

export default function ToolsPage() {
  const headerRef = useRef(null);
  const toolsRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isToolsInView = useInView(toolsRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const tools = [
    { name: "Shopify", description: "E-commerce platform for online stores." },
    { name: "Canva", description: "Graphic design tool for creating visuals." },
    { name: "Upwork", description: "Freelance marketplace for gigs." },
    { name: "Fiverr", description: "Platform for freelance services starting at $5." },
    { name: "Freelancer.com", description: "Marketplace for hiring freelancers for various projects." },
    { name: "Printful", description: "Print-on-demand service for custom products." },
    { name: "Printify", description: "On-demand printing and dropshipping platform." },
    { name: "Gelato", description: "Global print-on-demand network for creators." },
    { name: "ChatGPT", description: "AI tool for content generation and ideation." },
    { name: "Notion", description: "All-in-one workspace for notes, tasks, and databases." },
    { name: "Trello", description: "Visual project management tool using boards and cards." },
    { name: "Mailchimp", description: "Email marketing platform for newsletters and campaigns." },
    { name: "Stripe", description: "Payment processing platform for online businesses." },
    { name: "WordPress", description: "Content management system for building websites." },
    { name: "QuickBooks", description: "Accounting software for managing finances." },
    // Add more tools as needed
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
            Tools & Software
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
            Discover essential tools to kickstart your side hustle.
          </motion.p>
        </motion.div>
      </section>
      <section ref={toolsRef} className="py-16">
        <motion.div
          className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isToolsInView ? "visible" : "hidden"}
        >
          {tools.map((tool, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card>
                <CardHeader>
                  <Wrench className="h-8 w-8 mb-2" />
                  <CardTitle>{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{tool.description}</p>
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
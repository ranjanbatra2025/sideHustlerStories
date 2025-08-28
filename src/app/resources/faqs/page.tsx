// app/resources/faqs/page.tsx
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { HelpCircle } from "lucide-react"; // Using HelpCircle as a relevant icon; adjust if needed
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Assuming Accordion components are available

export default function FAQsPage() {
  const headerRef = useRef(null);
  const faqsRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isFAQsInView = useInView(faqsRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const faqs = [
    { question: "What is a side hustle?", answer: "A side hustle is a way to make extra money outside of your full-time job, often involving sharing your skills or passions." },
    { question: "How can I share my side hustle story?", answer: "You can submit your story through our contact form or directly on the stories page if submission is enabled." },
    { question: "Are the stories on this site real?", answer: "Yes, all stories are shared by real users and moderated for authenticity." },
    // Add more FAQs as needed
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
            Side Hustle FAQs
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
            Common questions about side hustles and sharing your stories on our platform.
          </motion.p>
        </motion.div>
      </section>
      <section ref={faqsRef} className="py-16">
        <motion.div
          className="container mx-auto px-4 max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate={isFAQsInView ? "visible" : "hidden"}
        >
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>
                  <HelpCircle className="h-5 w-5 mr-2" />
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
// app/contact/page.tsx
"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const headerRef = useRef(null);
  const formRef = useRef(null);

  const isHeaderInView = useInView(headerRef, { once: true, amount: 0.2 });
  const isFormInView = useInView(formRef, { once: true, amount: 0.2 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., send email)
    setSubmitted(true);
  };

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
            Contact Us
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with us for any inquiries or feedback.
          </motion.p>
        </motion.div>
      </section>
      <section ref={formRef} className="py-16 bg-muted/10">
        <motion.div
          className="container mx-auto px-4 max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate={isFormInView ? "visible" : "hidden"}
        >
          {submitted ? (
            <motion.p variants={itemVariants} className="text-center text-primary text-lg">
              Thank you for your message! We'll get back to you soon.
            </motion.p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
              />
              <Textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
              />
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          )}
          <div className="mt-12 space-y-4 text-center">
            <p className="flex items-center justify-center gap-2">
              <Mail className="h-5 w-5" /> support@sidehustlesnaps.com
            </p>
            <p className="flex items-center justify-center gap-2">
              <Phone className="h-5 w-5" /> +1 (123) 456-7890
            </p>
            <p className="flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" /> 123 Side Hustle St, City, Country
            </p>
          </div>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
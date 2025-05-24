import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary/5 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">
              <span className="text-primary">Side</span>HustlingStories
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Discover the best side hustle opportunities to earn extra income,
              build skills, and pursue your passions.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://twitter.com"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="https://facebook.com"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://instagram.com"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://linkedin.com"
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/sidehustles" className="text-muted-foreground hover:text-primary transition-colors">
                  Side Hustles
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-lg">Popular Side Hustles</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/sidehustles/freelancing" className="text-muted-foreground hover:text-primary transition-colors">
                  Freelancing
                </Link>
              </li>
              <li>
                <Link href="/sidehustles/blogging" className="text-muted-foreground hover:text-primary transition-colors">
                  Blogging
                </Link>
              </li>
              <li>
                <Link href="/sidehustles/ecommerce" className="text-muted-foreground hover:text-primary transition-colors">
                  E-commerce
                </Link>
              </li>
              <li>
                <Link href="/sidehustles/online-courses" className="text-muted-foreground hover:text-primary transition-colors">
                  Online Courses
                </Link>
              </li>
              <li>
                <Link href="/sidehustles/affiliate-marketing" className="text-muted-foreground hover:text-primary transition-colors">
                  Affiliate Marketing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-lg">Resources</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/resources/tools" className="text-muted-foreground hover:text-primary transition-colors">
                  Tools & Software
                </Link>
              </li>
              <li>
                <Link href="/resources/guides" className="text-muted-foreground hover:text-primary transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/resources/case-studies" className="text-muted-foreground hover:text-primary transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/resources/faqs" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 opacity-50" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {currentYear} SideHustlingStories. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

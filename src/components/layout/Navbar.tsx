"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Menu, Search, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/stories", label: "Stories" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus management for search modal
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Focus trapping for mobile menu
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      const focusableElements = mobileMenuRef.current.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
        if (e.key === "Escape") {
          setIsMobileMenuOpen(false);
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isMobileMenuOpen]);

  // Search handler (removed debounce for immediate updates)
  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/sidehustles?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: "/" });
    } finally {
      setIsSigningOut(false);
      setIsMobileMenuOpen(false);
    }
  };

  // Animation variants
  const navbarVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0, 0, 0.58, 1] } },
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const mobileMenuVariants: Variants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: [0, 0, 0.58, 1] } },
  };

  // Mobile menu item variants
  const mobileMenuItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled
            ? "bg-background/95 backdrop-blur-md border-b shadow-sm py-2"
            : "bg-background/95 backdrop-blur-md py-4"
        )}
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
      >
        <div className="container flex items-center justify-between mx-auto">
          <Link
            href="/"
            className={cn(
              "text-2xl font-bold transition-all duration-300",
              isScrolled ? "text-foreground" : "text-foreground"
            )}
            aria-label="Side Hustle Snaps Home"
          >
            <span className="text-primary">Side</span>HustleSnaps
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "font-medium hover:text-primary transition-colors relative py-2",
                    isScrolled ? "text-foreground" : "text-foreground",
                    "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                  )}
                  aria-label={`Navigate to ${link.label}`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "rounded-full w-10 h-10",
                  isScrolled ? "text-foreground" : "text-foreground"
                )}
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>
              {status === "loading" ? (
                <Button
                  variant="ghost"
                  className="rounded-full px-6 animate-pulse"
                  disabled
                  aria-label="Loading user status"
                >
                  <User className="h-4 w-4 mr-2" /> Loading...
                </Button>
              ) : session ? (
                <Button
                  onClick={handleSignOut}
                  className="rounded-full px-6"
                  disabled={isSigningOut}
                  aria-label="Sign out"
                >
                  <User className="h-4 w-4 mr-2" /> {isSigningOut ? "Signing Out..." : "Sign Out"}
                </Button>
              ) : (
                <Button asChild className="rounded-full px-6">
                  <Link href="/signin" aria-label="Sign in">
                    <User className="h-4 w-4 mr-2" /> Sign In
                  </Link>
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full w-10 h-10",
                isScrolled ? "text-foreground" : "text-foreground"
              )}
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full w-10 h-10",
                isScrolled ? "text-foreground" : "text-foreground"
              )}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="bg-background card-gradient rounded-lg shadow-lg w-full max-w-md p-6"
              variants={modalVariants}
            >
              <form onSubmit={handleSearchSubmit}>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search side hustles..."
                    className="pl-10 py-6 text-base rounded-full bg-muted/10 text-foreground placeholder:text-muted-foreground border-border focus:border-primary search-glow"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    aria-label="Search side hustles by title or description"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setIsSearchOpen(false)}
                    aria-label="Close search"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-full"
                    disabled={!searchQuery.trim()}
                    aria-label="Submit search"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col p-6"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <Link
                href="/"
                className="text-2xl font-bold text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Side Hustle Snaps Home"
              >
                <span className="text-primary">Side</span>HustleSnaps
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground rounded-full w-10 h-10"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <motion.div
                  key={link.href}
                  variants={mobileMenuItemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    href={link.href}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label={`Navigate to ${link.label}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={mobileMenuItemVariants} initial="hidden" animate="visible">
                {status === "loading" ? (
                  <Button
                    variant="ghost"
                    className="text-lg font-medium text-foreground animate-pulse"
                    disabled
                    aria-label="Loading user status"
                  >
                    Loading...
                  </Button>
                ) : session ? (
                  <Button
                    variant="ghost"
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    aria-label="Sign out"
                  >
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </Button>
                ) : (
                  <Link
                    href="/signin"
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Sign in"
                  >
                    Sign In
                  </Link>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
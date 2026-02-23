"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanyData } from "@/hooks/use-company-data";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Gallery", path: "/gallery" },
  { name: "Pharmacy", path: "/pharmacy" },
  { name: "Training", path: "/training" },
  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { whatsappUrl } = useCompanyData();
  const pathname = usePathname();

  // Active if exact match for Home, prefix match for all others
  // Also treat /enroll/* as part of Training
  const isActive = (link: { path: string }) => {
    if (link.path === "/") return pathname === "/";
    if (link.path === "/training") return pathname.startsWith("/training") || pathname.startsWith("/enroll");
    return pathname.startsWith(link.path);
  };

  return (
    <header className="bg-card/95 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Chakra Biotech Logo"
            className="h-[70px] w-auto object-contain"
          />

        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`relative font-medium transition-colors hover:text-primary ${isActive(link) ? "text-primary" : "text-foreground"
                }`}
            >
              {link.name}
              {isActive(link) && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Phone className="w-4 h-4 mr-2" />
              WhatsApp
            </a>
          </Button>
          <Button size="sm" asChild>
            <Link href="/products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shop Now
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 text-foreground"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 font-medium transition-colors hover:text-primary ${isActive(link) ? "text-primary" : "text-foreground"
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                <Button size="sm" className="flex-1" asChild>
                  <Link href="/products" onClick={() => setIsOpen(false)}>
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Shop
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

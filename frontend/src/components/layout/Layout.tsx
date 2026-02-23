"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { SubHeader } from "./SubHeader";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { FloatingElement } from "@/components/ui/floating-element";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <FloatingElement
          className="absolute top-20 left-10 w-4 h-4 bg-primary/10 rounded-full"
          duration={4}
          yOffset={15}
        >
          <div />
        </FloatingElement>
        <FloatingElement
          className="absolute top-40 right-20 w-6 h-6 bg-accent/10 rounded-full"
          duration={5}
          yOffset={20}
          delay={1}
        >
          <div />
        </FloatingElement>
        <FloatingElement
          className="absolute bottom-40 left-20 w-3 h-3 bg-secondary/20 rounded-full"
          duration={6}
          yOffset={12}
          delay={2}
        >
          <div />
        </FloatingElement>
        <FloatingElement
          className="absolute bottom-60 right-10 w-5 h-5 bg-primary/5 rounded-full"
          duration={4.5}
          yOffset={18}
          delay={0.5}
        >
          <div />
        </FloatingElement>
      </div>

      {/* Header Components - Always on top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SubHeader />
          <Navbar />
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.main
        className="flex-1 pt-[120px] lg:pt-[120px] relative z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {children}
      </motion.main>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="relative z-40"
      >
        <Footer />
        <WhatsAppButton />
      </motion.div>
    </div>
  );
}

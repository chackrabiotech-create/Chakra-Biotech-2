"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  duration?: number;
  yOffset?: number;
  delay?: number;
}

export function FloatingElement({ 
  children, 
  className = "", 
  duration = 3,
  yOffset = 10,
  delay = 0
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -yOffset, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }}
    >
      {children}
    </motion.div>
  );
}
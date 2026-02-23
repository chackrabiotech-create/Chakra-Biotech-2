"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BackgroundWrapperProps {
  children: ReactNode;
  backgroundImage: string; // Path to image in public folder (e.g., "/hero-saffron.jpg")
  overlayOpacity?: number;
  blurAmount?: "sm" | "md" | "lg" | "xl";
  animationType?: "fade" | "scale" | "slide";
  className?: string;
}

// Available background images in public folder:
// "/hero-saffron.jpg" - Main hero saffron image
// "/saffron-field.jpg" - Saffron field landscape
// "/saffron-tea.jpg" - Saffron tea cup
// "/product-saffron-jar.jpg" - Product jar image

// Preset configurations for easy use
export const backgroundPresets = {
  hero: {
    image: "/WrapperImage.jpg",
    overlayOpacity: 0.9,
    blurAmount: "sm" as const,
    animationType: "scale" as const
  },
  field: {
    image: "/saffron-field.jpg",
    overlayOpacity: 0.85,
    blurAmount: "md" as const,
    animationType: "fade" as const
  },
  tea: {
    image: "/saffron-tea.jpg",
    overlayOpacity: 0.8,
    blurAmount: "lg" as const,
    animationType: "slide" as const
  },
  product: {
    image: "/product-saffron-jar.jpg",
    overlayOpacity: 0.9,
    blurAmount: "sm" as const,
    animationType: "scale" as const
  }
};

export function BackgroundWrapper({ 
  children, 
  backgroundImage,
  overlayOpacity = 0.85,
  blurAmount = "sm",
  animationType = "scale",
  className = ""
}: BackgroundWrapperProps) {
  const getInitialAnimation = () => {
    switch (animationType) {
      case "scale":
        return { opacity: 0, scale: 1.1 };
      case "slide":
        return { opacity: 0, y: 50 };
      default:
        return { opacity: 0 };
    }
  };

  const getAnimateProps = () => {
    switch (animationType) {
      case "scale":
        return { opacity: 1, scale: 1 };
      case "slide":
        return { opacity: 1, y: 0 };
      default:
        return { opacity: 1 };
    }
  };

  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md", 
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl"
  };

  return (
    <div className={`relative min-h-screen ${className}`}>
      {/* Background Image - Behind everything */}
      <motion.div 
        className="fixed inset-0 -z-10"
        initial={getInitialAnimation()}
        animate={getAnimateProps()}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        
        {/* Gradient Overlays */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-background via-background to-background"
          style={{ 
            background: `linear-gradient(180deg, 
              hsl(var(--background) / ${overlayOpacity}) 0%, 
              hsl(var(--background) / ${overlayOpacity - 0.1}) 50%, 
              hsl(var(--background) / ${overlayOpacity}) 100%)`
          }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"
          style={{ 
            background: `linear-gradient(90deg, 
              hsl(var(--background) / ${overlayOpacity - 0.05}) 0%, 
              transparent 50%, 
              hsl(var(--background) / ${overlayOpacity - 0.05}) 100%)`
          }}
        />
        
        {/* Animated Pattern Overlay */}
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{ 
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 193, 7, 0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(255, 152, 0, 0.1) 0%, transparent 50%)`,
            backgroundSize: "100px 100px"
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-1/4 left-10 w-2 h-2 bg-primary/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-20 w-3 h-3 bg-accent/20 rounded-full"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-secondary/30 rounded-full"
          animate={{
            y: [0, -15, 0],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </div>
  );
}
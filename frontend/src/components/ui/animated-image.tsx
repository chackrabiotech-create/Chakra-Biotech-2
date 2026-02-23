"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface AnimatedImageProps {
  src: string;
  alt: string;
  className?: string;
  hoverScale?: number;
  animationType?: "fade" | "slide" | "zoom" | "float" | "pulse";
  delay?: number;
}

export function AnimatedImage({ 
  src, 
  alt, 
  className = "", 
  hoverScale = 1.05,
  animationType = "fade",
  delay = 0
}: AnimatedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const getInitialAnimation = () => {
    switch (animationType) {
      case "slide":
        return { opacity: 0, x: -50 };
      case "zoom":
        return { opacity: 0, scale: 0.8 };
      case "float":
        return { opacity: 0, y: 20 };
      case "pulse":
        return { opacity: 0, scale: 0.9 };
      default:
        return { opacity: 0 };
    }
  };

  const getAnimateProps = () => {
    switch (animationType) {
      case "slide":
        return { opacity: 1, x: 0 };
      case "zoom":
        return { opacity: 1, scale: 1 };
      case "float":
        return { opacity: 1, y: 0 };
      case "pulse":
        return { opacity: 1, scale: 1 };
      default:
        return { opacity: 1 };
    }
  };

  return (
    <motion.div
      initial={getInitialAnimation()}
      animate={isLoaded ? getAnimateProps() : getInitialAnimation()}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: hoverScale }}
      className={`overflow-hidden ${className}`}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setIsLoaded(true)}
        animate={animationType === "float" ? {
          y: [0, -10, 0]
        } : {}}
        transition={animationType === "float" ? {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        } : {}}
        whileHover={animationType === "pulse" ? { scale: 1.02 } : {}}
      />
    </motion.div>
  );
}
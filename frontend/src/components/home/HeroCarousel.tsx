"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useHeroStore } from "@/lib/store";
import { useState } from "react";

import { HeroSkeleton } from "./Skeletons";

export function HeroCarousel() {
  const { heroSections, loading, fetchHeroSections } = useHeroStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchHeroSections();
  }, []);

  useEffect(() => {
    if (heroSections.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroSections.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSections.length]);

  const activeSlides = heroSections
    .filter((h) => h.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (loading || activeSlides.length === 0) {
    return <HeroSkeleton />;
  }

  const currentSlide = activeSlides[currentIndex];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + activeSlides.length) % activeSlides.length,
    );
  };

  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: currentSlide.overlayOpacity || 0.5 }}
            />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`max-w-2xl lg:max-w-3xl text-center sm:text-left ${currentSlide.textPosition === "center"
                    ? "sm:mx-auto sm:text-center"
                    : currentSlide.textPosition === "right"
                      ? "sm:ml-auto sm:text-right"
                      : ""
                  }`}
              >
                {currentSlide.subtitle && (
                  <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-[10px] sm:text-xs md:text-sm font-semibold rounded-full mb-4 uppercase tracking-wider">
                    {currentSlide.subtitle}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 leading-tight">
                  {currentSlide.title}
                </h1>
                {currentSlide.description && (
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed line-clamp-3 sm:line-clamp-none">
                    {currentSlide.description}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center sm:justify-start">
                  {currentSlide.ctaText && currentSlide.ctaLink && (
                    <Button asChild size="lg" className="text-sm md:text-base">
                      <Link href={currentSlide.ctaLink}>
                        {currentSlide.ctaText}
                      </Link>
                    </Button>
                  )}
                  {currentSlide.secondaryCtaText &&
                    currentSlide.secondaryCtaLink && (
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="text-sm md:text-base bg-white/10 hover:bg-white/20 text-white border-white/30"
                      >
                        <Link href={currentSlide.secondaryCtaLink}>
                          {currentSlide.secondaryCtaText}
                        </Link>
                      </Button>
                    )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </button>
        </>
      )}

      {/* Indicators */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {activeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${index === currentIndex
                  ? "bg-white w-6 md:w-8"
                  : "bg-white/50 hover:bg-white/75"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

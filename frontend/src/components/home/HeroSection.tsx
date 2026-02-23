"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center pattern-saffron overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 rounded-bl-[200px] hidden lg:block" />
      
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Award className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Premium Quality Since 1985</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
              High Quality{" "}
              <span className="text-gradient-saffron">Saffron</span>
              <br />& Herbal Excellence
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Discover the world's finest Kashmiri saffron, handpicked from pristine valleys. 
              Experience authentic taste, aroma, and the incredible health benefits of nature's most precious spice.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary font-serif">146</div>
                <div className="text-sm text-muted-foreground">KCAL</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary font-serif">500 GR</div>
                <div className="text-sm text-muted-foreground">CARBOHYDRATES</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary font-serif">2.9 GR</div>
                <div className="text-sm text-muted-foreground">PROTEINS</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/pharmacy">Learn Benefits</Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span>100% Authentic</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-5 h-5 text-gold fill-gold" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="/hero-saffron.jpg"
                alt="Premium Saffron Threads"
                className="w-full h-auto rounded-3xl shadow-elevated"
              />
              
              {/* Floating testimonial cards */}
              <motion.div
                className="absolute -left-4 top-1/4 bg-card p-4 rounded-xl shadow-card max-w-[200px]"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20" />
                  <div>
                    <p className="text-xs font-medium">Katie Robinson</p>
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">"The best saffron I've ever used!"</p>
              </motion.div>

              <motion.div
                className="absolute -right-4 bottom-1/4 bg-card p-4 rounded-xl shadow-card max-w-[200px]"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-accent/20" />
                  <div>
                    <p className="text-xs font-medium">Katheryne Gosling</p>
                    <div className="flex text-gold">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">"Premium quality, authentic aroma!"</p>
              </motion.div>
            </div>

            {/* Background decoration */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-primary/5" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

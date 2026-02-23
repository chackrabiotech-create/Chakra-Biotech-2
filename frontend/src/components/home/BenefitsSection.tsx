"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Brain, Moon, Sparkles, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Heart,
    title: "Heart Health",
    description: "Supports cardiovascular wellness and healthy blood pressure",
  },
  {
    icon: Brain,
    title: "Mood Enhancement",
    description: "Natural antidepressant properties for emotional wellbeing",
  },
  {
    icon: Moon,
    title: "Better Sleep",
    description: "Promotes restful sleep and relaxation",
  },
  {
    icon: Sparkles,
    title: "Skin Radiance",
    description: "Antioxidants for glowing, youthful skin",
  },
  {
    icon: Shield,
    title: "Immunity Boost",
    description: "Strengthens the body's natural defenses",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-secondary text-secondary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative max-w-sm md:max-w-md mx-auto">
              <img
                src="/saffron-tea.jpg"
                alt="Saffron Tea"
                className="w-full rounded-2xl md:rounded-3xl shadow-elevated"
              />
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-24 h-24 md:w-32 md:h-32 bg-primary rounded-full opacity-20" />
              <div className="absolute -top-4 -left-4 md:-top-6 md:-left-6 w-16 h-16 md:w-24 md:h-24 bg-primary rounded-full opacity-10" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 md:space-y-8 order-1 lg:order-2"
          >
            <div>
              <span className="text-primary font-medium tracking-widest uppercase text-sm">
                Saffron Pharmacy
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">
                The Golden Spice of Health
              </h2>
              <p className="text-secondary-foreground/80 mt-4 leading-relaxed text-sm md:text-base">
                Saffron has been treasured for centuries in Ayurveda and
                traditional medicine. Discover the incredible health benefits of
                this precious spice.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-secondary-foreground/5 rounded-xl hover:bg-secondary-foreground/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base">
                      {benefit.title}
                    </h3>
                    <p className="text-xs md:text-sm text-secondary-foreground/70">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-2">
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground transform active:scale-95 transition-transform"
              >
                <Link href="/pharmacy">
                  Explore Pharmacy
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

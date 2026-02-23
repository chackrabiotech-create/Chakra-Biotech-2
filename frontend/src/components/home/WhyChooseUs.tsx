"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  Leaf,
  Globe,
  Heart,
  Shield,
  Award,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "100% Organic",
    description:
      "Grown without pesticides or chemicals in pristine Kashmir valleys",
  },
  {
    icon: Shield,
    title: "Lab Tested",
    description: "Every batch tested for purity, potency, and authenticity",
  },
  {
    icon: Award,
    title: "Grade A+ Quality",
    description: "Only the finest stigmas hand-selected for premium quality",
  },
  {
    icon: Globe,
    title: "Global Shipping",
    description: "Fast, secure delivery to 25+ countries worldwide",
  },
  {
    icon: Heart,
    title: "Health Benefits",
    description: "Rich in antioxidants with proven wellness benefits",
  },
  {
    icon: Sparkles,
    title: "Fresh Harvest",
    description: "Direct from farm to your doorstep for maximum freshness",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative group">
              <img
                src="/saffron-field.jpg"
                alt="Saffron Fields of Kashmir"
                className="rounded-2xl md:rounded-3xl shadow-elevated w-full"
              />
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-primary text-primary-foreground p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg hidden xs:block">
                <div className="text-2xl md:text-4xl font-bold font-serif whitespace-nowrap">
                  35+
                </div>
                <div className="text-[10px] md:text-sm uppercase tracking-wider">
                  Years of Excellence
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-8 lg:mt-0"
          >
            <span className="text-primary font-medium tracking-widest uppercase text-sm">
              Why Choose Us
            </span>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-foreground mt-2 mb-6 leading-tight">
              The <span className="text-gradient-saffron">Finest Saffron</span>{" "}
              From Kashmir Valley
            </h2>
            <p className="text-muted-foreground mb-8 text-sm md:text-base leading-relaxed">
              We take pride in bringing you the purest, most aromatic saffron
              directly from the heart of Kashmir. Our commitment to quality
              ensures you receive only the best.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 text-sm md:text-base">
                      {feature.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

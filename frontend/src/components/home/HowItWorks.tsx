"use client";

import { motion } from "framer-motion";
import { Leaf, Droplets, Sun, Flower, Award } from "lucide-react";

const steps = [
  {
    icon: Leaf,
    title: "Planting Seeds",
    description: "We put the seed in the soil",
  },
  {
    icon: Droplets,
    title: "Plant Irrigation",
    description: "Water is one of the requirements of the plant",
  },
  {
    icon: Sun,
    title: "Plant Light Sun",
    description: "Is one of the needs of the plant",
  },
  {
    icon: Flower,
    title: "Saffron Harvest",
    description: "Saffron plant is ready to be harvested",
  },
  {
    icon: Award,
    title: "Quality Testing",
    description: "Rigorous testing ensures premium quality",
  },
];

export function HowItWorks() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-card overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="text-primary font-medium tracking-widest uppercase text-sm">
            Our Process
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-2">
            How we grow our{" "}
            <span className="text-gradient-saffron">Saffron</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-10 gap-x-6 md:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="relative inline-flex mb-4">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-primary/30 flex items-center justify-center bg-card group-hover:border-primary group-hover:bg-primary/5 transition-all duration-500 shadow-sm group-hover:shadow-md">
                  <step.icon className="w-7 h-7 md:w-8 md:h-8 text-primary transition-transform duration-500 group-hover:scale-110" />
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent -translate-y-1/2 -z-10" />
                )}
              </div>
              <h3 className="font-serif font-semibold text-foreground mb-2 text-base md:text-lg">
                {step.title}
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-[150px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

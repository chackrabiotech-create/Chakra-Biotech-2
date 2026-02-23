"use client";

import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Heart,
  Brain,
  Moon,
  Sparkles,
  Shield,
  Eye,
  Coffee,
  Leaf,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  {
    icon: Heart,
    title: "Heart Health",
    description:
      "Saffron contains crocetin, which helps reduce cholesterol levels and improves blood circulation. It supports overall cardiovascular health.",
    dosage: "10-15mg daily",
  },
  {
    icon: Brain,
    title: "Mood & Mental Health",
    description:
      "Natural antidepressant properties help combat anxiety and depression. Saffron boosts serotonin levels for improved emotional wellbeing.",
    dosage: "30mg daily",
  },
  {
    icon: Moon,
    title: "Sleep Quality",
    description:
      "Saffron tea before bed promotes relaxation and helps achieve deeper, more restful sleep cycles.",
    dosage: "1 cup saffron tea",
  },
  {
    icon: Sparkles,
    title: "Skin Radiance",
    description:
      "Powerful antioxidants fight free radicals, promoting youthful, glowing skin. Used in Ayurvedic skincare for centuries.",
    dosage: "Topical + 15mg oral",
  },
  {
    icon: Shield,
    title: "Immunity Boost",
    description:
      "Rich in vitamin C and antioxidants, saffron strengthens the immune system and helps fight infections.",
    dosage: "20-30mg daily",
  },
  {
    icon: Eye,
    title: "Eye Health",
    description:
      "Contains compounds that protect retinal cells and may help slow age-related macular degeneration.",
    dosage: "20mg daily",
  },
  {
    icon: Coffee,
    title: "Energy & Vitality",
    description:
      "Natural energy booster without caffeine jitters. Improves stamina and reduces fatigue.",
    dosage: "15-20mg daily",
  },
  {
    icon: Leaf,
    title: "Digestive Health",
    description:
      "Aids digestion, reduces bloating, and supports a healthy gut. Traditional remedy for stomach ailments.",
    dosage: "10-15mg with meals",
  },
];

const usageGuide = [
  "Add 5-7 strands to warm milk or water, steep for 10 minutes",
  "Use in cooking: rice, desserts, curries, teas",
  "For skincare: mix with rose water for a face mask",
  "Store in a cool, dark place in an airtight container",
  "Best consumed within 6 months of opening",
];

export default function Pharmacy() {
  return (
    <Layout>
      {/* Header */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-primary font-medium">Saffron Pharmacy</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">
              The Golden Spice of Health & Wellness
            </h1>
            <p className="text-secondary-foreground/80 mt-6 text-lg leading-relaxed">
              Discover the incredible healing properties of saffron, treasured in Ayurveda and
              modern medicine alike. Learn how this precious spice can transform your health.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Health Benefits of Saffron
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Backed by centuries of traditional use and modern scientific research
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card p-6 rounded-2xl shadow-card hover:shadow-elevated transition-shadow group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {benefit.description}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full">
                  <span className="text-xs font-medium text-accent">Dosage: {benefit.dosage}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Usage Guide */}
      <section className="py-20 bg-cream-dark">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="/saffron-tea.jpg"
                alt="Saffron Tea"
                className="w-full max-w-md mx-auto rounded-3xl shadow-elevated"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                How to Use Saffron
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Follow these guidelines to get the maximum benefits from your saffron:
              </p>
              <ul className="space-y-4">
                {usageGuide.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
              <Button size="lg" asChild>
                <Link href="/products">
                  Shop Premium Saffron
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> The information provided is for educational purposes only
              and is not intended as medical advice. Consult a healthcare professional before using
              saffron for therapeutic purposes.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

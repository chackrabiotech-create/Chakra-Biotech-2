"use client";

import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import {
  BackgroundWrapper,
  backgroundPresets,
} from "@/components/ui/background-wrapper";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BrandsSection } from "@/components/home/BrandsSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { StatsSection } from "@/components/home/StatsSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { BlogPreview } from "@/components/home/BlogPreview";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { CTASection } from "@/components/home/CTASection";
import { StructuredData } from "@/components/seo/StructuredData";
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
} from "@/lib/seo/structured-data";

const customBackground = {
  image: "/hero-saffron.jpg",
  overlayOpacity: 0.9,
  blurAmount: "sm" as const,
  animationType: "scale" as const,
};

export default function Home() {
  return (
    <>
      <StructuredData data={generateOrganizationSchema()} />
      <StructuredData data={generateLocalBusinessSchema()} />
      <BackgroundWrapper
        backgroundImage={customBackground.image}
        overlayOpacity={customBackground.overlayOpacity}
        blurAmount={customBackground.blurAmount}
        animationType={customBackground.animationType}
      >
        <Layout>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-background/20 rounded-none" />
              <div className="relative z-10">
                <HeroCarousel />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-background/25 rounded-2xl mx-4" />
              <div className="relative z-10">
                <BrandsSection />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-background/30 rounded-2xl mx-4" />
              <div className="relative z-10">
                <FeaturedProducts />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-background/25 rounded-2xl mx-4" />
              <div className="relative z-10">
                <WhyChooseUs />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-background/20 rounded-2xl mx-4" />
              <div className="relative z-10">
                <StatsSection />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-background/30 rounded-2xl mx-4" />
              <div className="relative z-10">
                <HowItWorks />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-background/25 rounded-2xl mx-4" />
              <div className="relative z-10">
                <BenefitsSection />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-background/30 rounded-2xl mx-4" />
              <div className="relative z-10">
                <TestimonialsSection />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-background/25 rounded-2xl mx-4" />
              <div className="relative z-10">
                <BlogPreview />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-background/30 rounded-2xl mx-4" />
              <div className="relative z-10">
                <NewsletterSection />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="relative"
            >
              <div className="absolute inset-0 backdrop-blur-sm bg-background/25 rounded-2xl mx-4" />
              <div className="relative z-10">
                <CTASection />
              </div>
            </motion.div>
          </motion.div>
        </Layout>
      </BackgroundWrapper>
    </>
  );
}

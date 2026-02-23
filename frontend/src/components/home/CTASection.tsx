"use client";

import { motion } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanyData } from "@/hooks/use-company-data";

export function CTASection() {
  const { whatsappUrl, phoneNumber } = useCompanyData();

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/saffron-field.jpg)` }}
      />
      <div className="absolute inset-0 bg-secondary/90" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary-foreground mb-4">
            Ready to Experience Premium Saffron?
          </h2>
          <p className="text-secondary-foreground/80 mb-8 text-lg">
            Order now via WhatsApp and get authentic Kashmiri saffron delivered to your doorstep.
            Free shipping on orders above ₹5,000.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-[#25D366] hover:bg-[#25D366]/90">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                Order on WhatsApp
              </a>
            </Button>
            <Button
              size="lg"
              className="bg-white text-secondary hover:bg-gray-100 font-semibold"
              asChild
            >
              <a href={`tel:${phoneNumber}`}>
                <Phone className="w-5 h-5 mr-2" />
                Call Us Now
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

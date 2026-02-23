"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Thank you for subscribing! Check your email for 10% off.");
      setEmail("");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Gift className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
            Get <span className="text-gradient-saffron">10% Off</span> Your First Order
          </h2>

          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for exclusive offers, saffron recipes, health tips, 
            and the latest updates from our farm to your inbox.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12"
                required
              />
            </div>
            <Button type="submit" size="lg" className="h-12">
              Subscribe
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

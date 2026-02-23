"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    rating: 5,
    text: "The quality of saffron is exceptional! The aroma and color are unmatched. I've been using it for my cooking and skincare routine.",
  },
  {
    name: "Ahmed Khan",
    location: "Dubai, UAE",
    rating: 5,
    text: "Best saffron I've ever purchased online. The WhatsApp ordering process was so convenient. Highly recommended!",
  },
  {
    name: "Sarah Johnson",
    location: "London, UK",
    rating: 5,
    text: "I was skeptical at first, but the quality speaks for itself. The training videos helped me understand saffron better.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-2">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card p-8 rounded-2xl shadow-card relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/20" />
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

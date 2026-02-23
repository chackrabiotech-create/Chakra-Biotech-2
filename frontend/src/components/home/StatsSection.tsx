"use client";

import { motion } from "framer-motion";
import { Users, Package, Award, MapPin } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Happy Customers",
    description: "Trusted by thousands worldwide",
  },
  {
    icon: Package,
    value: "50,000+",
    label: "Orders Delivered",
    description: "Successfully shipped globally",
  },
  {
    icon: Award,
    value: "35+",
    label: "Years Experience",
    description: "Heritage of quality since 1985",
  },
  {
    icon: MapPin,
    value: "25+",
    label: "Countries Served",
    description: "Exporting premium saffron",
  },
];

export function StatsSection() {
  return (
    <section className="py-12 md:py-16 bg-secondary text-secondary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <stat.icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold font-serif text-primary mb-1">
                {stat.value}
              </div>
              <div className="text-base md:text-lg font-medium mb-1">
                {stat.label}
              </div>
              <div className="text-xs md:text-sm text-secondary-foreground/70 max-w-[200px] mx-auto">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect } from "react";
import { Phone, Truck, Shield, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const announcements = [
  { icon: Truck, text: "Free Shipping on Orders Over ₹2000" },
  { icon: Shield, text: "100% Authentic Kashmiri Saffron" },
  { icon: Clock, text: "Same Day Dispatch on Orders Before 2 PM" },
  { icon: Phone, text: "24/7 WhatsApp Support" },
];

export function SubHeader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-secondary text-secondary-foreground overflow-hidden border-b border-border/10">
      <div className="container mx-auto px-4">
        {/* Desktop View (Horizontal) */}
        <motion.div
          className="hidden lg:flex items-center justify-between py-2.5 text-xs font-medium gap-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {announcements.map((item, id) => (
            <motion.div
              key={id}
              className="flex items-center gap-2 whitespace-nowrap group"
              whileHover={{ scale: 1.02 }}
            >
              <item.icon className="w-4 h-4 text-primary group-hover:rotate-12 transition-transform" />
              <span className="tracking-tight">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile View (Single Item Slider) */}
        <div className="lg:hidden h-10 relative flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 text-[11px] font-medium"
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                {(() => {
                  const Icon = announcements[index].icon;
                  return <Icon className="w-3.5 h-3.5 text-primary" />;
                })()}
              </div>
              <span className="tracking-wide uppercase">
                {announcements[index].text}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

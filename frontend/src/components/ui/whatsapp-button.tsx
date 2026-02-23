"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useCompanyData } from "@/hooks/use-company-data";

export function WhatsAppButton() {
  const { whatsappUrl } = useCompanyData();

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-elevated hover:scale-110 transition-transform"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: "spring" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="w-7 h-7 text-white" />
    </motion.a>
  );
}

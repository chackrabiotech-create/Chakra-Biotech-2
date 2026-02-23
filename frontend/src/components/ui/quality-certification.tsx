"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Award,
  CheckCircle,
  Star,
  Sparkles,
  Globe,
  Leaf,
  Users,
  Clock,
  TrendingUp,
  Eye,
  Heart,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Certification {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ComponentType<any>;
  description: string;
  year: string;
  color: string;
  bgColor: string;
}

interface QualityMetric {
  id: string;
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
}

const certifications: Certification[] = [
  {
    id: "iso",
    name: "ISO 22000",
    subtitle: "Food Safety",
    icon: Shield,
    description: "International standard for food safety management systems",
    year: "2020",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "fssai",
    name: "FSSAI",
    subtitle: "Certified",
    icon: CheckCircle,
    description: "Food Safety and Standards Authority of India certification",
    year: "2019",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "organic",
    name: "Organic India",
    subtitle: "Certified",
    icon: Leaf,
    description: "Certified organic farming and processing standards",
    year: "2018",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    id: "gi",
    name: "GI Tagged",
    subtitle: "Kashmir Origin",
    icon: Globe,
    description: "Geographical Indication tag for authentic Kashmir saffron",
    year: "2017",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "apeda",
    name: "APEDA",
    subtitle: "Export Quality",
    icon: TrendingUp,
    description:
      "Agricultural and Processed Food Products Export Development Authority",
    year: "2016",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "haccp",
    name: "HACCP",
    subtitle: "Certified",
    icon: Award,
    description: "Hazard Analysis and Critical Control Points certification",
    year: "2021",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

const qualityMetrics: QualityMetric[] = [
  {
    id: "purity",
    label: "Purity Level",
    value: "99.9%",
    icon: Sparkles,
    description: "Lab-tested purity with zero adulterants",
    color: "text-gold",
  },
  {
    id: "grade",
    label: "Quality Grade",
    value: "A+",
    icon: Star,
    description: "Highest grade saffron with premium characteristics",
    color: "text-primary",
  },
  {
    id: "customers",
    label: "Satisfied Customers",
    value: "10,000+",
    icon: Users,
    description: "Trusted by customers worldwide",
    color: "text-blue-600",
  },
  {
    id: "experience",
    label: "Years Experience",
    value: "35+",
    icon: Clock,
    description: "Heritage of quality since 1985",
    color: "text-green-600",
  },
];

interface QualityCertificationProps {
  variant?: "compact" | "full" | "minimal";
  showMetrics?: boolean;
  showCertifications?: boolean;
  animated?: boolean;
  className?: string;
}

export function QualityCertification({
  variant = "full",
  showMetrics = true,
  showCertifications = true,
  animated = true,
  className = "",
}: QualityCertificationProps) {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  if (variant === "minimal") {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <Shield className="w-6 h-6 text-primary" />
            <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          </motion.div>
          <span className="font-semibold text-foreground">
            Certified Quality
          </span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-gold fill-gold" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className={`bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-2xl p-6 ${className}`}
      >
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4"
          >
            <Shield className="w-8 h-8 text-primary" />
          </motion.div>
          <h3 className="text-xl font-serif font-bold text-foreground mb-2">
            Certified & Trusted Quality
          </h3>
          <p className="text-muted-foreground text-sm">
            Premium saffron with international certifications
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {qualityMetrics.slice(0, 4).map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 bg-card rounded-lg"
            >
              <metric.icon className={`w-5 h-5 ${metric.color} mx-auto mb-2`} />
              <div className="font-bold text-foreground">{metric.value}</div>
              <div className="text-xs text-muted-foreground">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-br from-card via-card/50 to-background rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 1 }}
          className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-primary to-accent rounded-full mb-4 md:mb-6 relative"
        >
          <Shield className="w-8 h-8 md:w-10 md:h-10 text-white" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/20 rounded-full"
          />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2 md:mb-3"
        >
          Certified &{" "}
          <span className="text-gradient-saffron">Trusted Quality</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-2"
        >
          Our commitment to excellence is backed by international certifications
          and rigorous quality standards, ensuring you receive only the finest
          saffron with complete authenticity and purity.
        </motion.p>
      </div>

      {/* Quality Metrics */}
      {showMetrics && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-8 md:mb-12"
        >
          {qualityMetrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              onHoverStart={() => setHoveredMetric(metric.id)}
              onHoverEnd={() => setHoveredMetric(null)}
              className="relative group cursor-pointer"
            >
              <div className="bg-card rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 text-center shadow-card hover:shadow-elevated transition-all duration-300 border border-border/50">
                <motion.div
                  animate={{
                    rotate: hoveredMetric === metric.id ? [0, 10, -10, 0] : 0,
                    scale: hoveredMetric === metric.id ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.5 }}
                  className={`inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full mb-2 md:mb-4 ${metric.color === "text-gold" ? "bg-yellow-50" : "bg-primary/10"}`}
                >
                  <metric.icon
                    className={`w-5 h-5 md:w-6 md:h-6 ${metric.color}`}
                  />
                </motion.div>

                <motion.div
                  animate={{ scale: hoveredMetric === metric.id ? 1.1 : 1 }}
                  className="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-2"
                >
                  {metric.value}
                </motion.div>

                <div className="text-xs md:text-sm font-medium text-muted-foreground mb-1 md:mb-2">
                  {metric.label}
                </div>

                <AnimatePresence>
                  {hoveredMetric === metric.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-muted-foreground"
                    >
                      {metric.description}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Floating particles */}
              {hoveredMetric === metric.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, x: 0, y: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        x: [0, (i - 1) * 20, (i - 1) * 40],
                        y: [0, -20, -40],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                      className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full ${metric.color === "text-gold" ? "bg-yellow-400" : "bg-primary"}`}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Certifications */}
      {showCertifications && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg md:text-xl font-serif font-semibold text-foreground mb-4 md:mb-6 text-center">
            International Certifications
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() =>
                  setSelectedCert(selectedCert === cert.id ? null : cert.id)
                }
                className="relative group cursor-pointer"
              >
                <div
                  className={`${cert.bgColor} rounded-lg md:rounded-xl p-3 md:p-4 text-center transition-all duration-300 hover:shadow-lg border border-border/30`}
                >
                  <motion.div
                    animate={{
                      rotate: selectedCert === cert.id ? 360 : 0,
                      scale: selectedCert === cert.id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                    className="mb-3"
                  >
                    <cert.icon
                      className={`w-6 h-6 md:w-8 md:h-8 ${cert.color} mx-auto`}
                    />
                  </motion.div>

                  <div className="text-xs md:text-sm font-bold text-foreground mb-1">
                    {cert.name}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {cert.subtitle}
                  </div>

                  <Badge variant="outline" className="mt-2 text-xs">
                    {cert.year}
                  </Badge>
                </div>

                {/* Tooltip */}
                <AnimatePresence>
                  {selectedCert === cert.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg p-4 z-10"
                    >
                      <div className="text-sm font-semibold text-foreground mb-2">
                        {cert.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {cert.description}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <Badge variant="secondary" className="text-xs">
                          Since {cert.year}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span className="text-xs text-green-600">
                            Verified
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border/50"
      >
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 lg:gap-8 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Transparent Process</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-600" />
            <span>Customer Loved</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-600" />
            <span>Fast Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-green-600" />
            <span>Worldwide Shipping</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

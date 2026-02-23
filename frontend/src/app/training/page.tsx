"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Sprout,
  FlaskConical,
  Award,
  Clock,
  Users,
  CheckCircle2,
  MessageCircle,
  Home,
  BookOpen,
  Trophy,
  Star,
  Quote,
  TrendingUp,
  Target,
  Lightbulb,
  Shield,
  Leaf,
  Droplets,
  Bug,
  Scissors,
  ArrowRight,
  Loader2,
  Heart,
  Globe,
  Send,
  MapPin,
} from "lucide-react";
import { useCompanyData } from "@/hooks/use-company-data";
import { trainingApi, Training } from "@/lib/api/training";
import { trainingPageApi, type TrainingPageSettings } from "@/lib/api/trainingPage";
import Link from "next/link";

// Icon mapping for dynamic icon resolution
const iconMap: { [key: string]: any } = {
  Sprout, GraduationCap, FlaskConical, Award, Leaf, TrendingUp,
  Home, BookOpen, Trophy, Users, Target, Droplets, Bug, Scissors,
  Shield, Lightbulb, Star, Heart, Clock, Globe,
};

// Default fallback data
const defaultStats = [
  { value: "500+", label: "Students Trained" },
  { value: "50+", label: "Workshops Conducted" },
  { value: "15+", label: "Expert Instructors" },
  { value: "98%", label: "Success Rate" },
];

const defaultModules = [
  { title: "Protected Farming Methods", icon: "Home", description: "Learn modern techniques for controlled environment agriculture", topics: ["Greenhouse setup", "Climate control", "Light management", "Ventilation systems"] },
  { title: "Growing Medium Preparation", icon: "Leaf", description: "Master the art of preparing optimal soil conditions", topics: ["Soil composition", "pH management", "Organic amendments", "Drainage systems"] },
  { title: "Nutrient & Water Management", icon: "Droplets", description: "Precise systems tailored specifically for saffron", topics: ["Fertilization schedules", "Irrigation techniques", "Water quality", "Nutrient monitoring"] },
  { title: "Disease Prevention", icon: "Bug", description: "Strategies to protect your saffron crop", topics: ["Common diseases", "Pest control", "Organic solutions", "Preventive measures"] },
  { title: "Harvesting & Processing", icon: "Scissors", description: "Maximize quality and profit with efficient techniques", topics: ["Optimal harvest timing", "Stigma separation", "Drying methods", "Quality preservation"] },
  { title: "Commercial Farming", icon: "TrendingUp", description: "Turn your knowledge into a profitable venture", topics: ["Market analysis", "Pricing strategies", "Scaling operations", "Export opportunities"] },
];

const defaultTestimonials = [
  { name: "Rajesh Kumar", role: "Saffron Farmer, Kashmir", rating: 5, text: "The training program transformed my farming approach. I've increased my yield by 40% and the quality has improved significantly. The practical sessions were invaluable!" },
  { name: "Priya Sharma", role: "Agricultural Entrepreneur", rating: 5, text: "As someone new to saffron cultivation, this course gave me the confidence to start my own farm. The instructors are knowledgeable and the support is excellent." },
  { name: "Dr. Amit Patel", role: "Horticulture Researcher", rating: 5, text: "The scientific approach and modern techniques taught here are cutting-edge. This is the most comprehensive saffron cultivation program I've encountered." },
];

const defaultImpactStats = [
  { value: "95%", label: "Student Success Rate", icon: "Target" },
  { value: "40%", label: "Average Yield Increase", icon: "TrendingUp" },
  { value: "500+", label: "Farmers Trained", icon: "Users" },
  { value: "15+", label: "Years of Expertise", icon: "Award" },
];

const defaultGains = [
  "Learn modern methods and techniques for protected farming",
  "Understand the best growing mediums and how to prepare them",
  "Study precise nutrient and water management systems tailored for saffron",
  "Master best practices for saffron growth and strategies for disease prevention",
  "Gain valuable tips on efficient harvesting and processing for maximum quality and profit",
];

const defaultBenefits = [
  { title: "In-Campus Stay", description: "Convenient access to classrooms, labs, and library. Save commute time and foster a deeper campus experience with full immersion in learning.", icon: "Home" },
  { title: "Practical Training", description: "Hands-on sessions demonstrating setup and maintenance of cultivation systems, nutrient solutions, and comprehensive plant care techniques.", icon: "BookOpen" },
  { title: "Certification", description: "Receive recognized credentials upon completion to validate your expertise and enhance your professional credibility in saffron cultivation.", icon: "Trophy" },
];

const defaultHighlights = [
  { title: "Aspiring Entrepreneurs", description: "Eye the lucrative saffron market with confidence", icon: "Users" },
  { title: "Traditional Farmers", description: "Expand and adopt modern cultivation methods", icon: "Sprout" },
  { title: "Students & Researchers", description: "Passionate about innovative agriculture", icon: "GraduationCap" },
];

export default function TrainingPage() {
  const { whatsappNumber } = useCompanyData();
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [pageSettings, setPageSettings] = useState<TrainingPageSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trainingsRes, pageRes] = await Promise.all([
          trainingApi.getAll(),
          trainingPageApi.get().catch(() => ({ data: null })),
        ]);
        if (trainingsRes && trainingsRes.data) {
          setTrainings(trainingsRes.data);
        }
        if (pageRes && pageRes.data) {
          setPageSettings(pageRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch training data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getIcon = (iconName?: string) => {
    if (iconName && iconMap[iconName]) return iconMap[iconName];
    return Sprout;
  };

  // Resolve data with fallbacks
  const heroData = {
    badge: pageSettings?.hero?.badge || "Saffron Training Academy",
    title: pageSettings?.hero?.title || "Master the Art of Saffron",
    subtitle: pageSettings?.hero?.subtitle || "From cultivation to quality testing, become an expert in the world's most precious spice with our comprehensive training programs.",
    backgroundImage: pageSettings?.hero?.backgroundImage || "/saffron-field.jpg",
    stats: pageSettings?.hero?.stats?.length ? pageSettings.hero.stats : defaultStats,
  };

  const featuredData = {
    isVisible: pageSettings?.featuredCourse?.isVisible ?? true,
    badge: pageSettings?.featuredCourse?.badge || "Featured Course",
    title: pageSettings?.featuredCourse?.title || "3-Day Saffron Cultivation Course",
    subtitle: pageSettings?.featuredCourse?.subtitle || "Crack the code to successfully cultivating the world's most precious spice at the Institute of Horticulture Technology",
    gains: pageSettings?.featuredCourse?.gains?.length ? pageSettings.featuredCourse.gains : defaultGains,
    benefits: pageSettings?.featuredCourse?.benefits?.length ? pageSettings.featuredCourse.benefits : defaultBenefits,
  };

  const standoutData = {
    isVisible: pageSettings?.standout?.isVisible ?? true,
    title: pageSettings?.standout?.title || "Why This Course Stands Out",
    description: pageSettings?.standout?.description || "Discover the science and success behind saffron cultivation through a program backed by our breakthrough achievement of successfully cultivating saffron at our state-of-the-art center near Shimla, where the crop has completed its full growth cycle and entered dormancy.",
    additionalText: pageSettings?.standout?.additionalText || "This course offers practical insights rooted in real-world results. You'll gain proven techniques, a deeper understanding of saffron's lifecycle, and explore its potential for commercial farming, making this golden spice a viable venture.",
    highlights: pageSettings?.standout?.highlights?.length ? pageSettings.standout.highlights : defaultHighlights,
  };

  const modulesData = pageSettings?.modules?.length ? pageSettings.modules : defaultModules;
  const testimonialsData = pageSettings?.testimonials?.length ? pageSettings.testimonials : defaultTestimonials;
  const impactData = pageSettings?.impactStats?.length ? pageSettings.impactStats : defaultImpactStats;

  const ctaData = {
    isVisible: pageSettings?.cta?.isVisible ?? true,
    title: pageSettings?.cta?.title || "Corporate & Group Training",
    description: pageSettings?.cta?.description || "Customized training programs for businesses, agricultural cooperatives, and educational institutions. Contact us for group discounts.",
    buttonText: pageSettings?.cta?.buttonText || "Contact for Group Training",
  };

  const customSections = pageSettings?.sections?.filter((s) => s.isVisible) || [];

  const handleEnquiry = (title: string, price: number) => {
    const message = `Hello! I'm interested in the ${title} training program (₹${price}).`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleCultivationEnquiry = () => {
    const message = `Hello! I'm interested in the ${featuredData.title}.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${heroData.backgroundImage})` }} />
        <div className="absolute inset-0 bg-secondary/90" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto text-secondary-foreground">
            <span className="text-primary font-medium">{heroData.badge}</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2">{heroData.title}</h1>
            <p className="text-secondary-foreground/80 mt-6 text-lg">{heroData.subtitle}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-3xl mx-auto">
            {heroData.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-secondary-foreground/70">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Course */}
      {featuredData.isVisible && (
        <section className="py-20 bg-gradient-to-b from-background to-cream-light">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <Badge className="mb-4">{featuredData.badge}</Badge>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">{featuredData.title}</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">{featuredData.subtitle}</p>
            </motion.div>
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="bg-card rounded-2xl p-8 shadow-card">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Sprout className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-foreground">What You'll Gain</h3>
                      <p className="text-sm text-muted-foreground">From This Training</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {featuredData.gains.map((gain, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{gain}</span>
                      </li>
                    ))}
                  </ul>
                  <Button size="lg" className="w-full mt-8" onClick={handleCultivationEnquiry}>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Register Now
                  </Button>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
                {featuredData.benefits.map((benefit, index) => {
                  const BenefitIcon = getIcon(benefit.icon);
                  return (
                    <motion.div key={benefit.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <BenefitIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-2">{benefit.title}</h4>
                          <p className="text-sm text-muted-foreground">{benefit.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Why This Course Stands Out */}
      {standoutData.isVisible && (
        <section className="py-20 bg-secondary">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <Lightbulb className="w-12 h-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary-foreground">{standoutData.title}</h2>
              </div>
              <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card">
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">{standoutData.description}</p>
                {standoutData.additionalText && (
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">{standoutData.additionalText}</p>
                )}
                <div className="grid md:grid-cols-3 gap-6">
                  {standoutData.highlights.map((hl) => {
                    const HLIcon = getIcon(hl.icon);
                    return (
                      <div key={hl.title} className="text-center p-6 bg-background rounded-xl">
                        <HLIcon className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h4 className="font-semibold text-foreground mb-2">{hl.title}</h4>
                        <p className="text-sm text-muted-foreground">{hl.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Course Modules */}
      {modulesData.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Course Modules</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Comprehensive curriculum covering every aspect of saffron cultivation</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {modulesData.map((mod, index) => {
                const ModIcon = getIcon(mod.icon);
                return (
                  <motion.div key={mod.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-card rounded-xl p-6 shadow-card hover:shadow-elevated transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <ModIcon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{mod.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{mod.description}</p>
                    <ul className="space-y-2">
                      {mod.topics.map((topic) => (
                        <li key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Programs Section */}
      <section className="py-20 bg-cream-light">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">All Training Programs</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Choose a program that matches your goals and expertise level</p>
          </motion.div>

          {/* Category Filter Chips */}
          {!loading && trainings.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {["All", ...Array.from(new Set(trainings.map(t => t.category).filter(Boolean)))].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat!)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-card text-muted-foreground hover:bg-primary/10 border"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trainings
                .filter(t => selectedCategory === "All" || t.category === selectedCategory)
                .map((program, index) => {
                  const ProgramIcon = getIcon(program.icon);
                  const seatsLeft = program.maxParticipants
                    ? program.maxParticipants - (program.currentEnrollments || 0)
                    : null;
                  return (
                    <motion.div key={program._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all flex flex-col ${program.popular ? "ring-2 ring-primary" : ""}`}>
                      {/* Cover Image */}
                      {program.coverImage && program.coverImage !== "no-photo.jpg" ? (
                        <div className="relative h-48 overflow-hidden">
                          <img src={program.coverImage} alt={program.title} className="w-full h-full object-cover" />
                          {program.popular && (
                            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">Most Popular</div>
                          )}
                          {program.originalPrice && program.originalPrice > program.price && (
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              {Math.round(((program.originalPrice - program.price) / program.originalPrice) * 100)}% OFF
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="relative h-48 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                          <ProgramIcon className="w-16 h-16 text-primary/30" />
                          {program.popular && (
                            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">Most Popular</div>
                          )}
                        </div>
                      )}

                      <div className="p-6 flex-1 flex flex-col">
                        {/* Category & Mode */}
                        <div className="flex items-center gap-2 mb-2">
                          {program.mode && <Badge variant="secondary" className="text-xs">{program.mode}</Badge>}
                        </div>

                        <h3 className="font-serif text-xl font-semibold text-foreground text-left">{program.title}</h3>

                        {/* Rating */}
                        {program.rating ? (
                          <div className="flex items-center gap-1.5 mt-2">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(program.rating!) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">({program.totalReviews || 0})</span>
                          </div>
                        ) : null}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{program.duration}</span>
                          {program.location && <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{program.location}</span>}
                        </div>

                        {/* Price */}
                        <div className="mt-4">
                          <span className="text-2xl font-bold text-foreground">₹{program.price.toLocaleString()}</span>
                          {program.originalPrice && program.originalPrice > program.price && (
                            <span className="text-sm text-muted-foreground line-through ml-2">₹{program.originalPrice.toLocaleString()}</span>
                          )}
                        </div>

                        {/* Seats Indicator */}
                        {seatsLeft !== null && (
                          <div className="mt-3">
                            {seatsLeft <= 5 && seatsLeft > 0 ? (
                              <span className="text-xs text-red-500 font-medium bg-red-50 px-2 py-1 rounded-full">Only {seatsLeft} seats left!</span>
                            ) : seatsLeft > 0 ? (
                              <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{seatsLeft} seats available</span>
                            ) : (
                              <span className="text-xs text-red-500 font-medium">Fully Booked</span>
                            )}
                          </div>
                        )}

                        {/* Features */}
                        <ul className="mt-4 space-y-2 flex-1">
                          {program.features.slice(0, 4).map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-2 mt-6">
                          <Link href={`/enroll/${program._id}`} className="w-full">
                            <Button className="w-full" variant={program.popular ? "default" : "default"}>
                              <Send className="w-4 h-4 mr-2" />Enroll Now
                            </Button>
                          </Link>
                          <div className="flex gap-2">
                            <Link href={`/training/${program.slug}`} className="flex-1">
                              <Button variant="outline" className="w-full group text-sm">
                                View Details<ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                              </Button>
                            </Link>
                            <Button variant="ghost" className="text-sm px-3" onClick={() => handleEnquiry(program.title, program.price)}>
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          )}

          {/* No results for filter */}
          {!loading && trainings.filter(t => selectedCategory === "All" || t.category === selectedCategory).length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No training programs found in this category.</p>
              <Button variant="ghost" className="mt-2" onClick={() => setSelectedCategory("All")}>Show All Programs</Button>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      {testimonialsData.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Student Reviews</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Hear from our successful graduates who transformed their saffron farming journey</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonialsData.map((testimonial, index) => (
                <motion.div key={testimonial.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-card rounded-2xl p-8 shadow-card hover:shadow-elevated transition-shadow">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Impact */}
      {impactData.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-cream-light to-background">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Our Impact</h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">Transforming saffron farming across the region with proven results</p>
            </motion.div>
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {impactData.map((stat, index) => {
                const StatIcon = getIcon(stat.icon);
                return (
                  <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <StatIcon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Custom Sections from Admin */}
      {customSections.map((section, idx) => (
        <section
          key={idx}
          className="py-16"
          style={{ backgroundColor: section.backgroundColor, color: section.textColor }}
        >
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              {section.title && (
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-center">{section.title}</h2>
              )}
              <div
                className="prose prose-lg max-w-4xl mx-auto prose-headings:font-serif"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </motion.div>
          </div>
        </section>
      ))}

      {/* CTA */}
      {ctaData.isVisible && (
        <section className="py-16 bg-cream-dark">
          <div className="container mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-secondary rounded-3xl p-8 md:p-12 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-secondary-foreground">{ctaData.title}</h2>
              <p className="text-secondary-foreground/80 mt-4 max-w-xl mx-auto">{ctaData.description}</p>
              <Button
                size="lg"
                className="mt-6"
                onClick={() => {
                  const message = `Hello! I'm interested in ${ctaData.title.toLowerCase()}.`;
                  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {ctaData.buttonText}
              </Button>
            </motion.div>
          </div>
        </section>
      )}
    </Layout>
  );
}

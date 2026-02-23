"use client";

import type { Metadata } from "next";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { QualityCertification } from "@/components/ui/quality-certification";
import Link from "next/link";
import {
  Award,
  Leaf,
  Users,
  Globe,
  ArrowRight,
  ShieldCheck,
  Heart,
} from "lucide-react";

// Note: Metadata must be exported from a Server Component, not a Client Component
// For client components, use a separate layout.tsx or move metadata to parent

const values = [
  {
    icon: Leaf,
    title: "Aeroponic Innovation",
    description:
      "Soil-less cultivation using advanced precision climate-controlled systems.",
  },
  {
    icon: ShieldCheck,
    title: "Resource Efficiency",
    description:
      "Reduced water usage and optimized nutrient delivery for sustainable agriculture.",
  },
  {
    icon: Award,
    title: "Kashmir Quality",
    description:
      "Replicating Kashmir-like conditions to produce premium 'Red Gold' anywhere.",
  },
  {
    icon: Users,
    title: "Agri-Empowerment",
    description:
      "Democratizing high-value saffron farming for entrepreneurs and institutions.",
  },
];

const team = [
  {
    name: "Mr. Mali Ram Sharma",
    role: "Founder & Advisor",
    bio: "LLB, Rajasthan University. Brings extensive legal expertise and strategic administrative oversight to Chakra Biotech's operations.",
    image: "/team-1.jpg",
  },
  {
    name: "Mr. Ankit Sharma",
    role: "Operations & Quality",
    bio: "Expert in modern farming systems and agricultural market operations. Leads R&D and cultivation optimization with a focus on commercial scalability.",
    education: ["B.Sc. (Hons.) Agriculture", "MBA - Sales & Marketing"],
    certifications: [
      "70 Hours Personality Development & Communication Training",
      "21 Days Training Programme on Agripreneurship (AAU Anand)",
      "01 Week Training on Growing Startups in Agriculture (SKNAU Jobner)",
    ],
    image: "/team-2.jpg",
  },
  {
    name: "Kuldeep Singh Sawhney",
    role: "Career Navigator + Co. Trainer (Competency Analyst)",
    bio: "Career Navigator and Corporate Trainer with 4 decades of expertise in HRD, OD, and OB. Also provides Legal Services at Rajasthan High Court, Jaipur. Specializes in organizational behavior and personnel management.",
    education: [
      "Masters Dip. in Personnel Management",
      "Masters Dip. in Organisational Behavior",
      "M.A.",
      "LL.B (Professional)",
    ],
    certifications: [
      "Professionally trained practitioner in HR, OD & OB (XLRI, ASCI, CII, XIM, JBIMS, IBPS, BTC, ISTD, NLI, CLI, RBI, TQMI, NTN, JOHNS HOPKINS, SNDT)",
      "Qualified HRD Facilitator (Academy of HRD, Ahmedabad)",
      "Life Member of ASCI - Hyderabad",
      "Professional memberships with NIPM & HRD Network",
    ],
    image: "/team-3.jpg",
  },
  {
    name: "Sanjeev Lurhta",
    role: "Certified Career Coach & Psychometric Analyst",
    bio: "Accomplished professional with diverse experience across Armed Forces, IT, Insurance, Education, Business, Electronics, Mechanical, Pharma, and Soft Skills. Specializes in career counselling and psychometric assessment — empowering students and professionals.",
    education: [
      "Diploma in Management (IGNOU)",
      "PG Diploma in Computer Applications (COMPRO, 1990)",
      "Certificate in French Language (Raj University, 1991)",
    ],
    certifications: [
      "Certified Career Coach (Mindler, NCDA, HCDA)",
      "Psychometric Analyst (Crystalizing Aptitude)",
      "IELTS Certified 2015 (7.5 Band, CEFR C1)",
      "Fundamentals of Digital Marketing (Google)",
      "Diploma in Human Resource Management (Udemy)",
      "Certified Counselling Practitioner (Academy of Modern Applied Psychology)",
    ],
    image: "/team-4.jpg",
  },
];

export default function About() {
  console.log("Rendering About page with team:", team);
  return (
    <Layout>
      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/hero-saffron.jpg)` }}
        />
        <div className="absolute inset-0 bg-[#3d0a0a]/90" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-primary font-medium tracking-widest uppercase text-sm">
              Agri + Technology Revolution
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mt-4 leading-tight">
              Democratizing <span className="text-primary">Red Gold</span>
            </h1>
            <p className="text-white/80 mt-8 text-xl leading-relaxed max-w-2xl mx-auto">
              Chakra Biotech LLP is an emerging Agri-Tech leader based in
              Jaipur, Rajasthan, pioneering the future of indoor aeroponic
              saffron cultivation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="/saffron-field.jpg"
                alt="Indoor Saffron Lab"
                className="rounded-3xl shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-primary/10 rounded-full -z-0" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="space-y-4">
                <h2 className="text-4xl font-serif font-bold text-foreground">
                  Our Vision
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To build India's leading indoor saffron cultivation ecosystem,
                  enabling high-quality "Red Gold" production in non-traditional
                  regions through technology, self-reliance, and sustainable
                  agri-innovation.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-serif font-bold text-foreground">
                  Our Mission
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  To empower farmers, agri-entrepreneurs, and institutions by
                  introducing aeroponic and hydroponic saffron farming using
                  controlled environments that replicate Kashmir-like
                  conditions, creating profitable, scalable, and
                  climate-resilient agriculture models in Rajasthan.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-6">
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-foreground">
                    Soil-less
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Cultivation Method
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-foreground">CEA</div>
                  <div className="text-sm text-muted-foreground">
                    Tech Ecosystem
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold text-foreground">
                    Jaipur
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Headquarters
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Block */}
      <section className="py-24 bg-[#0a0a0a] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-3xl rounded-full translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Innovative Solutions
            </h2>
            <p className="text-white/60 text-lg">
              We address climate dependency and geographical limitations through
              Controlled Environment Agriculture (CEA).
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-3">
                  {value.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Meet Our Leadership
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              The experts driving the next generation of precision agriculture
              in India.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-1 gap-12 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col md:flex-row gap-10 bg-card p-10 rounded-4xl shadow-card hover:shadow-elevated transition-all duration-500 border border-border/50"
              >
                <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-primary/10 to-primary/30 flex-shrink-0 overflow-hidden sticky top-36">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/40">
                      <Users className="w-20 h-20" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-foreground">
                      {member.name}
                    </h3>
                    <div className="text-primary font-semibold text-lg mt-1">
                      {member.role}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-lg leading-relaxed italic border-l-4 border-primary/20 pl-6">
                    {member.bio}
                  </p>

                  <div className="grid sm:grid-cols-2 gap-8 pt-4">
                    {"education" in member && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                          <Award className="w-4 h-4 text-primary" />
                          Education
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {member.education?.map((edu) => (
                            <li key={edu} className="flex gap-2">
                              <span className="text-primary">•</span>
                              {edu}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {"certifications" in member && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-foreground flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          Certifications
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          {member.certifications?.map((cert) => (
                            <li key={cert} className="flex gap-2">
                              <span className="text-primary">•</span>
                              {cert}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {"experience" in member && (
                    <div className="space-y-4 pt-4">
                      <h4 className="font-bold text-foreground flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        Professional Experience
                      </h4>
                      <div className="space-y-6">
                        {member.experience?.map((exp, i) => (
                          <div
                            key={i}
                            className="bg-muted/30 p-5 rounded-2xl border border-border/40"
                          >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-3">
                              <div>
                                <h5 className="font-bold text-foreground">
                                  {exp.company}
                                </h5>
                                <p className="text-primary text-sm font-medium">
                                  {exp.designation}
                                </p>
                              </div>
                              <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-3 py-1 rounded-full w-fit">
                                {exp.duration}
                              </span>
                            </div>
                            <ul className="space-y-1.5 text-xs text-muted-foreground">
                              {exp.points.map((point, pi) => (
                                <li key={pi} className="flex gap-2">
                                  <span className="text-primary text-[10px]">
                                    ◆
                                  </span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Certification */}
      <section className="py-24 bg-cream-dark">
        <div className="container mx-auto px-4">
          <QualityCertification
            variant="full"
            showMetrics={true}
            showCertifications={true}
            animated={true}
            className="max-w-6xl mx-auto"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cream-dark to-transparent opacity-20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">
              Revolutionizing Saffron Cultivation
            </h2>
            <p className="text-white/80 mt-6 max-w-2xl mx-auto text-lg">
              Join us in strengthening India's agri-innovation landscape.
              Experience the purest 'Red Gold' grown with precision and care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <Button
                size="lg"
                asChild
                className="bg-white text-primary hover:bg-white/90"
              >
                <Link href="/products">
                  Explore Pure Saffron
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent border-white text-white hover:bg-white/10"
              >
                <Link href="/contact">Partner With Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

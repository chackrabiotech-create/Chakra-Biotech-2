"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";
import { useCompanyData } from "@/hooks/use-company-data";

export function Footer() {
  const { companyData, whatsappUrl } = useCompanyData();

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-secondary-foreground/10">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-white p-1 shadow-sm group-hover:shadow-md transition-shadow">
                <img
                  src="/logo.png"
                  alt="Chakra Biotech Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold leading-tight">
                  Chakra<span className="text-primary">Biotech</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-sans font-medium">
                  Precision Agri-Tech
                </span>
              </div>
            </Link>
            <p className="text-secondary-foreground/80 leading-relaxed text-sm">
              {companyData?.footer?.description ||
                'An Agri-Tech leader specializing in precision-controlled aeroponic saffron cultivation. We are democratizing "Red Gold" through sustainable technology and innovation.'}
            </p>
            <div className="flex gap-4">
              {companyData?.socialMedia?.facebook && (
                <a
                  href={companyData.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {companyData?.socialMedia?.instagram && (
                <a
                  href={companyData.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {companyData?.socialMedia?.twitter && (
                <a
                  href={companyData.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary-foreground/5 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-semibold relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {(companyData?.footer?.quickLinks &&
                companyData.footer.quickLinks.length > 0
                ? companyData.footer.quickLinks
                : [
                  { name: "Our Products", href: "/products" },
                  { name: "Training Programs", href: "/training" },
                  { name: "Research & Blog", href: "/blog" },
                  { name: "About Company", href: "/about" },
                  { name: "Terms of Service", href: "/terms" },
                ]
              ).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-secondary-foreground/70 hover:text-primary hover:translate-x-1 transition-all inline-block text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Offerings */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-semibold relative inline-block">
              Offerings
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {(companyData?.footer?.offerings &&
                companyData.footer.offerings.length > 0
                ? companyData.footer.offerings
                : [
                  "Aeroponic Saffron",
                  "Indoor Cultivation Training",
                  "CEA Consulting",
                  "Biotech Innovation",
                  "Sustainable Farming",
                ]
              ).map((item) => (
                <li key={item} className="text-secondary-foreground/70 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-semibold relative inline-block">
              Get in Touch
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-secondary-foreground/70 text-sm leading-relaxed">
                  {companyData?.address?.city &&
                    `${companyData.address.city}, `}
                  {companyData?.address?.state &&
                    `${companyData.address.state},`}
                  <br />
                  {companyData?.address?.country || "India"} -{" "}
                  {companyData?.address?.zipCode || "302021"}
                </span>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-secondary-foreground/70 text-sm group-hover:text-primary transition-colors">
                    {companyData?.phone || "+91 98765 43210"}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${companyData?.email || "info@chakrabiotech.com"}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-secondary-foreground/70 text-sm group-hover:text-primary transition-colors">
                    {companyData?.email || "info@chakrabiotech.com"}
                  </span>
                </a>
              </li>
              {companyData?.secondaryEmail && (
                <li>
                  <a
                    href={`mailto:${companyData.secondaryEmail}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-secondary-foreground/70 text-sm group-hover:text-primary transition-colors">
                      {companyData.secondaryEmail}
                    </span>
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-secondary-foreground/60 text-xs">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            {companyData?.footer?.copyrightText ||
              "Chakra Biotech LLP. All rights reserved."}
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/compliance"
              className="hover:text-primary transition-colors"
            >
              Compliance
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

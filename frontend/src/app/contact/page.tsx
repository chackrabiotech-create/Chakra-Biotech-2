"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Facebook,
  Instagram,
  Twitter,
  Loader2,
} from "lucide-react";
import { contactApi } from "@/lib/api";
import { useCompanyData } from "@/hooks/use-company-data";

export default function Contact() {
  const { toast } = useToast();
  const { companyData: companyDetails, whatsappUrl } = useCompanyData();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await contactApi.submit(formData);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: companyDetails?.address
        ? [
          companyDetails.address.street,
          `${companyDetails.address.city}, ${companyDetails.address.state} - ${companyDetails.address.zipCode}`,
        ].filter(Boolean)
        : ["Loading..."],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: companyDetails
        ? [companyDetails.phone, companyDetails.alternatePhone].filter(Boolean)
        : ["Loading..."],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: companyDetails ? [companyDetails.email] : ["Loading..."],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Sat: 9:00 AM - 6:00 PM", "Sunday: Closed"],
    },
  ];

  return (
    <Layout>
      {/* Header */}
      <section className="py-12 md:py-16 bg-gradient-hero pattern-saffron">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground"
          >
            Get in <span className="text-gradient-saffron">Touch</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-4 max-w-xl mx-auto text-sm md:text-base"
          >
            Have questions about our products? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-12 md:py-16 lg:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground">
                Contact Information
              </h2>

              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="flex items-start gap-3 md:gap-4"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <info.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm md:text-base">
                      {info.title}
                    </h3>
                    {info.details.map((detail, idx) => (
                      <p
                        key={idx}
                        className="text-muted-foreground text-xs md:text-sm"
                      >
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <div className="bg-[#25D366]/10 p-4 md:p-6 rounded-xl md:rounded-2xl">
                <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">
                  Quick Response via WhatsApp
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm mb-4">
                  Get instant responses to your queries on WhatsApp.
                </p>
                <Button
                  asChild
                  className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-sm md:text-base"
                  size="sm"
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Chat on WhatsApp
                  </a>
                </Button>
              </div>

              {/* Social Links */}
              {companyDetails?.socialMedia && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3 text-sm md:text-base">
                    Follow Us
                  </h3>
                  <div className="flex gap-3">
                    {companyDetails.socialMedia.facebook && (
                      <a
                        href={companyDetails.socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                      </a>
                    )}
                    {companyDetails.socialMedia.instagram && (
                      <a
                        href={companyDetails.socialMedia.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                      </a>
                    )}
                    {companyDetails.socialMedia.twitter && (
                      <a
                        href={companyDetails.socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <Twitter className="w-4 h-4 md:w-5 md:h-5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-card p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-card"
            >
              <h2 className="text-xl md:text-2xl font-serif font-bold text-foreground mb-6">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                      Name *
                    </label>
                    <Input
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="text-sm md:text-base"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                      Phone
                    </label>
                    <Input
                      name="phone"
                      placeholder="+91 12345 67890"
                      value={formData.phone}
                      onChange={handleChange}
                      className="text-sm md:text-base"
                    />
                  </div>
                  <div>
                    <label className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                      Subject *
                    </label>
                    <Input
                      name="subject"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs md:text-sm font-medium text-foreground mb-2 block">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    placeholder="Your message..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="text-sm md:text-base"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="text-sm md:text-base"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3 h-3 md:w-4 md:h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-64 md:h-96 bg-muted">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d423286.27404345275!2d74.0097694!3d34.08284645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e1855686a4c6c1%3A0xc6e89c2e30b52c6c!2sKashmir!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Location Map"
        />
      </section>
    </Layout>
  );
}

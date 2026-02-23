"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    Calendar,
    Users,
    MapPin,
    Globe,
    MessageCircle,
    Loader2,
    GraduationCap,
    Send,
    ChevronRight,
} from "lucide-react";
import { useCompanyData } from "@/hooks/use-company-data";
import { trainingApi, Training } from "@/lib/api/training";
import { enrollmentApi } from "@/lib/api/enrollment";
import { toast } from "sonner";
import Link from "next/link";

export default function EnrollPage() {
    const { trainingId } = useParams();
    const router = useRouter();
    const { whatsappNumber } = useCompanyData();
    const [training, setTraining] = useState<Training | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        studentName: "",
        email: "",
        phone: "",
        whatsappNumber: "",
        notes: "",
    });

    useEffect(() => {
        if (trainingId) {
            loadTraining(trainingId as string);
        }
    }, [trainingId]);

    const loadTraining = async (id: string) => {
        try {
            setLoading(true);
            const res = await trainingApi.getById(id);
            if (res && res.data) {
                setTraining(res.data);
            } else {
                router.push("/training");
            }
        } catch (error) {
            console.error("Failed to load training", error);
            router.push("/training");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.studentName.trim() || !formData.email.trim() || !formData.phone.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        setSubmitting(true);
        try {
            await enrollmentApi.submit({
                ...formData,
                trainingId: trainingId as string,
                whatsappNumber: formData.whatsappNumber || formData.phone,
            });
            setSubmitted(true);
            toast.success("Enrollment submitted successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to submit enrollment");
        } finally {
            setSubmitting(false);
        }
    };

    const handleWhatsAppEnquiry = () => {
        if (!training) return;
        const message = `Hello! I've submitted an enrollment for the ${training.title} training program. My name is ${formData.studentName || "N/A"}.`;
        window.open(
            `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center min-h-[60vh]">
                    <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    if (!training) return null;

    const seatsLeft = training.maxParticipants
        ? training.maxParticipants - (training.currentEnrollments || 0)
        : null;
    const discount =
        training.originalPrice && training.originalPrice > training.price
            ? Math.round(
                  ((training.originalPrice - training.price) / training.originalPrice) * 100
              )
            : 0;

    // Success state
    if (submitted) {
        return (
            <Layout>
                <div className="min-h-[70vh] flex items-center justify-center bg-cream-light">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-lg w-full mx-4"
                    >
                        <div className="bg-card rounded-2xl p-8 md:p-12 text-center shadow-card border">
                            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
                                Enrollment Submitted!
                            </h1>
                            <p className="text-muted-foreground mb-2">
                                Your enrollment request for <span className="font-semibold text-foreground">{training.title}</span> has been received.
                            </p>
                            <p className="text-muted-foreground mb-8">
                                Our team will review your application and contact you within 24 hours.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button onClick={handleWhatsAppEnquiry} variant="outline">
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat on WhatsApp
                                </Button>
                                <Link href="/training">
                                    <Button>
                                        Browse More Programs
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-background min-h-screen">
                {/* Breadcrumb */}
                <div className="bg-secondary/10 py-4 border-b">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link href="/training" className="hover:text-primary transition-colors">
                                <ArrowLeft className="w-4 h-4 inline mr-1" />
                                Trainings
                            </Link>
                            <ChevronRight className="w-3 h-3" />
                            <Link
                                href={`/training/${training.slug}`}
                                className="hover:text-primary transition-colors"
                            >
                                {training.title}
                            </Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-foreground">Enroll</span>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-10"
                        >
                            <GraduationCap className="w-12 h-12 text-primary mx-auto mb-4" />
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                                Enroll in This Program
                            </h1>
                            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
                                Fill in your details below to submit your enrollment request.
                                Our team will contact you to confirm your seat.
                            </p>
                        </motion.div>

                        <div className="grid lg:grid-cols-5 gap-8">
                            {/* Form (3 cols) */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="lg:col-span-3"
                            >
                                <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 md:p-8 shadow-card border space-y-6">
                                    <h2 className="text-lg font-semibold text-foreground border-b pb-3">
                                        Your Information
                                    </h2>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.studentName}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, studentName: e.target.value })
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, email: e.target.value })
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, phone: e.target.value })
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-foreground mb-2">
                                                WhatsApp Number
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.whatsappNumber}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, whatsappNumber: e.target.value })
                                                }
                                                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                placeholder="Same as phone if blank"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Message / Notes
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={formData.notes}
                                            onChange={(e) =>
                                                setFormData({ ...formData, notes: e.target.value })
                                            }
                                            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                                            placeholder="Any questions or special requirements..."
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4 mr-2" />
                                                Submit Enrollment
                                            </>
                                        )}
                                    </Button>

                                    <div className="text-center">
                                        <p className="text-sm text-muted-foreground">
                                            Or enroll directly via{" "}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const msg = `Hello! I want to enroll in the ${training.title} training program.`;
                                                    window.open(
                                                        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,
                                                        "_blank"
                                                    );
                                                }}
                                                className="text-green-600 hover:text-green-700 font-medium underline underline-offset-2"
                                            >
                                                WhatsApp
                                            </button>
                                        </p>
                                    </div>
                                </form>
                            </motion.div>

                            {/* Training Summary (2 cols) */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="lg:col-span-2"
                            >
                                <div className="bg-card rounded-2xl shadow-card border sticky top-24 overflow-hidden">
                                    {/* Image */}
                                    {training.coverImage && training.coverImage !== "no-photo.jpg" && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={training.coverImage}
                                                alt={training.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="p-6 space-y-4">
                                        <div>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {training.category && (
                                                    <Badge variant="outline" className="text-xs">
                                                        {training.category}
                                                    </Badge>
                                                )}
                                                <Badge variant="outline" className="text-xs">
                                                    {training.level}
                                                </Badge>
                                            </div>
                                            <h3 className="text-lg font-serif font-bold text-foreground">
                                                {training.title}
                                            </h3>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-2xl font-bold text-primary">
                                                ₹{training.price.toLocaleString()}
                                            </span>
                                            {training.originalPrice && training.originalPrice > training.price && (
                                                <>
                                                    <span className="text-sm text-muted-foreground line-through">
                                                        ₹{training.originalPrice.toLocaleString()}
                                                    </span>
                                                    <Badge className="bg-red-500 text-xs">{discount}% OFF</Badge>
                                                </>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className="space-y-2.5 text-sm">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Clock className="w-4 h-4 text-primary" />
                                                <span>{training.duration}</span>
                                            </div>
                                            {training.mode && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Globe className="w-4 h-4 text-primary" />
                                                    <span>{training.mode}</span>
                                                </div>
                                            )}
                                            {training.location && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    <span>{training.location}</span>
                                                </div>
                                            )}
                                            {training.startDate && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Calendar className="w-4 h-4 text-primary" />
                                                    <span>Starts: {training.startDate}</span>
                                                </div>
                                            )}
                                            {seatsLeft !== null && (
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Users className="w-4 h-4 text-primary" />
                                                    <span>
                                                        {seatsLeft > 0
                                                            ? `${seatsLeft} seats available`
                                                            : "Fully booked"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {seatsLeft !== null && seatsLeft <= 5 && seatsLeft > 0 && (
                                            <p className="text-xs text-red-500 font-medium bg-red-50 px-3 py-2 rounded-lg">
                                                Only {seatsLeft} seats left! Hurry!
                                            </p>
                                        )}

                                        <div className="pt-3 border-t">
                                            <Link href={`/training/${training.slug}`}>
                                                <Button variant="ghost" className="w-full text-sm">
                                                    View Full Details
                                                    <ChevronRight className="w-4 h-4 ml-1" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

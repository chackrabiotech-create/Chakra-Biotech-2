"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Clock,
    Calendar,
    Users,
    CheckCircle2,
    MessageCircle,
    ArrowLeft,
    Share2,
    Sprout,
    Award,
    BookOpen,
    Loader2,
    Star,
    MapPin,
    Globe,
    Download,
    Copy,
    Play,
    GraduationCap,
    FileText,
    ChevronRight,
    Quote,
    Microscope,
    User,
    Send,
} from "lucide-react";
import { useCompanyData } from "@/hooks/use-company-data";
import { trainingApi, Training } from "@/lib/api/training";
import { StructuredData } from "@/components/seo/StructuredData";
import { toast } from "sonner";
import Link from "next/link";

export default function TrainingDetailClient() {
    const { slug } = useParams();
    const router = useRouter();
    const { whatsappNumber, companyData } = useCompanyData();
    const [training, setTraining] = useState<Training | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            loadTraining(slug as string);
        }
    }, [slug]);

    const loadTraining = async (slug: string) => {
        try {
            setLoading(true);
            const res = await trainingApi.getBySlug(slug);
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

    const handleEnquiry = () => {
        if (!training) return;
        const message = `Hello! I'm interested in the ${training.title} training program.`;
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    const handleShare = async () => {
        const url = window.location.href;
        const title = training?.title || "Training Program";
        if (navigator.share) {
            try {
                await navigator.share({ title, url });
            } catch {
                // User cancelled or not supported
            }
        } else {
            // Fallback: open WhatsApp share
            const message = `Check out this training: ${title} - ${url}`;
            window.open(
                `https://wa.me/?text=${encodeURIComponent(message)}`,
                "_blank"
            );
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
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
    const seatPercent = training.maxParticipants
        ? ((training.currentEnrollments || 0) / training.maxParticipants) * 100
        : 0;
    const discount =
        training.originalPrice && training.originalPrice > training.price
            ? Math.round(
                ((training.originalPrice - training.price) /
                    training.originalPrice) *
                100
            )
            : 0;

    // Schema.org structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: training.title,
        description: training.seoDescription || training.description,
        provider: {
            "@type": "Organization",
            name: companyData?.companyName || "Chakra Biotech",
        },
        ...(training.instructor && {
            instructor: {
                "@type": "Person",
                name: training.instructor,
                ...(training.instructorDesignation && {
                    jobTitle: training.instructorDesignation,
                }),
            },
        }),
        ...(training.rating && {
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: training.rating,
                reviewCount: training.totalReviews || 1,
            },
        }),
        offers: {
            "@type": "Offer",
            price: training.price,
            priceCurrency: "INR",
            availability: training.isActive
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
        },
        courseMode: training.mode || "Offline",
        inLanguage: training.language || "Hindi & English",
    };

    return (
        <Layout>
            <StructuredData data={structuredData} />

            <div className="bg-background min-h-screen">
                {/* Breadcrumb */}
                <div className="bg-secondary/10 py-4 border-b">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Link
                                href="/training"
                                className="hover:text-primary transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4 inline mr-1" />
                                Trainings
                            </Link>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-foreground truncate">
                                {training.title}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 1. Hero Banner */}
                <section className="relative bg-cream-light py-12 lg:py-20">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row gap-12 items-start">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex-1"
                            >
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {training.category && (
                                        <Badge variant="outline">
                                            {training.category}
                                        </Badge>
                                    )}

                                    {training.mode && (
                                        <Badge variant="secondary">
                                            {training.mode}
                                        </Badge>
                                    )}
                                    {training.popular && (
                                        <Badge className="bg-yellow-500 hover:bg-yellow-600">
                                            Popular Choice
                                        </Badge>
                                    )}
                                    {discount > 0 && (
                                        <Badge className="bg-red-500 hover:bg-red-600">
                                            {discount}% OFF
                                        </Badge>
                                    )}
                                </div>

                                <h1 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-4 leading-tight">
                                    {training.title}
                                </h1>

                                {/* Rating */}
                                {training.rating ? (
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.round(training.rating!)
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-medium">
                                            {training.rating}
                                        </span>
                                        {training.totalReviews ? (
                                            <span className="text-sm text-muted-foreground">
                                                ({training.totalReviews} reviews)
                                            </span>
                                        ) : null}
                                    </div>
                                ) : null}

                                <div
                                    className="text-lg text-muted-foreground mb-6 prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: training.description }}
                                />

                                {/* Meta Info */}
                                <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-foreground/80 mb-8">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-primary" />
                                        <span>{training.duration}</span>
                                    </div>
                                    {training.mode && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-primary" />
                                            <span>{training.mode}</span>
                                        </div>
                                    )}
                                    {training.language && (
                                        <div className="flex items-center gap-2">
                                            <MessageCircle className="w-4 h-4 text-primary" />
                                            <span>{training.language}</span>
                                        </div>
                                    )}
                                    {training.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <span>{training.location}</span>
                                        </div>
                                    )}
                                    {training.maxParticipants && (
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-primary" />
                                            <span>
                                                {training.maxParticipants} Max
                                                Participants
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="text-3xl font-bold text-primary">
                                        ₹{training.price.toLocaleString()}
                                    </span>
                                    {training.originalPrice &&
                                        training.originalPrice >
                                        training.price && (
                                            <span className="text-lg text-muted-foreground line-through">
                                                ₹
                                                {training.originalPrice.toLocaleString()}
                                            </span>
                                        )}
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-wrap gap-3">
                                    <Link href={`/enroll/${training._id}`}>
                                        <Button size="lg">
                                            <Send className="w-4 h-4 mr-2" />
                                            Enroll Now
                                        </Button>
                                    </Link>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={handleEnquiry}
                                    >
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        WhatsApp Enquiry
                                    </Button>
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                </div>
                            </motion.div>

                            {/* Cover Image */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="w-full lg:w-[500px] aspect-[4/3] relative rounded-2xl overflow-hidden shadow-2xl flex-shrink-0"
                            >
                                {training.coverImage &&
                                    training.coverImage !== "no-photo.jpg" ? (
                                    <img
                                        src={training.coverImage}
                                        alt={training.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                        <Sprout className="w-24 h-24 text-primary/40" />
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Main Content + Sidebar */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid lg:grid-cols-3 gap-12">
                        {/* Main Content (2 cols) */}
                        <div className="lg:col-span-2 space-y-16">
                            {/* 2. About the Program */}
                            {(training.aboutProgram || training.content) && (
                                <section>
                                    <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                        <BookOpen className="w-6 h-6 text-primary" />
                                        About the Program
                                    </h2>
                                    <div
                                        className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary"
                                        dangerouslySetInnerHTML={{
                                            __html:
                                                training.aboutProgram ||
                                                training.content,
                                        }}
                                    />
                                </section>
                            )}

                            {/* 3. What You Will Learn */}
                            {training.features && training.features.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                        <Award className="w-6 h-6 text-primary" />
                                        What You Will Learn
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {training.features.map(
                                            (feature, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-3 p-4 bg-card rounded-xl border"
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                    <span className="text-foreground">
                                                        {feature}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* 4. Curriculum */}
                            {training.curriculum &&
                                training.curriculum.length > 0 && (
                                    <section>
                                        <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                            <FileText className="w-6 h-6 text-primary" />
                                            Curriculum
                                        </h2>
                                        <Accordion
                                            type="single"
                                            collapsible
                                            className="space-y-3"
                                        >
                                            {training.curriculum.map(
                                                (module, idx) => (
                                                    <AccordionItem
                                                        key={idx}
                                                        value={`module-${idx}`}
                                                        className="border rounded-xl px-6 bg-card"
                                                    >
                                                        <AccordionTrigger className="hover:no-underline">
                                                            <div className="flex items-center gap-4 text-left">
                                                                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                                                                    {idx + 1}
                                                                </span>
                                                                <div>
                                                                    <p className="font-semibold text-foreground">
                                                                        {module.title}
                                                                    </p>
                                                                    {module.duration && (
                                                                        <p className="text-xs text-muted-foreground mt-0.5">
                                                                            {module.duration}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            {module.description && (
                                                                <p className="text-muted-foreground mb-4">
                                                                    {module.description}
                                                                </p>
                                                            )}
                                                            {module.topics &&
                                                                module.topics
                                                                    .length >
                                                                0 && (
                                                                    <ul className="space-y-2">
                                                                        {module.topics.map(
                                                                            (
                                                                                topic,
                                                                                tIdx
                                                                            ) => (
                                                                                <li
                                                                                    key={tIdx}
                                                                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                                                                >
                                                                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                                                                    {topic}
                                                                                </li>
                                                                            )
                                                                        )}
                                                                    </ul>
                                                                )}
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                )
                                            )}
                                        </Accordion>
                                    </section>
                                )}

                            {/* 5. Practical Exposure */}
                            {training.practicalExposure &&
                                (training.practicalExposure.points?.length > 0 ||
                                    training.practicalExposure.description) && (
                                    <section>
                                        <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                            <Microscope className="w-6 h-6 text-primary" />
                                            {training.practicalExposure.title ||
                                                "Practical Exposure"}
                                        </h2>
                                        {training.practicalExposure
                                            .description && (
                                                <p className="text-muted-foreground mb-6">
                                                    {
                                                        training.practicalExposure
                                                            .description
                                                    }
                                                </p>
                                            )}
                                        {training.practicalExposure.points
                                            ?.length > 0 && (
                                                <ul className="space-y-3 mb-6">
                                                    {training.practicalExposure.points.map(
                                                        (point, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="flex items-start gap-3"
                                                            >
                                                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                                <span className="text-foreground">
                                                                    {point}
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                        {training.practicalExposure.images
                                            ?.length > 0 && (
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                    {training.practicalExposure.images.map(
                                                        (img, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="aspect-video rounded-xl overflow-hidden"
                                                            >
                                                                <img
                                                                    src={img}
                                                                    alt={`Practical exposure ${idx + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </section>
                                )}

                            {/* 6. Certification */}
                            {training.certificationTitle && (
                                <section>
                                    <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                        <GraduationCap className="w-6 h-6 text-primary" />
                                        Certification
                                    </h2>
                                    <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-8 border">
                                        <div className="flex flex-col md:flex-row gap-8 items-center">
                                            {training.certificationImage && (
                                                <div className="w-full md:w-64 flex-shrink-0">
                                                    <img
                                                        src={
                                                            training.certificationImage
                                                        }
                                                        alt="Certificate"
                                                        className="w-full rounded-xl shadow-lg"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                                                    {
                                                        training.certificationTitle
                                                    }
                                                </h3>
                                                {training.certificationDescription && (
                                                    <p className="text-muted-foreground">
                                                        {
                                                            training.certificationDescription
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* 7. Instructor */}
                            {training.instructor && (
                                <section>
                                    <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                        <User className="w-6 h-6 text-primary" />
                                        Instructor
                                    </h2>
                                    <div className="bg-card rounded-2xl p-8 border">
                                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                                            {training.instructorImage ? (
                                                <img
                                                    src={
                                                        training.instructorImage
                                                    }
                                                    alt={training.instructor}
                                                    className="w-24 h-24 rounded-full object-cover flex-shrink-0"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                    <span className="text-3xl font-bold text-primary">
                                                        {training.instructor.charAt(
                                                            0
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-xl font-serif font-bold text-foreground">
                                                    {training.instructor}
                                                </h3>
                                                {training.instructorDesignation && (
                                                    <p className="text-primary font-medium mt-1">
                                                        {
                                                            training.instructorDesignation
                                                        }
                                                    </p>
                                                )}
                                                {training.instructorBio && (
                                                    <div
                                                        className="text-muted-foreground mt-3 leading-relaxed prose prose-sm max-w-none"
                                                        dangerouslySetInnerHTML={{ __html: training.instructorBio }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}

                            {/* 8. Testimonials */}
                            {training.testimonials &&
                                training.testimonials.length > 0 && (
                                    <section>
                                        <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                            <Quote className="w-6 h-6 text-primary" />
                                            Student Reviews
                                        </h2>
                                        <div className="grid sm:grid-cols-2 gap-6">
                                            {training.testimonials.map(
                                                (t, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="bg-card rounded-2xl p-6 border"
                                                    >
                                                        <div className="flex gap-1 mb-3">
                                                            {[...Array(5)].map(
                                                                (_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${i <
                                                                            (t.rating ||
                                                                                5)
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "text-gray-300"
                                                                            }`}
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                        <p className="text-muted-foreground italic mb-4">
                                                            &ldquo;{t.review}&rdquo;
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            {t.image ? (
                                                                <img
                                                                    src={
                                                                        t.image
                                                                    }
                                                                    alt={
                                                                        t.name
                                                                    }
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                                    <span className="text-primary font-semibold text-sm">
                                                                        {t.name?.charAt(
                                                                            0
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-semibold text-foreground text-sm">
                                                                    {t.name}
                                                                </p>
                                                                {t.city && (
                                                                    <p className="text-xs text-muted-foreground">
                                                                        {
                                                                            t.city
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </section>
                                )}

                            {/* 9. FAQ */}
                            {training.faq && training.faq.length > 0 && (
                                <section>
                                    <h2 className="text-2xl font-serif font-bold mb-6">
                                        Frequently Asked Questions
                                    </h2>
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="space-y-3"
                                    >
                                        {training.faq.map((item, idx) => (
                                            <AccordionItem
                                                key={idx}
                                                value={`faq-${idx}`}
                                                className="border rounded-xl px-6 bg-card"
                                            >
                                                <AccordionTrigger className="hover:no-underline text-left font-semibold">
                                                    {item.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground">
                                                    {item.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </section>
                            )}

                            {/* 10. Facility Video */}
                            {training.facilityVideoUrl && (
                                <section>
                                    <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-2">
                                        <Play className="w-6 h-6 text-primary" />
                                        Facility Video
                                    </h2>
                                    <div className="aspect-video rounded-2xl overflow-hidden border">
                                        <iframe
                                            src={training.facilityVideoUrl}
                                            title="Facility Video"
                                            className="w-full h-full"
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* 11. Sticky Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-card p-6 rounded-2xl shadow-card border sticky top-24 space-y-6">
                                {/* Price */}
                                <div>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-bold text-primary">
                                            ₹
                                            {training.price.toLocaleString()}
                                        </span>
                                        {training.originalPrice &&
                                            training.originalPrice >
                                            training.price && (
                                                <span className="text-sm text-muted-foreground line-through">
                                                    ₹
                                                    {training.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                    </div>
                                    {discount > 0 && (
                                        <p className="text-sm text-green-600 font-medium mt-1">
                                            You save ₹
                                            {(
                                                training.originalPrice! -
                                                training.price
                                            ).toLocaleString()}{" "}
                                            ({discount}% off)
                                        </p>
                                    )}
                                </div>

                                {/* Dates */}
                                {(training.startDate || training.endDate) && (
                                    <div className="space-y-2 text-sm">
                                        {training.startDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                <span>
                                                    Starts:{" "}
                                                    {training.startDate}
                                                </span>
                                            </div>
                                        )}
                                        {training.endDate && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span>
                                                    Ends: {training.endDate}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Seats Left */}
                                {seatsLeft !== null && (
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">
                                                Seats Available
                                            </span>
                                            <span className="font-semibold text-foreground">
                                                {seatsLeft > 0
                                                    ? `${seatsLeft} of ${training.maxParticipants}`
                                                    : "Full"}
                                            </span>
                                        </div>
                                        <Progress
                                            value={seatPercent}
                                            className="h-2"
                                        />
                                        {seatsLeft > 0 && seatsLeft <= 5 && (
                                            <p className="text-xs text-red-500 mt-1 font-medium">
                                                Only {seatsLeft} seats left!
                                                Hurry!
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Enroll Button */}
                                <Link href={`/enroll/${training._id}`} className="block">
                                    <Button
                                        className="w-full"
                                        size="lg"
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Enroll Now
                                    </Button>
                                </Link>

                                {/* WhatsApp Button */}
                                <Button
                                    onClick={handleEnquiry}
                                    className="w-full"
                                    size="lg"
                                    variant="outline"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Enquire via WhatsApp
                                </Button>

                                {/* Brochure Download */}
                                {training.brochureUrl && (
                                    <a
                                        href={training.brochureUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Brochure
                                        </Button>
                                    </a>
                                )}

                                {/* Share & Copy */}
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleShare}
                                    >
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={handleCopyLink}
                                    >
                                        <Copy className="w-4 h-4 mr-2" />
                                        Copy Link
                                    </Button>
                                </div>

                                {/* Topics */}
                                {training.topics &&
                                    training.topics.length > 0 && (
                                        <div>
                                            <h4 className="font-semibold text-sm text-foreground mb-3">
                                                Topics Covered
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {training.topics.map(
                                                    (topic, i) => (
                                                        <Badge
                                                            key={i}
                                                            variant="secondary"
                                                        >
                                                            {topic}
                                                        </Badge>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Quick Info */}
                                <div className="text-xs text-center text-muted-foreground pt-2 border-t">
                                    Usually replies within 1 hour
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

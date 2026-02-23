import type { Metadata } from "next";
import TrainingDetailClient from "./TrainingDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

async function getTraining(slug: string) {
    try {
        const res = await fetch(`${API_URL}/trainings/${slug}`, {
            next: { revalidate: 60 },
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch {
        return null;
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const training = await getTraining(slug);

    if (!training) {
        return {
            title: "Training Program Not Found",
        };
    }

    const title = training.seoTitle || `${training.title} | Saffron Farming Training`;
    const description = training.seoDescription || training.description;
    const keywords = training.seoKeywords?.length
        ? training.seoKeywords
        : [
              training.title,
              "Saffron Farming Training",
              "Indoor Saffron Cultivation",
              "Artificial Saffron Farming",
              "Controlled Environment Agriculture",
          ];

    return {
        title,
        description,
        keywords,
        openGraph: {
            title: training.title,
            description,
            url: `${siteUrl}/training/${slug}`,
            images: training.coverImage && training.coverImage !== "no-photo.jpg"
                ? [{ url: training.coverImage, width: 1200, height: 630, alt: training.title }]
                : [{ url: "/og.webp", width: 1200, height: 630, alt: "Chakra Biotech Training" }],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: training.title,
            description,
            images: training.coverImage && training.coverImage !== "no-photo.jpg"
                ? [training.coverImage]
                : ["/og.webp"],
        },
        alternates: {
            canonical: `${siteUrl}/training/${slug}`,
        },
    };
}

export default function TrainingDetailPage() {
    return <TrainingDetailClient />;
}

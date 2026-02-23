import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

export const metadata: Metadata = {
  title: "Indoor Saffron Cultivation Training Programs",
  description:
    "Learn aeroponic saffron farming with Chakra Biotech's comprehensive training programs. Hands-on experience in controlled environment agriculture, indoor cultivation techniques, and sustainable farming practices.",
  keywords: [
    "saffron farming training",
    "aeroponic cultivation course",
    "indoor farming training",
    "CEA training programs",
    "saffron cultivation workshop",
    "agri-tech training Jaipur",
  ],
  openGraph: {
    title: "Saffron Cultivation Training - Chakra Biotech",
    description:
      "Comprehensive training programs in aeroponic saffron farming and controlled environment agriculture.",
    url: `${siteUrl}/training`,
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Chakra Biotech Training Programs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saffron Cultivation Training Programs",
    description: "Learn aeroponic saffron farming with expert guidance.",
    images: ["/og.webp"],
  },
  alternates: {
    canonical: `${siteUrl}/training`,
  },
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

export const metadata: Metadata = {
  title: "Saffron Agri-Tech Blog - Insights & Research",
  description:
    "Explore articles on aeroponic saffron cultivation, controlled environment agriculture, sustainable farming practices, and agri-tech innovations from Chakra Biotech's experts.",
  keywords: [
    "saffron cultivation blog",
    "aeroponic farming articles",
    "agri-tech insights",
    "indoor farming research",
    "sustainable agriculture blog",
    "CEA technology",
  ],
  openGraph: {
    title: "Saffron Agri-Tech Blog - Chakra Biotech",
    description:
      "Expert insights on aeroponic saffron cultivation and agri-tech innovations.",
    url: `${siteUrl}/blog`,
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Chakra Biotech Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saffron Agri-Tech Blog",
    description:
      "Expert insights on aeroponic cultivation and sustainable farming.",
    images: ["/og.webp"],
  },
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

export const metadata: Metadata = {
  title: "Saffron Agri-Tech Blog - Insights & Research",
  description:
    "Explore expert articles on aeroponic saffron cultivation, controlled environment agriculture, sustainable farming practices, and agri-tech innovations from Chakra Biotech's researchers in Jaipur, Rajasthan.",
  keywords: [
    "saffron cultivation blog",
    "aeroponic farming articles",
    "agri-tech insights",
    "indoor farming research",
    "sustainable agriculture blog",
    "CEA technology",
    "saffron growing tips",
    "vertical farming India",
    "indoor saffron India",
  ],
  openGraph: {
    title: "Saffron Agri-Tech Blog - Chakra Biotech",
    description:
      "Expert insights on aeroponic saffron cultivation, agri-tech innovations, and sustainable farming from Chakra Biotech.",
    url: `${siteUrl}/blog`,
    type: "website",
    images: [{ url: "/og.webp", width: 1200, height: 630, alt: "Chakra Biotech Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saffron Agri-Tech Blog - Chakra Biotech",
    description: "Expert insights on aeroponic cultivation and sustainable farming from Chakra Biotech.",
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

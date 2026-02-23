import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

export const metadata: Metadata = {
  title: "About Us - Agri-Tech Innovation in Saffron Cultivation",
  description:
    "Learn about Chakra Biotech LLP's mission to democratize saffron farming through aeroponic technology. Based in Jaipur, Rajasthan, we're revolutionizing indoor cultivation with controlled environment agriculture.",
  keywords: [
    "about Chakra Biotech",
    "saffron agri-tech company",
    "aeroponic farming Jaipur",
    "indoor agriculture innovation",
    "sustainable saffron production",
    "Rajasthan agri-tech",
  ],
  openGraph: {
    title: "About Chakra Biotech - Saffron Agri-Tech Innovation",
    description:
      "Revolutionizing saffron cultivation through aeroponic technology in Jaipur, Rajasthan.",
    url: `${siteUrl}/about`,
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "About Chakra Biotech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Chakra Biotech - Saffron Agri-Tech Innovation",
    description:
      "Revolutionizing saffron cultivation through aeroponic technology.",
    images: ["/og.webp"],
  },
  alternates: {
    canonical: `${siteUrl}/about`,
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

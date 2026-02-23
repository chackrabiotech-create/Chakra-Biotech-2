import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

export const metadata: Metadata = {
  title: "Premium Aeroponic Saffron Products",
  description:
    "Explore our range of premium aeroponic saffron products. 100% pure, lab-tested saffron grown using controlled environment agriculture in Jaipur. Available from 0.5g to bulk quantities.",
  keywords: [
    "buy aeroponic saffron",
    "premium saffron India",
    "pure saffron online",
    "saffron products",
    "Chakra Biotech saffron",
    "indoor grown saffron",
  ],
  openGraph: {
    title: "Premium Aeroponic Saffron Products - Chakra Biotech",
    description:
      "100% pure, lab-tested aeroponic saffron. Available from 0.5g to bulk quantities.",
    url: `${siteUrl}/products`,
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Chakra Biotech Saffron Products",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Premium Aeroponic Saffron Products",
    description: "100% pure, lab-tested aeroponic saffron.",
    images: ["/og.webp"],
  },
  alternates: {
    canonical: `${siteUrl}/products`,
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

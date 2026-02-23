import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

export const metadata: Metadata = {
  title: "Saffron for Wellness & Ayurveda",
  description:
    "Premium aeroponic saffron for wellness brands, Ayurvedic products, cosmetics, and nutraceuticals. Bulk quantities available with lab-tested quality assurance.",
  keywords: [
    "saffron for ayurveda",
    "wellness saffron supplier",
    "cosmetic grade saffron",
    "nutraceutical saffron",
    "bulk saffron India",
    "pharmaceutical saffron",
  ],
  openGraph: {
    title: "Saffron for Wellness & Ayurveda - Chakra Biotech",
    description:
      "Premium saffron for wellness, Ayurvedic, and cosmetic applications.",
    url: `${siteUrl}/pharmacy`,
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Chakra Biotech Wellness Saffron",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saffron for Wellness & Ayurveda",
    description:
      "Premium saffron for wellness and pharmaceutical applications.",
    images: ["/og.webp"],
  },
  alternates: {
    canonical: `${siteUrl}/pharmacy`,
  },
};

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

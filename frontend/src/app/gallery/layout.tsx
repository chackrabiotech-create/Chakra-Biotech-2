import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

export const metadata: Metadata = {
  title: "Gallery - Aeroponic Saffron Cultivation",
  description:
    "View our state-of-the-art aeroponic saffron cultivation facility in Jaipur. Explore images of our controlled environment agriculture setup, saffron flowers, and harvesting process.",
  keywords: [
    "saffron cultivation gallery",
    "aeroponic farming photos",
    "indoor saffron images",
    "CEA facility pictures",
    "saffron flower gallery",
    "Chakra Biotech facility",
  ],
  openGraph: {
    title: "Gallery - Aeroponic Saffron Cultivation",
    description:
      "Explore our state-of-the-art aeroponic saffron facility and cultivation process.",
    url: `${siteUrl}/gallery`,
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Chakra Biotech Gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gallery - Aeroponic Saffron Cultivation",
    description: "View our cutting-edge saffron cultivation facility.",
    images: ["/og.webp"],
  },
  alternates: {
    canonical: `${siteUrl}/gallery`,
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

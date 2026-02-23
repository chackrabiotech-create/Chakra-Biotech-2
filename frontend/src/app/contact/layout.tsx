import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

export const metadata: Metadata = {
  title: "Contact Us - Chakra Biotech LLP",
  description:
    "Get in touch with Chakra Biotech for premium aeroponic saffron, training programs, or partnership opportunities. Located in Jaipur, Rajasthan. Contact us via phone, email, or WhatsApp.",
  keywords: [
    "contact Chakra Biotech",
    "saffron supplier contact",
    "aeroponic farming inquiry",
    "Jaipur agri-tech company",
    "saffron training contact",
    "business partnership",
  ],
  openGraph: {
    title: "Contact Chakra Biotech - Get in Touch",
    description:
      "Contact us for premium saffron, training programs, or partnership opportunities.",
    url: `${siteUrl}/contact`,
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Contact Chakra Biotech",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Chakra Biotech",
    description: "Get in touch for saffron products and training programs.",
    images: ["/og.webp"],
  },
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

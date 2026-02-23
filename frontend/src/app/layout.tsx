import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Chakra Biotech LLP - Premium Aeroponic Saffron | Indoor Cultivation Technology",
    template: "%s | Chakra Biotech LLP",
  },
  description:
    "Leading Agri-Tech company specializing in precision-controlled aeroponic saffron cultivation in Jaipur, Rajasthan. Democratizing Red Gold through sustainable indoor farming technology and innovation.",
  keywords: [
    "aeroponic saffron",
    "indoor saffron cultivation",
    "Chakra Biotech",
    "saffron farming Rajasthan",
    "controlled environment agriculture",
    "premium saffron India",
    "saffron training programs",
    "sustainable agriculture",
    "agri-tech innovation",
    "Kashmir saffron alternative",
  ],
  authors: [{ name: "Chakra Biotech LLP" }],
  creator: "Chakra Biotech LLP",
  publisher: "Chakra Biotech LLP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Chakra Biotech LLP",
    title: "Chakra Biotech LLP - Premium Aeroponic Saffron",
    description:
      "Leading Agri-Tech company specializing in precision-controlled aeroponic saffron cultivation. Democratizing Red Gold through sustainable technology.",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Chakra Biotech - Premium Aeroponic Saffron",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chakra Biotech LLP - Premium Aeroponic Saffron",
    description:
      "Leading Agri-Tech company specializing in precision-controlled aeroponic saffron cultivation.",
    images: ["/og.webp"],
    creator: "@chakrabiotech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "Agriculture Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="P7xktxQvkjDDtdmf1zCxSy0S5GSGNEpVo2BejA_JdOA"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#DC2626" />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

export const metadata: Metadata = {
    title: "Home - Premium Aeroponic Saffron Cultivation",
    description: "Chakra Biotech LLP pioneers indoor aeroponic saffron cultivation in Jaipur, Rajasthan. Experience climate-independent, sustainable Red Gold production with cutting-edge controlled environment agriculture.",
    keywords: [
        "aeroponic saffron home",
        "indoor saffron farming",
        "Chakra Biotech Jaipur",
        "sustainable saffron cultivation",
        "controlled environment agriculture",
        "premium saffron India"
    ],
    openGraph: {
        title: "Chakra Biotech - Premium Aeroponic Saffron",
        description: "Pioneering indoor aeroponic saffron cultivation in Rajasthan. Climate-independent, sustainable Red Gold production.",
        url: siteUrl,
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
        title: "Chakra Biotech - Premium Aeroponic Saffron",
        description: "Pioneering indoor aeroponic saffron cultivation in Rajasthan.",
        images: ["/og.webp"],
    },
    alternates: {
        canonical: siteUrl,
    },
};

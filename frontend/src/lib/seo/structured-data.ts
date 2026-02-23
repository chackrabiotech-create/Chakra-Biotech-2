export function generateOrganizationSchema() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Chakra Biotech LLP",
        "alternateName": "Chakra Biotech",
        "url": siteUrl,
        "logo": `${siteUrl}/logo.png`,
        "description": "Leading Agri-Tech company specializing in precision-controlled aeroponic saffron cultivation in Jaipur, Rajasthan.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "302021",
            "addressCountry": "IN"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-98765-43210",
            "contactType": "customer service",
            "email": "info@chakrabiotech.com",
            "availableLanguage": ["English", "Hindi"]
        },
        "sameAs": [
            "https://www.facebook.com/chakrabiotech",
            "https://www.instagram.com/chakrabiotech",
            "https://twitter.com/chakrabiotech",
            "https://www.linkedin.com/company/chakrabiotech"
        ],
        "foundingDate": "2016",
        "founders": [
            {
                "@type": "Person",
                "name": "Ankit Sharma"
            },
            {
                "@type": "Person",
                "name": "Siddhartha Sharma"
            }
        ],
        "areaServed": {
            "@type": "Country",
            "name": "India"
        },
        "knowsAbout": [
            "Aeroponic Cultivation",
            "Saffron Farming",
            "Controlled Environment Agriculture",
            "Indoor Farming",
            "Sustainable Agriculture"
        ]
    };
}

export function generateProductSchema(product: {
    name: string;
    description: string;
    price: number;
    image: string;
    sku?: string;
    rating?: number;
    reviewCount?: number;
}) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": `${siteUrl}${product.image}`,
        "sku": product.sku || "N/A",
        "brand": {
            "@type": "Brand",
            "name": "Chakra Biotech"
        },
        "offers": {
            "@type": "Offer",
            "url": siteUrl,
            "priceCurrency": "INR",
            "price": product.price,
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Chakra Biotech LLP"
            }
        },
        ...(product.rating && product.reviewCount ? {
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": product.rating,
                "reviewCount": product.reviewCount
            }
        } : {})
    };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `${siteUrl}${item.url}`
        }))
    };
}

export function generateArticleSchema(article: {
    title: string;
    description: string;
    image: string;
    datePublished: string;
    dateModified: string;
    author: string;
}) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.description,
        "image": `${siteUrl}${article.image}`,
        "datePublished": article.datePublished,
        "dateModified": article.dateModified,
        "author": {
            "@type": "Person",
            "name": article.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Chakra Biotech LLP",
            "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
            }
        }
    };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };
}

export function generateLocalBusinessSchema() {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://chakrabiotech.com";

    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Chakra Biotech LLP",
        "image": `${siteUrl}/logo.png`,
        "description": "Premium aeroponic saffron cultivation facility in Jaipur, Rajasthan",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Jaipur",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "postalCode": "302021",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 26.9124,
            "longitude": 75.7873
        },
        "url": siteUrl,
        "telephone": "+91-98765-43210",
        "priceRange": "₹₹",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday"
                ],
                "opens": "09:00",
                "closes": "18:00"
            }
        ]
    };
}

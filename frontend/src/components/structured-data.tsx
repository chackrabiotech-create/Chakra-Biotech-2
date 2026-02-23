const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chakrabiotech.com';

export function OrganizationStructuredData() {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Chakra Biotech LLP',
        url: siteUrl,
        logo: `${siteUrl}/logo.png`,
        description:
            'Leading Agri-Tech company specializing in precision-controlled aeroponic saffron cultivation in Jaipur, Rajasthan.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Jaipur',
            addressRegion: 'Rajasthan',
            addressCountry: 'IN',
        },
        sameAs: [
            'https://www.instagram.com/chakrabiotech',
            'https://www.linkedin.com/company/chakrabiotech',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            availableLanguage: ['English', 'Hindi'],
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

export function WebsiteStructuredData() {
    const data = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Chakra Biotech LLP',
        url: siteUrl,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${siteUrl}/blog?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

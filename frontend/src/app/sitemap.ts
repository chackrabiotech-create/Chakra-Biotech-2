import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chakrabiotech.com';
const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticRoutes: MetadataRoute.Sitemap = [
        { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
        { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
        { url: `${siteUrl}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${siteUrl}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
        { url: `${siteUrl}/pharmacy`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
        { url: `${siteUrl}/training`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
        { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    ];

    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        if (apiUrl) {
            const res = await fetch(`${apiUrl}/blogs?pagination[pageSize]=100`, { next: { revalidate: 3600 } });
            if (res.ok) {
                const data = await res.json();
                blogRoutes = (data?.data || []).map((post: { slug?: string; updatedAt?: string }) => ({
                    url: `${siteUrl}/blog/${post.slug}`,
                    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.7,
                }));
            }
        }
    } catch {
        // silently skip dynamic routes if API is unavailable
    }

    return [...staticRoutes, ...blogRoutes];
}

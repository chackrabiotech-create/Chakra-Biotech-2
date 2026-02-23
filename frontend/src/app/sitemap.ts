import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://chakrabiotech.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Static routes
    const routes = [
        '',
        '/about',
        '/products',
        '/gallery',
        '/pharmacy',
        '/training',
        '/blog',
        '/contact',
    ].map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' as const : 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // You can fetch dynamic routes from your API here
    // Example for products:
    // const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`).then(res => res.json());
    // const productRoutes = products.data.products.map((product: any) => ({
    //   url: `${siteUrl}/products/${product.slug}`,
    //   lastModified: new Date(product.updatedAt),
    //   changeFrequency: 'weekly' as const,
    //   priority: 0.7,
    // }));

    return [...routes];
}

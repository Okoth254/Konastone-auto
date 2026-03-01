import { MetadataRoute } from 'next';
import { getVehicles } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://konastoneautos.com';

    // Core pages
    const routes = ['', '/inventory', '/checkout', '/account'].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Vehicle detail pages from live database
    const vehicles = await getVehicles();
    const vehicleRoutes = vehicles.map((v) => ({
        url: `${baseUrl}/vehicle/${v.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...vehicleRoutes];
}

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://konastoneautos.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/admin/*'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

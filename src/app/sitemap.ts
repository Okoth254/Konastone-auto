import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://konastoneautos.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/inventory',
    '/about',
    '/reviews',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const { data: vehicles } = await supabase.from('vehicles').select('id');

  const vehicleRoutes: MetadataRoute.Sitemap = (vehicles || []).map((vehicle) => ({
    url: `${baseUrl}/vehicle/${vehicle.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}

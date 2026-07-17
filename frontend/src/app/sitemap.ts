import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';
import { getIndustrySlugs, getServiceSlugs } from '@/lib/strapi/queries';

/**
 * Sitemap built from Strapi slugs, so adding a service/industry in the CMS surfaces it here without
 * a code change. All 20 routes: 7 fixed + 8 services + 5 industries.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, industries] = await Promise.all([getServiceSlugs(), getIndustrySlugs()]);
  const now = new Date();

  const fixed: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { path: '/', priority: 1.0, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/services', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/industries', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/sustainability', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/projects', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.6, changeFrequency: 'yearly' },
  ];

  return [
    ...fixed.map((f) => ({
      url: `${SITE_URL}${f.path}`,
      lastModified: now,
      changeFrequency: f.changeFrequency,
      priority: f.priority,
    })),
    ...services.map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...industries.map((i) => ({
      url: `${SITE_URL}/industries/${i.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}

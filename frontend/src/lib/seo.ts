import type { Metadata } from 'next';
import { mediaUrl } from './strapi/client';
import type { Seo } from './strapi/types';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** robots.txt and noindex both key off this. Anything but "true" means: do not index. */
export const ALLOW_INDEXING = process.env.ALLOW_INDEXING === 'true';

/**
 * Builds page metadata from a page's `shared.seo`, falling back to Global > Default SEO.
 *
 * Every page must use this — titles, descriptions and slugs are specified in
 * design/SEO-Content-Map.md and live in Strapi. Don't hand-roll a `metadata` export.
 */
export function buildMetadata({
  seo,
  fallback,
  path,
}: {
  seo?: Seo | null;
  fallback: Seo;
  /** Route path, e.g. "/services/drinking-water-quality". Used for the canonical. */
  path: string;
}): Metadata {
  const title = seo?.metaTitle || fallback.metaTitle;
  const description = seo?.metaDescription || fallback.metaDescription;
  const keywords = seo?.keywords || fallback.keywords;
  const canonical = seo?.canonicalPath || path;

  const ogImage = mediaUrl(seo?.ogImage?.url ?? fallback.ogImage?.url ?? null);
  const images = ogImage ? [{ url: ogImage, alt: title }] : undefined;

  // Staging must never be indexed, whatever the page says.
  const noIndex = !ALLOW_INDEXING || seo?.noIndex === true;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Forbes Water',
      type: 'website',
      locale: 'en_AU',
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

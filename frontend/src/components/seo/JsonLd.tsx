import { SITE_URL } from '@/lib/seo';

/**
 * Renders a JSON-LD block.
 *
 * Only ever describe what's actually on the page. No invented ratings, prices or reviews —
 * fabricated structured data is a manual-action risk and misrepresents the client.
 */
export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger -- JSON-LD has no other insertion point
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
    />
  );
}

export const organizationSchema = (opts: { name: string; logo?: string | null; phone?: string | null; email?: string | null }) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: opts.name,
  url: SITE_URL,
  ...(opts.logo ? { logo: opts.logo } : {}),
  areaServed: { '@type': 'Country', name: 'Australia' },
  ...(opts.phone || opts.email
    ? {
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'sales',
          ...(opts.phone ? { telephone: opts.phone } : {}),
          ...(opts.email ? { email: opts.email } : {}),
          areaServed: 'AU',
        },
      }
    : {}),
});

export const websiteSchema = (name: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#organization` },
});

export const serviceSchema = (opts: { name: string; description: string; path: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: opts.name,
  description: opts.description,
  url: `${SITE_URL}${opts.path}`,
  provider: { '@id': `${SITE_URL}/#organization` },
  areaServed: { '@type': 'Country', name: 'Australia' },
});

export const breadcrumbSchema = (crumbs: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${SITE_URL}${c.path}`,
  })),
});

export const itemListSchema = (opts: { name: string; items: { name: string }[] }) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: opts.name,
  itemListElement: opts.items.map((it, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: it.name,
  })),
});

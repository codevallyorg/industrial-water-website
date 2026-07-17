import type { MetadataRoute } from 'next';
import { ALLOW_INDEXING, SITE_URL } from '@/lib/seo';

/**
 * Three-tier robots policy — confirmed with the client, do not "simplify" it.
 *
 *   allow   search indexers            → the site is meant to rank
 *   allow   user-triggered LLM fetch    → a person asking an assistant should get a real answer
 *   block   AI *training* scrapers      → don't feed the crawl-for-training bots
 *   block   commercial SEO scrapers     → no Ahrefs/Semrush harvesting
 *
 * ALLOW_INDEXING gates the whole thing: anything but "true" ⇒ Disallow: / for everyone, so staging
 * can never be indexed by accident. This file is evaluated at build time (it reads an env var, not a
 * request), so the env must be correct at build.
 */

const SEARCH_INDEXERS = ['Googlebot', 'Bingbot', 'DuckDuckBot', 'Slurp'];

const LLM_RETRIEVAL = ['ChatGPT-User', 'OAI-SearchBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot'];

const AI_TRAINING_SCRAPERS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'CCBot',
  'Applebot-Extended',
  'Bytespider',
  'Meta-ExternalAgent',
  'Diffbot',
];

const COMMERCIAL_SCRAPERS = ['AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'DataForSeoBot', 'BLEXBot'];

export default function robots(): MetadataRoute.Robots {
  if (!ALLOW_INDEXING) {
    // Staging / preview — index nothing, from anyone.
    return { rules: [{ userAgent: '*', disallow: '/' }] };
  }

  return {
    rules: [
      { userAgent: [...SEARCH_INDEXERS, ...LLM_RETRIEVAL], allow: '/' },
      { userAgent: [...AI_TRAINING_SCRAPERS, ...COMMERCIAL_SCRAPERS], disallow: '/' },
      // Everyone else: allowed, but keep the Strapi-facing and Next internals out.
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

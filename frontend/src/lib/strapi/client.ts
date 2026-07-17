import 'server-only';

/**
 * Server-side Strapi client.
 *
 * `server-only` is load-bearing: it makes importing this from a Client Component a build error.
 * That's deliberate — this module reads STRAPI_API_TOKEN, and the token must never reach the
 * browser. Strapi's public role has zero permissions, so every read here is authenticated.
 *
 * If the browser needs Strapi data, add a route handler under app/api/ and fetch that instead.
 */

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://127.0.0.1:1337';

function requireToken(): string {
  const token = process.env.STRAPI_API_TOKEN;
  if (!token) {
    throw new Error(
      'STRAPI_API_TOKEN is not set. Generate one with `cd backend && npm run tokens` and add it to frontend/.env.local.'
    );
  }
  return token;
}

export type StrapiFetchOptions = {
  /** Cache tags, so the Strapi webhook can revalidate precisely. */
  tags?: string[];
  /** Seconds. Defaults to an hour — content is editorial and changes rarely. */
  revalidate?: number;
};

type StrapiResponse<T> = { data: T; meta?: unknown };

/**
 * GET a Strapi REST endpoint.
 *
 * `path` is everything after /api — e.g. `services?populate=...`.
 * We stay on Next's "previous" caching model (no `cacheComponents`), so `next: { tags, revalidate }`
 * is the correct way to express ISR here.
 */
export async function strapiFetch<T>(path: string, opts: StrapiFetchOptions = {}): Promise<T> {
  const { tags = [], revalidate = 3600 } = opts;
  const url = `${STRAPI_URL}/api/${path.replace(/^\//, '')}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${requireToken()}`,
      'Content-Type': 'application/json',
    },
    next: { tags, revalidate },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    // 403 here almost always means the token's scope is wrong — not that the public role needs
    // opening up. Never "fix" this by granting the public role permissions.
    throw new Error(
      `Strapi ${res.status} ${res.statusText} for ${url}${body ? ` — ${body.slice(0, 300)}` : ''}`
    );
  }

  const json = (await res.json()) as StrapiResponse<T>;
  return json.data;
}

/** Absolute URL for a Strapi media path (uploads are served relative in local dev). */
export function mediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

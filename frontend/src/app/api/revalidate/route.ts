import { revalidateTag } from 'next/cache';
import type { NextRequest } from 'next/server';

/**
 * Strapi → Next ISR webhook. Strapi fires this on entry create/update/delete; we invalidate the tag
 * for the affected content type so the next request refetches.
 *
 * Auth: a shared secret (REVALIDATE_SECRET), matched against the Strapi webhook header. Without it,
 * anyone could force cache churn.
 *
 * Maps Strapi model UIDs → the tags used in lib/strapi/queries.ts.
 */

const MODEL_TO_TAGS: Record<string, string[]> = {
  service: ['service'],
  industry: ['industry'],
  project: ['project'],
  'team-member': ['team-member'],
  global: ['global'],
  navigation: ['navigation'],
  'home-page': ['home-page'],
  'about-page': ['about-page'],
  'services-page': ['services-page'],
  'industries-page': ['industries-page'],
  'sustainability-page': ['sustainability-page'],
  'projects-page': ['projects-page'],
  'contact-page': ['contact-page'],
};

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (!secret || provided !== secret) {
    return Response.json({ revalidated: false, message: 'Unauthorized' }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const model: string | undefined = payload?.model ?? payload?.uid?.split('.').pop();

  const tags = model ? MODEL_TO_TAGS[model] : undefined;
  if (!tags) {
    return Response.json({ revalidated: false, message: `No tags mapped for model "${model}"` }, { status: 400 });
  }

  // Next 16: revalidateTag requires a second arg. `{ expire: 0 }` forces immediate expiry, which is
  // what an external webhook wants — the editor expects to see the change on the next load.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });

  return Response.json({ revalidated: true, tags, now: Date.now() });
}

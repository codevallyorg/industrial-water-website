import { getIndustryCards, getServiceCards } from '@/lib/strapi/queries';
import { SITE_URL } from '@/lib/seo';

/**
 * /llms.txt — a plain-text map of the site for LLMs, served in every environment (the brief wants
 * LLMs able to find the content even while robots policy tightens around scrapers).
 *
 * Built from Strapi so it stays in step with the real services/industries.
 */
export async function GET() {
  const [services, industries] = await Promise.all([getServiceCards(), getIndustryCards()]);

  const body = `# Forbes Water

> Independent Australian water treatment and consulting. Consulting, treatment, monitoring and
> management for industry, communities and the environment — vendor-independent advice that optimises
> water quality, cuts operating costs and keeps clients compliant.

## Services
${services.map((s) => `- [${s.title}](${SITE_URL}/services/${s.slug}): ${s.short}`).join('\n')}

## Industries
${industries.map((i) => `- [${i.title}](${SITE_URL}/industries/${i.slug}): ${i.cardDescription}`).join('\n')}

## Key pages
- [Home](${SITE_URL}/)
- [About](${SITE_URL}/about): Independent water specialists — 18+ years, 340+ sites.
- [Services](${SITE_URL}/services): Eight specialist water services.
- [Industries](${SITE_URL}/industries): Sector-specific water expertise.
- [Sustainability](${SITE_URL}/sustainability): Water stewardship with measurable payback.
- [Projects](${SITE_URL}/projects): Case studies with measured results.
- [Contact](${SITE_URL}/contact): Request a consultation — response within one business day.

## Notes
- Contact and ABN details, team bios, case studies and statistics are representative placeholders
  pending client sign-off.
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

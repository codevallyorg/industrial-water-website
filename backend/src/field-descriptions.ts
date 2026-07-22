/**
 * Helper text shown under each field in the Strapi admin's Content Manager.
 *
 * WHY THIS EXISTS: a field's `description` in schema.json is developer metadata — Strapi does NOT
 * surface it to content editors. The grey hint under a field in Content Manager comes from the
 * *content-type configuration* (metadatas.<field>.edit.description), which Strapi keeps in the DB,
 * not in a source file. This module is the source-controlled source of truth for that text.
 *
 * It is applied automatically on every server start (see bootstrap in src/index.ts), so the hints
 * are always in sync and survive a fresh database. `npm run describe` runs the same logic ad-hoc.
 *
 * Wording is client-facing: what the field is and where it appears on the live site, plain English.
 */
import type { Core } from '@strapi/strapi';

/** Collection & single types: uid → { field → helper text }. */
export const CONTENT_TYPES: Record<string, Record<string, string>> = {
  'api::service.service': {
    title: 'The service name. Shown on cards, the top nav, breadcrumbs and the browser tab.',
    slug: 'The web address for this service: /services/<slug>. Auto-filled from the title. Changing it changes the page URL and any links to it.',
    order: 'Position in lists. Lower numbers show first — in grids, the nav menu and the footer.',
    short: 'One-line summary. Shown on the small service card on the Home page.',
    blurb: 'A slightly longer summary. Shown on the service card on the Services listing page.',
    h1: 'The big headline at the very top of the service page.',
    tagline: 'The intro sentence directly beneath the headline, at the top of the page.',
    overview: 'The body text of the "Overview" section (the first block below the header).',
    media: 'The main image shown beside the "Overview" text.',
    outcomes: 'The cards in the "What you get" section — each a short title plus one line. 4 in the design; add or remove as needed.',
    steps: 'The numbered stages in the "How it works" section. 4 in the design; add or remove as needed.',
    featurePanel: 'Optional extra section: a headline + image + a list of points (e.g. the groundwater page\'s "Borehole programs" block). Leave empty on services that don\'t need it.',
    relatedIndustries: 'Industries listed under "Common in these industries" at the bottom of the page. Drag to set the order.',
    seo: 'Search-engine title & description for this page. Leave blank to use the site defaults (Global → Default SEO).',
  },
  'api::industry.industry': {
    title: 'The industry name. Shown on cards, the top nav, breadcrumbs and the browser tab.',
    slug: 'The web address for this industry: /industries/<slug>. Auto-filled from the title. Changing it changes the page URL and any links to it.',
    order: 'Position in lists. Lower numbers show first.',
    cardDescription: 'The short label under the industry name on the Home page tile.',
    h1: 'The big headline at the very top of the industry page.',
    intro: 'The intro paragraph beneath the headline.',
    media: 'The main image for this industry, shown near the top of the page.',
    challenges: 'The cards in the "Challenges we solve" section — a short title plus one line each. 3 in the design.',
    relatedServices: 'Services listed as relevant to this industry. Drag to set the order.',
    stat: 'The single highlighted statistic shown for this sector (a number plus a short label).',
    seo: 'Search-engine title & description for this page. Leave blank to use the site defaults (Global → Default SEO).',
  },
  'api::project.project': {
    title: 'The project / case-study name. Shown on the project card.',
    sector: 'The sector badge on the card (a free-text label, not linked to the Industry list).',
    description: 'The short summary shown on the project card.',
    media: 'The project image shown on the card.',
    metrics: 'The two headline results shown on the card (each a number plus a short label). Exactly 2 in the design.',
    featured: 'Turn on to also show this project in the "Recent Work" strip on the Home page (3 are shown there).',
    order: 'Position in the Projects grid. Lower numbers show first.',
  },
  'api::team-member.team-member': {
    name: 'The team member\'s full name.',
    role: 'Their job title, shown under the name.',
    bio: 'A short paragraph about them, shown on the About page.',
    portrait: 'Head-and-shoulders photo for the About page.',
    order: 'Position in the team grid. Lower numbers show first.',
  },
  'api::global.global': {
    siteName: 'The site / company name, used in the browser tab and SEO.',
    logo: 'Optional logo image. If empty, the built-in droplet + wordmark is used.',
    defaultSeo: 'Fallback search-engine title & description, used on any page whose own SEO fields are blank.',
    contact: 'Phone, email and ABN shown in the footer and on the Contact page.',
    socials: 'Social media links shown in the footer.',
    footerTagline: 'The short line of text near the top of the footer.',
    copyright: 'The copyright line at the very bottom of the footer.',
    legalLine: 'The legal line in the footer, e.g. ABN and service area.',
    ctaBand: 'The call-to-action band shown near the bottom of every page except Contact.',
  },
  'api::navigation.navigation': {
    mainItems: 'The links in the top navigation bar. Order here is the order shown.',
    ctaButton: 'The highlighted button on the right of the top nav (e.g. "Get in touch").',
    footerColumns: 'The link columns in the footer.',
  },
  'api::home-page.home-page': {
    seo: 'Search-engine title & description for the Home page. Leave blank to use the site defaults.',
    heroEyebrow: 'Small kicker text above the main headline at the top of the page.',
    heroHeading: 'The main headline at the very top of the Home page.',
    heroBody: 'The paragraph beneath the main headline.',
    heroPrimaryCta: 'The main (filled) button in the hero.',
    heroSecondaryCta: 'The secondary (outline) button in the hero.',
    heroStats: 'The row of headline stats in the hero (each a number plus a short label). 3 in the design.',
    heroMedia: 'The large image in the hero.',
    expertiseHeading: 'The heading above the "Expertise" (services) section.',
    whyHeading: 'The heading above the "Why Forbes Water" section.',
    whyMedia: 'The image in the "Why Forbes Water" section.',
    whyItems: 'The numbered points in the "Why Forbes Water" section.',
    industriesHeading: 'The heading above the industries section.',
    processHeading: 'The heading above the "How we work" process section.',
    processItems: 'The numbered steps in the process section.',
    testimonial: 'The client quote shown on the Home page.',
    testimonialStats: 'The stats shown alongside the testimonial.',
    projectsHeading: 'The heading above the "Recent Work" section.',
  },
  'api::about-page.about-page': {
    seo: 'Search-engine title & description for the About page. Leave blank to use the site defaults.',
    hero: 'The top-of-page header: kicker, headline and intro.',
    storyHeading: 'The heading above the company story section.',
    storyBody: 'The company story text (a few paragraphs).',
    storyMedia: 'The image beside the company story.',
    valuesHeading: 'The heading above the values section.',
    valuesItems: 'The value cards — a short title plus one line each.',
    teamHeading: 'The heading above the team section (the team members themselves are managed under Team Member).',
  },
  'api::services-page.services-page': {
    seo: 'Search-engine title & description for the Services listing page. Leave blank to use the site defaults.',
    hero: 'The top-of-page header: kicker, headline and intro. (The service cards come from the Service entries.)',
    engagementHeading: 'The heading above the "How we engage" section.',
    engagementItems: 'The numbered steps in the "How we engage" section.',
  },
  'api::industries-page.industries-page': {
    seo: 'Search-engine title & description for the Industries listing page. Leave blank to use the site defaults.',
    hero: 'The top-of-page header: kicker, headline and intro. (The industry cards come from the Industry entries.)',
  },
  'api::sustainability-page.sustainability-page': {
    seo: 'Search-engine title & description for the Sustainability page. Leave blank to use the site defaults.',
    hero: 'The top-of-page header: kicker, headline and intro.',
    pillarsHeading: 'The heading above the sustainability pillars section.',
    pillarsItems: 'The numbered pillars.',
    impactHeading: 'The heading above the impact stats section.',
    impactItems: 'The impact stats (each a number plus a short label).',
    impactNote: 'The small disclaimer under the impact stats (the "representative examples" note).',
    practiceHeading: 'The heading above the "in practice" section.',
    practiceItems: 'The practice cards — a short title plus one line each.',
  },
  'api::projects-page.projects-page': {
    seo: 'Search-engine title & description for the Projects page. Leave blank to use the site defaults.',
    hero: 'The top-of-page header: kicker, headline and intro. (The project cards come from the Project entries.)',
  },
  'api::contact-page.contact-page': {
    seo: 'Search-engine title & description for the Contact page. Leave blank to use the site defaults.',
    hero: 'The top-of-page header: kicker, headline and intro.',
    directContactHeading: 'The heading above the phone/email/ABN details block.',
    nextStepsHeading: 'The heading above the "what happens next" steps.',
    nextStepsItems: 'The numbered "what happens next" steps shown beside the form.',
    formNote: 'Small print shown under the form\'s submit button.',
    successHeading: 'The headline shown after the form is submitted successfully.',
    successBody: 'The message shown after a successful submission.',
    successButtonLabel: 'The button label on the success message (e.g. "Back to home").',
    industryOptions: 'The choices in the form\'s "Industry" dropdown. Mirrors the industry list plus "Other".',
  },
  'api::enquiry.enquiry': {
    name: 'Submitted by the contact form — the sender\'s name.',
    email: 'Submitted by the contact form — the sender\'s email.',
    phone: 'Submitted by the contact form — the sender\'s phone (optional).',
    industry: 'Submitted by the contact form — the industry they chose.',
    message: 'Submitted by the contact form — their message.',
    status: 'Internal triage status for this enquiry. Not shown on the website.',
  },
};

/** Reusable building blocks: component uid → { field → helper text }. */
export const COMPONENTS: Record<string, Record<string, string>> = {
  'shared.seo': {
    metaTitle: 'The page title shown in Google results and the browser tab. ~50–60 characters works best.',
    metaDescription: 'The summary shown under the title in Google results. ~150–160 characters works best.',
    keywords: 'Optional keywords. Rarely needed — modern search engines mostly ignore this.',
    ogImage: 'The image used when the page is shared on social media / messaging apps.',
    canonicalPath: 'Advanced: override the page\'s canonical URL. Leave blank — it defaults to the page\'s own route.',
    noIndex: 'Turn on to ask search engines NOT to list this page. Leave off for normal pages.',
  },
  'shared.link': {
    label: 'The clickable text shown for this link/button.',
    href: 'Where the link goes — a path like /contact or a full https:// URL.',
    variant: 'The button style: primary (filled), secondary (outline) or ghost (plain).',
    isExternal: 'Turn on for links to other websites (opens in a new tab).',
  },
  'shared.media-frame': {
    image: 'The image to show here. Leave empty to show a plain gradient placeholder.',
    label: 'Optional small caption shown over the image (uppercase). Leave blank for no caption.',
    alt: 'Describes the image for screen readers and SEO. Leave blank only if the image is purely decorative.',
  },
  'shared.page-hero': {
    eyebrow: 'Small kicker text above the headline at the top of the page.',
    heading: 'The main headline at the top of the page.',
    intro: 'The intro paragraph beneath the headline.',
    note: 'Optional small caveat under the intro (e.g. a disclaimer).',
  },
  'ui.numbered-item': {
    number: 'The number shown, exactly as typed, e.g. 01. (It is not calculated automatically.)',
    title: 'The short heading for this step.',
    description: 'One or two lines explaining this step.',
  },
  'ui.icon-item': {
    title: 'The short heading on this card. (The icon is set by the design, not here.)',
    description: 'One line of supporting text on the card.',
  },
  'ui.stat': {
    value: 'The number shown, exactly as typed, e.g. 18+, 1.2GL, -41%, 24h.',
    label: 'The short caption under the number.',
  },
  'ui.section-heading': {
    eyebrow: 'Small kicker text above the section heading.',
    heading: 'The section heading.',
    linkLabel: 'Optional link text shown to the right of the heading (e.g. "View all").',
    linkHref: 'Where that optional link goes. Fill in only if you set a link label.',
  },
  'ui.testimonial': {
    quote: 'The client quote.',
    attribution: 'Who said it — name and/or company.',
    note: 'Optional qualifier shown after the attribution (e.g. "representative feedback").',
  },
  'ui.cta-band': {
    heading: 'The headline of the call-to-action band.',
    body: 'The supporting line under the headline.',
    button: 'The button in the band.',
  },
  'ui.feature-panel': {
    eyebrow: 'Small uppercase kicker above the headline, e.g. GROUNDWATER MONITORING.',
    heading: 'The section headline, e.g. "Borehole programs with defensible field data."',
    media: 'The image shown beside the list. If left empty, a plain gradient placeholder shows.',
    points: 'The list items, shown as rows with a coloured left edge. Add, remove or drag to reorder.',
  },
  'ui.list-line': {
    text: 'The line of text shown in the list row.',
  },
  'nav.nav-item': {
    label: 'The link text shown in the top navigation bar.',
    href: 'Where the nav link goes, e.g. /services.',
    megaMenu: 'Optional: pick a collection to auto-build a dropdown of its entries. Leave as none for a plain link.',
  },
  'nav.footer-column': {
    title: 'The heading at the top of this footer column.',
    source: 'How the links are filled: services / industries auto-list from those collections; choose manual to list your own links below.',
    links: 'The links in this column (used only when source is set to manual).',
  },
  'contact.contact-details': {
    phone: 'The contact phone number shown in the footer and on the Contact page.',
    phoneNote: 'Optional note beside the phone (e.g. a placeholder marker until confirmed).',
    email: 'The contact email address.',
    emailNote: 'Optional note beside the email.',
    coverage: 'The service-area line, e.g. "Servicing all Australian states & territories".',
    abn: 'The company ABN.',
    abnNote: 'Optional note beside the ABN.',
  },
};

/**
 * Writes the helper text into the content-manager configuration for every content type and
 * component above. Merges — it only sets `metadatas.<field>.edit.description`, leaving each field's
 * layout/list settings (and any admin "Configure the view" customisation) untouched. Returns the
 * number of descriptions changed. Safe to run repeatedly; a no-op when nothing changed.
 */
export async function applyFieldDescriptions(strapi: Core.Strapi): Promise<number> {
  const store = strapi.db.query('strapi::core-store');
  let total = 0;

  const apply = async (key: string, fields: Record<string, string>) => {
    const row: any = await store.findOne({ where: { key } });
    if (!row) return; // configuration not generated yet — nothing to do
    const config = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
    config.metadatas ??= {};

    let touched = 0;
    for (const [field, description] of Object.entries(fields)) {
      if (!config.metadatas[field]) continue; // field not in this type — skip
      config.metadatas[field].edit ??= {};
      if (config.metadatas[field].edit.description !== description) {
        config.metadatas[field].edit.description = description;
        touched++;
      }
    }
    if (touched > 0) {
      await store.update({ where: { key }, data: { value: JSON.stringify(config) } });
      total += touched;
    }
  };

  for (const [uid, fields] of Object.entries(CONTENT_TYPES)) {
    await apply(`plugin_content_manager_configuration_content_types::${uid}`, fields);
  }
  for (const [uid, fields] of Object.entries(COMPONENTS)) {
    await apply(`plugin_content_manager_configuration_components::${uid}`, fields);
  }

  return total;
}

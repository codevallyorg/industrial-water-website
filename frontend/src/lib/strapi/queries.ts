import 'server-only';
import qs from 'qs';
import { strapiFetch } from './client';
import type {
  AboutPage,
  ContactPage,
  Global,
  HomePage,
  Industry,
  IndustriesPage,
  IndustryCard,
  Navigation,
  Project,
  ProjectsPage,
  Service,
  ServiceCard,
  ServicesPage,
  SustainabilityPage,
  TeamMember,
} from './types';

/**
 * One query per page. Populate is always explicit — never `populate: '*'`, which over-fetches and
 * risks pulling in fields (and content types) the page has no business reading.
 *
 * Tags let the Strapi webhook (`/api/revalidate`) invalidate precisely.
 */

const IMAGE = { fields: ['url', 'width', 'height', 'alternativeText'] } as const;
const MEDIA_FRAME = { populate: { image: IMAGE } } as const;
const SEO = { populate: { ogImage: IMAGE } } as const;
const LINK = true;

const q = (obj: unknown) => qs.stringify(obj, { encodeValuesOnly: true });

// ---- collections -------------------------------------------------------------------------------

/** Cards for the home grid, services grid, nav dropdown and footer. */
export function getServiceCards() {
  return strapiFetch<ServiceCard[]>(
    `services?${q({
      fields: ['slug', 'title', 'order', 'short', 'blurb'],
      sort: ['order:asc'],
      pagination: { pageSize: 100 },
    })}`,
    { tags: ['service'] }
  );
}

export function getIndustryCards() {
  return strapiFetch<IndustryCard[]>(
    `industries?${q({
      fields: ['slug', 'title', 'order', 'cardDescription', 'intro'],
      populate: { media: MEDIA_FRAME },
      sort: ['order:asc'],
      pagination: { pageSize: 100 },
    })}`,
    { tags: ['industry'] }
  );
}

export function getServiceSlugs() {
  return strapiFetch<{ slug: string }[]>(
    `services?${q({ fields: ['slug'], sort: ['order:asc'], pagination: { pageSize: 100 } })}`,
    { tags: ['service'] }
  );
}

export function getIndustrySlugs() {
  return strapiFetch<{ slug: string }[]>(
    `industries?${q({ fields: ['slug'], sort: ['order:asc'], pagination: { pageSize: 100 } })}`,
    { tags: ['industry'] }
  );
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const data = await strapiFetch<Service[]>(
    `services?${q({
      filters: { slug: { $eq: slug } },
      populate: {
        media: MEDIA_FRAME,
        outcomes: true,
        steps: true,
        featurePanel: { populate: { media: MEDIA_FRAME, points: true } },
        relatedIndustries: { fields: ['slug', 'title'] },
        seo: SEO,
      },
    })}`,
    { tags: ['service', `service:${slug}`] }
  );
  return data[0] ?? null;
}

export async function getIndustryBySlug(slug: string): Promise<Industry | null> {
  const data = await strapiFetch<Industry[]>(
    `industries?${q({
      filters: { slug: { $eq: slug } },
      populate: {
        media: MEDIA_FRAME,
        challenges: true,
        relatedServices: { fields: ['slug', 'title'] },
        stat: true,
        seo: SEO,
      },
    })}`,
    { tags: ['industry', `industry:${slug}`] }
  );
  return data[0] ?? null;
}

export function getProjects(opts: { featuredOnly?: boolean } = {}) {
  return strapiFetch<Project[]>(
    `projects?${q({
      ...(opts.featuredOnly ? { filters: { featured: { $eq: true } } } : {}),
      populate: { media: MEDIA_FRAME, metrics: true },
      sort: ['order:asc'],
      pagination: { pageSize: 100 },
    })}`,
    { tags: ['project'] }
  );
}

export function getTeam() {
  return strapiFetch<TeamMember[]>(
    `team-members?${q({
      populate: { portrait: IMAGE },
      sort: ['order:asc'],
      pagination: { pageSize: 100 },
    })}`,
    { tags: ['team-member'] }
  );
}

// ---- single types ------------------------------------------------------------------------------

export function getGlobal() {
  return strapiFetch<Global>(
    `global?${q({
      populate: {
        logo: IMAGE,
        defaultSeo: SEO,
        contact: true,
        socials: LINK,
        ctaBand: { populate: { button: LINK } },
      },
    })}`,
    { tags: ['global'] }
  );
}

export function getNavigation() {
  return strapiFetch<Navigation>(
    `navigation?${q({
      populate: {
        mainItems: true,
        ctaButton: LINK,
        footerColumns: { populate: { links: LINK } },
      },
    })}`,
    { tags: ['navigation'] }
  );
}

export function getHomePage() {
  return strapiFetch<HomePage>(
    `home-page?${q({
      populate: {
        seo: SEO,
        heroPrimaryCta: LINK,
        heroSecondaryCta: LINK,
        heroStats: true,
        heroMedia: MEDIA_FRAME,
        expertiseHeading: true,
        whyHeading: true,
        whyMedia: MEDIA_FRAME,
        whyItems: true,
        industriesHeading: true,
        processHeading: true,
        processItems: true,
        testimonial: true,
        testimonialStats: true,
        projectsHeading: true,
      },
    })}`,
    { tags: ['home-page'] }
  );
}

export function getAboutPage() {
  return strapiFetch<AboutPage>(
    `about-page?${q({
      populate: {
        seo: SEO,
        hero: true,
        storyMedia: MEDIA_FRAME,
        valuesHeading: true,
        valuesItems: true,
        teamHeading: true,
      },
    })}`,
    { tags: ['about-page'] }
  );
}

export function getServicesPage() {
  return strapiFetch<ServicesPage>(
    `services-page?${q({
      populate: { seo: SEO, hero: true, engagementHeading: true, engagementItems: true },
    })}`,
    { tags: ['services-page'] }
  );
}

export function getIndustriesPage() {
  return strapiFetch<IndustriesPage>(
    `industries-page?${q({ populate: { seo: SEO, hero: true } })}`,
    { tags: ['industries-page'] }
  );
}

export function getSustainabilityPage() {
  return strapiFetch<SustainabilityPage>(
    `sustainability-page?${q({
      populate: {
        seo: SEO,
        hero: true,
        pillarsHeading: true,
        pillarsItems: true,
        impactItems: true,
        practiceItems: true,
      },
    })}`,
    { tags: ['sustainability-page'] }
  );
}

export function getProjectsPage() {
  return strapiFetch<ProjectsPage>(`projects-page?${q({ populate: { seo: SEO, hero: true } })}`, {
    tags: ['projects-page'],
  });
}

export function getContactPage() {
  return strapiFetch<ContactPage>(
    `contact-page?${q({ populate: { seo: SEO, hero: true, nextStepsItems: true } })}`,
    { tags: ['contact-page'] }
  );
}

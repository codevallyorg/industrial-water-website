/**
 * Frontend view of the Strapi content model.
 *
 * Deliberately narrower than Strapi's generated types: these describe only what our queries
 * actually populate. Keeping them hand-written is what stops `populate=*` creeping back in — and
 * `enquiry` is absent on purpose. It holds personal data and is never read by the site.
 *
 * After a schema change run `/sync-types`.
 */

export type StrapiImage = {
  url: string;
  width: number;
  height: number;
  alternativeText: string | null;
};

export type MediaFrame = {
  image: StrapiImage | null;
  label: string | null;
  alt: string | null;
};

export type Seo = {
  metaTitle: string;
  metaDescription: string;
  keywords: string | null;
  ogImage: StrapiImage | null;
  canonicalPath: string | null;
  noIndex: boolean;
};

export type LinkVariant = 'primary' | 'secondary' | 'ghost';

export type Link = {
  label: string;
  href: string;
  variant: LinkVariant;
  isExternal: boolean;
};

export type PageHero = {
  eyebrow: string | null;
  heading: string;
  intro: string | null;
  note: string | null;
};

/** `{n,t,d}` in the prototype. */
export type NumberedItem = {
  number: string;
  title: string;
  description: string;
};

/** `{t,d}` in the prototype. The icon is chosen by the section in code, not stored per item. */
export type IconItem = {
  title: string;
  description: string;
};

/** `{v,d}` in the prototype. */
export type Stat = {
  value: string;
  label: string;
};

export type SectionHeading = {
  eyebrow: string | null;
  heading: string;
  linkLabel: string | null;
  linkHref: string | null;
};

export type Testimonial = {
  quote: string;
  attribution: string;
  note: string | null;
};

export type CtaBand = {
  heading: string;
  body: string | null;
  button: Link | null;
};

// ---- collections -------------------------------------------------------------------------------

/** Minimal shape for nav/footer/related lists. */
export type ServiceRef = { slug: string; title: string };
export type IndustryRef = { slug: string; title: string };

export type ServiceCard = ServiceRef & {
  order: number;
  short: string;
  blurb: string;
};

export type Service = ServiceCard & {
  h1: string;
  tagline: string;
  overview: string;
  media: MediaFrame | null;
  outcomes: IconItem[];
  steps: NumberedItem[];
  /** One-way relation, curated order. NOT the inverse of Industry.relatedServices. */
  relatedIndustries: IndustryRef[];
  seo: Seo | null;
};

export type IndustryCard = IndustryRef & {
  order: number;
  cardDescription: string;
  intro: string;
  media: MediaFrame | null;
};

export type Industry = IndustryCard & {
  h1: string;
  challenges: IconItem[];
  /** One-way relation, curated order. NOT the inverse of Service.relatedIndustries. */
  relatedServices: ServiceRef[];
  stat: Stat | null;
  seo: Seo | null;
};

export type Project = {
  title: string;
  sector: 'Mining' | 'Government' | 'Industrial' | 'Hospitality' | 'Agriculture';
  description: string;
  media: MediaFrame | null;
  metrics: Stat[];
  featured: boolean;
  order: number;
};

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  portrait: StrapiImage | null;
  order: number;
};

// ---- single types ------------------------------------------------------------------------------

export type ContactDetails = {
  phone: string | null;
  phoneNote: string | null;
  email: string | null;
  emailNote: string | null;
  coverage: string | null;
  abn: string | null;
  abnNote: string | null;
};

export type Global = {
  siteName: string;
  logo: StrapiImage | null;
  defaultSeo: Seo;
  contact: ContactDetails | null;
  socials: Link[];
  footerTagline: string | null;
  copyright: string | null;
  legalLine: string | null;
  ctaBand: CtaBand | null;
};

export type NavItem = {
  label: string;
  href: string;
  megaMenu: 'none' | 'services' | 'industries';
};

export type FooterColumn = {
  title: string;
  source: 'manual' | 'services' | 'industries';
  links: Link[];
};

export type Navigation = {
  mainItems: NavItem[];
  ctaButton: Link | null;
  footerColumns: FooterColumn[];
};

export type HomePage = {
  seo: Seo;
  heroEyebrow: string | null;
  heroHeading: string;
  heroBody: string | null;
  heroPrimaryCta: Link | null;
  heroSecondaryCta: Link | null;
  heroStats: Stat[];
  heroMedia: MediaFrame | null;
  expertiseHeading: SectionHeading | null;
  whyHeading: SectionHeading | null;
  whyMedia: MediaFrame | null;
  whyItems: NumberedItem[];
  industriesHeading: SectionHeading | null;
  processHeading: SectionHeading | null;
  processItems: NumberedItem[];
  testimonial: Testimonial | null;
  testimonialStats: Stat[];
  projectsHeading: SectionHeading | null;
};

export type AboutPage = {
  seo: Seo;
  hero: PageHero;
  storyHeading: string | null;
  storyBody: string | null;
  storyMedia: MediaFrame | null;
  valuesHeading: SectionHeading | null;
  valuesItems: IconItem[];
  teamHeading: SectionHeading | null;
};

export type ServicesPage = {
  seo: Seo;
  hero: PageHero;
  engagementHeading: SectionHeading | null;
  engagementItems: NumberedItem[];
};

export type IndustriesPage = { seo: Seo; hero: PageHero };
export type ProjectsPage = { seo: Seo; hero: PageHero };

export type SustainabilityPage = {
  seo: Seo;
  hero: PageHero;
  pillarsHeading: SectionHeading | null;
  pillarsItems: NumberedItem[];
  impactHeading: string | null;
  impactItems: Stat[];
  impactNote: string | null;
  practiceHeading: string | null;
  practiceItems: IconItem[];
};

export type ContactPage = {
  seo: Seo;
  hero: PageHero;
  directContactHeading: string | null;
  nextStepsHeading: string | null;
  nextStepsItems: NumberedItem[];
  formNote: string | null;
  successHeading: string | null;
  successBody: string | null;
  successButtonLabel: string | null;
  industryOptions: string[] | null;
};

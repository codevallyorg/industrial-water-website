import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/layout/CtaBand';
import { DetailHero } from '@/components/sections/Heroes';
import { IconCardGrid } from '@/components/sections/IconCardGrid';
import { NumberedGrid } from '@/components/sections/NumberedGrid';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { Button } from '@/components/ui/Button';
import { JsonLd, breadcrumbSchema, serviceSchema } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { getGlobal, getServiceBySlug, getServiceSlugs } from '@/lib/strapi/queries';

// Pre-render the 8 service pages at build time; unknown slugs 404 (dynamicParams stays default true,
// so a slug added in Strapi later renders on demand and is then cached).
export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [service, global] = await Promise.all([getServiceBySlug(slug), getGlobal()]);
  if (!service) return {};
  return buildMetadata({ seo: service.seo, fallback: global.defaultSeo, path: `/services/${slug}` });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [service, global] = await Promise.all([getServiceBySlug(slug), getGlobal()]);
  if (!service) notFound();

  return (
    <div className="page-enter">
      <DetailHero
        breadcrumb={{ label: 'Services', href: '/services', current: service.title }}
        heading={service.h1}
        tagline={service.tagline}
      >
        <div className="mt-8 flex flex-wrap gap-[14px]">
          <Button href="/contact" variant="primary">
            Discuss this service
          </Button>
          <Button href="/projects" variant="secondary">
            See related projects
          </Button>
        </div>
      </DetailHero>

      {/* Service detail / Overview */}
      <section className="container-site grid items-start gap-12 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-[clamp(26px,3.4vw,36px)] font-bold tracking-[-.015em]">Overview</h2>
          <p className="mt-5 text-[15.5px] leading-[1.75] text-muted">{service.overview}</p>
        </div>
        <MediaFrame data={service.media} sizes="(max-width: 1024px) 100vw, 50vw" ratio="aspect-[4/3]" />
      </section>

      {/* Service detail / Outcomes — icon = check */}
      <section className="container-site py-16">
        <h2 className="font-display text-[clamp(26px,3.4vw,36px)] font-bold tracking-[-.015em]">What you get</h2>
        <IconCardGrid items={service.outcomes} icon="check" columns={4} />
      </section>

      {/* Service detail / Process */}
      <section className="container-site py-16">
        <h2 className="font-display text-[clamp(26px,3.4vw,36px)] font-bold tracking-[-.015em]">How it works</h2>
        <NumberedGrid items={service.steps} columns={4} />
      </section>

      {/* Service detail / Related industries */}
      {service.relatedIndustries.length ? (
        <section className="container-site py-16">
          <div className="rounded-xl border border-line bg-fill-2 p-8">
            <div className="font-display text-[14px] font-semibold text-muted">Common in these industries:</div>
            <div className="mt-4 flex flex-wrap gap-3">
              {service.relatedIndustries.map((i) => (
                <Link
                  key={i.slug}
                  href={`/industries/${i.slug}`}
                  className="rounded-pill border border-line bg-fill-3 px-4 py-2 font-display text-[13px] font-semibold text-text transition-colors hover:border-accent-edge hover:text-accent"
                >
                  {i.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBand data={global.ctaBand} />

      <JsonLd schema={serviceSchema({ name: service.title, description: service.tagline, path: `/services/${slug}` })} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
          { name: service.title, path: `/services/${slug}` },
        ])}
      />
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/layout/CtaBand';
import { DetailHero } from '@/components/sections/Heroes';
import { IconCardGrid } from '@/components/sections/IconCardGrid';
import { Button } from '@/components/ui/Button';
import { JsonLd, breadcrumbSchema } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { getGlobal, getIndustryBySlug, getIndustrySlugs } from '@/lib/strapi/queries';

export async function generateStaticParams() {
  const slugs = await getIndustrySlugs();
  return slugs.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [industry, global] = await Promise.all([getIndustryBySlug(slug), getGlobal()]);
  if (!industry) return {};
  return buildMetadata({ seo: industry.seo, fallback: global.defaultSeo, path: `/industries/${slug}` });
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [industry, global] = await Promise.all([getIndustryBySlug(slug), getGlobal()]);
  if (!industry) notFound();

  return (
    <div className="page-enter">
      <DetailHero
        breadcrumb={{ label: 'Industries', href: '/industries', current: industry.title }}
        heading={industry.h1}
        tagline={industry.intro}
      >
        <div className="mt-8">
          <Button href="/contact" variant="primary">
            Talk to a sector specialist
          </Button>
        </div>
      </DetailHero>

      {/* Industry detail / Challenges — no icon in the design */}
      <section className="container-site py-16">
        <h2 className="font-display text-[clamp(26px,3.4vw,36px)] font-bold tracking-[-.015em]">Challenges we solve</h2>
        <IconCardGrid items={industry.challenges} icon="none" columns={3} />
      </section>

      {/* Industry detail / Services + stat */}
      <section className="container-site py-16">
        <div className="grid items-start gap-12 lg:grid-cols-[1.3fr_.7fr]">
          <div>
            <h2 className="font-display text-[clamp(26px,3.4vw,36px)] font-bold tracking-[-.015em]">How we help</h2>
            <div className="mt-6 flex flex-col gap-3">
              {industry.relatedServices.map((s) => (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="flex items-center justify-between rounded-lg border border-line bg-fill-2 px-5 py-4 text-text transition-colors hover:border-accent-edge hover:text-accent"
                >
                  <span className="font-display text-[16px] font-semibold">{s.title}</span>
                  <span aria-hidden="true" className="text-accent">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {industry.stat ? (
            <div className="rounded-xl border border-line bg-[linear-gradient(160deg,rgba(52,211,224,.1),rgba(255,255,255,.02))] p-8">
              <div className="font-display text-[clamp(28px,4vw,44px)] font-bold text-accent">{industry.stat.value}</div>
              <div className="mt-3 text-[14px] leading-[1.6] text-muted">{industry.stat.label}</div>
            </div>
          ) : null}
        </div>
      </section>

      <CtaBand data={global.ctaBand} />

      <JsonLd
        schema={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Industries', path: '/industries' },
          { name: industry.title, path: `/industries/${slug}` },
        ])}
      />
    </div>
  );
}

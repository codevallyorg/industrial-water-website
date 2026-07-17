import type { Metadata } from 'next';
import { CtaBand } from '@/components/layout/CtaBand';
import { PageHero } from '@/components/sections/Heroes';
import { IconCardGrid } from '@/components/sections/IconCardGrid';
import { NumberedGrid } from '@/components/sections/NumberedGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatTiles } from '@/components/ui/Stat';
import { buildMetadata } from '@/lib/seo';
import { getGlobal, getSustainabilityPage } from '@/lib/strapi/queries';

export async function generateMetadata(): Promise<Metadata> {
  const [page, global] = await Promise.all([getSustainabilityPage(), getGlobal()]);
  return buildMetadata({ seo: page.seo, fallback: global.defaultSeo, path: '/sustainability' });
}

export default async function SustainabilityPageRoute() {
  const [page, global] = await Promise.all([getSustainabilityPage(), getGlobal()]);

  return (
    <div className="page-enter">
      <PageHero data={page.hero} />

      {/* Sustainability / Pillars */}
      {page.pillarsHeading ? (
        <section className="container-site py-16">
          <SectionHeading data={page.pillarsHeading} />
          <NumberedGrid items={page.pillarsItems} columns={4} />
        </section>
      ) : null}

      {/* Sustainability / Impact */}
      {page.impactItems?.length ? (
        <section className="container-site py-16">
          {page.impactHeading ? (
            <h2 className="font-display text-[clamp(26px,3.4vw,36px)] font-bold tracking-[-.015em]">
              {page.impactHeading}
            </h2>
          ) : null}
          <div className="mt-8">
            <StatTiles stats={page.impactItems} columns={4} />
          </div>
          {page.impactNote ? <p className="mt-5 text-[13.5px] leading-[1.55] text-dim">{page.impactNote}</p> : null}
        </section>
      ) : null}

      {/* Sustainability / In practice — icon = droplet */}
      {page.practiceItems?.length ? (
        <section className="container-site py-16">
          {page.practiceHeading ? (
            <h2 className="font-display text-[clamp(26px,3.4vw,36px)] font-bold tracking-[-.015em]">
              {page.practiceHeading}
            </h2>
          ) : null}
          <IconCardGrid items={page.practiceItems} icon="droplet" columns={3} />
        </section>
      ) : null}

      <CtaBand data={global.ctaBand} />
    </div>
  );
}

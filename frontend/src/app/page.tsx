import type { Metadata } from 'next';
import { CtaBand } from '@/components/layout/CtaBand';
import { HomeHero } from '@/components/sections/Heroes';
import { IndustryTileGrid, ProjectMiniGrid, ServiceMiniGrid } from '@/components/sections/Cards';
import { NumberedGrid, NumberedList } from '@/components/sections/NumberedGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { StatTiles } from '@/components/ui/Stat';
import { QuoteMarks } from '@/components/icons';
import { buildMetadata } from '@/lib/seo';
import { getGlobal, getHomePage, getIndustryCards, getProjects, getServiceCards } from '@/lib/strapi/queries';

export async function generateMetadata(): Promise<Metadata> {
  const [page, global] = await Promise.all([getHomePage(), getGlobal()]);
  return buildMetadata({ seo: page.seo, fallback: global.defaultSeo, path: '/' });
}

export default async function HomePageRoute() {
  const [page, global, services, industries, projects] = await Promise.all([
    getHomePage(),
    getGlobal(),
    getServiceCards(),
    getIndustryCards(),
    getProjects({ featuredOnly: true }),
  ]);

  return (
    <div className="page-enter">
      <HomeHero data={page} />

      {/* Home / Expertise */}
      {page.expertiseHeading ? (
        <section className="container-site py-16">
          <SectionHeading data={page.expertiseHeading} />
          <ServiceMiniGrid services={services} />
        </section>
      ) : null}

      {/* Home / Why */}
      {page.whyHeading ? (
        <section className="container-site grid items-center gap-12 py-16 lg:grid-cols-2">
          <MediaFrame data={page.whyMedia} sizes="(max-width: 1024px) 100vw, 50vw" ratio="aspect-[4/3]" />
          <div>
            <div className="mb-8">
              <SectionHeading data={page.whyHeading} />
            </div>
            <NumberedList items={page.whyItems} />
          </div>
        </section>
      ) : null}

      {/* Home / Industries */}
      {page.industriesHeading ? (
        <section className="container-site py-16">
          <SectionHeading data={page.industriesHeading} />
          <IndustryTileGrid industries={industries} />
        </section>
      ) : null}

      {/* Home / Process */}
      {page.processHeading ? (
        <section className="container-site py-16">
          <SectionHeading data={page.processHeading} />
          <NumberedGrid items={page.processItems} columns={4} />
        </section>
      ) : null}

      {/* Home / Testimonial */}
      {page.testimonial ? (
        <section className="container-site py-16">
          <figure className="grid items-center gap-12 rounded-xl border border-line bg-fill-2 p-8 lg:grid-cols-[1.1fr_.9fr] lg:p-12">
            <div>
              <span className="text-accent-edge">
                <QuoteMarks />
              </span>
              <blockquote className="mt-[18px] font-display text-[clamp(20px,2.2vw,26px)]/[1.45] font-medium text-text-soft">
                {page.testimonial.quote}
              </blockquote>
              <figcaption className="mt-6 font-display text-[14px] font-semibold text-muted">
                {page.testimonial.attribution}{' '}
                {page.testimonial.note ? (
                  <span className="font-normal text-dim">{page.testimonial.note}</span>
                ) : null}
              </figcaption>
            </div>
            <StatTiles stats={page.testimonialStats} columns={2} />
          </figure>
        </section>
      ) : null}

      {/* Home / Projects preview — the design shows the first 3 */}
      {page.projectsHeading ? (
        <section className="container-site py-16">
          <SectionHeading data={page.projectsHeading} />
          <ProjectMiniGrid projects={projects.slice(0, 3)} />
        </section>
      ) : null}

      <CtaBand data={global.ctaBand} />
    </div>
  );
}

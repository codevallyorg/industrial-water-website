import type { Metadata } from 'next';
import { CtaBand } from '@/components/layout/CtaBand';
import { PageHero } from '@/components/sections/Heroes';
import { IconCardGrid } from '@/components/sections/IconCardGrid';
import { TeamGrid } from '@/components/sections/Cards';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { buildMetadata } from '@/lib/seo';
import { getAboutPage, getGlobal, getTeam } from '@/lib/strapi/queries';

export async function generateMetadata(): Promise<Metadata> {
  const [page, global] = await Promise.all([getAboutPage(), getGlobal()]);
  return buildMetadata({ seo: page.seo, fallback: global.defaultSeo, path: '/about' });
}

export default async function AboutPageRoute() {
  const [page, global, team] = await Promise.all([getAboutPage(), getGlobal(), getTeam()]);

  return (
    <div className="page-enter">
      <PageHero data={page.hero} />

      {/* About / Story */}
      {page.storyHeading ? (
        <section className="container-site grid items-center gap-12 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-[clamp(26px,3.4vw,36px)] font-bold tracking-[-.015em]">
              {page.storyHeading}
            </h2>
            {page.storyBody ? (
              <div
                className="mt-5 space-y-4 text-[15.5px] leading-[1.75] text-muted [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: page.storyBody }}
              />
            ) : null}
          </div>
          <MediaFrame data={page.storyMedia} sizes="(max-width: 1024px) 100vw, 50vw" ratio="aspect-[4/3]" />
        </section>
      ) : null}

      {/* About / Values — icon = droplet */}
      {page.valuesHeading ? (
        <section className="container-site py-16">
          <SectionHeading data={page.valuesHeading} />
          <IconCardGrid items={page.valuesItems} icon="droplet" columns={4} />
        </section>
      ) : null}

      {/* About / Team */}
      {page.teamHeading ? (
        <section className="container-site py-16">
          <SectionHeading data={page.teamHeading} />
          <TeamGrid team={team} />
        </section>
      ) : null}

      <CtaBand data={global.ctaBand} />
    </div>
  );
}

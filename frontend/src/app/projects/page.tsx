import type { Metadata } from 'next';
import { CtaBand } from '@/components/layout/CtaBand';
import { PageHero } from '@/components/sections/Heroes';
import { ProjectGrid } from '@/components/sections/Cards';
import { JsonLd, itemListSchema } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { getGlobal, getProjects, getProjectsPage } from '@/lib/strapi/queries';

export async function generateMetadata(): Promise<Metadata> {
  const [page, global] = await Promise.all([getProjectsPage(), getGlobal()]);
  return buildMetadata({ seo: page.seo, fallback: global.defaultSeo, path: '/projects' });
}

export default async function ProjectsPageRoute() {
  const [page, global, projects] = await Promise.all([getProjectsPage(), getGlobal(), getProjects()]);

  return (
    <div className="page-enter">
      <PageHero data={page.hero} />

      <section className="container-site py-16">
        <ProjectGrid projects={projects} />
      </section>

      <CtaBand data={global.ctaBand} />

      <JsonLd schema={itemListSchema({ name: 'Projects & case studies', items: projects.map((p) => ({ name: p.title })) })} />
    </div>
  );
}

import type { Metadata } from 'next';
import { CtaBand } from '@/components/layout/CtaBand';
import { PageHero } from '@/components/sections/Heroes';
import { IndustryCardGrid } from '@/components/sections/Cards';
import { JsonLd, itemListSchema } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { getGlobal, getIndustriesPage, getIndustryCards } from '@/lib/strapi/queries';

export async function generateMetadata(): Promise<Metadata> {
  const [page, global] = await Promise.all([getIndustriesPage(), getGlobal()]);
  return buildMetadata({ seo: page.seo, fallback: global.defaultSeo, path: '/industries' });
}

export default async function IndustriesPageRoute() {
  const [page, global, industries] = await Promise.all([
    getIndustriesPage(),
    getGlobal(),
    getIndustryCards(),
  ]);

  return (
    <div className="page-enter">
      <PageHero data={page.hero} />

      <section className="container-site py-16">
        <IndustryCardGrid industries={industries} />
      </section>

      <CtaBand data={global.ctaBand} />

      <JsonLd schema={itemListSchema({ name: 'Industries served', items: industries.map((i) => ({ name: i.title })) })} />
    </div>
  );
}

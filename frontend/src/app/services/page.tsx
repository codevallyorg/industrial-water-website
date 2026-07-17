import type { Metadata } from 'next';
import { CtaBand } from '@/components/layout/CtaBand';
import { PageHero } from '@/components/sections/Heroes';
import { ServiceGrid } from '@/components/sections/Cards';
import { NumberedGrid } from '@/components/sections/NumberedGrid';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { JsonLd, itemListSchema } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo';
import { getGlobal, getServiceCards, getServicesPage } from '@/lib/strapi/queries';

export async function generateMetadata(): Promise<Metadata> {
  const [page, global] = await Promise.all([getServicesPage(), getGlobal()]);
  return buildMetadata({ seo: page.seo, fallback: global.defaultSeo, path: '/services' });
}

export default async function ServicesPageRoute() {
  const [page, global, services] = await Promise.all([getServicesPage(), getGlobal(), getServiceCards()]);

  return (
    <div className="page-enter">
      <PageHero data={page.hero} />

      <section className="container-site py-16">
        <ServiceGrid services={services} />
      </section>

      {page.engagementHeading ? (
        <section className="container-site py-16">
          <SectionHeading data={page.engagementHeading} />
          <NumberedGrid items={page.engagementItems} columns={3} />
        </section>
      ) : null}

      <CtaBand data={global.ctaBand} />

      <JsonLd schema={itemListSchema({ name: 'Water services', items: services.map((s) => ({ name: s.title })) })} />
    </div>
  );
}

import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/Heroes';
import { ContactForm } from '@/components/forms/ContactForm';
import { buildMetadata } from '@/lib/seo';
import { getContactPage, getGlobal } from '@/lib/strapi/queries';

export async function generateMetadata(): Promise<Metadata> {
  const [page, global] = await Promise.all([getContactPage(), getGlobal()]);
  return buildMetadata({ seo: page.seo, fallback: global.defaultSeo, path: '/contact' });
}

export default async function ContactPageRoute() {
  const [page, global] = await Promise.all([getContactPage(), getGlobal()]);
  const contact = global.contact;

  return (
    <div className="page-enter">
      <PageHero data={page.hero} />

      <section className="container-site grid gap-12 py-16 lg:grid-cols-[1.2fr_.8fr]">
        <ContactForm page={page} />

        <div className="flex flex-col gap-8">
          {/* Direct contact */}
          {contact ? (
            <div className="rounded-xl border border-line bg-fill-2 p-6">
              <div className="font-display text-[13px] font-bold uppercase tracking-[.12em] text-accent">
                {page.directContactHeading ?? 'Direct contact'}
              </div>
              <div className="mt-4 flex flex-col gap-3 text-[14px] text-muted">
                {contact.phone ? (
                  <div>
                    <span aria-hidden="true" className="mr-2 text-accent">
                      ☎
                    </span>
                    {contact.phone}{' '}
                    {contact.phoneNote ? <span className="text-dim">{contact.phoneNote}</span> : null}
                  </div>
                ) : null}
                {contact.email ? (
                  <div>
                    <span aria-hidden="true" className="mr-2 text-accent">
                      ✉
                    </span>
                    <a href={`mailto:${contact.email}`} className="hover:text-accent">
                      {contact.email}
                    </a>{' '}
                    {contact.emailNote ? <span className="text-dim">{contact.emailNote}</span> : null}
                  </div>
                ) : null}
                {contact.coverage ? (
                  <div>
                    <span aria-hidden="true" className="mr-2 text-accent">
                      ◎
                    </span>
                    {contact.coverage}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {/* What happens next */}
          {page.nextStepsItems?.length ? (
            <div className="rounded-xl border border-line bg-fill-2 p-6">
              <div className="font-display text-[13px] font-bold uppercase tracking-[.12em] text-accent">
                {page.nextStepsHeading ?? 'What happens next'}
              </div>
              <div className="mt-4 flex flex-col gap-4">
                {page.nextStepsItems.map((step, i) => (
                  <div key={i} className="flex gap-3 text-[14px] leading-[1.55] text-muted">
                    <span className="font-mono text-[12px] font-medium text-accent">{step.number}</span>
                    <span>{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

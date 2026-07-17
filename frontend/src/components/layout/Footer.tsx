import Link from 'next/link';
import { Droplet } from '@/components/icons';
import type { Global, IndustryRef, Navigation, ServiceRef } from '@/lib/strapi/types';

/**
 * Site footer. Server Component — no state.
 *
 * The Services and Industries columns are marked `source: 'services' | 'industries'` in Strapi and
 * populate from those collections, so adding a service can't leave the footer stale. Only the
 * "Company" column is hand-listed.
 */
export function Footer({
  global,
  nav,
  services,
  industries,
}: {
  global: Global;
  nav: Navigation;
  services: ServiceRef[];
  industries: IndustryRef[];
}) {
  const linksFor = (col: Navigation['footerColumns'][number]) => {
    if (col.source === 'services') return services.map((s) => ({ label: s.title, href: `/services/${s.slug}` }));
    if (col.source === 'industries') return industries.map((i) => ({ label: i.title, href: `/industries/${i.slug}` }));
    return col.links.map((l) => ({ label: l.label, href: l.href }));
  };

  return (
    <footer className="mt-auto border-t border-line-soft bg-ink">
      <div className="container-site py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-[11px]">
              <span className="text-accent">
                <Droplet width={22} height={26} />
              </span>
              <span className="font-display text-[18px] font-bold tracking-[-.01em]">
                Forbes<span className="text-accent">Water</span>
              </span>
            </div>
            {global.footerTagline ? (
              <p className="mt-4 max-w-[38ch] text-[14px] leading-[1.65] text-muted">{global.footerTagline}</p>
            ) : null}
          </div>

          {nav.footerColumns.map((col) => (
            <div key={col.title}>
              <div className="font-display text-[13px] font-bold uppercase tracking-[.12em] text-text">{col.title}</div>
              <div className="mt-4 flex flex-col gap-[10px]">
                {linksFor(col).map((l) => (
                  <Link key={l.href} href={l.href} className="text-[14px] text-muted hover:text-accent">
                    {l.label}
                  </Link>
                ))}
              </div>

              {/* the design hangs the phone/email off the Company column */}
              {col.source === 'manual' && global.contact ? (
                <div className="mt-5 text-[13px] leading-[1.7] text-dim">
                  {global.contact.phone ? <div>{global.contact.phone}</div> : null}
                  {global.contact.email ? (
                    <a href={`mailto:${global.contact.email}`} className="hover:text-accent">
                      {global.contact.email}
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {global.socials?.length ? (
          <div className="mt-10 flex gap-4">
            {global.socials.map((s) => (
              <a
                key={s.href}
                href={s.href}
                className="text-[13px] text-muted hover:text-accent"
                {...(s.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {s.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line-soft pt-6 text-[12.5px] text-dim">
          {global.copyright ? <div>{global.copyright}</div> : null}
          {global.legalLine ? <div>{global.legalLine}</div> : null}
        </div>
      </div>
    </footer>
  );
}

import Link from 'next/link';
import { mediaUrl } from '@/lib/strapi/client';
import { DropletOutline } from '@/components/icons';
import type { IndustryCard, Project, ServiceCard, TeamMember } from '@/lib/strapi/types';

/**
 * Card grids for the three collections. Each has two variants because the design shows them
 * differently on Home vs their own overview page — same data, different density.
 */

const cardBase =
  'block rounded-lg border border-line bg-fill-2 transition-[border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-accent-edge';

/** Home "Our Expertise" — compact: outline droplet, title, one-liner. */
export function ServiceMiniGrid({ services }: { services: ServiceCard[] }) {
  return (
    <div className="mt-8 grid gap-[14px] sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s) => (
        <Link key={s.slug} href={`/services/${s.slug}`} className={`${cardBase} px-5 py-[22px] text-text`}>
          <span className="text-accent">
            <DropletOutline />
          </span>
          <div className="mt-3 font-display text-[16px] font-semibold">{s.title}</div>
          <div className="mt-2 text-[13.5px] leading-[1.55] text-muted">{s.short}</div>
        </Link>
      ))}
    </div>
  );
}

/** /services grid — roomier, with the longer blurb and an "Explore →" affordance. */
export function ServiceGrid({ services }: { services: ServiceCard[] }) {
  return (
    <div className="grid gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <Link key={s.slug} href={`/services/${s.slug}`} className={`${cardBase} p-6 text-text`}>
          <div className="flex items-center justify-between">
            <span className="text-accent">
              <DropletOutline />
            </span>
            <span className="font-display text-[13px] font-semibold text-accent">Explore →</span>
          </div>
          <div className="mt-4 font-display text-[17px] font-semibold">{s.title}</div>
          <div className="mt-2 text-[14px] leading-[1.65] text-muted">{s.blurb}</div>
        </Link>
      ))}
    </div>
  );
}

/** Home industries strip — photo tile with the label overlaid. */
export function IndustryTileGrid({ industries }: { industries: IndustryCard[] }) {
  return (
    <div className="mt-8 grid gap-[14px] sm:grid-cols-2 lg:grid-cols-5">
      {industries.map((i) => {
        const img = mediaUrl(i.media?.image?.url);
        return (
          <Link
            key={i.slug}
            href={`/industries/${i.slug}`}
            className="relative block h-[180px] overflow-hidden rounded-lg border border-line text-text transition-[border-color,transform] duration-200 hover:-translate-y-[3px] hover:border-accent-edge"
            style={{
              backgroundImage: `linear-gradient(180deg,rgba(15,42,52,.55),rgba(10,26,36,.92))${img ? `,url('${img}')` : ''}`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-x-5 bottom-[18px]">
              <div className="font-display text-[19px] font-bold">{i.title}</div>
              <div className="mt-1 text-[13px] text-muted">{i.cardDescription}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/** /industries list — photo header plus the full intro. */
export function IndustryCardGrid({ industries }: { industries: IndustryCard[] }) {
  return (
    <div className="grid gap-[14px] md:grid-cols-2">
      {industries.map((i) => {
        const img = mediaUrl(i.media?.image?.url);
        return (
          <Link key={i.slug} href={`/industries/${i.slug}`} className={`${cardBase} overflow-hidden text-text`}>
            <div
              className="relative h-[190px]"
              style={{
                backgroundImage: `linear-gradient(160deg,rgba(15,42,52,.5),rgba(10,26,36,.8))${img ? `,url('${img}')` : ''}`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {i.media?.label ? (
                <div className="absolute bottom-3 left-4 font-mono text-[10.5px] font-medium uppercase tracking-[.14em] text-[rgba(232,242,244,.55)]">
                  {i.media.label}
                </div>
              ) : null}
            </div>
            <div className="p-6">
              <div className="font-display text-[19px] font-bold">{i.title}</div>
              <div className="mt-2 text-[14px] leading-[1.65] text-muted">{i.intro}</div>
              <div className="mt-4 font-display text-[13px] font-semibold text-accent">Explore {i.title} →</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/** Home "Recent Work" — sector badge, title, one headline metric. Links to /projects (no detail page). */
export function ProjectMiniGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="mt-8 grid gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, idx) => {
        const img = mediaUrl(p.media?.image?.url);
        const m = p.metrics?.[0];
        return (
          <Link key={idx} href="/projects" className={`${cardBase} overflow-hidden text-text`}>
            <div
              className="relative h-[160px]"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(15,42,52,.45),rgba(10,26,36,.8))${img ? `,url('${img}')` : ''}`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <SectorBadge sector={p.sector} />
            </div>
            <div className="p-5">
              <div className="font-display text-[17px] font-semibold leading-[1.3]">{p.title}</div>
              {m ? (
                <div className="mt-3 font-display text-[18px] font-bold text-accent">
                  {m.value} <span className="font-sans text-[12px] font-normal text-dim">{m.label}</span>
                </div>
              ) : null}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

/** /projects grid — full description and both metrics. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid gap-[14px] md:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, idx) => {
        const img = mediaUrl(p.media?.image?.url);
        return (
          <article key={idx} className="overflow-hidden rounded-lg border border-line bg-fill-2">
            <div
              className="relative h-[170px]"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(15,42,52,.45),rgba(10,26,36,.8))${img ? `,url('${img}')` : ''}`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <SectorBadge sector={p.sector} />
              {p.media?.label ? (
                <div className="absolute bottom-3 left-4 font-mono text-[10.5px] font-medium uppercase tracking-[.14em] text-[rgba(232,242,244,.55)]">
                  {p.media.label}
                </div>
              ) : null}
            </div>
            <div className="p-5">
              <h3 className="font-display text-[17px] font-semibold leading-[1.3]">{p.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.6] text-muted">{p.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line-soft pt-4">
                {p.metrics.map((m, i) => (
                  <div key={i}>
                    <div className="font-display text-[18px] font-bold text-accent">{m.value}</div>
                    <div className="mt-[2px] text-[12px] text-dim">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function SectorBadge({ sector }: { sector: string }) {
  return (
    <div className="absolute left-[14px] top-[14px] rounded-pill bg-accent px-[10px] py-[5px] font-display text-[11px] font-semibold uppercase tracking-[.1em] text-on-accent">
      {sector}
    </div>
  );
}

/** About leadership grid. Portraits are placeholders pending client sign-off. */
export function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <div className="mt-8 grid gap-[14px] sm:grid-cols-2 lg:grid-cols-3">
      {team.map((m, i) => {
        const img = mediaUrl(m.portrait?.url);
        return (
          <div key={i} className="overflow-hidden rounded-lg border border-line bg-fill-2">
            <div
              className="relative flex h-[220px] items-center justify-center bg-[linear-gradient(160deg,#0f2a34,#0a1a24)]"
              style={img ? { backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
            >
              {!img ? (
                <span className="font-mono text-[11px] uppercase tracking-[.14em] text-dim">[ portrait photo ]</span>
              ) : null}
            </div>
            <div className="p-5">
              <div className="font-display text-[17px] font-semibold">{m.name}</div>
              <div className="mt-1 font-display text-[13px] font-semibold text-accent">{m.role}</div>
              <p className="mt-3 text-[14px] leading-[1.65] text-muted">{m.bio}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { MediaFrame } from '@/components/ui/MediaFrame';
import { StatRow } from '@/components/ui/Stat';
import { Droplet } from '@/components/icons';
import type { HomePage, PageHero as PageHeroData } from '@/lib/strapi/types';

/**
 * Three hero variants, exactly as the design has them:
 *   HomeHero   — two-column, stats, dual CTA, media panel
 *   PageHero   — eyebrow + H1 + intro (about/services/industries/sustainability/projects/contact)
 *   DetailHero — PageHero plus a breadcrumb (service & industry detail)
 */

export function HomeHero({ data }: { data: HomePage }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_90%_0%,rgba(52,211,224,.14),transparent_55%)]"
      />
      <div className="container-site relative grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_.9fr] lg:py-24">
        <div>
          {data.heroEyebrow ? <Eyebrow>{data.heroEyebrow}</Eyebrow> : null}
          <h1 className="mb-[18px] mt-4 max-w-[22ch] font-display text-[clamp(34px,4.4vw,50px)]/[1.08] font-bold tracking-[-.02em]">
            {data.heroHeading}
          </h1>
          {data.heroBody ? (
            <p className="max-w-[58ch] text-[17px]/[1.7] text-muted">{data.heroBody}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-[14px]">
            {data.heroPrimaryCta ? (
              <Button href={data.heroPrimaryCta.href} variant="primary">
                {data.heroPrimaryCta.label}
              </Button>
            ) : null}
            {data.heroSecondaryCta ? (
              <Button href={data.heroSecondaryCta.href} variant="secondary">
                {data.heroSecondaryCta.label}
              </Button>
            ) : null}
          </div>

          <StatRow stats={data.heroStats} />
        </div>

        <div className="relative">
          <MediaFrame
            data={data.heroMedia}
            sizes="(max-width: 1024px) 100vw, 45vw"
            preload
            ratio="aspect-[4/3.4]"
          />
          {/* the design floats the droplet mark over the hero panel */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-accent opacity-90">
              <Droplet width={54} height={66} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageHero({ data }: { data: PageHeroData }) {
  return (
    <section className="relative overflow-hidden border-b border-line-soft">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_90%_0%,rgba(52,211,224,.14),transparent_55%)]"
      />
      <div className="container-site relative py-16 lg:py-20">
        {data.eyebrow ? <Eyebrow>{data.eyebrow}</Eyebrow> : null}
        <h1 className="mb-[18px] mt-4 max-w-[24ch] font-display text-[clamp(34px,4.4vw,50px)]/[1.08] font-bold tracking-[-.02em]">
          {data.heading}
        </h1>
        {data.intro ? <p className="max-w-[72ch] text-[17px]/[1.7] text-muted">{data.intro}</p> : null}
        {data.note ? <p className="mt-4 max-w-[72ch] text-[13.5px]/[1.55] text-dim">{data.note}</p> : null}
      </div>
    </section>
  );
}

export function DetailHero({
  breadcrumb,
  heading,
  tagline,
  children,
}: {
  breadcrumb: { label: string; href: string; current: string };
  heading: string;
  tagline?: string | null;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line-soft">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_90%_0%,rgba(52,211,224,.14),transparent_55%)]"
      />
      <div className="container-site relative py-16 lg:py-20">
        <nav aria-label="Breadcrumb" className="font-display text-[13px] font-semibold">
          <ol className="flex items-center gap-2">
            <li>
              <Link href={breadcrumb.href} className="text-accent hover:text-accent-link">
                {breadcrumb.label}
              </Link>
            </li>
            <li aria-hidden="true" className="text-dim">
              /
            </li>
            <li className="text-muted" aria-current="page">
              {breadcrumb.current}
            </li>
          </ol>
        </nav>

        <h1 className="mb-[18px] mt-4 max-w-[24ch] font-display text-[clamp(34px,4.4vw,50px)]/[1.08] font-bold tracking-[-.02em]">
          {heading}
        </h1>
        {tagline ? <p className="max-w-[72ch] text-[17px]/[1.7] text-muted">{tagline}</p> : null}
        {children}
      </div>
    </section>
  );
}

import Link from 'next/link';
import type { SectionHeading as SectionHeadingData } from '@/lib/strapi/types';

/**
 * Eyebrow + H2, with the optional right-aligned link the design uses on Home.
 *
 * From the prototype:
 *   eyebrow  font:600 12px 'Space Grotesk'; letter-spacing:.14em; uppercase; color:#34d3e0
 *   h2       font:700 clamp(26px,3.4vw,36px) 'Space Grotesk'; letter-spacing:-.015em
 */

export function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`font-display text-[12px] font-semibold uppercase tracking-[.14em] text-accent ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  data,
  as: Heading = 'h2',
  className = '',
}: {
  data: SectionHeadingData;
  as?: 'h2' | 'h3';
  className?: string;
}) {
  const hasLink = Boolean(data.linkLabel && data.linkHref);

  return (
    <div className={`flex flex-wrap items-end justify-between gap-4 ${className}`.trim()}>
      <div>
        {data.eyebrow ? <Eyebrow>{data.eyebrow}</Eyebrow> : null}
        <Heading className="mt-[10px] font-display text-[clamp(26px,3.4vw,36px)] font-bold tracking-[-.015em]">
          {data.heading}
        </Heading>
      </div>
      {hasLink ? (
        <Link href={data.linkHref!} className="font-display text-[14px] font-semibold text-accent hover:text-accent-link">
          {data.linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

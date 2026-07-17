import type { Stat } from '@/lib/strapi/types';

/**
 * The `{value,label}` shape — hero stats, testimonial stats, sustainability impact, industry stat.
 * One of the three shapes that cover nearly every grid in the design.
 */

type Size = 'hero' | 'tile' | 'large';

const valueSize: Record<Size, string> = {
  hero: 'text-[30px]',
  tile: 'text-[26px]',
  large: 'text-[clamp(28px,4vw,44px)]',
};

export function StatBlock({ stat, size = 'hero' }: { stat: Stat; size?: Size }) {
  return (
    <div>
      <div className={`font-display font-bold text-accent ${valueSize[size]}`}>{stat.value}</div>
      <div className="mt-1 text-[13px] text-dim">{stat.label}</div>
    </div>
  );
}

/** Inline row of stats — the home hero uses `display:flex; gap:40px`. */
export function StatRow({ stats }: { stats: Stat[] }) {
  if (!stats?.length) return null;
  return (
    <div className="mt-11 flex flex-wrap gap-10">
      {stats.map((s, i) => (
        <StatBlock key={i} stat={s} size="hero" />
      ))}
    </div>
  );
}

/** Boxed stat tiles — home testimonial (2×2) and sustainability impact. */
export function StatTiles({ stats, columns = 2 }: { stats: Stat[]; columns?: 2 | 4 }) {
  if (!stats?.length) return null;
  return (
    <div className={`grid gap-[14px] ${columns === 2 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-4'}`}>
      {stats.map((s, i) => (
        <div key={i} className="rounded-lg border border-line bg-fill-2 p-5">
          <div className="font-display text-[26px] font-bold text-accent">{s.value}</div>
          <div className="mt-1 text-[13px] text-muted">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

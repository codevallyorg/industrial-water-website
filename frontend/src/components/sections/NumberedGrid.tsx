import type { NumberedItem } from '@/lib/strapi/types';

/**
 * The `{number,title,description}` shape — one of the three that cover nearly every grid.
 *
 * Used by: home "why" (list layout), home process, services engagement, sustainability pillars,
 * service detail steps (all card layout). Don't write a fourth bespoke numbered grid.
 */

/** Card layout: big accent ordinal, title, description — process / engagement / pillars / steps. */
export function NumberedGrid({ items, columns = 4 }: { items: NumberedItem[]; columns?: 3 | 4 }) {
  if (!items?.length) return null;
  return (
    <div
      className={`mt-8 grid gap-[14px] sm:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}
    >
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-line bg-fill-2 p-6">
          <div className="font-mono text-[13px] font-medium tracking-[.1em] text-accent">{item.number}</div>
          <div className="mt-3 font-display text-[18px] font-semibold">{item.title}</div>
          {item.description ? (
            <div className="mt-2 text-[14px] leading-[1.65] text-muted">{item.description}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/** List layout: pill ordinal beside the text — the home "Why Forbes Water" section. */
export function NumberedList({ items }: { items: NumberedItem[] }) {
  if (!items?.length) return null;
  return (
    <div className="flex flex-col gap-[18px]">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-[14px]">
          <span className="mt-[2px] flex h-7 w-7 shrink-0 items-center justify-center rounded-pill bg-accent-veil font-mono text-[11px] font-medium text-accent">
            {item.number}
          </span>
          <div>
            <div className="font-display text-[16px] font-semibold">{item.title}</div>
            {item.description ? (
              <div className="mt-1 text-[14px] leading-[1.65] text-muted">{item.description}</div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

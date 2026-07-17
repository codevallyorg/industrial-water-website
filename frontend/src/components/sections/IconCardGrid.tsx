import type { IconItem } from '@/lib/strapi/types';
import { Check, DropletOutline } from '@/components/icons';

/**
 * The `{title,description}` shape — one of the three that cover nearly every grid.
 *
 * Used by: about values (droplet), service detail outcomes (check), sustainability practice
 * (droplet), industry challenges (no icon).
 *
 * The icon is a prop, not a CMS field: the prototype picks one icon per section, never per item.
 */

type IconName = 'droplet' | 'check' | 'none';

function Glyph({ name }: { name: IconName }) {
  if (name === 'none') return null;
  return (
    <div className="mb-3 text-accent">
      {name === 'droplet' ? <DropletOutline /> : <Check />}
    </div>
  );
}

export function IconCardGrid({
  items,
  icon = 'droplet',
  columns = 4,
}: {
  items: IconItem[];
  icon?: IconName;
  columns?: 2 | 3 | 4;
}) {
  if (!items?.length) return null;
  const cols = columns === 2 ? 'sm:grid-cols-2' : columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`mt-8 grid gap-[14px] ${cols}`}>
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border border-line bg-fill-2 px-5 py-6">
          <Glyph name={icon} />
          <div className="font-display text-[17px] font-semibold">{item.title}</div>
          <div className="mt-2 text-[14px] leading-[1.65] text-muted">{item.description}</div>
        </div>
      ))}
    </div>
  );
}

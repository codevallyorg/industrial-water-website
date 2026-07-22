import Image from 'next/image';
import { Eyebrow } from '@/components/ui/SectionHeading';
import { mediaUrl } from '@/lib/strapi/client';
import type { FeaturePanel as FeaturePanelData } from '@/lib/strapi/types';

/**
 * Client-added "Borehole programs with defensible field data" block: eyebrow + H2 on the right, an
 * image on the left, and a vertical list of accent-bar points. Used only by the groundwater service.
 *
 * The image is a Strapi media asset — seeded with the bundled borehole illustration and swappable in
 * the admin. The frame matches the site's media treatment (placeholder gradient + a light veil) but
 * carries no caption, per the design. When the image is cleared, the gradient placeholder shows.
 */
export function FeaturePanel({ data }: { data: FeaturePanelData }) {
  const url = mediaUrl(data.media?.image?.url);
  const alt = data.media?.alt ?? data.media?.image?.alternativeText ?? '';

  return (
    <section className="container-site py-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-[linear-gradient(160deg,#0f2a34,#0a1a24)]">
          {url ? (
            <>
              <Image src={url} alt={alt} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(160deg,rgba(14,58,69,.28),rgba(10,26,36,.42)_80%)]"
              />
            </>
          ) : null}
        </div>

        <div>
          {data.eyebrow ? <Eyebrow>{data.eyebrow}</Eyebrow> : null}
          <h2 className="mt-[10px] font-display text-[clamp(26px,3.4vw,36px)] font-bold tracking-[-.015em]">
            {data.heading}
          </h2>

          {data.points.length ? (
            <ul className="mt-8 flex flex-col gap-3">
              {data.points.map((p, i) => (
                <li
                  key={i}
                  className="rounded-lg border-l-[3px] border-accent bg-fill-2 px-5 py-4 text-[15.5px] leading-[1.5] text-text"
                >
                  {p.text}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

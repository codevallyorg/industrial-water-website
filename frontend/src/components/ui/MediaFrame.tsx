import Image from 'next/image';
import { mediaUrl } from '@/lib/strapi/client';
import type { MediaFrame as MediaFrameData } from '@/lib/strapi/types';

/**
 * An image with the small uppercase caption the design overlays on it, e.g.
 * "FORBES WATER · FIELD OPERATIONS".
 *
 * The prototype renders these as gradient-over-photo blocks. When Strapi has no image yet, we fall
 * back to the gradient alone so the layout still holds — the design's own placeholder behaviour.
 */
export function MediaFrame({
  data,
  className = '',
  sizes,
  preload = false,
  ratio = 'aspect-[4/3]',
}: {
  data: MediaFrameData | null | undefined;
  className?: string;
  /** Required whenever the image is responsive — omitting it makes Next assume 100vw. */
  sizes: string;
  /** Hero image only. (`priority` is deprecated in Next 16.) */
  preload?: boolean;
  ratio?: string;
}) {
  const url = mediaUrl(data?.image?.url);
  const alt = data?.alt ?? data?.image?.alternativeText ?? '';

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-line bg-[linear-gradient(160deg,#0f2a34,#0a1a24)] ${ratio} ${className}`.trim()}
    >
      {url ? (
        <>
          <Image src={url} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" />
          {/* the design veils every photo so the caption and body text stay legible */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(160deg,rgba(14,58,69,.6),rgba(10,26,36,.82)_75%)]"
          />
        </>
      ) : null}

      {data?.label ? (
        <div className="absolute bottom-[14px] left-[14px] right-[14px] font-mono text-[10.5px] font-medium uppercase tracking-[.14em] text-[rgba(232,242,244,.55)]">
          {data.label}
        </div>
      ) : null}
    </div>
  );
}

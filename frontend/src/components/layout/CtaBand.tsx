import { Button } from '@/components/ui/Button';
import type { CtaBand as CtaBandData } from '@/lib/strapi/types';

/**
 * The shared CTA band. The design shows it on every page except Contact
 * (the prototype gates it with `showCta: p.page !== 'contact'`).
 */
export function CtaBand({ data }: { data: CtaBandData | null | undefined }) {
  if (!data) return null;

  return (
    <section className="container-site py-16">
      <div className="relative overflow-hidden rounded-xl border border-line bg-[linear-gradient(160deg,rgba(52,211,224,.1),rgba(255,255,255,.02))] px-6 py-12 text-center sm:px-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_80%_at_90%_0%,rgba(52,211,224,.14),transparent_55%)]"
        />
        <div className="relative">
          <h2 className="font-display text-[clamp(24px,3vw,32px)] font-bold tracking-[-.015em]">{data.heading}</h2>
          {data.body ? (
            <p className="mx-auto mt-4 max-w-[62ch] text-[15.5px] leading-[1.75] text-muted">{data.body}</p>
          ) : null}
          {data.button ? (
            <div className="mt-7 flex justify-center">
              <Button href={data.button.href} variant={data.button.variant}>
                {data.button.label}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

import { Button } from '@/components/ui/Button';
import { Droplet } from '@/components/icons';

export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span className="text-accent opacity-80">
        <Droplet width={44} height={54} />
      </span>
      <div className="mt-6 font-mono text-[13px] font-medium uppercase tracking-[.14em] text-dim">Error 404</div>
      <h1 className="mt-3 font-display text-[clamp(28px,4vw,42px)] font-bold tracking-[-.02em]">
        This page has run dry
      </h1>
      <p className="mt-4 max-w-[46ch] text-[15.5px] leading-[1.7] text-muted">
        The page you were after doesn&apos;t exist or has moved. Let&apos;s get you back to something useful.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-[14px]">
        <Button href="/" variant="primary">
          Back to home
        </Button>
        <Button href="/services" variant="secondary">
          Browse services
        </Button>
      </div>
    </div>
  );
}

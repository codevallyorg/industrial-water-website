import { Droplet } from '@/components/icons';

// Shown while a route's Server Component data resolves. Minimal by design — the pages are ISR so
// this is rarely seen, and a heavy skeleton would flash.
export default function Loading() {
  return (
    <div className="container-site flex min-h-[50vh] items-center justify-center py-24" role="status" aria-label="Loading">
      <span className="animate-pulse text-accent opacity-70">
        <Droplet width={40} height={48} />
      </span>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

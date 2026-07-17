'use client';

// Route error boundary. Client Component by requirement — it's the one place the site catches a
// render/data failure. The Strapi client throws on a bad token or an unreachable CMS; this keeps
// that from becoming a blank page.

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In production this is where a Sentry/logging call would go.
    console.error(error);
  }, [error]);

  return (
    <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="font-mono text-[13px] font-medium uppercase tracking-[.14em] text-danger">Something went wrong</div>
      <h1 className="mt-3 font-display text-[clamp(28px,4vw,42px)] font-bold tracking-[-.02em]">
        We hit an unexpected snag
      </h1>
      <p className="mt-4 max-w-[48ch] text-[15.5px] leading-[1.7] text-muted">
        The page couldn&apos;t be loaded. Try again — if it keeps happening, please let us know.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center rounded-[12px] bg-accent px-[26px] py-[15px] font-display text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hi"
      >
        Try again
      </button>
    </div>
  );
}

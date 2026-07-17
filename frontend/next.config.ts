import type { NextConfig } from 'next';

const strapiUrl = new URL(process.env.STRAPI_URL ?? 'http://127.0.0.1:1337');

// Next 16 blocks the image optimizer from fetching local/private IPs by default (SSRF protection).
// In dev Strapi runs on 127.0.0.1, so we opt in — but ONLY when the host really is local. In
// production Strapi is a real hostname, this stays false, and the protection remains in force.
const isLocalHost = /^(localhost|127\.|0\.0\.0\.0|::1|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(
  strapiUrl.hostname
);

const nextConfig: NextConfig = {
  images: {
    // Strapi's Media Library serves every editable image. Allowlist only its host.
    remotePatterns: [
      {
        protocol: strapiUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: strapiUrl.hostname,
        port: strapiUrl.port,
        pathname: '/uploads/**',
      },
    ],
    // Next 16 made `qualities` a required allowlist (default [75]); a quality outside it is
    // silently coerced. 75 is all the design needs — add values here rather than passing them ad hoc.
    qualities: [75],
    // See above — dev only. Never hard-code this to true.
    dangerouslyAllowLocalIP: isLocalHost,
  },
  // NB: do NOT enable `cacheComponents`. It switches Next to a different caching model that
  // forbids empty generateStaticParams and demands <Suspense> around runtime APIs. Our ISR +
  // tag revalidation is written against the previous model. See frontend/AGENTS.md.
};

export default nextConfig;

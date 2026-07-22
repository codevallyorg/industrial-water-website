import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd, organizationSchema, websiteSchema } from '@/components/seo/JsonLd';
import { mediaUrl } from '@/lib/strapi/client';
import { getGlobal, getIndustryCards, getNavigation, getServiceCards } from '@/lib/strapi/queries';
import { SITE_URL } from '@/lib/seo';

// The three families the design uses, at the weights it actually uses.
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: '--font-ibm-plex-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
});

export const metadata: Metadata = {
  // Mandatory in Next 16 once any relative canonical/OG URL is used — without it, build error.
  metadataBase: new URL(SITE_URL),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [global, nav, services, industries] = await Promise.all([
    getGlobal(),
    getNavigation(),
    getServiceCards(),
    getIndustryCards(),
  ]);

  return (
    <html
      lang="en-AU"
      className={`${spaceGrotesk.variable} ${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      {/* Browser extensions (Grammarly etc.) inject data-* attrs on <body> before React hydrates,
          causing a benign attribute mismatch. Suppress on this element only — it does NOT extend to
          children, so real hydration bugs in the app tree still surface. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        {/* the prototype has no skip link — keyboard users need one */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:font-display focus:text-[14px] focus:font-semibold focus:text-on-accent"
        >
          Skip to content
        </a>

        <Header nav={nav} services={services} industries={industries} />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer global={global} nav={nav} services={services} industries={industries} />

        <JsonLd
          schema={organizationSchema({
            name: global.siteName,
            logo: mediaUrl(global.logo?.url),
            phone: global.contact?.phone,
            email: global.contact?.email,
          })}
        />
        <JsonLd schema={websiteSchema(global.siteName)} />
      </body>
    </html>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Burger, Chevron, Droplet } from '@/components/icons';
import type { IndustryRef, Navigation, ServiceRef } from '@/lib/strapi/types';

/**
 * Sticky header with the two mega-menus and the mobile drawer.
 *
 * One of only three Client Components on the site — it owns dropdown + drawer state.
 *
 * The prototype opens the dropdowns on hover only, and the burger has no ARIA. Both are visual-mock
 * gaps, not design decisions: we keep the hover behaviour exactly, and add keyboard/ARIA support on
 * top so the menus are actually operable. Nothing here changes how it looks.
 */

type Props = {
  nav: Navigation;
  services: ServiceRef[];
  industries: IndustryRef[];
};

const linkCls =
  'relative rounded-sm px-3 py-[9px] transition-colors hover:bg-fill-3 hover:text-text';

/** A short accent bar under the active nav item — the "you are here" cue (option A). */
function ActiveUnderline() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[5px] left-3 right-3 h-[2px] origin-left rounded-full bg-accent [animation:growX_.25s_ease_both]"
    />
  );
}

export function Header({ nav, services, industries }: Props) {
  const [menu, setMenu] = useState<'services' | 'industries' | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navId = useId();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  // A top-level item is active on its own page and on any child route (e.g. Services is active on
  // /services and every /services/<slug>). Home only matches exactly.
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  // Escape closes whatever is open — keyboard users need a way out the prototype never had.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenu(null);
      setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const open = (m: 'services' | 'industries') => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenu(m);
  };
  // small grace period so the pointer can travel from the trigger into the panel
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenu(null), 120);
  };

  const itemsFor = (which: 'services' | 'industries') =>
    which === 'services'
      ? { all: { href: '/services', label: 'All Services →' }, list: services.map((s) => ({ href: `/services/${s.slug}`, label: s.title })) }
      : { all: { href: '/industries', label: 'All Industries →' }, list: industries.map((i) => ({ href: `/industries/${i.slug}`, label: i.title })) };

  return (
    <header className="sticky top-0 z-[60] border-b border-line-soft bg-[rgba(10,26,36,.88)] backdrop-blur-[14px]">
      <div className="container-site flex flex-wrap items-center justify-between gap-5 py-[14px]">
        <Link href="/" className="flex items-center gap-[11px] text-text">
          <span className="text-accent">
            <Droplet width={26} height={30} />
          </span>
          <span className="font-display text-[20px] font-bold tracking-[-.01em]">
            Forbes<span className="text-accent">Water</span>
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="hidden items-center gap-1 font-display text-[14px] font-medium max-[1120px]:order-3 max-[1120px]:w-full max-[1120px]:basis-full max-[1120px]:justify-center min-[901px]:flex"
        >
          {nav.mainItems.map((item) => {
            const active = isActive(item.href);

            if (item.megaMenu === 'none') {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`${linkCls} ${active ? 'text-accent' : 'text-muted'}`}
                >
                  {item.label}
                  {active ? <ActiveUnderline /> : null}
                </Link>
              );
            }

            const which = item.megaMenu;
            const isOpen = menu === which;
            const { all, list } = itemsFor(which);
            const panelId = `${navId}-${which}`;

            return (
              <div key={item.href} className="relative" onMouseEnter={() => open(which)} onMouseLeave={scheduleClose}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`${linkCls} inline-flex items-center gap-[6px] ${active ? 'text-accent' : 'text-muted'}`}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  aria-haspopup="true"
                  onFocus={() => open(which)}
                  onClick={() => setMenu(null)}
                >
                  {item.label}
                  <span className={active ? 'text-accent' : 'text-dim'}>
                    <Chevron />
                  </span>
                  {active ? <ActiveUnderline /> : null}
                </Link>

                {isOpen ? (
                  <div
                    id={panelId}
                    className="absolute left-0 top-full pt-2"
                    onMouseEnter={() => open(which)}
                    onMouseLeave={scheduleClose}
                  >
                    <div className="w-[300px] rounded-[14px] border border-[rgba(255,255,255,.10)] bg-ink-raised p-[10px] shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] [animation:fadeUp_.18s_ease_both]">
                      <Link
                        href={all.href}
                        onClick={() => setMenu(null)}
                        className="block rounded-sm px-3 py-2 font-display text-[13px] font-semibold text-accent hover:bg-accent-wash"
                      >
                        {all.label}
                      </Link>
                      <div className="mx-1 my-[6px] h-px bg-line-soft" />
                      {list.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={() => setMenu(null)}
                          className="block rounded-sm px-3 py-2 text-[13.5px] text-muted hover:bg-fill-3 hover:text-text"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        {nav.ctaButton ? (
          <Link
            href={nav.ctaButton.href}
            className="hidden whitespace-nowrap rounded-pill bg-accent px-5 py-[11px] font-display text-[13px] font-semibold text-on-accent transition-colors hover:bg-accent-hi min-[901px]:inline-flex"
          >
            {nav.ctaButton.label}
          </Link>
        ) : null}

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls={`${navId}-mobile`}
          className="inline-flex items-center justify-center rounded-sm border border-line p-[10px] text-text min-[901px]:hidden"
        >
          <Burger />
        </button>
      </div>

      {mobileOpen ? (
        <nav
          id={`${navId}-mobile`}
          aria-label="Mobile"
          className="max-h-[72vh] overflow-y-auto overscroll-contain border-t border-line-soft bg-ink px-4 pb-5 pt-2 min-[901px]:hidden"
        >
          <MobileLink href="/" onNavigate={() => setMobileOpen(false)}>Home</MobileLink>
          <MobileLink href="/about" onNavigate={() => setMobileOpen(false)}>About</MobileLink>

          <MobileGroup label="Services" />
          <MobileLink href="/services" onNavigate={() => setMobileOpen(false)}>All Services</MobileLink>
          {services.map((s) => (
            <MobileLink key={s.slug} href={`/services/${s.slug}`} onNavigate={() => setMobileOpen(false)}>
              {s.title}
            </MobileLink>
          ))}

          <MobileGroup label="Industries" />
          <MobileLink href="/industries" onNavigate={() => setMobileOpen(false)}>All Industries</MobileLink>
          {industries.map((i) => (
            <MobileLink key={i.slug} href={`/industries/${i.slug}`} onNavigate={() => setMobileOpen(false)}>
              {i.title}
            </MobileLink>
          ))}

          <MobileLink href="/sustainability" onNavigate={() => setMobileOpen(false)}>Sustainability</MobileLink>
          <MobileLink href="/projects" onNavigate={() => setMobileOpen(false)}>Projects</MobileLink>

          {nav.ctaButton ? (
            <Link
              href={nav.ctaButton.href}
              onClick={() => setMobileOpen(false)}
              className="mt-3 block rounded-[12px] bg-accent px-4 py-[13px] text-center font-display text-[15px] font-semibold text-on-accent"
            >
              {nav.ctaButton.label}
            </Link>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}

function MobileGroup({ label }: { label: string }) {
  return (
    <div className="px-2 pb-[6px] pt-[14px] font-display text-[11px] font-semibold uppercase tracking-[.12em] text-accent">
      {label}
    </div>
  );
}

function MobileLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  const pathname = usePathname();
  // Exact match — the mobile list is granular (each service/industry is its own link).
  const active = pathname === href;
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`block rounded-sm px-2 py-[10px] text-[15px] hover:bg-fill-3 hover:text-text ${
        active ? 'text-accent' : 'text-muted'
      }`}
    >
      {children}
    </Link>
  );
}

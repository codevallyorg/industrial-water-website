import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import type { LinkVariant } from '@/lib/strapi/types';

/**
 * Button / CTA, transcribed from the prototype.
 *
 *   primary   font:600 15px 'Space Grotesk'; color:#062028; background:#34d3e0;
 *             padding:15px 26px; border-radius:12px;   hover → #5ee0ea
 *   secondary font:600 15px 'Space Grotesk'; color:#e8f2f4;
 *             border:1px solid rgba(255,255,255,.22); padding:15px 26px; border-radius:12px;
 *             hover → border rgba(52,211,224,.6); color #34d3e0
 *   pill      the header CTA: font:600 13px; padding:11px 20px; border-radius:999px;
 */

const base =
  'inline-flex items-center justify-center font-display font-semibold transition-colors whitespace-nowrap';

const variants: Record<LinkVariant | 'pill', string> = {
  primary: 'text-[15px] text-on-accent bg-accent px-[26px] py-[15px] rounded-[12px] hover:bg-accent-hi',
  secondary:
    'text-[15px] text-text border border-[rgba(255,255,255,.22)] px-[26px] py-[15px] rounded-[12px] hover:border-[rgba(52,211,224,.6)] hover:text-accent',
  ghost: 'text-[15px] text-muted hover:text-text',
  pill: 'text-[13px] text-on-accent bg-accent px-5 py-[11px] rounded-pill hover:bg-accent-hi',
};

type Props = {
  href: string;
  variant?: LinkVariant | 'pill';
  external?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, 'href' | 'className'>;

export function Button({ href, variant = 'primary', external, children, className = '', ...rest }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`.trim();

  if (external) {
    return (
      <a href={href} className={cls} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}

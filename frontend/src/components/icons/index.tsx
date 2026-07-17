/**
 * The complete icon set, transcribed verbatim from the prototype's inline SVGs.
 *
 * The design uses exactly these — a droplet, two checkmarks, quote marks, a chevron and a burger.
 * Icons are chosen by the section in code, not stored per item in the CMS: the prototype uses one
 * icon per section (values/practice → droplet, service outcomes → check), never a per-item choice.
 */

type IconProps = { className?: string };

/** The Forbes Water droplet. Solid fill — used for the logo mark and section bullets. */
export function Droplet({ className, width = 24, height = 30 }: IconProps & { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 30" aria-hidden="true" className={className}>
      <path d="M12 1 C12 1 3 12 3 19 a9 9 0 0 0 18 0 C21 12 12 1 12 1 Z" fill="currentColor" />
      <ellipse cx="9" cy="16" rx="2.4" ry="3.4" fill="#0a1a24" opacity=".28" />
    </svg>
  );
}

/** Outline droplet — the expertise/services cards use this stroked variant. */
export function DropletOutline({ className, width = 22, height = 26 }: IconProps & { width?: number; height?: number }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 30" aria-hidden="true" className={className}>
      <path
        d="M12 1 C12 1 3 12 3 19 a9 9 0 0 0 18 0 C21 12 12 1 12 1 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/** Small check — service detail "What you get". */
export function Check({ className }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path d="M6 10.5 L9 13.5 L14 7.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Large check — contact form success panel. */
export function CheckLarge({ className }: IconProps) {
  return (
    <svg width="54" height="54" viewBox="0 0 54 54" aria-hidden="true" className={className}>
      <path d="M16 27 L23 34 L37 19" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Quote marks — home testimonial. */
export function QuoteMarks({ className }: IconProps) {
  return (
    <svg width="34" height="26" viewBox="0 0 34 26" aria-hidden="true" className={className}>
      <path d="M0 26 L8 0 h8 L11 26 Z M18 26 L26 0 h8 L29 26 Z" fill="currentColor" />
    </svg>
  );
}

/** Chevron — nav dropdown affordance. */
export function Chevron({ className }: IconProps) {
  return (
    <svg width="9" height="6" viewBox="0 0 10 6" aria-hidden="true" className={className}>
      <path d="M1 1 L5 5 L9 1" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Burger — mobile nav toggle. */
export function Burger({ className }: IconProps) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true" className={className}>
      <path d="M1 1 h16 M1 7 h16 M1 13 h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

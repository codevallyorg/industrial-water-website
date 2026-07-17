'use client';

import { useActionState } from 'react';
import { submitEnquiry, type EnquiryState } from '@/actions/submit-enquiry';
import { CheckLarge } from '@/components/icons';
import type { ContactPage } from '@/lib/strapi/types';

/**
 * The contact form. One of only three Client Components on the site — it owns the submit lifecycle
 * via useActionState. Field labels, placeholders, options and the success copy all come from Strapi.
 *
 * The prototype's form was inert ("no data is sent"); this posts to the submitEnquiry Server Action,
 * which stores an enquiry in Strapi and emails the team. Validation and error strings match the
 * prototype exactly.
 */

const initial: EnquiryState = { ok: false, errors: {} };

const fieldCls =
  'w-full rounded-[10px] border border-line bg-fill-1 px-4 py-3 text-[15px] text-text placeholder:text-dim focus:border-accent focus:outline-none';

export function ContactForm({ page }: { page: ContactPage }) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initial);

  if (state.ok) {
    return (
      <div className="rounded-xl border border-line bg-fill-2 p-8 text-center sm:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-pill bg-accent-veil text-accent">
          <CheckLarge />
        </span>
        <h2 className="mt-6 font-display text-[24px] font-bold tracking-[-.015em]">
          {page.successHeading ?? "Thanks — we've got it."}
        </h2>
        {page.successBody ? (
          <p className="mx-auto mt-3 max-w-[52ch] text-[15px] leading-[1.7] text-muted">{page.successBody}</p>
        ) : null}
        <a
          href="/contact"
          className="mt-8 inline-flex items-center justify-center rounded-[12px] border border-[rgba(255,255,255,.22)] px-[26px] py-[13px] font-display text-[14px] font-semibold text-text transition-colors hover:border-accent-edge hover:text-accent"
        >
          {page.successButtonLabel ?? 'Send another enquiry'}
        </a>
      </div>
    );
  }

  const options = page.industryOptions ?? [];

  return (
    <form action={formAction} noValidate className="rounded-xl border border-line bg-fill-2 p-6 sm:p-8">
      {/* honeypot — off-screen, not a real field. Bots fill it; humans never see it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="fw-company">Company (leave blank)</label>
        <input id="fw-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fw-name" label="Full name *" error={state.errors.name}>
          <input
            id="fw-name"
            name="name"
            type="text"
            placeholder="Jane Citizen"
            aria-invalid={Boolean(state.errors.name)}
            aria-describedby={state.errors.name ? 'fw-name-err' : undefined}
            className={fieldCls}
          />
        </Field>
        <Field id="fw-email" label="Work email *" error={state.errors.email}>
          <input
            id="fw-email"
            name="email"
            type="email"
            placeholder="jane@company.com.au"
            aria-invalid={Boolean(state.errors.email)}
            aria-describedby={state.errors.email ? 'fw-email-err' : undefined}
            className={fieldCls}
          />
        </Field>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <Field id="fw-phone" label="Phone">
          <input id="fw-phone" name="phone" type="tel" placeholder="04xx xxx xxx" className={fieldCls} />
        </Field>
        <Field id="fw-industry" label="Industry">
          <select id="fw-industry" name="industry" defaultValue="" className={fieldCls}>
            <option value="">Select your industry…</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5">
        <Field id="fw-message" label="How can we help? *" error={state.errors.message}>
          <textarea
            id="fw-message"
            name="message"
            rows={5}
            placeholder="Tell us about your site, your water source, and the challenge you're facing…"
            aria-invalid={Boolean(state.errors.message)}
            aria-describedby={state.errors.message ? 'fw-message-err' : undefined}
            className={`${fieldCls} resize-y`}
          />
        </Field>
      </div>

      {state.errors.form ? (
        <p className="mt-4 text-[13px] font-medium text-danger" role="alert">
          {state.errors.form}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 inline-flex items-center justify-center rounded-[12px] bg-accent px-[26px] py-[15px] font-display text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hi disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send enquiry'}
      </button>

      {page.formNote ? <div className="mt-4 text-[12.5px] text-dim">{page.formNote}</div> : null}
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-display text-[13px] font-semibold text-muted">
        {label}
      </label>
      {children}
      {error ? (
        <div id={`${id}-err`} className="mt-[6px] text-[12.5px] font-medium text-danger">
          {error}
        </div>
      ) : null}
    </div>
  );
}

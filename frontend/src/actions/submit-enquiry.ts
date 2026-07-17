'use server';

import 'server-only';

/**
 * Contact form Server Action.
 *
 * Writes an `enquiry` to Strapi (create-only token) AND emails the team. Nothing is lost if email
 * delivery fails — the submission is persisted first, the email is best-effort after.
 *
 * The token never reaches the browser: this runs on the server, and `server-only` guarantees the
 * module can't be imported into a client bundle.
 *
 * Validation mirrors the prototype's rules and error strings exactly (design/…dc.html onSubmitForm).
 */

export type EnquiryState = {
  ok: boolean;
  errors: Partial<Record<'name' | 'email' | 'message' | 'form', string>>;
  values?: Partial<Record<'name' | 'email' | 'phone' | 'industry' | 'message', string>>;
};

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://127.0.0.1:1337';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Simple in-memory throttle. On the VPS this is backed by nginx `limit_req` too (see backend/README);
// this is the app-level second line, not the only one.
const RATE = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(key: string): boolean {
  const now = Date.now();
  const rec = RATE.get(key);
  if (!rec || now - rec.first > WINDOW_MS) {
    RATE.set(key, { count: 1, first: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  // Honeypot: a hidden field real users never fill. Bots do. Pretend success, store nothing.
  if ((formData.get('company') as string)?.trim()) {
    return { ok: true, errors: {} };
  }

  const name = (formData.get('name') as string)?.trim() ?? '';
  const email = (formData.get('email') as string)?.trim() ?? '';
  const phone = (formData.get('phone') as string)?.trim() ?? '';
  const industry = (formData.get('industry') as string)?.trim() ?? '';
  const message = (formData.get('message') as string)?.trim() ?? '';

  // Validation — strings verbatim from the prototype.
  const values = { name, email, phone, industry, message };
  const errors: EnquiryState['errors'] = {};
  if (!name) errors.name = 'Please enter your name.';
  if (!email) errors.email = 'Please enter your work email.';
  else if (!EMAIL_RE.test(email)) errors.email = "That email doesn't look right — please check it.";
  if (!message) errors.message = 'Tell us briefly what you need help with.';
  if (Object.keys(errors).length) return { ok: false, errors, values };

  if (rateLimited(email.toLowerCase())) {
    return { ok: false, errors: { form: 'Too many submissions — please try again in a minute.' }, values };
  }

  const token = process.env.STRAPI_ENQUIRY_TOKEN;
  if (!token) {
    console.error('STRAPI_ENQUIRY_TOKEN is not set — enquiry cannot be saved.');
    return { ok: false, errors: { form: 'Something went wrong on our end. Please email us directly.' }, values };
  }

  // 1) Persist first.
  try {
    const res = await fetch(`${STRAPI_URL}/api/enquiries`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: { name, email, phone, industry, message, status: 'new' } }),
    });
    if (!res.ok) {
      console.error(`Strapi enquiry create failed: ${res.status} ${await res.text().catch(() => '')}`);
      return { ok: false, errors: { form: 'Something went wrong on our end. Please email us directly.' }, values };
    }
  } catch (err) {
    console.error('Strapi enquiry create threw:', err);
    return { ok: false, errors: { form: 'Something went wrong on our end. Please email us directly.' }, values };
  }

  // 2) Notify — best effort. A failed email must not fail the submission.
  await notifyTeam({ name, email, phone, industry, message }).catch((err) =>
    console.error('Enquiry email notification failed (submission was still saved):', err)
  );

  return { ok: true, errors: {} };
}

async function notifyTeam(enquiry: {
  name: string;
  email: string;
  phone: string;
  industry: string;
  message: string;
}) {
  const { ENQUIRY_NOTIFY_TO, ENQUIRY_NOTIFY_FROM, SMTP_HOST } = process.env;
  if (!ENQUIRY_NOTIFY_TO || !SMTP_HOST) {
    // No mail transport configured (e.g. local dev) — the enquiry is already saved in Strapi.
    console.info('Email notification skipped: SMTP not configured. Enquiry saved to Strapi.');
    return;
  }

  // Lazy import so nodemailer isn't pulled into the bundle unless mail is actually configured.
  const nodemailer = (await import('nodemailer')).default;
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
      : undefined,
  });

  await transport.sendMail({
    to: ENQUIRY_NOTIFY_TO,
    from: ENQUIRY_NOTIFY_FROM ?? ENQUIRY_NOTIFY_TO,
    replyTo: enquiry.email,
    subject: `New website enquiry — ${enquiry.name}`,
    text: [
      `Name:     ${enquiry.name}`,
      `Email:    ${enquiry.email}`,
      `Phone:    ${enquiry.phone || '—'}`,
      `Industry: ${enquiry.industry || '—'}`,
      '',
      enquiry.message,
    ].join('\n'),
  });
}

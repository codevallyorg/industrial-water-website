/**
 * Creates the two API tokens the frontend needs, and asserts the public role is locked down.
 *
 *   npm run tokens
 *
 * Prints each accessKey ONCE — Strapi only ever shows it at creation. Copy them into
 * frontend/.env.local. Re-running rotates a token (delete + recreate) rather than duplicating it.
 *
 * Why two tokens, and why "custom" rather than Strapi's built-in "read-only":
 * the read-only type grants find/findOne on EVERY content type — including `enquiry`, which holds
 * personal data from the contact form. A leaked read-only token would expose every submission. So
 * the frontend token is `custom`, scoped explicitly to the content types the site renders, and the
 * form gets a separate token that can only create an enquiry and read nothing at all.
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';

// Everything the public site renders. `enquiry` is deliberately absent.
const COLLECTIONS = ['service', 'industry', 'project', 'team-member'];
const SINGLES = [
  'global',
  'navigation',
  'home-page',
  'about-page',
  'services-page',
  'industries-page',
  'sustainability-page',
  'projects-page',
  'contact-page',
];

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';

  const tokenService = app.service('admin::api-token');

  const readPermissions = [
    ...COLLECTIONS.flatMap((t) => [`api::${t}.${t}.find`, `api::${t}.${t}.findOne`]),
    ...SINGLES.map((t) => `api::${t}.${t}.find`),
  ];

  async function mint(name: string, description: string, permissions: string[]) {
    const existing = await tokenService.getByName(name);
    if (existing) await tokenService.revoke(existing.id);
    const token = await tokenService.create({
      name,
      description,
      type: 'custom',
      lifespan: null,
      permissions,
    });
    return token.accessKey as string;
  }

  const readKey = await mint(
    'frontend-read',
    'Server-side content reads for the Next.js site. Cannot read enquiries. Cannot write.',
    readPermissions
  );
  const enquiryKey = await mint(
    'contact-form-create',
    'Contact form Server Action. Can only create an enquiry — no reads.',
    ['api::enquiry.enquiry.create']
  );

  // ---- assert the public role really is locked down -------------------------------------------
  const publicRole = await app.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' }, populate: ['permissions'] });
  const leaked = (publicRole?.permissions ?? [])
    .map((p: any) => p.action as string)
    .filter((a: string) => a.startsWith('api::'));

  console.log('\n─────────────────────────────────────────────────────────────');
  console.log('Add these to frontend/.env.local (shown once, never again):\n');
  console.log(`STRAPI_API_TOKEN=${readKey}`);
  console.log(`STRAPI_ENQUIRY_TOKEN=${enquiryKey}`);
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`\nfrontend-read scope       : ${readPermissions.length} read actions, enquiry excluded`);
  console.log(`contact-form-create scope : create enquiry only`);

  if (leaked.length) {
    console.log(`\n✗ PUBLIC ROLE IS NOT LOCKED DOWN — ${leaked.length} action(s) exposed anonymously:`);
    for (const a of leaked) console.log(`    ${a}`);
    console.log('  Disable these in Settings → Roles → Public. The site reads server-side with a token.');
    process.exitCode = 1;
  } else {
    console.log('\n✓ Public role has no api:: permissions — anonymous reads are refused.');
  }

  await app.destroy();
  process.exit(process.exitCode ?? 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Applies the Content Manager field hints (src/field-descriptions.ts) ad-hoc, without a restart.
 *
 * Normally you don't need this: the same logic runs automatically on every server start (see
 * bootstrap in src/index.ts). Use it when you've edited the descriptions and want them live in an
 * already-running instance.
 *
 *   npm run describe
 */
import { createStrapi, compileStrapi } from '@strapi/strapi';
import { applyFieldDescriptions } from '../src/field-descriptions';

async function main() {
  const app = await createStrapi(await compileStrapi()).load();
  app.log.level = 'error';
  const n = await applyFieldDescriptions(app);
  console.log(`done: applied ${n} description update(s). Reload the admin to see them.`);
  await app.destroy();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

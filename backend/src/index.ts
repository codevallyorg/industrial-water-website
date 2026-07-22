import type { Core } from '@strapi/strapi';
import { applyFieldDescriptions } from './field-descriptions';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Keep Content Manager field hints in sync with src/field-descriptions.ts on every start, so
    // editors always see them — even on a fresh database. Never let a hiccup here block boot.
    try {
      const n = await applyFieldDescriptions(strapi);
      if (n > 0) strapi.log.info(`field descriptions: applied ${n} update(s)`);
    } catch (err) {
      strapi.log.warn(`field descriptions: skipped (${(err as Error).message})`);
    }
  },
};

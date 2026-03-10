import type { Core } from '@strapi/strapi';

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    // Register custom services or middleware here.
  },

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Bootstrap logic after Strapi has loaded (e.g. seed data, set permissions).
  },
};

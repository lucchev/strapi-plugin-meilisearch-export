import type { Core } from "@strapi/strapi";
import { pluginId } from "../pluginId";
import type { MeilisearchConfig } from "../types";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  get: () => {
    const settings = strapi.config.get(`plugin::${pluginId}`) as MeilisearchConfig;
    return settings;
  }
});

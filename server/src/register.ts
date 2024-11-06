import type { Core } from '@strapi/strapi';
import { pluginId } from './pluginId';
import type { IndexConfig, MeilisearchConfig } from './types';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const pluginConfig = strapi.config.get(`plugin::${pluginId}`) as MeilisearchConfig;
  const plugin = strapi.plugin(pluginId);

  const isPublished = (result: any) => result.publishedAt !== null;

  if (pluginConfig && Array.isArray(pluginConfig.index)) {
    pluginConfig.index.forEach((collectionConfig: IndexConfig) => {
      const { collection } = collectionConfig;
      const contentType = strapi.contentTypes[collection];

      if (contentType) {
        strapi.db.lifecycles.subscribe({
          models: [contentType.uid],
          afterCreate: async (event) => {
            const { result } = event;
            const { locale } = result;

            if (isPublished(result)) {
              const { documentId } = result;
              await plugin.service('lifecycle').createOrUpdateEntry(contentType.uid, documentId, locale);
            }
          },
          afterUpdate: async (event) => {
            const { result } = event;
            const { locale } = result;

            if (isPublished(result)) {
              const { documentId } = result;
              await plugin.service('lifecycle').createOrUpdateEntry(contentType.uid, documentId, locale);
            }
          },
          afterDelete: async (event) => {
            const { result } = event;
            const { locale } = result;
            const { documentId } = result;

            if (isPublished(result)) {
              await plugin.service('lifecycle').deleteEntry(contentType.uid, documentId, locale);
            }
          },
        });
      }
    });
  }
};

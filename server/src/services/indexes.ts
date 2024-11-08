import type { Core } from "@strapi/strapi";
import { pluginId } from "../pluginId";
import { getCollectionContentTypeUID } from "../utils/getCollectionContentTypeUID";
import { getExportInfos } from "../utils/getExportInfos";
import { serialize } from "../utils/serialize";
import * as server from "../utils/server";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  rebuild: async(indexName: string) => {
    const contentTypeUID = getCollectionContentTypeUID(strapi, indexName);
    const exportInfos = await getExportInfos(strapi, contentTypeUID);
    const { host, apiKey, settings, format, fields, populate, transformEntry } = exportInfos;

    //strapi.log.info('Updating index ' + indexName);

    try {
      //strapi.log.info('Deleting index ' + indexName + '...');
      await server.deleteIndex(host, apiKey,indexName);
      //strapi.log.info('Creating index ' + indexName + '...');
      await server.createIndex(host, apiKey, indexName);
      //strapi.log.info('Updating settings ' + indexName + '...');
      await server.updateSettings(host, apiKey, indexName, settings);

      let page = 0;
      const pageSize = 100;
      while (true) {
        const pageEntities = await strapi.documents(contentTypeUID).findMany({
          fields: fields,
          limit: pageSize,
          offset: page * pageSize,
          populate: populate,
          filters: {
            publishedAt: {
              $notNull: true
            }
          }
        });
        //strapi.log.info('Found ' + pageEntities.length + ' entities ' + pageEntities);

        if (pageEntities.length === 0) break;

        const serializedData = serialize(pageEntities, format, transformEntry);
        //strapi.log.info('Sending data to Meilisearch' + indexName);
        const res = await server.send(host, apiKey, indexName, serializedData, format);

        if (res === null) {
          throw new Error('Failed to send data to Meilisearch');
        }

        page++;
      }

      return true;

    } catch (error) {
      strapi.log.error('Error updating index', error);
      throw new Error('Index update failed');
    }
  },

  delete: async (indexName: string) => {
    const pluginConfig = strapi.plugin(pluginId).service('settings').get();
    const { host, apiKey } = pluginConfig;
    try {
      const response = await server.deleteIndex(host, apiKey, indexName);
      return response !== null;
    } catch (error) {
      strapi.log.error('Error deleting index from Meilisearch:', error);
      throw new Error('Index deletion failed');
    }
  },

  updateSettings: async(indexName: string) => {
    const contentTypeUID = getCollectionContentTypeUID(strapi, indexName);
    const exportInfos = await getExportInfos(strapi, contentTypeUID);
    const { host, apiKey, settings } = exportInfos;
    try {
      const response = await server.updateSettings(host, apiKey, indexName, settings);
      return response !== null;
    } catch (error) {
      strapi.log.error('Error updating settings ' + indexName + ' in Meilisearch', error);
      throw new Error('Settings update failed');
    }
  }
});

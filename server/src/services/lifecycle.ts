import type { Core, UID } from '@strapi/strapi';
import { getExportInfos } from '../utils/getExportInfos';
import { serialize } from '../utils/serialize';
import * as server from '../utils/server';

const lifecycleService = ({ strapi }: { strapi: Core.Strapi }) => ({

  async createOrUpdateEntry(contentType: UID.ContentType, documentId: string, locale?: string) {
    try {
      const exportInfos = await getExportInfos(strapi, contentType, documentId, locale, true);
      const { entry, indexName, format, host, apiKey, settings } = exportInfos;

      // Serialize the data
      const serializedData = serialize([entry], format);

      // Check if the index exists
      const indexExists = await server.checkIndexExists(host, apiKey, indexName);
      if (!indexExists) {
        //strapi.log.info('Index ' + indexName + ' does not exist, creating it');
        await server.createIndex(host, apiKey, indexName);
        await server.updateSettings(host, apiKey, indexName, settings);
      }

      // Create or update the entry in Meilisearch
      //strapi.log.info('Entry ' + documentId + ' sent to Meilisearch');
      const response = await server.send(host, apiKey, indexName, serializedData, format);
      return response;
    } catch (error) {
      //strapi.log.error('Error creating or updating entry in Meilisearch:', error);
      throw new Error('Entry creation or update failed');
    }
  },

  async deleteEntry(contentType: UID.ContentType, documentId: string, locale?: string) {
    try {
      const exportInfos = await getExportInfos(strapi, contentType, documentId, locale);
      const { host, indexName, apiKey } = exportInfos;

      // Delete the entry from Meilisearch
      const response = await server.deleteEntry(host, apiKey, indexName, documentId);
      return response;
    } catch (error) {
      strapi.log.error('Error deleting entry from Meilisearch:', error);
      throw new Error('Entry deletion failed');
    }
  },
});

export default lifecycleService;

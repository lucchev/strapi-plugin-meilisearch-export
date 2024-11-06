import type { Core, UID } from "@strapi/strapi";
import { pluginId } from "../pluginId";
import type { IndexSettings, MeilisearchConfig } from "../types";

type EntryInfos = {
  host: string;
  apiKey: string;
  format: string;
  settings: IndexSettings;
  fields: string[];
  entry: Document;
  indexName: string;
  populate: string[];
  transformEntry: ({ entry }: { entry: any }) => any;
}

export const getExportInfos = async (strapi: Core.Strapi, contentTypeUID: UID.ContentType, documentId?: string, locale?: string, getEntry: boolean = false): Promise<EntryInfos> => {
  const plugin = strapi.plugin(pluginId);
  const pluginConfig = await plugin.service('settings').get() as MeilisearchConfig;
  const { index, host, apiKey } = pluginConfig;

  // Check if the documentId is required
  if (!documentId && getEntry) {
    throw new Error('documentId is required to get the entry');
  }

  // Find the collection configuration
  const collectionConfig = index.find(collection => collection.collection === contentTypeUID);
  if (!collectionConfig) {
    throw new Error(`Collection not found for content type: ${contentTypeUID}`);
  }
  const { fields, indexName, settings, format = 'ndjson' } = collectionConfig;

  // Get the index name with the locale if it exists
  const indexNameInternational = locale ? `${indexName}_${locale}` : indexName;

  // Get the entry if required
  const entry = getEntry ? await strapi.documents(contentTypeUID).findOne({documentId: documentId, fields: fields, populate: collectionConfig.populate, locale: locale}) : null;

  console.log('entry', entry, getEntry, documentId);
  // Check if the entry exists
  if (getEntry && !entry) {
    throw new Error(`Entity not found for content type: ${contentTypeUID} and documentId: ${documentId}`);
  }

  // Sanitize the entry to exclude the id field (if entry is required)
  const entryWithoutId = getEntry && entry ? (({ id, ...rest }) => rest)(entry) : null;
  // Transform the entry if a transformEntry function is provided
  let transformedEntry = entryWithoutId;
  if (getEntry && entry && collectionConfig.transformEntry) {
    transformedEntry = collectionConfig.transformEntry({ entry: entryWithoutId });
  }

  // Return the export infos
  return {
    entry: transformedEntry,
    indexName: indexNameInternational,
    format: format,
    host: host,
    apiKey: apiKey,
    settings: settings,
    fields: fields,
    populate: collectionConfig.populate,
    transformEntry: collectionConfig.transformEntry
  }
}



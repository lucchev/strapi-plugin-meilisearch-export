import axios from 'axios';
import type { IndexSettings } from "../types";

const checkRequiredParams = (params: { [key: string]: string | IndexSettings | null }) => {
  for (const [key, value] of Object.entries(params)) {
    if (!value) {
      console.error(`Meilisearch ${key} is not defined`);
      return false;
    }
  }
  return true;
}

export const checkIndexExists = async (host: string, apiKey: string, indexName: string) => {
  if (!checkRequiredParams({ host, apiKey, indexName })) {
    return null;
  }

  try {
    const response = await axios.get(`${host}/indexes/${indexName}`, { headers: { 'Authorization': `Bearer ${apiKey}` } });
    return response.data !== null;
  } catch (error) {
    console.error("Error checking if index exists in Meilisearch", error);
    return false;
  }
}

export const createIndex = async (host: string, apiKey: string, indexName: string) => {
  if (!checkRequiredParams({ host, apiKey, indexName })) {
    return null;
  }

  try {
    const response = await axios.post(`${host}/indexes`, { uid: indexName, primaryKey: 'documentId' }, { headers: { 'Authorization': `Bearer ${apiKey}` } });
    return response.data !== null;
  } catch (error) {
    console.error("Error creating index in Meilisearch", error);
    return null;
  }
}

export const send = async (host: string, apiKey: string, indexName: string, serializedData: string, format: string) => {
  if (!checkRequiredParams({ host, apiKey, indexName, serializedData, format })) {
    return null;
  }

  //strapi.log.info('Sending data to Meilisearch ' + indexName + ' ' + serializedData + ' ' + format);
  try {
    const response = await axios.post(`${host}/indexes/${indexName}/documents`, Buffer.from(serializedData), {
      headers: {
        'Content-Type': format === 'ndjson' ? 'application/x-ndjson' : 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error sending data to Meilisearch", error);
    return null;
  }
};

export const deleteEntry = async (host: string, apiKey: string, indexName: string, documentId: string) => {
  if (!checkRequiredParams({ host, apiKey, indexName, documentId })) {
    return null;
  }

  try {
    const response = await axios.delete(`${host}/indexes/${indexName}/documents/${documentId}`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting item from Meilisearch", error);
    return null;
  }
};

export const deleteIndex = async (host: string, apiKey: string, indexName: string) => {
  if (!checkRequiredParams({ host, apiKey, indexName })) {
    return null;
  }

  try {
    const response = await axios.delete(`${host}/indexes/${indexName}`, { headers: { 'Authorization': `Bearer ${apiKey}` } });
    return response.data;
  } catch (error) {
    console.error("Error deleting index from Meilisearch", error);
    return null;
  }
};

export const updateSettings = async (host: string, apiKey: string, indexName: string, settings: IndexSettings) => {
  if (!checkRequiredParams({ host, apiKey, indexName, settings })) {
    return null;
  }
  try {
    const response = await axios.patch(`${host}/indexes/${indexName}/settings`, settings, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    return response.data;
  } catch (error) {
    console.error("Error updating settings for index", error);
    return null;
  }
}

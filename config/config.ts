import type { MeilisearchConfig } from "../server/src/types";

const config = {
  default: {
    apiKey: 'your-default-meilisearch-key',
    host: 'http://localhost:7700',
    index: []
  },
  validator: (config: MeilisearchConfig) => {
    if (!config.host) {
      throw new Error('Meilisearch host must be defined');
    }
    if (!config.apiKey) {
      throw new Error('Meilisearch API key must be defined');
    }
    if (!config.index || !Array.isArray(config.index)) {
      throw new Error('A valid index configuration must be provided');
    }
  },
  locales: ["fr", "en"],
};

export default config;

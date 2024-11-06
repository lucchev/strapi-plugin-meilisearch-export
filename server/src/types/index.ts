export type MeilisearchConfig = {
  apiKey: string;
  host: string;
  index: IndexConfig[];
};

export type IndexConfig = {
  indexName: string;
  format: 'json' | 'ndjson';
  collection: string;
  fields: string[];
  populate?: string[];
  transformEntry?: TransformEntry;
  settings?: IndexSettings;
};

export type TransformEntry = ({ entry }: { entry: any }) => any;

export type IndexSettings = {
  displayedAttributes: string[];
  searchableAttributes: string[];
  filterableAttributes: string[];
  sortableAttributes: string[];
  rankingRules: string[];
  stopWords: string[];
  nonSeparatorTokens: string[];
  separatorTokens: string[];
  dictionary: string[];
  synonyms: { [key: string]: string[] };
  distinctAttribute: string | null;
  typoTolerance: {
    enabled: boolean;
    minWordSizeForTypos: {
      oneTypo: number;
      twoTypos: number;
    };
  };
  faceting: {
    maxValuesPerFacet: number;
    sortFacetValuesBy: {
      [key: string]: string;
    };
  };
  pagination: {
    maxTotalHits: number;
  };
  searchCutoffMs: number | null;
  localizedAttributes: string[] | null;
};

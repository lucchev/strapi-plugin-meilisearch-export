import type { Core } from "@strapi/strapi";

export const getCollectionContentTypeUID = (strapi: Core.Strapi, indexName: string) => {
  const collectionPluralName = indexName.split('_')[0];
  const contentType = Object.values(strapi.contentTypes).find((ct) => ct.collectionName === collectionPluralName);
  return contentType.uid;
};

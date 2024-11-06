// Mise à jour du typage de la réponse
interface ContentTypeResponse {
  data: {
    data: {
      schema: {
        pluginOptions?: {
        i18n?: {
          localized: boolean;
        };
        };
      };
    };
  };
}

export const fetchCollection = async (get: (url: string) => Promise<ContentTypeResponse>, uid: string): Promise<ContentTypeResponse["data"] | null> => {
  try {
    const response = await get(`/content-type-builder/content-types/${uid}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la vérification de la collection ${uid}`, error);
    return null;
  }
};

export const isCollectionLocalized = async (get: (url: string) => Promise<ContentTypeResponse>, uid: string): Promise<boolean> => {
  const collection = await fetchCollection(get, uid);
  return collection?.data.schema.pluginOptions?.i18n?.localized || false;
};

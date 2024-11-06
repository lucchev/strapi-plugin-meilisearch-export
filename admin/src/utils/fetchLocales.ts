import { useFetchClient } from '@strapi/strapi/admin';


const fetchLocales = async () => {
  const { get } = useFetchClient();
  try {
    const response = await get('/i18n/locales');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des locales', error);
  }
};

export default fetchLocales;

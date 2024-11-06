export const serialize = (entities: Document[], format: string, transformedEntry?: ({ entry }: { entry: any }) => any) => {
  // strapi.log.info('Serializing ' + entities.length + ' entities ' + format + ' ' + entities);
  const transformedEntities = transformedEntry ? entities.map(entity => transformedEntry({ entry: entity })) : entities;

  const serializedData = format === 'ndjson'
    ? transformedEntities.map(entity => JSON.stringify(entity)).join('\n')
    : JSON.stringify(transformedEntities);
  return serializedData;
};

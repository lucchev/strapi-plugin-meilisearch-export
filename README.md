# Strapi Meilisearch Exporter

A plugin for Strapi v5 that allows exporting data to Meilisearch in JSON or NDJSON format.

## Installation

1. Add the plugin to your Strapi project.

```bash
npm install strapi-plugin-meilisearch-export
```

2. Enable and configure the plugin in the `config/plugins.ts` file of your Strapi project.

```typescript
export default {
  'meilisearch-export': {
    enabled: true,
    config: {
      host: process.env.MEILISEARCH_HOST,
      apiKey: process.env.MEILISEARCH_API_KEY,
      index: [
        {
          indexName: 'articles_index', // Meilisearch index name
          format: 'ndjson', // Choice between 'json' and 'ndjson'
          collection: 'api::article.article', // Strapi Collection
          fields: ['title', 'content', 'author'],
          populate: ['categories'], 
          transformEntry: ({ entry }: { entry: any }) => {
            return {
              ...entry,
              categories: entry.categories.map(category => category.label)
            }
          },
          settings: {
            searchableAttributes: ['title', 'content', 'author', 'categories'],
            ...
          }
        },
        ...
        {
          indexName: 'users_index',
          collection: 'api::user.user',
          fields: ['username', 'email'],
          settings: {
            searchableAttributes: ['username', 'email'],
            ...
          }
        }
      ],
    }
  }
};
```

## Utilisation
After configuring the plugin, the lifecycle hooks will automatically export the data to Meilisearch as a background task (using Strapi's collection `lifecycle hooks` feature).

## Error Management
In case of errors during export, error messages will be logged in the Strapi log. Make sure to check the logs for additional information.

## Admin Interface
The plugin adds a new page in the Strapi admin interface, accessible via the main menu. This interface allows you to:
- Select an index from those configured (with internationalization support)
- Manage index content:
  - Rebuild index: Clears the index and re-exports all collection data to Meilisearch
  - Delete index: Removes the index and its data from Meilisearch
- Manage configuration:
  - Update settings: Synchronizes search settings (searchableAttributes, etc.) with Meilisearch based on the plugin configuration in `config/plugins.ts`

## Contributions
Contributions are welcome! Please open an issue or submit a pull request if you have suggestions or corrections.

## License
MIT

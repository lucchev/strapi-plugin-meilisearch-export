export default [
  {
    method: 'GET',
    path: '/settings',
    handler: 'controller.getPluginSettings',
    config: {
      policies: ['admin::isAuthenticatedAdmin']
    },
  },
  {
    method: 'DELETE',
    path: '/indexes/:indexName',
    handler: 'controller.deleteIndex',
    config: {
      policies: []
    },
  },
  {
    method: 'PUT',
    path: '/indexes/:indexName/settings',
    handler: 'controller.updateIndexSettings',
    config: {
      policies: ['admin::isAuthenticatedAdmin']
    },
  },
  {
    method: 'PUT',
    path: '/indexes/:indexName',
    handler: 'controller.rebuildIndex',
    config: {
      policies: ['admin::isAuthenticatedAdmin']
    },
  }
];

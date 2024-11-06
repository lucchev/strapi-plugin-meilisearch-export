import type { Core } from '@strapi/strapi';
import { Context } from 'koa';
import { pluginId } from '../pluginId';
const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  getPluginSettings: async (ctx: Context) => {
    return strapi.plugin(pluginId).service('settings').get();
  },
  updateIndexSettings: async (ctx: Context) => {
    const { indexName } = ctx.params;
    return strapi.plugin(pluginId).service('indexes').updateSettings(indexName);
  },
  rebuildIndex: async (ctx: Context) => {
    const { indexName } = ctx.params;
    return strapi.plugin(pluginId).service('indexes').rebuild(indexName);
  },
  deleteIndex: async (ctx: Context) => {
    const { indexName } = ctx.params;
    return strapi.plugin(pluginId).service('indexes').delete(indexName);
  }
});

export default controller;

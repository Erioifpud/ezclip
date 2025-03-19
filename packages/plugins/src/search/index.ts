import type { ActionContext, Plugin } from '@ezclip/core';

export default {
  namespace: 'com.ezclip.search',
  name: '搜索',
  version: {
    plugin: '1.0.0',
    data: 0
  },
  author: 'ezclip',
  description: '搜索跳转插件',
  permissions: ['open'],
  configForm: [
    {
      type: 'text',
      label: '搜索引擎',
      name: 'url',
      defaultValue: 'https://www.google.com/search?q={keyword}',
      props: {
        placeholder: '{keyword} 会被替换为搜索关键字',
      }
    }
  ],
  actions: [
    {
      id: 'search.open',
      name: '搜索跳转',
      icon: '搜',
      description: '用关键字进行搜索，跳转到指定搜索引擎',
      execute: async (ctx: ActionContext) => {
        const url = ctx.config.get('url')
        const text = ctx.selection.text
        const keyword = encodeURIComponent(text)
        ctx.utils.open(url.replace('{keyword}', keyword))
      }
    }
  ],
} as Plugin

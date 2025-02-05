import type { ActionContext, Plugin } from '@ezclip/core';

export default {
  namespace: 'com.ezclip.example',
  name: '示例插件',
  version: {
    plugin: '1.0.0',
    data: 0
  },
  author: 'ezclip',
  description: '示例插件',
  permissions: [],
  configForm: [],
  actions: [
    {
      id: 'example.foo',
      name: 'foo',
      icon: '🍎',
      description: 'foo',
      execute: async (ctx: ActionContext) => {
        ctx.tooltip.toast.success('example action 🍎')
      }
    }
  ],
  migrates: {}
} as Plugin;
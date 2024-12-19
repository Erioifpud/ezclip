import { Plugin } from '@/store/plugin';

export const builtinPlugin: Plugin = {
  namespace: 'com.eclip.builtin',
  name: '基础功能',
  version: {
    plugin: '1.0.0',
    data: 0
  },
  author: 'eclip',
  description: '提供复制等基础功能',
  permissions: ['clipboard'],
  configForm: [],
  actions: [
    {
      id: 'builtin.copy',
      name: '复制',
      icon: '📋',
      description: '复制选中的文本',
      execute: async (ctx) => {
        await ctx.utils.clipboard?.writeText(ctx.selection.text);
        ctx.tooltip.showMessage('已复制到剪贴板');
        ctx.tooltip.close();
      }
    }
  ],
  migrates: {}
};
const search = `module.exports = {
namespace: 'com.example.<插件 id>',
  name: '搜索跳转模版插件',
  version: {
    plugin: '1.0.0',
    data: 0
  },
  author: 'me',
  description: '搜索跳转模版插件',
  permissions: ['open'],
  actions: [
    {
      id: '<动作 id>',
      name: '搜索跳转模版动作',
      icon: '搜',
      description: '搜索跳转模版动作',
      execute: async (ctx) => {
        const text = ctx.selection.text;
        ctx.utils.open(\`https://www.google.com/search?q=\${text}\`)
      }
    }
  ],
}`

const allTemplates: Record<string, string> = {
  none: '',
  search,
}

export default allTemplates

# 插件
远程的插件，不管源的来源，都可以在 `plugins` 目录下开发，然后通过 `build:plugins` 构建，最终会得到 UDM 形式的模块。

本地插件在设置中的调试页面点击添加，不能使用 ESM 模块导出，应该使用 CommonJS，在创建时会有相关的模板提供作为参考。

## 结构
```ts
interface Plugin {
  // 插件命名空间
  // 如 'com.example.base64'
  namespace: string;
  // 插件名称
  // 如 'Base64 工具'
  name: string;
  version: {
    // 插件的版本，语义化
    plugin: string;
    // 数据的版本，用于数据迁移
    data: number;
  };
  // 作者
  author: string;
  // 描述
  description: string;
  // 权限
  // 影响 Action 中具体能使用的功能
  permissions: string[];
  // 配置项
  configForm: PluginFormField[];
  // 插件提供的动作
  // 结构参考 action.md
  actions: Action[];
  // 数据迁移函数
  migrates: Record<number, (oldConfig: any) => any>;
  // 插件的标签（暂无用途）
  tags?: string[];
  // 插件的主页
  homepage?: string;
}
```

## 权限
权限影响动作中能使用的 API，文档的更新可能不及时，最新数据可以在 `createActionContext.ts` 中查看。

目前能使用的有：`storage`、`fetch`、`xhr`、`clipboard`、`download`、`open`，具体的功能都来源于 GM API，如果需要补充可以提交 PR。

比如说要在动作中打开网页，应该在插件中声明 `open` 这个权限，然后通过 `ctx.utils.open` 访问。

## 配置
是**插件层面**的配置，提供**表单组件的描述**，在脚本的插件设置面板中会显示一套表单，填写后在动作中可以读取，无法修改（动作的数据储存可以参考 [action.md](./action.md)）。

具体的表单描述项可以参考 `config.ts` 文件。

比如提供了如下的描述，可以生成名称（字符串）与年龄（滑块）表单：
```ts
[
  {
    label: '名称',
    name: 'name',
    type: 'text',
    defaultValue: 'ezclip',
  },
  {
    label: '年龄',
    name: 'age',
    type: 'slider',
    props: {
      min: 1,
      max: 100,
    }
  }
]
```

## 数据迁移
插件的配置数据会保存在 `GM_value` 中，如果出现版本更新需要对数据进行调整的情况，应该在 `migrates` 中提供迁移函数，这样脚本会对本地的插件的 `version.data` 和即将安装插件的 `version.data` 进行比对，然后通过 `migrates` 逐级进行更新。

比方说本地的数据版本是 0，要安装的数据版本是 2，开发者应该提供两个迁移函数：
```ts
{
  migrates: {
    // 从 0 到 1
    1: (oldData: any) => newData,
    // 从 1 到 2
    2: (oldData: any) => newData,
  }
}
```

## 关于更新插件
只要保持 `namespace` 一致，脚本就会自动**覆盖安装**新的插件并做迁移，所以也要注意不要和其他插件“重名”。
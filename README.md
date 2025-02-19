# EzClip

一个用于**快速处理选中文本**的 UserScript 脚本，需要配合 [Tampermonkey](https://tampermonkey.net/) 或者 [Violentmonkey](https://violentmonkey.github.io/) 使用。

## 安装
首先要确保你已经安装了 [Tampermonkey](https://tampermonkey.net/) 或者 [Violentmonkey](https://violentmonkey.github.io/)。

然后点击 [这里](待定) 安装脚本。

## 使用
安装完成后，在任意网页中选中文字，就会弹出 EzClip 的迷你菜单，你可以选择其中的功能来处理选中的文本。

## 功能
1. 文本复制（内置插件，可以选择禁用）
2. 快捷搜索（远程插件）
3. ...

额外的功能可以通过应用中心的方式去安装，也可以通过本地代码的形式安装。

具体的开发文档可以参考 [这里](待定)。

## 关于子模块
本项目使用 [pnpm](https://pnpm.io/) 作为包管理工具，并使用 [pnpm-workspace](https://pnpm.io/workspace) 来管理子模块。

1. [EzClip-Core](./packages/core) 是 EzClip 的核心模块，包含了 EzClip 的基本功能与设置界面等
2. [EzClip-Plugins](./packages/plugins) 是 EzClip 的插件模块，包含了所有**官方源**的插件，有需要可以自建源，参考 [这里](待定)

## 常见问题
### 为什么生产和开发环境不使用同样的注入方式
开发使用 `document.body.insertBefore` 的方式注入（将脚本动态插入到页面中），因为这个脚手架默认就使用这种方式，将所有资源一并注入。

但这样会存在样式冲突，因为项目使用的是 tailwindcss，即便修改了 prefix，在注入同样使用 tailwindcss 的页面后，也无法彻底避免冲突。

所以生产环境使用的是脚手架提供的 `cssSideEffects` 功能，在等待 tailwindcss 给出编译后的 css 后，手动创建 shadow root，然后将 css 插入到 shadow root 中，做一个样式隔离。

目前开发环境依然会存在与页面样式冲突的问题，但生产环境不会（目前只发现了页面自己的 dark/light 会影响插件），两个环境的行为并不一致，由于 `cssSideEffects` 并不会在开发环境生效，所以在找到新的方案之前，依然会保留这种怪异的解决办法。

## 贡献
如果你有任何想法或者建议，欢迎提交 Issues 或者 Pull Requests。

## 许可证
本项目基于 [MIT 许可证](LICENSE) 发布。

## 参考
- [PopClip](https://www.popclip.app/)
- [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved)

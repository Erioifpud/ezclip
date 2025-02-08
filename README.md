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

## 贡献
如果你有任何想法或者建议，欢迎提交 Issues 或者 Pull Requests。

## 许可证
本项目基于 [MIT 许可证](LICENSE) 发布。

## 参考
- [PopClip](https://www.popclip.app/)
- [Bilibili-Evolved](https://github.com/the1812/Bilibili-Evolved)

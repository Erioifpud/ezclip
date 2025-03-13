# 动作
动作是工具栏中的具体功能，会显示为按钮，并且在点击后可能会执行一些操作。

## 结构
```ts
interface Action {
  // 动作唯一标识
  // 如 'base64.encode'
  id: string;
  // 动作名称
  // 如 '编码'
  name: string;
  // 动作图标
  // 可以是图片地址，也可以是文字
  icon: string;
  // 动作描述
  description?: string;
  // 判断是否显示此动作按钮
  // text 为选中的文本，url 为当前页面地址
  shouldShow?: (text: string, url: string) => boolean;
  // 点击执行的动作
  execute: (context: ActionContext) => void | Promise<void>;
  // 主题色（按钮的自定义背景色）
  primaryColor?: string;
  // 字体、图标颜色
  secondaryColor?: string;
}
```

## Context
Context 是工具栏运行时的上下文，里面包括了工具栏当前的一些状态，还有动作可以访问的 API。

```ts
interface SelectionInfo {
  text: string;
  position: { x: number; y: number };
}

interface ActionContext {
  // 插件的部分元信息
  meta: {
    namespace: string;
    version: {
      data: number;
      plugin: string;
    }
  };
  // 工具栏状态
  selection: SelectionInfo;
  // 弹窗消息的相关 API
  tooltip: {
    toast: typeof toast;
    close: () => void;
    setLoading: (loading: boolean) => void;
    showMessage: (message: string) => void;
    setError: () => void;
    resetStatus: () => void;
  };
  // 读取插件设置
  config: {
    get: (key: string) => any;
  };
  // 由插件 permission 决定的 Utils API
  utils: Partial<UtilsMap>;
  // 点击动作按钮时按下的修饰键（暂未实现）
  modifierKey: {
    isCtrl: boolean;
    isShift: boolean;
    isAlt: boolean;
  };
  // 动作的版本号
  version: number;
}
```
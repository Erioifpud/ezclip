import { proxy, subscribe } from "valtio";
import { ActionContext } from "@/lib/createActionContext";
import { PluginFormField } from "./config";
import { builtinPlugin } from "./builtin";
import { parsePlugin } from "@/lib/parsePlugin";
import { getActionId } from "./utils";
import { GM_getValue, GM_setValue } from "$";
import { createSandbox } from "@/lib/sandbox";
import { throttle } from "lodash-es";

/*
插件作为“容器”，主要用处是注册 action 和提供基本信息
action 是插件提供的功能单元，会作为按钮显示在 Tooltip 中
禁用和启用的概念也是针对 action 的，所以当插件被安装的时候，他就是“启用”的
当所有 action 都被禁用时，插件在**逻辑上**就被禁用了，因为他的 action 全都不可用
*/

export interface Action {
  id: string;          // 动作唯一标识，如 'base64.encode'
  name: string;        // 动作名称，如 '编码'
  icon: string;        // 动作图标
  description?: string;// 动作描述
  // 判断是否显示此动作按钮
  shouldShow?: (text: string) => boolean;
  execute: (context: ActionContext) => void | Promise<void>;
  primaryColor?: string;
  secondaryColor?: string;
  // 动作所属的插件，自动注入
  _plugin?: Plugin;
}

export interface Plugin {
  namespace: string;   // 如 'com.example.base64'
  name: string;        // 插件名称，如 'Base64 工具'
  version: {
    // 插件的版本，语义化
    plugin: string;
    // 数据的版本，用于数据迁移
    data: number;
  };
  author: string;
  description: string;
  permissions: string[];
  configForm: PluginFormField[];     // 插件级别的配置
  actions: Action[];   // 插件提供的所有动作
  migrates: Record<number, (oldConfig: any) => any>;
  supportedPlatforms?: string[];
  tags?: string[];
  homepage?: string;
  // 插件来源（注册时不需要提供，加载插件时自动注入来源）
  _source?: 'local' | 'remote' | 'builtin';
  // 本地插件的源码
  _sourceCode?: string;
}

export interface PluginStore {
  remotePlugins: Plugin[];
  localPlugins: Plugin[];
  builtinPlugins: Plugin[];
  // 记录启用的 action id
  enabledActions: string[];  // 格式: 'namespace.actionId'
  // 插件配置保持不变
  pluginSettings: Record<string, Record<string, any>>;
  // 已安装的插件
  installedPlugins: Plugin[];
}

// 持久化的数据结构
interface PluginStoreData {
  remotePlugins: {
    sourceCode: string;
    namespace: string;
  }[];
  localPlugins: {
    sourceCode: string;
    namespace: string;
  }[];
  enabledActions: string[];
  pluginSettings: Record<string, Record<string, any>>;
}

// --------------------------------------------

// 从 GM_getValue 恢复数据
function hydratePluginStore(): PluginStore {
  const data = GM_getValue<PluginStoreData>('plugin_store', {
    remotePlugins: [],
    localPlugins: [],
    enabledActions: ['com.eclip.builtin.builtin.copy'],
    pluginSettings: {},
  });

  const sandbox = createSandbox();

  // 恢复远程插件
  const remotePlugins = data.remotePlugins.map(item => {
    const [exported] = sandbox.run(item.sourceCode || '');
    return parsePlugin('remote', exported as Plugin, item.sourceCode || '');
  });

  // 恢复本地插件
  const localPlugins = data.localPlugins.map(item => {
    const [exported] = sandbox.run(item.sourceCode || '');
    return parsePlugin('local', exported as Plugin, item.sourceCode || '');
  });

  const builtinPlugins = [
    parsePlugin('builtin', builtinPlugin, ''),
  ];

  return {
    remotePlugins,
    localPlugins,
    // 不需要持久化
    builtinPlugins,
    enabledActions: data.enabledActions,
    pluginSettings: data.pluginSettings,
    // 不需要持久化
    installedPlugins: [...builtinPlugins, ...localPlugins, ...remotePlugins],
  };
}

export const pluginStore = proxy<PluginStore>(hydratePluginStore());

const updateHandler = throttle(() => {
  const data: PluginStoreData = {
    remotePlugins: pluginStore.remotePlugins.map(plugin => ({
      sourceCode: plugin._sourceCode!,
      namespace: plugin.namespace,
    })),
    localPlugins: pluginStore.localPlugins.map(plugin => ({
      sourceCode: plugin._sourceCode!,
      namespace: plugin.namespace,
    })),
    enabledActions: pluginStore.enabledActions,
    pluginSettings: pluginStore.pluginSettings,
  };
  GM_setValue('plugin_store', data);
}, 1000);

// 订阅 store 变更，自动保存数据
subscribe(pluginStore, updateHandler);

export const pluginActions = {
  setActionEnabled(action: Action, state: boolean) {
    const actionId = getActionId(action);
    const index = pluginStore.enabledActions.findIndex(item => item === actionId)
    if (index === -1 && state) {
      pluginStore.enabledActions = [...pluginStore.enabledActions, actionId]
      return
    }
    pluginStore.enabledActions = pluginStore.enabledActions.filter(item => item !== actionId)
  }
}

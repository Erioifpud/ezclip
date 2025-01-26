import { Plugin } from "@/store/plugin";
import { createSandbox } from "./sandbox";
import { parsePlugin } from "./parsePlugin";
import { pluginStore } from "@/store/plugin";
import { appStore } from "@/store/app";
import { getActionId } from "@/store/plugin/utils";

export interface PluginMeta {
  id: string;
  name: string;
  description: string;
  version: string;
  entry: {
    type: 'cdn' | 'url';
    path: string;
  };
}

function getPluginUrl(entry: PluginMeta['entry']) {
  if (entry.type === 'cdn') {
    const { cdnRoot } = appStore;
    if (!cdnRoot) {
      throw new Error(`Source doesn't support CDN`);
    }
    return `${cdnRoot}${entry.path}`;
  }
  return entry.path;
}

export type DiffPluginResult = {
  existed: false;
} | {
  existed: true;
  existedPlugin: Plugin;
  newPlugin: Plugin;
  existedVersion: string;
  newVersion: string;
  existedActionsCount: number;
  newActionsCount: number;
};

export function diffPlugin(plugin: Plugin): DiffPluginResult {
  const { installedPlugins } = pluginStore;
  const exist = installedPlugins.find(p => p.namespace === plugin.namespace);
  if (!exist) {
    return {
      existed: false,
    }
  }
  return {
    existed: true,
    existedPlugin: exist,
    newPlugin: plugin,
    existedVersion: exist.version.plugin,
    newVersion: plugin.version.plugin,
    existedActionsCount: exist.actions.length,
    newActionsCount: plugin.actions.length,
  }
}

// 通过元数据获取插件的代码并执行
export async function runPluginCodeByMeta(meta: PluginMeta) {
  try {
    // 1. 获取完整的插件URL
    const fullPath = getPluginUrl(meta.entry);

    // 2. 获取插件代码
    const response = await fetch(fullPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch plugin: ${response.statusText}`);
    }
    const code = await response.text();

    // 3. 在沙箱中执行代码
    const sandbox = createSandbox();
    const [exported] = sandbox.run(code);

    if (!exported || typeof exported !== 'object') {
      throw new Error('Invalid plugin format');
    }

    // 4. 解析插件
    const parsedPlugin = parsePlugin('remote', exported as Plugin, code);

    return parsedPlugin;
  } catch (error) {
    console.error('Failed to load plugin:', error);
    throw error;
  }
}

// 覆盖安装远程插件
export function installRemotePlugin(plugin: Plugin) {
  // 这里的 plugin 是已经解析过的插件，已经包含 _sourceCode
  if (!plugin._sourceCode) {
    throw new Error('Plugin source code is not available');
  }
  const remotePlugins = [...pluginStore.remotePlugins];
  const enabledActions = [...pluginStore.enabledActions];
  const isExisted = remotePlugins.findIndex(p => p.namespace === plugin.namespace);
  if (isExisted >= 0) {
    remotePlugins.splice(isExisted, 1);
    enabledActions.splice(isExisted, 1);
  }
  pluginStore.remotePlugins = [...remotePlugins, plugin];
  // 默认启用新插件的所有 action
  pluginStore.enabledActions = [...enabledActions, ...plugin.actions.map(action => getActionId(action))];
}

export async function loadLocalPlugin(code: string) {
  const sandbox = createSandbox();
  const [exported] = sandbox.run(code);
  if (!exported || typeof exported !== 'object') {
    throw new Error('Invalid plugin format');
  }
  const plugin = parsePlugin('local', exported as Plugin, code);
  const diff = diffPlugin(plugin);
  if (diff.existed) {
    throw new Error('Plugin already exists');
  }
  pluginStore.localPlugins = [...pluginStore.localPlugins, plugin];
  pluginStore.enabledActions = [...pluginStore.enabledActions, ...plugin.actions.map(action => getActionId(action))];
  return plugin;
}

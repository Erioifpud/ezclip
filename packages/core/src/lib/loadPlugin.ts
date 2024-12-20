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
  const { remotePlugins, localPlugins, builtinPlugins } = pluginStore;
  const allPlugin = [...remotePlugins, ...localPlugins, ...builtinPlugins];
  const exist = allPlugin.find(p => p.namespace === plugin.namespace);
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

export async function loadRemotePlugin(meta: PluginMeta) {
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

    // 4. 解析插件并添加到 store
    const plugin = parsePlugin('remote', exported as Plugin);

    // 5. 验证插件 ID 是否匹配
    if (plugin.namespace !== meta.id) {
      throw new Error('Plugin ID mismatch');
    }

    const diff = diffPlugin(plugin);
    if (diff.existed) {
      throw new Error('Plugin already exists');
    }

    // 6. 添加到 store
    pluginStore.remotePlugins = [...pluginStore.remotePlugins, plugin];
    pluginStore.enabledActions = [...pluginStore.enabledActions, ...plugin.actions.map(action => getActionId(action))];

    return plugin;
  } catch (error) {
    console.error('Failed to load plugin:', error);
    throw error;
  }
}

export async function loadLocalPlugin(code: string) {
  const sandbox = createSandbox();
  const [exported] = sandbox.run(code);
  if (!exported || typeof exported !== 'object') {
    throw new Error('Invalid plugin format');
  }
  const plugin = parsePlugin('local', exported as Plugin);
  const diff = diffPlugin(plugin);
  if (diff.existed) {
    throw new Error('Plugin already exists');
  }
  pluginStore.localPlugins = [...pluginStore.localPlugins, plugin];
  pluginStore.enabledActions = [...pluginStore.enabledActions, ...plugin.actions.map(action => getActionId(action))];
  return plugin;
}

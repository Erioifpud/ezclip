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
    const normalizedBase = cdnRoot.endsWith('/') ? cdnRoot : `${cdnRoot}/`;
    const url = new URL(entry.path, normalizedBase);
    return url.toString();
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

function doDataMigrate(existed: Plugin, remote: Plugin) {
  // 数据迁移
  const localVersion = existed.version.data;
  const remoteVersion = remote.version.data;
  if (localVersion < remoteVersion) {
    // 远程插件版本较新
    // 版本号差距
    const versions = Array.from(
      { length: remoteVersion - localVersion },
      (_, i) => localVersion + i + 1
    );
    // 本地配置
    const config = pluginStore.pluginSettings[remote.namespace] || {};
    // 逐版本升级
    versions.forEach(version => {
      const migrate = remote.migrates[version];
      if (typeof migrate === 'function') {
        // 执行迁移并更新配置
        const newConfig = migrate(config) || {};
        pluginStore.pluginSettings[remote.namespace] = newConfig;
      }
    });
  }
}

export function installPlugin(plugin: Plugin, source: 'remote' | 'local') {
  // 这里的 plugin 是已经解析过的插件，已经包含 _sourceCode
  if (!plugin._sourceCode) {
    throw new Error('Plugin source code is not available');
  }
  const isRemote = source === 'remote';
  const pluginKey = isRemote ? 'remotePlugins' : 'localPlugins';
  const pluginList = [...pluginStore[pluginKey]];
  const enabledActions = [...pluginStore.enabledActions];
  const isExisted = pluginList.findIndex(p => p.namespace === plugin.namespace);
  if (isExisted >= 0) {
    // 更新时的数据迁移
    const existedPlugin = pluginList[isExisted];
    doDataMigrate(existedPlugin, plugin);

    pluginList.splice(isExisted, 1);
    enabledActions.splice(isExisted, 1);
  }
  pluginStore[pluginKey] = [...pluginList, plugin];
  // 默认启用新插件的所有 action
  pluginStore.enabledActions = [...enabledActions, ...plugin.actions.map(action => getActionId(action))];
}

// 覆盖安装远程插件
export function installRemotePlugin(plugin: Plugin) {
  installPlugin(plugin, 'remote');
}

// 覆盖安装本地插件
export function installLocalPlugin(plugin: Plugin) {
  installPlugin(plugin, 'local');
}

// 加载本地代码为插件
export async function loadLocalPlugin(code: string) {
  const sandbox = createSandbox();
  const [exported] = sandbox.run(code);
  if (!exported || typeof exported !== 'object') {
    throw new Error('Invalid plugin format');
  }
  return parsePlugin('local', exported as Plugin, code);
}

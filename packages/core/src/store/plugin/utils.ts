import { Action, Plugin, pluginStore } from './index';

export function getActionId(action: Action): string {
  return `${action._plugin?.namespace}.${action.id}`;
}

// 判断插件是否"启用"（至少有一个 action 被启用）
export function isPluginEnabled(plugin: Plugin): boolean {
  return plugin.actions.some(action => 
    pluginStore.enabledActions.includes(`${plugin.namespace}.${action.id}`)
  );
}

// 获取插件已启用的 actions 数量
export function getEnabledActionCount(plugin: Plugin): number {
  return plugin.actions.filter(action => 
    pluginStore.enabledActions.includes(`${plugin.namespace}.${action.id}`)
  ).length;
}

// 启用/禁用插件的所有 actions
export function togglePluginActions(plugin: Plugin, enabled: boolean) {
  const actionIds = plugin.actions.map(action => `${plugin.namespace}.${action.id}`);
  
  if (enabled) {
    pluginStore.enabledActions = [...new Set([
      ...pluginStore.enabledActions,
      ...actionIds
    ])];
  } else {
    pluginStore.enabledActions = pluginStore.enabledActions.filter(
      id => !actionIds.includes(id)
    );
  }
} 
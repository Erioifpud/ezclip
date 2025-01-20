import { FormValueType } from './config';
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

// 根据插件的配置创建初始表单值
export function initPluginConfig(plugin: Plugin): FormValueType<typeof plugin.configForm> {
  return plugin.configForm?.reduce((acc, field) => {
    if (field.defaultValue !== undefined) {
      acc[field.name] = field.defaultValue;
      return acc;
    }
    // 如果没有 defaultValue，则根据 type 推断默认值
    switch (field.type) {
      case 'text':
      case 'textarea':
      case 'color':
        acc[field.name] = '';
        break;
      case 'number':
      case 'slider':
        acc[field.name] = 0;
        break;
      case 'switch':
        acc[field.name] = false;
        break;
      case 'select':
        // 使用第一个选项作为默认值
        acc[field.name] = field.options[0]?.value ?? '';
        break;
      case 'list':
        acc[field.name] = [];
        break;
      case 'date':
        acc[field.name] = new Date();
        break;
    }
    return acc;
  }, {} as Record<string, any>);
}

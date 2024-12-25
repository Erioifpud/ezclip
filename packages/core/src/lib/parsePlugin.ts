import { Plugin } from "@/store/plugin";

export const parsePlugin = (source: 'local' | 'remote' | 'builtin', plugin: Plugin, code: string) => {
  const { actions } = plugin;
  actions.forEach(action => {
    action._plugin = plugin;
    // 规范一下格式，默认会使用当前主题的颜色
    if (!action.primaryColor) {
      action.primaryColor = '';
    }
    if (!action.secondaryColor) {
      action.secondaryColor = '';
    }
  });
  plugin._source = source;
  plugin._sourceCode = code;
  return plugin;
}
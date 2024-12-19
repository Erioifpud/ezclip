import { Plugin } from "@/store/plugin";

export const parsePlugin = (source: 'local' | 'remote' | 'builtin', plugin: Plugin) => {
  const { actions } = plugin;
  actions.forEach(action => {
    action._plugin = plugin;
  });
  plugin._source = source;
  return plugin;
}
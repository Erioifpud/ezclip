import { pluginStore } from "@/store/plugin";
import { filter, flatMap } from 'lodash-es';

export function useEnabledPlugins() {
  const { remotePlugins, localPlugins } = pluginStore;
  const enabledPlugins = pluginStore.enabledPlugins;
  const plugins = filter([...remotePlugins, ...localPlugins], plugin => enabledPlugins.includes(plugin.namespace));
  
  return plugins;
}

export function useEnabledActions() {
  const plugins = useEnabledPlugins();
  return flatMap(plugins, plugin => plugin.actions);
}

import { pluginStore } from "@/store/plugin";
import { flatMap } from "lodash-es";

export function useEnabledActions() {
  const { remotePlugins, localPlugins, enabledActions } = pluginStore;
  const allPlugins = [...remotePlugins, ...localPlugins];
  
  return flatMap(allPlugins, plugin => 
    plugin.actions.filter(action => 
      enabledActions.includes(`${plugin.namespace}.${action.id}`)
    )
  );
}
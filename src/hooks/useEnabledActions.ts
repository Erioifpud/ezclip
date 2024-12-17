import { pluginStore } from "@/store/plugin";
import { getActionId } from "@/store/plugin/utils";
import { flatMap } from "lodash-es";

export function useEnabledActions() {
  const { remotePlugins, localPlugins, enabledActions } = pluginStore;
  const allPlugins = [...remotePlugins, ...localPlugins];
  
  return flatMap(allPlugins, plugin => 
    plugin.actions.filter(action => 
      enabledActions.includes(getActionId(action))
    )
  );
}
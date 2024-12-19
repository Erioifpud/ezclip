import { pluginStore } from "@/store/plugin";
import { getActionId } from "@/store/plugin/utils";
import { flatMap } from "lodash-es";

export function useEnabledActions() {
  const { remotePlugins, localPlugins, builtinPlugins, enabledActions } = pluginStore;
  const allPlugins = [...remotePlugins, ...localPlugins, ...builtinPlugins];

  return flatMap(allPlugins, plugin =>
    plugin.actions.filter(action =>
      enabledActions.includes(getActionId(action))
    )
  );
}
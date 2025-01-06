import { Switch } from "@/components/ui/switch";
import { Action, pluginStore,pluginActions } from "@/store/plugin";
import { getActionId } from "@/store/plugin/utils";
import { memo, useMemo } from "react";
import { useSnapshot } from "valtio";

interface Props {
  actions: Action[]
  pluginId: string
}

const ActionList = memo(({ actions, pluginId }: Props) => {
  const pluginState = useSnapshot(pluginStore)

  const enabledMap = useMemo(() => {
    return actions.reduce((acc, action) => {
      const actionId = getActionId(action)
      acc[action.id] = pluginState.enabledActions.includes(actionId)
      return acc
    }, {} as Record<string, boolean>)
  }, [actions, pluginState.enabledActions])

  return (
    <div className="ec-flex ec-flex-col ec-gap-2 ec-rounded-md ec-p-2 ec-ml-2">
      {actions.map(action => (
        <div key={action.id} className="ec-flex ec-items-center ec-justify-between ec-border ec-p-2 ec-rounded-lg">
          <div className="ec-flex ec-flex-col ec-flex-grow ec-min-w-0">
            <span className="ec-font-semibold ec-tracking-tight ec-text-card-foreground ec-truncate">{action.name}</span>
            <span className="ec-text-muted-foreground ec-truncate ec-text-sm" title={action.description}>{action.description}</span>
          </div>
          {/* 启用状态 */}
          <Switch
            checked={enabledMap[action.id]}
            onCheckedChange={(checked) => {
              pluginActions.setActionEnabled(action, checked)
            }}
          />
        </div>
      ))}
    </div>
  )
})

export default ActionList

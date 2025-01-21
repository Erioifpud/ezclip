import { PlugIcon, ChevronUpIcon, ChevronDownIcon, TrashIcon } from "lucide-react"
import { Fragment, memo, useCallback, useEffect, useState } from "react"
import { TitleBar } from "../components/TitleBar"
import { useSnapshot } from "valtio"
import { pluginActions, pluginStore } from "@/store/plugin"
import { Button } from "@/components/ui/button"
import { Plugin } from "@/store/plugin"
import ActionList from "./ActionList"
import { PluginConfig } from "./PluginConfig"
import { confirmActions } from "@/store/confirm"

interface PluginExtra extends Plugin {
  expanded: boolean
  permissions: string[]
}

export const PluginTab = memo(() => {
  const pluginState = useSnapshot(pluginStore)

  const [plugins, setPlugins] = useState<PluginExtra[]>([])

  useEffect(() => {
    // @ts-ignore
    setPlugins(pluginState.installedPlugins.map(plugin => ({
      ...plugin,
      expanded: false,
    })))
  }, [pluginState.installedPlugins])

  const togglePluginExpanded = useCallback((namespace: string) => {
    const pluginIndex = plugins.findIndex(plugin => plugin.namespace === namespace)
    if (pluginIndex !== -1) {
      const newPlugins = [...plugins]
      newPlugins[pluginIndex].expanded = !newPlugins[pluginIndex].expanded
      setPlugins(newPlugins)
    }
  }, [plugins])

  return (
    <div className="ec-flex ec-flex-col ec-gap-4 ec-h-full">
      {/* 标题栏 */}
      <TitleBar title="插件管理" icon={<PlugIcon className="ec-w-4 ec-h-4" />} />
      {/* 内容区 */}
      <div data-ec-scrollbar className="ec-flex ec-flex-col ec-gap-4 ec-overflow-y-auto ec-px-2">
        <div className="ec-flex ec-flex-col ec-gap-2">
          {plugins.map((plugin) => (
            <Fragment key={plugin.namespace}>
              <div
                className="ec-flex ec-items-center ec-justify-between ec-border ec-p-2 ec-rounded-lg"
              >
                <div className="ec-flex ec-flex-col ec-flex-grow ec-min-w-0">
                  <span className="ec-font-semibold ec-tracking-tight ec-text-card-foreground ec-truncate">{plugin.name}</span>
                  <span className="ec-text-muted-foreground ec-truncate ec-text-sm" title={plugin.description}>{plugin.description}</span>
                </div>
                {/* 展开状态按钮 */}
                <Button
                  className="ec-border ec-border-transparent ec-flex-shrink-0 ec-ml-2"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    togglePluginExpanded(plugin.namespace)
                  }}
                >
                  {plugin.expanded
                    ? <ChevronUpIcon className="ec-w-4 ec-h-4" />
                    : <ChevronDownIcon className="ec-w-4 ec-h-4" />}
                </Button>
                {/* 编辑按钮 */}
                <PluginConfig plugin={plugin} />
                {/* 删除按钮 */}
                <Button
                  className="ec-border ec-border-transparent ec-flex-shrink-0 ec-ml-2"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    confirmActions.confirm({
                      title: '确认删除插件',
                      description: '删除插件后，插件将不再生效',
                    }).then(res => {
                      if (res) {
                        pluginActions.uninstallPlugin(plugin.namespace)
                      }
                    })
                  }}
                >
                  <TrashIcon className="ec-w-4 ec-h-4" />
                </Button>
              </div>

              {plugin.expanded && (
                <ActionList actions={plugin.actions} pluginId={plugin.namespace} />
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
})

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { PluginMetaWithInstalled } from "../type";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { InstallPlugin } from "./install";
import { UpdatePlugin } from "./update";
import { useSnapshot } from "valtio";
import { pluginStore } from "@/store/plugin";
import { Plugin } from "@/store/plugin";
import { runPluginCodeByMeta } from "@/lib/loadPlugin";
import { toast } from "sonner";

interface Props {
  meta: PluginMetaWithInstalled
  onClose: () => void
  onInstall: (plugin: Plugin) => void
}

export const InstallDialog = memo((props: Props) => {
  const { meta, onClose, onInstall } = props
  const pluginState = useSnapshot(pluginStore)
  const [newPlugin, setNewPlugin] = useState<Plugin | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isUpdate = useMemo(() => {
    return meta.installed && meta.diffVersion
  }, [meta])

  // 已安装的插件
  const existedPlugin = useMemo(() => {
    if (!meta.installed) {
      return null
    }
    const plugin = pluginState.installedPlugins.find(plugin => plugin.namespace === meta.id)
    return plugin as Plugin | null
  }, [meta, pluginState.installedPlugins])

  // 加载新插件代码
  useEffect(() => {
    if (meta) {
      setIsLoading(true)
      runPluginCodeByMeta(meta).then((parsedPlugin) => {
        setNewPlugin(parsedPlugin)
      }).finally(() => {
        setIsLoading(false)
      })
    }
  }, [meta])

  const onSubmit = useCallback(() => {
    if (newPlugin?.namespace === meta.id) {
      onInstall(newPlugin)
      return
    }
    toast.error('插件安装失败')
  }, [newPlugin, onInstall, meta])

  return (
    <div className="ec-fixed ec-max-w-[400px] ec-w-[90%] ec-max-h-full ec-flex ec-flex-col ec-top-1/2 ec-left-1/2 ec-bg-white ec-p-4 ec-shadow-lg ec-rounded-lg ec-border ec-border-gray-200 -ec-translate-x-1/2 -ec-translate-y-1/2">
      {/* 标题 */}
      <div className="ec-flex ec-justify-between ec-mb-2 ec-border-b ec-border-gray-200 ec-flex-shrink-0">
        <div className="ec-text-lg ec-font-bold ec-flex-grow">
          {
            isUpdate
              ? '插件更新'
              : '插件安装'
          }
        </div>
        <Button className="ec-flex-shrink-0" variant="ghost" size="icon" onClick={onClose}>
          <X className="ec-w-4 ec-h-4" />
        </Button>
      </div>
      {isLoading ? (
        <div className="ec-flex ec-flex-col ec-gap-4 ec-flex-grow ec-h-full ec-overflow-y-auto">
          <div className="ec-flex ec-flex-col ec-gap-2">
            <div className="ec-text-sm ec-text-gray-500">加载中...</div>
          </div>
        </div>
      ) : (
        <div className="ec-flex ec-flex-col ec-gap-4 ec-flex-grow ec-h-full ec-overflow-y-auto">
          {isUpdate
            ? <UpdatePlugin existedPlugin={existedPlugin} newPlugin={newPlugin} onSubmit={onSubmit} />
            : <InstallPlugin newPlugin={newPlugin} onSubmit={onSubmit} />
          }
        </div>
      )}
    </div>
  )
})

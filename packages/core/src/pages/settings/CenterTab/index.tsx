import { AppWindowIcon, CheckIcon, PlusIcon } from "lucide-react"
import { memo, useCallback, useEffect, useState } from "react"
import { TitleBar } from "../components/TitleBar"
import { useSnapshot } from "valtio"
import { appStore, Source } from "@/store/app"
import { loadRemotePlugin, PluginMeta } from "@/lib/loadPlugin"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { pluginStore } from "@/store/plugin"
import { AddSource } from "./AddSource"

function isInstalled(plugin: PluginMeta) {
  const localPlugin = pluginStore.installedPlugins.find(localPlugin => localPlugin.namespace === plugin.id)
  return {
    installed: !!localPlugin,
    diffVersion: !!localPlugin && localPlugin.version.plugin !== plugin.version,
    remoteVersion: plugin.version,
    localVersion: localPlugin?.version.plugin || '',
  }
}

interface PluginMetaWithInstalled extends PluginMeta {
  installed: boolean;
  // 新插件比当前插件版本高
  diffVersion: boolean;
  remoteVersion: string;
  localVersion: string;
}

export const CenterTab = memo(() => {
  const appState = useSnapshot(appStore)
  const [source, setSource] = useState<string>(appState.sources[0]?.url || '')
  const [metaList, setMetaList] = useState<PluginMetaWithInstalled[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(source).then(res => res.json()).then(plugins => {
      const metaList = plugins.map((plugin: PluginMeta) => {
        const { installed, diffVersion, remoteVersion, localVersion } = isInstalled(plugin)
        return {
          ...plugin,
          installed,
          diffVersion,
          remoteVersion,
          localVersion,
        }
      })
      setMetaList(metaList)
    })
  }, [source])

  const handleAdded = useCallback((src: Source) => {
    setSource(src.url)
  }, [])

  return (
    <div className="ec-flex ec-flex-col ec-gap-4 ec-h-full">
      {/* 标题栏 */}
      <TitleBar title="插件中心" icon={<AppWindowIcon className="ec-w-4 ec-h-4" />}>
        <div className="ec-flex ec-gap-2 ec-justify-end">
          {/* 添加应用源 */}
          <AddSource onAdded={handleAdded} />
          <div className="ec-w-40">
            <select
              className="ec-w-full ec-border ec-border-input ec-rounded-lg ec-p-2 ec-text-sm focus:ec-outline-primary"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              {appState.sources.map((source) => (
                <option key={source.name} value={source.url}>{source.name}</option>
              ))}
            </select>
          </div>
        </div>
      </TitleBar>
      {/* 内容区 */}
      <div data-ec-scrollbar className="ec-flex ec-flex-col ec-gap-4 ec-overflow-y-auto ec-px-2" >
        <div className="ec-flex ec-flex-col ec-gap-2">
          {metaList.map((meta) => (
            <div
              key={meta.id}
              className="ec-flex ec-items-center ec-justify-between ec-border ec-p-2 ec-rounded-lg"
            >
              <div className="ec-flex ec-flex-col ec-flex-grow ec-min-w-0">
                <span className="ec-font-semibold ec-tracking-tight ec-text-card-foreground ec-truncate">{meta.name}</span>
                <span className="ec-text-muted-foreground ec-truncate ec-text-sm" title={meta.description}>{meta.description}</span>
              </div>
              <Button
                className={
                  cn(
                    'ec-border ec-border-transparent ec-flex-shrink-0 ec-ml-2',
                    // 已安装的显示灰色
                    meta.installed
                    ? meta.diffVersion
                      ? 'ec-text-yellow-500 ec-border-yellow-500 hover:ec-text-yellow-500 hover:ec-border-yellow-500'
                      : 'ec-text-muted-foreground ec-border-muted-foreground hover:ec-text-muted-foreground hover:ec-border-muted-foreground'
                    : 'ec-text-green-500 ec-border-green-500 hover:ec-text-green-500 hover:ec-border-green-500'
                  )
                }
                variant="ghost"
                size="sm"
                disabled={(meta.installed && !meta.diffVersion) || loading}
                onClick={() => {
                  // 安装插件
                  // TODO: 先通过 runPluginCodeByMeta(meta) 获取插件的详情，然后弹窗比对信息，如果用户确认，则安装插件
                  setLoading(true)
                  loadRemotePlugin(meta).then(() => {
                    // 更新状态
                    setMetaList(prev => prev.map(item => item.id === meta.id ? { ...item, installed: true } : item))
                  }).finally(() => {
                    setLoading(false)
                  })
                }}
              >
                {
                  meta.installed
                  ? meta.diffVersion
                    ? <CheckIcon className="ec-w-4 ec-h-4" />
                    : <CheckIcon className="ec-w-4 ec-h-4" />
                  : <PlusIcon className="ec-w-4 ec-h-4" />
                }
                <span className="ec-ml-1 ec-text-sm">
                  {
                    meta.installed
                    ? meta.diffVersion
                      ? '更新'
                      : '已安装'
                    : '安装'
                  }
                </span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

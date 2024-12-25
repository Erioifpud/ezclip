import { ScrollArea } from "@/components/ui/scroll-area"
import { PlugIcon } from "lucide-react"
import { memo } from "react"
import { TitleBar } from "../components/TitleBar"

export const PluginTab = memo(() => {
  return (
    <div className="ec-flex ec-flex-col ec-gap-4 ec-h-full">
      {/* 标题栏 */}
      <TitleBar title="插件管理" icon={<PlugIcon className="ec-w-4 ec-h-4" />} />
      {/* 内容区 */}
      <ScrollArea className="ec-flex ec-flex-col ec-gap-4 ec-overflow-y-auto ec-px-2" >

      </ScrollArea>
    </div>
  )
})

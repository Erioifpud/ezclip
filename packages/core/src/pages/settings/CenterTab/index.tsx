import { ScrollArea } from "@/components/ui/scroll-area"
import { AppWindowIcon } from "lucide-react"
import { memo } from "react"
import { TitleBar } from "../components/TitleBar"

export const CenterTab = memo(() => {
  return (
    <div className="ec-flex ec-flex-col ec-gap-4 ec-h-full">
      {/* 标题栏 */}
      <TitleBar title="插件中心" icon={<AppWindowIcon className="ec-w-4 ec-h-4" />} />
      {/* 内容区 */}
      <ScrollArea className="ec-flex ec-flex-col ec-gap-4 ec-overflow-y-auto ec-px-2" >

      </ScrollArea>
    </div>
  )
})

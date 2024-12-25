import { ScrollArea } from "@/components/ui/scroll-area"
import { InfoIcon } from "lucide-react"
import { memo } from "react"
import { TitleBar } from "../components/TitleBar"

export const AboutTab = memo(() => {
  return (
    <div className="ec-flex ec-flex-col ec-gap-4 ec-h-full">
      {/* 标题栏 */}
      <TitleBar title="关于" icon={<InfoIcon className="ec-w-4 ec-h-4" />} />
      {/* 内容区 */}
      <ScrollArea className="ec-flex ec-flex-col ec-gap-4 ec-overflow-y-auto ec-px-2" >

      </ScrollArea>
    </div>
  )
})

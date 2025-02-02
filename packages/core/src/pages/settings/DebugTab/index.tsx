import { BugIcon } from "lucide-react"
import { memo } from "react"
import { TitleBar } from "../components/TitleBar"

export const DebugTab = memo(() => {
  return (
    <div className="ec-flex ec-flex-col ec-gap-4 ec-h-full">
      {/* 标题栏 */}
      <TitleBar title="调试" icon={<BugIcon className="ec-w-4 ec-h-4" />} />
      {/* 内容区 */}
      <div data-ec-scrollbar className="ec-flex ec-flex-col ec-gap-4 ec-overflow-y-auto ec-px-2">

      </div>
    </div>
  )
})

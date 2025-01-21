import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { appActions, Source } from "@/store/app"
import { PlusIcon, X } from "lucide-react"
import { memo, useCallback, useState } from "react"
import { toast } from "sonner"

interface Props {
  onAdded: (source: Source) => void
}

function isValidURL(url: string) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

export const AddSource = memo<Props>(({ onAdded }) => {
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState('')
  const [name, setName] = useState('')

  const handleAddSource = useCallback(() => {
    const trimedName = name.trim()
    const trimedSource = source.trim()
    if (!trimedName || !trimedSource) {
      toast.error('请输入名称和URL')
      return
    }
    // 检查是否是有效的URL
    if (!isValidURL(trimedSource)) {
      toast.error('请输入有效的URL')
      return
    }
    appActions.addSource({
      name: trimedName,
      url: trimedSource,
    })
    setOpen(false)
    setSource('')
    setName('')
    toast.success('添加成功')
    onAdded({
      name: trimedName,
      url: trimedSource,
    })
  }, [source, name, onAdded])

  return (
    <>
      <Button variant="default" size="sm" onClick={() => setOpen(true)}>
        <PlusIcon className="ec-w-4 ec-h-4" />
      </Button>
      {/* 不使用dialog，因为dialog的样式会影响到主应用的样式 */}
      {open && <div className="ec-fixed ec-w-80 ec-max-w-lg ec-top-1/2 ec-left-1/2 ec-bg-white ec-p-4 ec-shadow-lg ec-rounded-lg ec-border ec-border-gray-200 -ec-translate-x-1/2 -ec-translate-y-1/2">
        {/* 标题 */}
        <div className="ec-flex ec-justify-between ec-mb-2 ec-border-b ec-border-gray-200">
          <div className="ec-text-lg ec-font-bold ec-flex-grow">添加应用源</div>
          <Button className="ec-flex-shrink-0" variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="ec-w-4 ec-h-4" />
          </Button>
        </div>
        <div className="ec-flex ec-flex-col ec-gap-2">
          <Input placeholder="请输入应用源名称" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="请输入应用源地址" value={source} onChange={(e) => setSource(e.target.value)} />
          <Button variant="default" size="sm" onClick={handleAddSource}>添加</Button>
        </div>
      </div>}
    </>
  )
})

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { appActions, Source } from "@/store/app"
import { PlusIcon, X } from "lucide-react"
import { memo, useCallback, useState } from "react"

interface Props {
  onAdded: (source: Source) => void
}

export const AddSource = memo<Props>(({ onAdded }) => {
  const [open, setOpen] = useState(false)
  const [source, setSource] = useState('')
  const [name, setName] = useState('')

  const handleAddSource = useCallback(() => {
    const trimedName = name.trim()
    const trimedSource = source.trim()
    if (!trimedName || !trimedSource) {
      return
    }
    appActions.addSource({
      name: trimedName,
      url: trimedSource,
    })
    setOpen(false)
    setSource('')
    setName('')
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
        <div className="ec-flex ec-flex-col ec-gap-2">
          <div className="ec-flex ec-justify-between">
            <div className="ec-text-lg ec-font-bold">添加应用源</div>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="ec-w-4 ec-h-4" />
            </Button>
          </div>
          <Input placeholder="请输入应用源名称" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="请输入应用源地址" value={source} onChange={(e) => setSource(e.target.value)} />
          <Button variant="default" size="sm" onClick={handleAddSource}>添加</Button>
        </div>
      </div>}
    </>
  )
})

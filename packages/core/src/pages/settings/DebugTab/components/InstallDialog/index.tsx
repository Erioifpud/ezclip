import { ChangeEvent, memo, useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "../CodeEditor";
import { Dialog } from "@/components/Dialog";
import { installLocalPlugin, loadLocalPlugin } from "@/lib/loadPlugin";
import { toast } from "sonner";
import allTemplate from './template';

export const InstallDialog = memo(() => {
  const [value, setValue] = useState('');
  const [template, setTemplate] = useState('none');

  const dialogRef = useRef<{
    open: () => void;
    close: () => void;
  }>(null)

  const handleInstallLocal = useCallback(() => {
    loadLocalPlugin(value).then(plugin => {
      installLocalPlugin(plugin)
      toast.success('安装成功')
      dialogRef.current?.close()
    }).catch(err => {
      toast.error(err.message)
    })
  }, [value])

  const handleSelectChange = useCallback((value: string) => {
    setTemplate(value)
    if (value in allTemplate) {
      setValue(allTemplate[value])
    }
  }, [])

  return (
    <Dialog
      trigger={<Button>安装本地插件</Button>}
      title="安装本地插件"
      dialogRef={dialogRef}
      className="ec-w-[90%] ec-max-w-[400px] ec-h-[90%]"
    >
      <>
        <select className="ec-select" value={template} onChange={(ev) => handleSelectChange(ev.target.value)}>
          <option value="none">空模版</option>
          <option value="search">跳转搜索</option>
        </select>
        <CodeEditor value={value} onChange={setValue} />
        <Button onClick={handleInstallLocal}>安装</Button>
      </>
    </Dialog>
  )
})

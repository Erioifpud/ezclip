import { memo, useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "../CodeEditor";
import { Dialog } from "@/components/Dialog";
import { installLocalPlugin, loadLocalPlugin } from "@/lib/loadPlugin";
import { toast } from "sonner";

export const InstallDialog = memo(() => {
  const [value, setValue] = useState('');
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

  return (
    <Dialog
      trigger={<Button>安装本地插件</Button>}
      title="安装本地插件"
      dialogRef={dialogRef}
      className="ec-w-[90%] ec-max-w-[400px] ec-h-[90%]"
    >
      <>
        <CodeEditor value={value} onChange={setValue} />
        <Button onClick={handleInstallLocal}>安装</Button>
      </>
    </Dialog>
  )
})

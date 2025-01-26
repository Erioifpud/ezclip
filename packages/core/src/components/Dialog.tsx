import { X } from "lucide-react";
import { cloneElement, memo, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
  trigger: React.ReactElement;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Dialog = memo((props: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {cloneElement(props.trigger, { onClick: () => setOpen(true) })}
      {open && (
        <div className={
          cn(
            "ec-fixed ec-max-h-full ec-flex ec-flex-col ec-top-1/2 ec-left-1/2 ec-bg-white ec-p-4 ec-shadow-lg ec-rounded-lg ec-border ec-border-gray-200 -ec-translate-x-1/2 -ec-translate-y-1/2",
            props.className
          )
        }>
          {/* 标题 */}
          <div className="ec-flex ec-justify-between ec-mb-2 ec-border-b ec-border-gray-200 ec-flex-shrink-0">
            <div className="ec-text-lg ec-font-bold ec-flex-grow">{props.title}</div>
            <Button className="ec-flex-shrink-0" variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="ec-w-4 ec-h-4" />
            </Button>
          </div>
          <div className="ec-flex ec-flex-col ec-gap-4 ec-flex-grow ec-h-full ec-overflow-y-auto">
            {props.children}
          </div>
        </div>
      )}
    </>
  )
})
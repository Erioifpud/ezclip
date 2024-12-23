import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "ec-flex ec-min-h-[80px] ec-w-full ec-rounded-md ec-border ec-border-input ec-bg-background ec-px-3 ec-py-2 ec-text-base ec-ring-offset-background placeholder:ec-text-muted-foreground focus-visible:ec-outline-none focus-visible:ec-ring-2 focus-visible:ec-ring-ring focus-visible:ec-ring-offset-2 disabled:ec-cursor-not-allowed disabled:ec-opacity-50 md:ec-text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }

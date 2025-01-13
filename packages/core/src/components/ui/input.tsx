import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "ec-flex ec-h-10 ec-w-full ec-rounded-md ec-border ec-border-input ec-bg-background ec-px-3 ec-py-2 ec-text-base ec-ring-offset-background file:ec-border-0 file:ec-bg-transparent file:ec-text-sm file:ec-font-medium file:ec-text-foreground placeholder:ec-text-muted-foreground focus-visible:ec-outline-none focus-visible:ec-ring-2 focus-visible:ec-ring-ring focus-visible:ec-ring-offset-2 disabled:ec-cursor-not-allowed disabled:ec-opacity-50 md:ec-text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

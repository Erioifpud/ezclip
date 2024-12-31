import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "ec-peer ec-inline-flex ec-h-6 ec-w-11 ec-shrink-0 ec-cursor-pointer ec-items-center ec-rounded-full ec-border-2 ec-border-transparent ec-transition-colors focus-visible:ec-outline-none focus-visible:ec-ring-2 focus-visible:ec-ring-ring focus-visible:ec-ring-offset-2 focus-visible:ec-ring-offset-background disabled:ec-cursor-not-allowed disabled:ec-opacity-50 data-[state=checked]:ec-bg-primary data-[state=unchecked]:ec-bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "ec-pointer-events-none ec-block ec-h-5 ec-w-5 ec-rounded-full ec-bg-background ec-shadow-lg ec-ring-0 ec-transition-transform data-[state=checked]:ec-translate-x-5 data-[state=unchecked]:ec-translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

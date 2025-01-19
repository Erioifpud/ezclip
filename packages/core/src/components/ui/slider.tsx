"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "ec-relative ec-flex ec-w-full ec-touch-none ec-select-none ec-items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="ec-relative ec-h-2 ec-w-full ec-grow ec-overflow-hidden ec-rounded-full ec-bg-secondary">
      <SliderPrimitive.Range className="ec-absolute ec-h-full ec-bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="ec-block ec-h-5 ec-w-5 ec-rounded-full ec-border-2 ec-border-primary ec-bg-background ec-ring-offset-background ec-transition-colors focus-visible:ec-outline-none focus-visible:ec-ring-2 focus-visible:ec-ring-ring focus-visible:ec-ring-offset-2 disabled:ec-pointer-events-none disabled:ec-opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

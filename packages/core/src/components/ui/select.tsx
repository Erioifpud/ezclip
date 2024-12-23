import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "ec-flex ec-h-10 ec-w-full ec-items-center ec-justify-between ec-rounded-md ec-border ec-border-input ec-bg-background ec-px-3 ec-py-2 ec-text-sm ec-ring-offset-background placeholder:ec-text-muted-foreground focus:ec-outline-none focus:ec-ring-2 focus:ec-ring-ring focus:ec-ring-offset-2 disabled:ec-cursor-not-allowed disabled:ec-opacity-50 [&>span]:ec-line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="ec-h-4 ec-w-4 ec-opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "ec-flex ec-cursor-default ec-items-center ec-justify-center ec-py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="ec-h-4 ec-w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "ec-flex ec-cursor-default ec-items-center ec-justify-center ec-py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="ec-h-4 ec-w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "ec-relative ec-z-50 ec-max-h-96 ec-min-w-[8rem] ec-overflow-hidden ec-rounded-md ec-border ec-bg-popover ec-text-popover-foreground ec-shadow-md data-[state=open]:ec-animate-in data-[state=closed]:ec-animate-out data-[state=closed]:ec-fade-out-0 data-[state=open]:ec-fade-in-0 data-[state=closed]:ec-zoom-out-95 data-[state=open]:ec-zoom-in-95 data-[side=bottom]:ec-slide-in-from-top-2 data-[side=left]:ec-slide-in-from-right-2 data-[side=right]:ec-slide-in-from-left-2 data-[side=top]:ec-slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:ec-translate-y-1 data-[side=left]:ec--translate-x-1 data-[side=right]:ec-translate-x-1 data-[side=top]:ec--translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "ec-p-1",
          position === "popper" &&
            "ec-h-[var(--radix-select-trigger-height)] ec-w-full ec-min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("ec-py-1.5 ec-pl-8 ec-pr-2 ec-text-sm ec-font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "ec-relative ec-flex ec-w-full ec-cursor-default ec-select-none ec-items-center ec-rounded-sm ec-py-1.5 ec-pl-8 ec-pr-2 ec-text-sm ec-outline-none focus:ec-bg-accent focus:ec-text-accent-foreground data-[disabled]:ec-pointer-events-none data-[disabled]:ec-opacity-50",
      className
    )}
    {...props}
  >
    <span className="ec-absolute ec-left-2 ec-flex ec-h-3.5 ec-w-3.5 ec-items-center ec-justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="ec-h-4 ec-w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("ec--mx-1 ec-my-1 ec-h-px ec-bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "ec-inline-flex ec-items-center ec-justify-center ec-gap-2 ec-whitespace-nowrap ec-rounded-md ec-text-sm ec-font-medium ec-ring-offset-background ec-transition-colors focus-visible:ec-outline-none focus-visible:ec-ring-2 focus-visible:ec-ring-ring focus-visible:ec-ring-offset-2 disabled:ec-pointer-events-none disabled:ec-opacity-50 [&_svg]:ec-pointer-events-none [&_svg]:ec-size-4 [&_svg]:ec-shrink-0",
  {
    variants: {
      variant: {
        default: "ec-bg-primary ec-text-primary-foreground hover:ec-bg-primary/90",
        destructive:
          "ec-bg-destructive ec-text-destructive-foreground hover:ec-bg-destructive/90",
        outline:
          "ec-border ec-border-input ec-bg-background hover:ec-bg-accent hover:ec-text-accent-foreground",
        secondary:
          "ec-bg-secondary ec-text-secondary-foreground hover:ec-bg-secondary/80",
        ghost: "hover:ec-bg-accent hover:ec-text-accent-foreground",
        link: "ec-text-primary ec-underline-offset-4 hover:ec-underline",
      },
      size: {
        default: "ec-h-10 ec-px-4 ec-py-2",
        sm: "ec-h-9 ec-rounded-md ec-px-3",
        lg: "ec-h-11 ec-rounded-md ec-px-8",
        icon: "ec-h-10 ec-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

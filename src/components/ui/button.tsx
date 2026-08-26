'use client'

import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  // `[&>*+*]:ml-2` instead of flex `gap-2` — this is a generic primitive
  // whose children (icon + label, in either order) are whatever a caller
  // passes, so there's no specific child to put a margin on directly. The
  // selector adds margin-left to any direct child that has a preceding
  // sibling, which is gap-2's effect without depending on `gap` support.
  "inline-flex items-center justify-center [&>*+*]:ml-2 whitespace-nowrap rounded-xl text-sm font-bold transition-[color,box-shadow,transform] duration-300 cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0",
  {
    variants: {
      // hover:shadow-xl hover:-translate-y-1 on destructive/outline/secondary/
      // ghost matches the Card component's lift+shadow exactly. default keeps
      // its own hard-edge neobrutalist shadow (already an equivalent lift
      // effect, just this site's established style for primary CTAs) rather
      // than being unified with the soft shadow-xl. link stays plain — a
      // lift/shadow on inline text would look broken.
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-sm hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_var(--border)]',
        destructive:
          'bg-destructive text-destructive-foreground shadow-xs hover:bg-destructive/90 hover:shadow-xl hover:-translate-y-1',
        outline:
          'border-2 border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:shadow-xl hover:-translate-y-1',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:shadow-xl hover:-translate-y-1',
        ghost: 'hover:bg-accent hover:text-accent-foreground hover:shadow-xl hover:-translate-y-1',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        clear: '',
        default: 'h-10 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-9 px-3 has-[>svg]:px-2.5',
        lg: 'h-11 px-8 has-[>svg]:px-4',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, ...props }) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

'use client'

import { Input as InputPrimitive } from '@base-ui/react/input'
import type * as React from 'react'

import { cn } from '@/lib/utils'

type InputProps = Omit<
  InputPrimitive.Props & React.RefAttributes<HTMLInputElement>,
  'size'
> & {
  size?: 'sm' | 'default' | 'lg' | number
  unstyled?: boolean
  variant?: 'default' | 'destructive'
}

function Input({
  className,
  size = 'default',
  unstyled = false,
  variant = 'default',
  ...props
}: InputProps) {
  return (
    <span
      className={
        cn(
          !unstyled &&
            'relative inline-flex w-full rounded-lg border bg-background bg-clip-padding text-base/5 transition-shadow before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] has-disabled:opacity-64 has-[:disabled,:focus-visible]:shadow-none sm:text-sm dark:bg-input/32 dark:not-in-data-[slot=group]:bg-clip-border',
          // Default variant styles
          variant === 'default' &&
            'border-input ring-ring/24 not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_1px_--theme(--color-black/4%)] has-focus-visible:border-ring has-focus-visible:ring-[3px] dark:not-has-disabled:not-has-focus-visible:not-has-aria-invalid:before:shadow-[0_-1px_--theme(--color-white/8%)]',
          // Destructive variant styles - show ring by default and enhance on focus
          variant === 'destructive' &&
            'border-destructive ring-[3px] ring-destructive/24 has-focus-visible:border-destructive has-focus-visible:ring-destructive/32 dark:border-destructive/60',
          className,
        ) || undefined
      }
      data-size={size}
      data-slot="input-control"
    >
      <InputPrimitive
        className={cn(
          'w-full min-w-0 rounded-[inherit] px-[calc(--spacing(3)-1px)] py-[calc(--spacing(1.5)-1px)] outline-none placeholder:text-muted-foreground/72',
          size === 'sm' &&
            'px-[calc(--spacing(2.5)-1px)] py-[calc(--spacing(1)-1px)]',
          size === 'lg' && 'py-[calc(--spacing(2)-1px)]',
          props.type === 'search' &&
            '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none [&::-webkit-search-results-button]:appearance-none [&::-webkit-search-results-decoration]:appearance-none',
          props.type === 'file' &&
            'text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm',
        )}
        data-slot="input"
        size={typeof size === 'number' ? size : undefined}
        {...props}
      />
    </span>
  )
}

export { Input, type InputProps }

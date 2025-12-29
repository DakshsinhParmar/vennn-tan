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
  charCount?: number
}

/**
 * Base wrapper:
 * - real subtle border
 * - inner bevel via ::before
 * - focus ring via focus-within
 */
const baseWrapper =
  'relative inline-flex w-full rounded-lg border border-input bg-background text-base shadow-xs transition-shadow \
   before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-lg)-1px)] \
   before:shadow-[0_1px_--theme(--color-black/4%)] \
   focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/24 \
   has-disabled:opacity-64 sm:text-sm dark:bg-input/32 \
   dark:before:shadow-[0_-1px_--theme(--color-white/8%)]'

const destructiveWrapper =
  'border-destructive/36 focus-within:border-destructive focus-within:ring-destructive/24'

function Input({
  className,
  size = 'default',
  unstyled = false,
  variant = 'default',
  charCount,
  maxLength,
  ...props
}: InputProps) {
  const showCounter =
    typeof charCount === 'number' && typeof maxLength === 'number'

  return (
    <span
      data-slot="input-control"
      data-size={size}
      className={
        cn(
          !unstyled && baseWrapper,
          !unstyled && variant === 'destructive' && destructiveWrapper,
          className,
        ) || undefined
      }
    >
      <InputPrimitive
        data-slot="input"
        size={typeof size === 'number' ? size : undefined}
        maxLength={maxLength}
        className={cn(
          // reset native input visuals completely
          'w-full min-w-0 bg-transparent rounded-[inherit]',
          'border-0 outline-none focus:outline-none focus:ring-0',

          // layout & spacing
          'px-3 py-1.5',

          // typography
          'placeholder:text-muted-foreground/72',

          size === 'sm' && 'px-2.5 py-1',
          size === 'lg' && 'py-2',

          props.type === 'search' &&
            '[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none',

          props.type === 'file' &&
            'text-muted-foreground file:me-3 file:bg-transparent file:font-medium file:text-foreground file:text-sm',

          showCounter && 'pe-14',
        )}
        {...props}
      />

      {showCounter && (
        <span
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-xs tabular-nums text-muted-foreground"
        >
          {charCount}/{maxLength}
        </span>
      )}
    </span>
  )
}

export { Input, type InputProps }

'use client'

import type * as React from 'react'
import { cn } from '@/lib/utils'

type TextareaProps = React.ComponentProps<'textarea'> & {
  size?: 'sm' | 'default' | 'lg' | number
  unstyled?: boolean
  variant?: 'default' | 'destructive'
  charCount?: number
  maxLength?: number
}

const baseWrapper =
  'relative inline-flex w-full rounded-lg border border-input bg-background text-base shadow-xs transition-shadow has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/24 has-disabled:opacity-64 has-[:disabled,:focus-visible,[aria-invalid]]:shadow-none sm:text-sm dark:bg-input/32'

const destructiveWrapper =
  'border-destructive/36 has-focus-visible:border-destructive/64 has-focus-visible:ring-destructive/24'

function Textarea({
  className,
  size = 'default',
  unstyled = false,
  variant = 'default',
  charCount,
  maxLength,
  ...props
}: TextareaProps) {
  const showCounter =
    typeof charCount === 'number' && typeof maxLength === 'number'

  return (
    <span
      className={
        cn(
          !unstyled && baseWrapper,
          !unstyled && variant === 'destructive' && destructiveWrapper,
          className,
        ) || undefined
      }
      data-size={size}
      data-slot="textarea-control"
    >
      <textarea
        className={cn(
          'field-sizing-content min-h-[70px] w-full bg-transparent resize-none rounded-[inherit] px-3 py-1.5 outline-none placeholder:text-muted-foreground/72',
          size === 'sm' && 'min-h-[66px] px-2.5 py-1',
          size === 'lg' && 'min-h-[74px] py-2',
          showCounter && 'pb-7',
        )}
        data-slot="textarea"
        maxLength={maxLength}
        {...props}
      />
      {showCounter && (
        <span
          aria-live="polite"
          className="pointer-events-none absolute bottom-0 end-0 p-2 text-muted-foreground text-xs tabular-nums"
          role="status"
        >
          {charCount}/{maxLength}
        </span>
      )}
    </span>
  )
}

export { Textarea, type TextareaProps }

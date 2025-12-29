import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ItemRowProps {
  left?: ReactNode
  primary: ReactNode
  secondary?: ReactNode
  tertiary?: ReactNode
  action?: ReactNode
  className?: string
}

export function ItemRow({
  left,
  primary,
  secondary,
  tertiary,
  action,
  className,
}: ItemRowProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      {left && <div className="shrink-0">{left}</div>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between min-h-9">
          <div className="flex flex-col justify-center gap-0.5 min-w-0">
            <div className="text-sm font-medium leading-tight">{primary}</div>
            {secondary && (
              <span className="text-xs text-muted-foreground leading-tight">
                {secondary}
              </span>
            )}
          </div>
          {action && <div className="shrink-0 ml-2">{action}</div>}
        </div>
        {tertiary && (
          <span className="text-xs text-muted-foreground/60 leading-tight block mt-0.5">
            {tertiary}
          </span>
        )}
      </div>
    </div>
  )
}

import { LifebuoyIcon } from '@phosphor-icons/react'
import { Button } from '../ui/button'

export function FeedHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between bg-background px-4">
      {/* Left: Logo */}
      <div className="text-xl font-bold tracking-tight text-primary font-sans">
        vennn
      </div>

      {/* Right: Reviews Link */}
      <Button
        variant="ghost"
        size="icon"
        className="-mr-2 text-foreground"
        render={
          <a
            href="https://vennn.featurebase.app/"
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <LifebuoyIcon weight="regular" className="size-6" />
        <span className="sr-only">Reviews</span>
      </Button>
    </header>
  )
}

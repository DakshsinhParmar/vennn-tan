import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/theme-toggle'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="relative min-h-dvh w-full bg-background text-foreground overflow-hidden">
      {/* Ambient gradient orb */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,600px)] h-[min(90vw,600px)] rounded-full bg-primary/8 blur-[100px] animate-pulse"
        style={{ animationDuration: '4s' }}
      />

      {/* Navigation */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-5 sm:px-8 sm:py-6">
        <div className="flex items-center gap-2.5">
          <span className="text-lg font-bold tracking-tight">vennn.</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-secondary/60 tracking-wide">
            beta
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="relative flex flex-col items-center justify-center min-h-dvh px-6 text-center">
        <div className="flex flex-col items-center gap-6 max-w-2xl">
          {/* Hero heading */}
          <h1 className="text-[clamp(2.5rem,10vw,5rem)] font-black tracking-tighter leading-[0.95]">
            The campus
            <br />
            <span className="text-primary">network.</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
            Find collaborators for clubs, startups, creative projects, and
            everything in between.
          </p>

          {/* CTA */}
          <Button
            size="xl"
            className="rounded-full mt-2 group"
            render={(props) => (
              <Link to="/home" {...props}>
                Get started
                <ArrowRightIcon
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            )}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 flex items-center justify-center px-6 py-5 sm:px-8 sm:py-6">
        <p className="text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} vennn
        </p>
      </footer>
    </div>
  )
}

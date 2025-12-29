import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from '@phosphor-icons/react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/theme-toggle'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      {/* Enhanced ambient background with multiple orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb */}
        <div
          className="absolute top-1/4 left-1/4 w-[min(80vw,500px)] h-[min(80vw,500px)] rounded-full bg-primary/6 blur-[120px] animate-pulse"
          style={{ animationDuration: '8s' }}
        />
        {/* Secondary orb */}
        <div
          className="absolute bottom-1/4 right-1/4 w-[min(60vw,400px)] h-[min(60vw,400px)] rounded-full bg-primary/4 blur-[100px] animate-pulse"
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        />
        {/* Accent orb */}
        <div
          className="absolute top-1/2 right-1/3 w-[min(40vw,300px)] h-[min(40vw,300px)] rounded-full bg-primary/3 blur-[80px] animate-pulse"
          style={{ animationDuration: '10s', animationDelay: '4s' }}
        />
      </div>

      {/* Navigation with proper z-index */}
      <header className="relative z-50 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
        <div className="flex items-center gap-2.5">
          <span className="text-lg sm:text-xl font-bold tracking-tight">
            vennn.
          </span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground bg-secondary/60 tracking-wide">
            beta
          </span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main content with proper spacing */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 sm:px-6 md:px-8 text-center py-8">
        <div className="flex flex-col items-center gap-4 sm:gap-6 max-w-4xl w-full">
          {/* Hero heading with responsive typography */}
          <h1 className="text-[clamp(2rem,8vw,4.5rem)] font-black tracking-tighter leading-[0.9] sm:leading-[0.95]">
            The campus
            <br />
            <span className="text-primary">network.</span>
          </h1>

          {/* Description with responsive text */}
          <p className="text-sm sm:text-base text-muted-foreground max-w-lg sm:max-w-xl leading-relaxed px-2">
            Find collaborators for clubs, startups, creative projects, and
            everything in between.
          </p>

          {/* CTA with responsive sizing */}
          <Button
            size="lg"
            className="rounded-full mt-2 sm:mt-4 group text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3"
            render={(props) => (
              <Link to="/home" {...props}>
                Get started
                <ArrowRightIcon
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5 ml-2"
                />
              </Link>
            )}
          />
        </div>
      </main>

      {/* Footer with proper positioning */}
      <footer className="relative z-10 flex items-center justify-center px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
        <p className="text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} vennn
        </p>
      </footer>
    </div>
  )
}

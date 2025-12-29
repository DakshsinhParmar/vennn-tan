import appCss from '../styles.css?url'

import * as React from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useMatch,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import { themeScript } from '@/lib/theme'

import type { QueryClient } from '@tanstack/react-query'
import { AppShell } from '@/components/layout/app-shell'
import {
  SidebarNavigation,
  MobileNavigation,
} from '@/components/layout/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { ToastProvider, AnchoredToastProvider } from '@/components/ui/toast'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, viewport-fit=cover',
      },
      {
        title: 'Vennn Tan',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap',
      },
    ],
    scripts: [
      {
        children: themeScript,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">
        Review Page Under Construction
      </h1>
      <p className="text-muted-foreground">
        We are currently building this feature. Please check back later.
      </p>
    </div>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const isDev = import.meta.env.DEV

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider position="top-center">
            <AnchoredToastProvider>{children}</AnchoredToastProvider>
          </ToastProvider>
        </ThemeProvider>
        {isDev ? (
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
              TanStackQueryDevtools,
            ]}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}

function RootComponent() {
  useMatch({ from: Route.id, shouldThrow: false })
  const location = useLocation()

  if (location.pathname === '/') {
    return <Outlet />
  }

  return (
    <AppShell
      sidebarContent={<SidebarNavigation />}
      bottomBarContent={<MobileNavigation />}
    >
      <Outlet />
    </AppShell>
  )
}

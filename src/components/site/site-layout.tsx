import { Outlet } from "react-router-dom"

import { SiteFooter } from "@/components/site/footer"
import { SiteHeader } from "@/components/site/site-header"

export function SiteLayout() {
  return (
    <div className="relative min-h-svh overflow-x-clip bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <SiteHeader />

      <main id="main">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  )
}

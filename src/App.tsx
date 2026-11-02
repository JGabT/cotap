import { useState } from "react"

import { Faq } from "@/components/site/faq"
import { Features } from "@/components/site/features"
import { SiteFooter } from "@/components/site/footer"
import { Hero } from "@/components/site/hero"
import { HowItWorks } from "@/components/site/how-it-works"
import { Marquee } from "@/components/site/marquee"
import { Materials } from "@/components/site/materials"
import { Order, type OrderSeed } from "@/components/site/order"
import { Preview } from "@/components/site/preview"
import { Pricing } from "@/components/site/pricing"
import { SiteHeader } from "@/components/site/site-header"
import { Teams } from "@/components/site/teams"

export default function App() {
  const [orderSeed, setOrderSeed] = useState<OrderSeed | null>(null)

  function handleOrder(seed: OrderSeed = {}) {
    setOrderSeed({ ...seed })

    const target = document.getElementById("order")
    if (!target) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    })
  }

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
        <Hero />
        <Marquee />
        <HowItWorks />
        <Preview onOrder={handleOrder} />
        <Features />
        <Materials onOrder={(plan) => handleOrder({ plan })} />
        <Teams />
        <Pricing onOrder={(plan) => handleOrder({ plan })} />
        <Faq />
        <Order seed={orderSeed} />
      </main>

      <SiteFooter />
    </div>
  )
}

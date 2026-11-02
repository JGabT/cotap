import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Sparkles } from "lucide-react"

import { Reveal } from "@/components/site/reveal"
import { Button } from "@/components/ui/button"

type LinkTarget = {
  label: string
  to: string
}

export function CtaBanner({
  eyebrow = "Your move",
  title,
  description,
  primary = { label: "Order your card", to: "/order" },
  secondary = { label: "Try the live preview", to: "/preview" },
}: {
  eyebrow?: string
  title: ReactNode
  description: string
  primary?: LinkTarget
  secondary?: LinkTarget
}) {
  const isExternal = (to: string) => to.startsWith("mailto:") || to.startsWith("http")

  return (
    <section className="py-16 sm:py-20">
      <div className="site-container">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-3xl border border-white/10 px-6 py-14 text-center sm:px-12 sm:py-16">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
            <div
              className="pointer-events-none absolute top-[-40%] left-1/2 h-[32rem] w-[54rem] max-w-none -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at center, oklch(0.885 0.176 124 / 11%), transparent 63%)",
              }}
            />
            <span className="serif-accent pointer-events-none absolute -bottom-14 left-1/2 -translate-x-1/2 text-[9rem] leading-none whitespace-nowrap text-white/[0.025] select-none sm:text-[12rem]">
              cotap.id
            </span>

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] py-1.5 pr-4 pl-2 text-[10px] font-medium tracking-[0.14em] text-primary uppercase">
                <Sparkles className="size-3" />
                {eyebrow}
              </span>

              <h2 className="mt-5 text-[clamp(1.9rem,4vw,3rem)] leading-[1.04] font-medium">
                {title}
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[13.5px] leading-relaxed text-muted-foreground">
                {description}
              </p>

              <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
                <Button
                  render={
                    isExternal(primary.to) ? (
                      <a href={primary.to} />
                    ) : (
                      <Link to={primary.to} />
                    )
                  }
                  nativeButton={false}
                  className="h-10 rounded-full px-5 text-[12.5px]"
                >
                  {primary.label}
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button
                  render={
                    isExternal(secondary.to) ? (
                      <a href={secondary.to} />
                    ) : (
                      <Link to={secondary.to} />
                    )
                  }
                  nativeButton={false}
                  variant="outline"
                  className="h-10 rounded-full border-white/12 bg-white/[0.02] px-5 text-[12.5px] hover:bg-white/[0.06]"
                >
                  {secondary.label}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

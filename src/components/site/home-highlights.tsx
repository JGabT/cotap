import { Link } from "react-router-dom"
import { ArrowRight, ArrowUpRight, CreditCard, Sparkles, Users } from "lucide-react"

import { Reveal } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"

const pathways = [
  {
    icon: Sparkles,
    title: "See your name on it",
    body: "Type your name and watch your card and cotap.id profile come to life in real time.",
    cta: "Try the live preview",
    to: "/preview",
  },
  {
    icon: CreditCard,
    title: "Two cards. One-time price.",
    body: "Basic ₱300 or Premium ₱800. No subscriptions — your digital profile stays free forever.",
    cta: "Compare the cards",
    to: "/pricing",
  },
  {
    icon: Users,
    title: "One identity for the team",
    body: "Central admin, unified branding and profiles you can provision or revoke in seconds.",
    cta: "Explore CoTap for Teams",
    to: "/teams",
  },
]

export function HomeHighlights() {
  return (
    <section className="py-16 sm:py-20">
      <div className="site-container">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Start here"
            title={
              <>
                One card.{" "}
                <span className="serif-accent text-primary">Everything else.</span>
              </>
            }
            description="Three ways in — try it, choose a card, or bring your whole team."
          />
          <Reveal delay={180}>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              How it works
              <ArrowRight className="size-3.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {pathways.map((pathway, index) => (
            <Reveal key={pathway.to} delay={index * 80}>
              <Link
                to={pathway.to}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/[0.022] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white/[0.04]"
              >
                <div className="pointer-events-none absolute -top-20 -right-16 size-40 rounded-full bg-primary/[0.06] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-start justify-between">
                  <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-primary">
                    <pathway.icon className="size-[18px]" />
                  </span>
                  <ArrowUpRight className="size-4 text-muted-foreground/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>

                <h3 className="mt-5 text-[16px] font-medium tracking-tight">
                  {pathway.title}
                </h3>
                <p className="mt-2 flex-1 text-[12.5px] leading-relaxed text-muted-foreground">
                  {pathway.body}
                </p>

                <span className="mt-5 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-primary">
                  {pathway.cta}
                  <ArrowRight className="size-3" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

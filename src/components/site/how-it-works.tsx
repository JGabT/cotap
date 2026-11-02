import { Nfc, Smartphone, UserPlus } from "lucide-react"

import { Reveal } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"
import { Card } from "@/components/ui/card"

const steps = [
  {
    number: "01",
    icon: Nfc,
    title: "Tap",
    body: "Hold your CoTap against the top of any iPhone or Android. No app, no pairing, no settings.",
  },
  {
    number: "02",
    icon: Smartphone,
    title: "Open",
    body: "Your live profile opens instantly — your role, links, portfolio and a ready-to-save contact card.",
  },
  {
    number: "03",
    icon: UserPlus,
    title: "Connect",
    body: "They save your details, follow your work or send a lead. The conversation starts warm.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="relative py-24 sm:py-28">
      <div className="site-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="How it works"
            title={
              <>
                Three seconds from{" "}
                <span className="serif-accent text-primary">hello</span>.
              </>
            }
            description="No fumbling for paper cards. No apps to install. Just the most natural gesture there is."
          />
          <Reveal delay={200}>
            <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] px-5 py-4">
              <span className="text-3xl font-medium tracking-tight text-primary">~3s</span>
              <span className="max-w-[9rem] text-xs leading-relaxed text-muted-foreground">
                Average time from tap to your live profile
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal key={step.number} delay={index * 90}>
              <Card className="group relative h-full gap-0 overflow-hidden rounded-2xl bg-white/[0.022] p-7 ring-1 ring-white/8 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] hover:ring-primary/25">
                <div className="pointer-events-none absolute -top-20 -right-16 size-40 rounded-full bg-primary/[0.06] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-primary transition-colors group-hover:border-primary/25 group-hover:bg-primary/10">
                    <step.icon className="size-5" />
                  </span>
                  <span className="text-[10px] font-medium tracking-[0.22em] text-white/25">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-8 text-xl font-medium tracking-tight">{step.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

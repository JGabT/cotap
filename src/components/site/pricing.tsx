import { Check } from "lucide-react"

import { Reveal } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Basic",
    price: "₱300",
    unit: "one-time · per card",
    description:
      "The everyday card: matte PVC with NFC and QR, plus your live profile free forever.",
    features: [
      "Matte PVC card",
      "NFC + laser-etched QR",
      "Live profile at cotap.id/yourname",
      "Unlimited profile updates",
      "Save to contacts (.vcf)",
      "Free shipping across the Philippines",
    ],
    cta: "Order basic",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "₱800",
    unit: "one-time · per card",
    description:
      "A card worth keeping: real cherry wood or anodized metal, laser-engraved to last.",
    features: [
      "Everything in Basic",
      "Cherry wood or anodized metal",
      "Premium NTAG215 chip",
      "Custom laser engraving",
      "Priority production and shipping",
      "Free profile forever",
    ],
    cta: "Choose premium",
    highlighted: true,
  },
  {
    name: "CoTap for Teams",
    price: "Custom",
    unit: "for 10+ employees",
    description: "A single system for your company's identity, from onboarding to offboarding.",
    features: [
      "Central admin dashboard",
      "Bulk orders and unified branding",
      "Provision and revoke instantly",
      "Role-based access controls",
      "Dedicated account manager",
    ],
    cta: "Book a demo",
    highlighted: false,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-28">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="site-container">
        <SectionHeading
          eyebrow="Pricing"
          title={
            <>
              One card. <span className="serif-accent text-primary">No monthly fees.</span>
            </>
          }
          description="Pay once for the hardware, keep the profile free forever. Teams get a single invoice and a single place to manage everyone."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan, index) => (
            <Reveal key={plan.name} delay={index * 90} className="h-full">
              <Card
                className={cn(
                  "relative h-full gap-0 overflow-hidden rounded-2xl p-7 ring-1 transition-colors sm:p-8",
                  plan.highlighted
                    ? "bg-[linear-gradient(180deg,oklch(0.885_0.176_124/0.08),transparent_45%)] ring-primary/35"
                    : "bg-white/[0.022] ring-white/8"
                )}
              >
                {plan.highlighted && (
                  <>
                    <div className="pointer-events-none absolute -top-24 left-1/2 size-64 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                    <Badge className="absolute top-6 right-6 h-5 rounded-full bg-primary text-[9px] font-medium tracking-[0.12em] text-primary-foreground uppercase">
                      Most popular
                    </Badge>
                  </>
                )}

                <h3 className="text-[13px] font-medium tracking-[0.02em] text-muted-foreground">
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-[2.6rem] leading-none font-medium tracking-[-0.04em]">
                    {plan.price}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] tracking-wide text-muted-foreground/80">
                  {plan.unit}
                </p>

                <p className="mt-4 min-h-[2.75rem] text-[13px] leading-relaxed text-muted-foreground">
                  {plan.description}
                </p>

                <div className="my-6 h-px bg-white/8" />

                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-[12.5px] text-foreground/80">
                      <span
                        className={cn(
                          "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full",
                          plan.highlighted ? "bg-primary/20" : "bg-white/8"
                        )}
                      >
                        <Check
                          className={cn(
                            "size-2.5",
                            plan.highlighted ? "text-primary" : "text-foreground/70"
                          )}
                        />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  render={<a href="#claim" />}
                  nativeButton={false}
                  variant={plan.highlighted ? "default" : "outline"}
                  className={cn(
                    "mt-8 h-11 w-full rounded-full text-[13.5px]",
                    plan.highlighted
                      ? "shadow-[0_0_40px_-14px_var(--primary)]"
                      : "border-white/12 bg-white/[0.02] hover:bg-white/[0.06]"
                  )}
                >
                  {plan.cta}
                </Button>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-6 text-center text-[11.5px] text-muted-foreground">
            Prices in PHP, excluding applicable taxes. Need 50+ cards?{" "}
            <a href="#claim" className="text-foreground underline decoration-white/25 underline-offset-4 hover:decoration-primary">
              Talk to us
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  )
}

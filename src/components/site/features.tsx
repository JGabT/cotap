import {
  ArrowUpRight,
  Globe,
  Inbox,
  Link2,
  Nfc,
  RefreshCw,
  UserPlus,
} from "lucide-react"

import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons"
import { QrCode } from "@/components/site/qr-code"
import { Reveal } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function FeatureCard({
  icon: Icon,
  title,
  body,
  className,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col gap-0 overflow-hidden rounded-2xl bg-white/[0.022] p-6 ring-1 ring-white/8 transition-all duration-300 hover:bg-white/[0.035] hover:ring-white/15 sm:p-7",
        className
      )}
    >
      <div className="pointer-events-none absolute -top-24 -right-20 size-48 rounded-full bg-primary/[0.05] blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-primary">
        <Icon className="size-[18px]" />
      </span>
      <h3 className="mt-5 text-[17px] font-medium tracking-tight">{title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{body}</p>
      {children && <div className="mt-auto pt-6">{children}</div>}
    </Card>
  )
}

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-28">
      <div className="pointer-events-none absolute top-1/3 left-1/2 -z-10 h-[30rem] w-[50rem] max-w-full -translate-x-1/2 rounded-full bg-primary/[0.03] blur-3xl" />
      <div className="site-container">
        <SectionHeading
          eyebrow="The digital profile"
          title={
            <>
              More than a card.{" "}
              <span className="serif-accent text-primary">An identity.</span>
            </>
          }
          description="A fast, responsive profile that lives at cotap.id/yourname. Edit it once, and every card you have ever shared stays current."
          align="center"
          className="mx-auto"
        />

        <div className="mt-14 grid gap-4 lg:grid-cols-6">
          <Reveal className="lg:col-span-4">
            <FeatureCard
              icon={RefreshCw}
              title="Always current, never reprinted"
              body="Change your role, number or links from your phone. Your profile updates everywhere, instantly — while the card in their wallet stays exactly the same."
              className="h-full min-h-[320px]"
            >
              <div className="rounded-xl border border-white/8 bg-[#0b0c0e]/80 p-3.5">
                <div className="flex items-center justify-between border-b border-white/6 pb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-white/20" />
                    <span className="size-1.5 rounded-full bg-white/15" />
                    <span className="size-1.5 rounded-full bg-white/10" />
                    <span className="ml-2 text-[10px] text-muted-foreground">
                      cotap.id/alex
                    </span>
                  </div>
                  <Badge variant="outline" className="h-5 gap-1.5 border-primary/25 bg-primary/10 text-[9px] text-primary">
                    <span className="size-1 rounded-full bg-primary" />
                    Live
                  </Badge>
                </div>

                <div className="flex items-center gap-3 pt-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(140deg,#d8f28c,#8fb84a_60%,#42551f)] text-[11px] font-semibold text-[#1a200c]">
                    AP
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-medium">Alexandra Putri</p>
                    <p className="truncate text-[10.5px] text-muted-foreground">
                      Product Designer · Studio Nara
                    </p>
                  </div>
                  <span className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-1 text-[9px] text-muted-foreground">
                    Editing
                  </span>
                </div>

                <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                  <div className="rounded-lg border border-primary/20 bg-primary/[0.06] px-2.5 py-2">
                    <p className="text-[8px] tracking-[0.16em] text-primary/70 uppercase">
                      Headline
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-foreground/85">
                      Product Designer
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/7 bg-white/[0.025] px-2.5 py-2">
                    <p className="text-[8px] tracking-[0.16em] text-muted-foreground uppercase">
                      Links
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-foreground/70">
                      6 connected
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground">Auto-saved just now</span>
                  <span className="rounded-md bg-primary px-2.5 py-1 text-[9px] font-medium text-primary-foreground">
                    Publish changes
                  </span>
                </div>
              </div>
            </FeatureCard>
          </Reveal>

          <Reveal delay={80} className="lg:col-span-2">
            <FeatureCard
              icon={UserPlus}
              title="Saved in one tap"
              body="A proper contact card — name, phone, email and photo — downloaded straight into their address book. No typing, no typos."
              className="h-full"
            >
              <div className="flex items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.025] px-3 py-3">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
                  <UserPlus className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-medium">Add to contacts</p>
                  <p className="text-[9.5px] text-muted-foreground">alexandra.vcf · 12 KB</p>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground" />
              </div>
            </FeatureCard>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-2">
            <FeatureCard
              icon={Link2}
              title="All your work, one link"
              body="Portfolio, LinkedIn, GitHub, socials. Everything that matters, arranged the way you want to be seen."
              className="h-full"
            >
              <div className="flex flex-wrap gap-1.5">
                {[GithubIcon, LinkedinIcon, Globe].map((Icon, index) => (
                  <span
                    key={index}
                    className="grid size-8 place-items-center rounded-lg border border-white/8 bg-white/[0.03] text-muted-foreground transition-colors group-hover:text-foreground"
                  >
                    <Icon className="size-3.5" />
                  </span>
                ))}
                <span className="flex h-8 items-center gap-1 rounded-lg border border-primary/20 bg-primary/[0.07] px-2.5 text-[10px] font-medium text-primary">
                  Portfolio <ArrowUpRight className="size-3" />
                </span>
              </div>
            </FeatureCard>
          </Reveal>

          <Reveal delay={160} className="lg:col-span-2">
            <FeatureCard
              icon={Inbox}
              title="Capture more than a number"
              body="Built-in lead forms turn a quick introduction into a follow-up you can actually act on."
              className="h-full"
            >
              <div className="rounded-xl border border-white/8 bg-white/[0.025] p-2.5">
                <p className="text-[9px] tracking-[0.14em] text-muted-foreground uppercase">
                  Work with me
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="min-w-0 flex-1 truncate rounded-md border border-white/8 bg-background/60 px-2 py-1.5 text-[9.5px] text-muted-foreground">
                    you@company.com
                  </span>
                  <span className="rounded-md bg-primary px-2 py-1.5 text-[9.5px] font-medium text-primary-foreground">
                    Send
                  </span>
                </div>
              </div>
            </FeatureCard>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-2">
            <FeatureCard
              icon={Nfc}
              title="No app. No friction."
              body="Native NFC on iPhone and Android. A laser-etched QR covers older devices, so nobody gets left out."
              className="h-full"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-1">
                    iPhone
                  </span>
                  <span className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-1">
                    Android
                  </span>
                </div>
                <div className="rounded-md bg-white p-1">
                  <QrCode className="size-7 text-black" />
                </div>
              </div>
            </FeatureCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

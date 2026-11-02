import { Link } from "react-router-dom"
import { ArrowRight, Check, Play, Smartphone } from "lucide-react"

import { CardFace } from "@/components/site/card-face"
import { TapMark } from "@/components/site/logo"
import { ProfilePhone } from "@/components/site/profile-phone"
import { Reveal } from "@/components/site/reveal"
import { Button } from "@/components/ui/button"

const proofPoints = ["No app required", "iOS & Android", "Update anytime"]

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-10 sm:pt-32 lg:pt-36 lg:pb-16">
      <div className="bg-grid pointer-events-none absolute inset-0 -z-10" />
      <div
        className="pointer-events-none absolute top-[-18rem] left-1/2 -z-10 h-[42rem] w-[64rem] max-w-none -translate-x-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.885 0.176 124 / 9%) 0%, transparent 62%)",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-background" />

      <div className="site-container">
        <div className="grid items-center gap-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          <div className="relative z-10">
            <Reveal>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pr-4 pl-2 text-[11px] font-medium tracking-[0.02em] text-muted-foreground backdrop-blur">
                <span className="grid size-5 place-items-center rounded-full bg-primary/15">
                  <span className="size-1.5 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                </span>
                NFC + QR digital business card
                <span className="hidden text-white/20 sm:inline">|</span>
                <span className="hidden text-foreground/80 sm:inline">No app needed</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="display mt-7 text-[clamp(2.9rem,7vw,5rem)] font-medium">
                <span className="text-gradient">Your identity,</span>
                <br />
                one <span className="serif-accent pr-1 text-primary">tap</span> away.
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="mt-6 max-w-[30rem] text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                CoTap is a premium NFC card that opens your live profile the moment it
                touches a phone. Share your contact details, links and story — without an
                app, a print run, or a second thought.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  render={<Link to="/order" />}
                  nativeButton={false}
                  className="h-11 rounded-full px-6 text-[14px] font-medium shadow-[0_0_40px_-12px_var(--primary)]"
                >
                  Get your CoTap
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button
                  render={<Link to="/how-it-works" />}
                  nativeButton={false}
                  variant="outline"
                  className="h-11 rounded-full border-white/12 bg-white/[0.02] px-5 text-[14px] hover:bg-white/[0.06]"
                >
                  <Play data-icon="inline-start" />
                  See how it works
                </Button>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-muted-foreground">
                {proofPoints.map((point) => (
                  <li key={point} className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-primary" />
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={180} className="relative">
            <div className="relative mx-auto h-[520px] w-full max-w-[520px] sm:h-[520px] lg:h-[560px]">
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div
                  className="absolute size-[78%] rounded-full opacity-80 blur-2xl"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.885 0.176 124 / 12%), transparent 65%)",
                  }}
                />
                <div className="absolute size-[72%] rounded-full border border-white/[0.055]" />
                <div className="absolute size-[92%] rounded-full border border-white/[0.035]" />
                <div className="absolute size-[52%] rounded-full border border-white/[0.05]" />
              </div>

              <div className="glass-panel animate-float-slow absolute top-1 left-0 z-20 hidden items-center gap-2 rounded-full py-2 pr-3.5 pl-2.5 text-[11px] font-medium text-foreground/85 shadow-xl sm:top-4 sm:flex">
                <span className="grid size-6 place-items-center rounded-full bg-primary/15 text-primary">
                  <Smartphone className="size-3.5" />
                </span>
                Works on any phone
              </div>

              <div className="animate-float absolute top-0 left-1/2 z-10 w-[90%] -translate-x-1/2 rotate-[-7deg] sm:top-[43%] sm:w-[84%] sm:-translate-y-1/2">
                <div className="absolute -inset-6 -z-10 rounded-full bg-primary/10 blur-3xl" />
                <CardFace handle="alex" name="Alexandra Putri" />
              </div>

              <div className="absolute right-0 bottom-0 z-20 origin-bottom-right scale-[0.66] sm:scale-90 lg:scale-100">
                <ProfilePhone className="animate-float-slow" />
              </div>

              <div className="glass-panel animate-float animation-delay-2 absolute bottom-0 left-0 z-20 flex items-center gap-2 rounded-full py-2 pr-3.5 pl-2.5 text-[11px] font-medium text-foreground/85 shadow-xl sm:bottom-8">
                <span className="grid size-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <TapMark className="size-3.5" />
                </span>
                One tap to share
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

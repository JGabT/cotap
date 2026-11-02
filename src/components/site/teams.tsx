import { Link } from "react-router-dom"
import { ArrowRight, Check, Plus, Search, ShieldCheck, Users } from "lucide-react"

import { TapMark } from "@/components/site/logo"
import { Reveal } from "@/components/site/reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const benefits = [
  "Bulk orders with your company logo",
  "Centrally managed employee profiles",
  "Provision or revoke access in seconds",
  "Role-based admin controls",
]

const members = [
  {
    initials: "AP",
    name: "Alexandra Putri",
    email: "alexandra@acme.co",
    handle: "alexandra",
    status: "Active",
    tone: "from-[#d8f28c] to-[#6d8f36] text-[#1a200c]",
  },
  {
    initials: "RP",
    name: "Rizky Pratama",
    email: "rizky@acme.co",
    handle: "rizky",
    status: "Active",
    tone: "from-[#9fc8ff] to-[#3f6fa8] text-[#0b1a2b]",
  },
  {
    initials: "SL",
    name: "Sarah Lim",
    email: "sarah@acme.co",
    handle: "sarah",
    status: "Invited",
    tone: "from-[#ffc9a3] to-[#a8653f] text-[#2b150b]",
  },
  {
    initials: "DA",
    name: "Dimas Aryo",
    email: "dimas@acme.co",
    handle: "dimas",
    status: "Active",
    tone: "from-[#d9c6ff] to-[#7357a8] text-[#1c102b]",
  },
]

export function Teams() {
  return (
    <section id="teams" className="relative overflow-hidden py-24 sm:py-28">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="pointer-events-none absolute top-1/2 left-0 -z-10 h-[32rem] w-[32rem] -translate-y-1/2 rounded-full bg-primary/[0.035] blur-3xl" />

      <div className="site-container">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <Reveal>
              <Badge
                variant="outline"
                className="h-6 gap-1.5 rounded-full border-primary/20 bg-primary/[0.07] px-3 text-[10px] tracking-[0.14em] text-primary uppercase"
              >
                <Users className="size-3" />
                CoTap for Teams
              </Badge>
            </Reveal>

            <Reveal delay={80}>
              <h2 className="mt-6 max-w-lg text-[clamp(2rem,4vw,2.9rem)] leading-[1.04] font-medium">
                One brand.{" "}
                <span className="serif-accent text-primary">Every</span> identity.
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                Give every employee a tap-to-connect card that stays on-brand and up to
                date. Provision profiles from a single admin — and revoke access the
                moment someone moves on.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-[13px] text-foreground/80">
                    <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-primary/15">
                      <Check className="size-2.5 text-primary" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={260}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  render={<a href="mailto:hello@cotap.id?subject=CoTap%20for%20Teams" />}
                  nativeButton={false}
                  className="h-11 rounded-full px-6 text-[14px]"
                >
                  Talk to our team
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button
                  render={<Link to="/pricing" />}
                  nativeButton={false}
                  variant="ghost"
                  className="h-11 rounded-full px-4 text-[13.5px] text-muted-foreground hover:text-foreground"
                >
                  See team pricing
                </Button>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="mt-8 flex items-center gap-2.5 text-[11.5px] text-muted-foreground">
                <ShieldCheck className="size-4 text-primary/70" />
                Employee data stays yours. Profiles revoke instantly.
              </div>
            </Reveal>
          </div>

          <Reveal delay={140}>
            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-full bg-primary/[0.055] blur-3xl" />

              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0e0f11]/90 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
                <div className="flex items-center gap-2 border-b border-white/6 px-4 py-3">
                  <span className="size-2 rounded-full bg-white/15" />
                  <span className="size-2 rounded-full bg-white/10" />
                  <span className="size-2 rounded-full bg-white/[0.07]" />
                  <span className="mx-auto rounded-md border border-white/6 bg-white/[0.03] px-3 py-1 text-[9.5px] text-muted-foreground">
                    admin.cotap.id
                  </span>
                  <span className="w-8" />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                        <TapMark className="size-4" />
                      </span>
                      <div>
                        <p className="text-[12px] font-medium">Acme Studio</p>
                        <p className="text-[9.5px] text-muted-foreground">24 members · 3 pending</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1.5 text-[9.5px] font-medium text-primary-foreground">
                      <Plus className="size-3" />
                      Add member
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-white/7 bg-white/[0.025] px-2.5 py-2 text-[10px] text-muted-foreground">
                    <Search className="size-3" />
                    Search teammates, teams or domains…
                  </div>

                  <div className="mt-3 flex items-center justify-between px-1 text-[8.5px] tracking-[0.16em] text-muted-foreground/70 uppercase">
                    <span>Employee</span>
                    <span className="hidden sm:block">Profile status</span>
                  </div>

                  <div className="mt-1.5 space-y-1">
                    {members.map((member) => (
                      <div
                        key={member.handle}
                        className="flex items-center gap-2.5 rounded-lg border border-transparent px-1.5 py-2 transition-colors hover:border-white/6 hover:bg-white/[0.025]"
                      >
                        <span
                          className={`grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-br text-[9px] font-semibold ${member.tone}`}
                        >
                          {member.initials}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[10.5px] font-medium">{member.name}</p>
                          <p className="truncate text-[9px] text-muted-foreground">
                            cotap.id/{member.handle}
                          </p>
                        </div>
                        <span
                          className={
                            member.status === "Active"
                              ? "rounded-full bg-primary/10 px-2 py-0.5 text-[8.5px] font-medium text-primary"
                              : "rounded-full bg-amber-400/10 px-2 py-0.5 text-[8.5px] font-medium text-amber-300/90"
                          }
                        >
                          {member.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-3">
                    <span className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-primary" />
                      All profiles synced
                    </span>
                    <span className="text-[9px] font-medium text-foreground/70">
                      Manage team <ArrowRight className="ml-0.5 inline size-2.5" />
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

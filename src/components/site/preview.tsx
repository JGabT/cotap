import { useState } from "react"
import { ArrowRight, ChevronDown, RotateCcw, Sparkles } from "lucide-react"

import { ProfileWebPreview } from "@/components/site/profile-web-preview"
import { Reveal } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const roles = [
  "Product Designer",
  "Founder & CEO",
  "Software Engineer",
  "Sales Lead",
  "Creative Director",
  "Marketing Strategist",
  "Consultant",
]

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24)
}

function cleanHandle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 24)
}

export function Preview({ onClaim }: { onClaim: (handle: string) => void }) {
  const [name, setName] = useState("")
  const [role, setRole] = useState(roles[0])
  const [customHandle, setCustomHandle] = useState("")

  const autoHandle = slugify(name)
  const handle = customHandle || autoHandle
  const displayHandle = handle || "yourname"

  const canClaim = name.trim().length > 0

  return (
    <section id="preview" className="relative py-24 sm:py-28">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="pointer-events-none absolute top-1/3 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-primary/[0.04] blur-3xl" />

      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center lg:gap-14">
          <div>
            <SectionHeading
              eyebrow="Live preview"
              title={
                <>
                  Your name.{" "}
                  <span className="serif-accent text-primary">Your link.</span>
                </>
              }
              description="Type your name and watch your digital identity take shape. Claim cotap.id/yourname when it feels right."
            />

            <Reveal delay={200}>
              <Card className="mt-8 max-w-md gap-0 rounded-2xl bg-white/[0.025] p-5 ring-1 ring-white/8 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    Make it yours
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-medium text-primary">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
                    </span>
                    Live
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div className="grid gap-1.5">
                    <Label htmlFor="preview-name" className="text-[11px] text-muted-foreground">
                      Full name
                    </Label>
                    <Input
                      id="preview-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g. Alexandra Putri"
                      autoComplete="name"
                      className="h-10 rounded-lg border-white/10 bg-background/60 text-[13px]"
                    />
                  </div>

                  <div className="grid gap-1.5">
                    <Label htmlFor="preview-role" className="text-[11px] text-muted-foreground">
                      Role
                    </Label>
                    <div className="relative">
                      <select
                        id="preview-role"
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                        className="h-10 w-full appearance-none rounded-lg border border-white/10 bg-background/60 px-3 pr-9 text-[13px] text-foreground outline-none transition-colors focus:border-ring"
                      >
                        {roles.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="grid gap-1.5">
                    <div className="flex items-baseline justify-between">
                      <Label htmlFor="preview-handle" className="text-[11px] text-muted-foreground">
                        Your link
                      </Label>
                      <span className="text-[9px] tracking-wide text-muted-foreground/70 uppercase">
                        Auto-selected
                      </span>
                    </div>
                    <div className="flex h-10 items-center rounded-lg border border-white/10 bg-background/60 px-3">
                      <span className="shrink-0 text-[13px] text-muted-foreground">cotap.id/</span>
                      <Input
                        id="preview-handle"
                        value={handle}
                        onChange={(event) => setCustomHandle(cleanHandle(event.target.value))}
                        placeholder="yourname"
                        autoComplete="off"
                        spellCheck={false}
                        className="h-full min-w-0 border-0 bg-transparent px-0.5 text-[13px] shadow-none focus-visible:ring-0"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomHandle("")}
                        title="Auto-select from your name"
                        className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[9.5px] font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        <Sparkles className="size-2.5" />
                        Auto
                      </button>
                    </div>
                    <p className="text-[10px] leading-relaxed text-muted-foreground/75">
                      Suggested from your name — edit it freely.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => onClaim(displayHandle)}
                  disabled={!canClaim}
                  className="mt-5 h-10 w-full rounded-lg text-[12.5px] font-medium"
                >
                  Claim this preview
                  <ArrowRight data-icon="inline-end" />
                </Button>

                <div className="mt-2.5 flex items-center justify-between text-[9.5px] text-muted-foreground/75">
                  <span>
                    {canClaim
                      ? `cotap.id/${displayHandle} · free profile`
                      : "Enter your name to claim your link"}
                  </span>
                  {name && (
                    <button
                      type="button"
                      onClick={() => {
                        setName("")
                        setCustomHandle("")
                      }}
                      className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
                    >
                      <RotateCcw className="size-2.5" />
                      Reset
                    </button>
                  )}
                </div>
              </Card>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-primary/[0.05] blur-3xl" />
              <ProfileWebPreview name={name} role={role} handle={displayHandle} />
              <p className="mt-3 text-center text-[10.5px] text-muted-foreground">
                This is exactly what opens when someone taps your card.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useState, type FormEvent } from "react"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"

import { Reveal } from "@/components/site/reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function ClaimCta({ seed }: { seed?: { handle: string } | null }) {
  const [handle, setHandle] = useState("")
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!seed?.handle) return
    setHandle(seed.handle)
    setSubmitted(false)
  }, [seed])

  const cleanHandle =
    handle
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, "")
      .slice(0, 24) || "yourname"

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!handle.trim() || !email.trim()) return
    setSubmitted(true)
  }

  return (
    <section id="claim" className="relative py-20 sm:py-24">
      <div className="site-container">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-3xl border border-white/10 px-6 py-16 sm:px-12 sm:py-20">
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-70" />
            <div
              className="pointer-events-none absolute top-[-30%] left-1/2 h-[36rem] w-[60rem] max-w-none -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at center, oklch(0.66 0.17 255 / 12%), transparent 62%)",
              }}
            />
            <span className="serif-accent pointer-events-none absolute -bottom-16 left-1/2 -translate-x-1/2 text-[11rem] leading-none whitespace-nowrap text-white/[0.025] select-none sm:text-[15rem]">
              cotap.id
            </span>

            <div className="relative mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.07] py-1.5 pr-4 pl-2 text-[10.5px] font-medium tracking-[0.12em] text-primary uppercase">
                <Sparkles className="size-3.5" />
                First drop — limited run
              </span>

              <h2 className="mt-6 text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.02] font-medium">
                Your next introduction is a{" "}
                <span className="serif-accent text-primary">tap</span> away.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[14.5px] leading-relaxed text-muted-foreground">
                Claim your cotap.id link and reserve your card. We will confirm your
                finish, engraving and delivery before anything is printed.
              </p>

              {submitted ? (
                <div
                  className="mx-auto mt-9 flex max-w-lg flex-col items-center rounded-2xl border border-primary/25 bg-primary/[0.06] px-6 py-7"
                  aria-live="polite"
                >
                  <CheckCircle2 className="size-8 text-primary" />
                  <p className="mt-3 text-[15px] font-medium">
                    cotap.id/{cleanHandle} is reserved.
                  </p>
                  <p className="mt-1.5 max-w-sm text-[12.5px] leading-relaxed text-muted-foreground">
                    Thanks — we have your details. Watch your inbox at{" "}
                    <span className="text-foreground/80">{email}</span> for the next step.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  className="mx-auto mt-9 w-full max-w-xl rounded-2xl border border-white/10 bg-white/[0.03] p-2 shadow-2xl backdrop-blur-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-white/8 bg-background/50 px-3">
                      <span className="shrink-0 text-[13px] text-muted-foreground">
                        cotap.id/
                      </span>
                      <Input
                        value={handle}
                        onChange={(event) => setHandle(event.target.value)}
                        placeholder="yourname"
                        aria-label="Your CoTap username"
                        autoComplete="off"
                        className="h-full min-w-0 border-0 bg-transparent px-0 text-[13px] shadow-none focus-visible:ring-0"
                      />
                    </div>
                    <div className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-white/8 bg-background/50 px-3">
                      <Input
                        type="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@company.com"
                        aria-label="Your email address"
                        className="h-full min-w-0 border-0 bg-transparent px-0 text-[13px] shadow-none focus-visible:ring-0"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="h-11 shrink-0 rounded-xl px-5 text-[13px] font-medium shadow-[0_0_36px_-14px_var(--primary)]"
                    >
                      Reserve
                      <ArrowRight data-icon="inline-end" />
                    </Button>
                  </div>
                </form>
              )}

              <p className="mt-4 text-[10.5px] text-muted-foreground/80">
                No spam, no subscription. Just your card and your profile.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

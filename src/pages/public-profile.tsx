import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import {
  ArrowUpRight,
  Check,
  Globe,
  Mail,
  Phone,
  Share2,
  UserPlus,
} from "lucide-react"

import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons"
import { Logo } from "@/components/site/logo"
import { usePageMeta } from "@/components/site/use-page-meta"
import { Button } from "@/components/ui/button"
import {
  PLAN_LABEL,
  api,
  initials,
  type PublicProfile,
} from "@/lib/api"

function linkIcon(url: string) {
  const value = url.toLowerCase()
  if (value.includes("linkedin.com")) return LinkedinIcon
  if (value.includes("github.com")) return GithubIcon
  return Globe
}

function vcard(profile: PublicProfile) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.name}`,
    `N:${profile.name};;;;`,
  ]
  if (profile.role) lines.push(`TITLE:${profile.role}`)
  if (profile.phone) lines.push(`TEL;TYPE=CELL:${profile.phone}`)
  if (profile.email) lines.push(`EMAIL:${profile.email}`)
  lines.push(`URL:${window.location.href}`)
  lines.push("END:VCARD")
  return lines.join("\r\n")
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[420px] animate-pulse overflow-hidden rounded-[2rem] border border-white/10 bg-[#f7f5ef] p-7">
      <div className="mx-auto size-[76px] rounded-full bg-black/10" />
      <div className="mx-auto mt-4 h-6 w-40 rounded bg-black/10" />
      <div className="mx-auto mt-2 h-3 w-28 rounded bg-black/[0.07]" />
      <div className="mt-6 h-10 w-full rounded-xl bg-black/10" />
      <div className="mt-2 grid grid-cols-3 gap-1.5">
        <div className="h-10 rounded-lg bg-black/[0.07]" />
        <div className="h-10 rounded-lg bg-black/[0.07]" />
        <div className="h-10 rounded-lg bg-black/[0.07]" />
      </div>
      <div className="mt-6 space-y-2">
        <div className="h-11 rounded-xl bg-black/[0.07]" />
        <div className="h-11 rounded-xl bg-black/[0.07]" />
        <div className="h-11 rounded-xl bg-black/[0.07]" />
      </div>
    </div>
  )
}

export function PublicProfilePage() {
  const { handle = "" } = useParams()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [state, setState] = useState<"loading" | "ready" | "error">("loading")
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  usePageMeta(
    profile ? `${profile.name} — CoTap` : "Profile — CoTap",
    profile
      ? `${profile.name}${profile.role ? ` · ${profile.role}` : ""} on CoTap. Save their contact card and connect in one tap.`
      : "A live CoTap digital profile."
  )

  useEffect(() => {
    let active = true
    setState("loading")
    api<PublicProfile>(`/api/profiles/${encodeURIComponent(handle)}`)
      .then((data) => {
        if (!active) return
        setProfile(data)
        setState("ready")
      })
      .catch(() => {
        if (!active) return
        setProfile(null)
        setState("error")
      })
    return () => {
      active = false
    }
  }, [handle])

  function saveContact() {
    if (!profile) return
    const blob = new Blob([vcard(profile)], {
      type: "text/vcard;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = `${profile.handle}.vcf`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2200)
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" />
      <div
        className="pointer-events-none absolute top-[-18rem] left-1/2 h-[38rem] w-[60rem] max-w-none -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.885 0.176 124 / 8%), transparent 64%)",
        }}
      />

      <div className="site-container relative flex min-h-svh flex-col">
        <header className="flex h-16 items-center justify-between sm:h-20">
          <Link to="/" aria-label="CoTap home">
            <Logo />
          </Link>
          <Button
            render={<Link to="/order" />}
            nativeButton={false}
            variant="outline"
            className="h-8 rounded-full border-white/12 bg-white/[0.03] px-3.5 text-[11.5px] hover:bg-white/[0.06]"
          >
            Make yours
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-10">
          {state === "loading" && <ProfileSkeleton />}

          {state === "error" && (
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-12 text-center">
              <span className="eyebrow">404</span>
              <h1 className="mt-4 text-2xl font-medium tracking-tight">
                This link has no <span className="serif-accent text-primary">tap.</span>
              </h1>
              <p className="mx-auto mt-2 max-w-xs text-[12px] leading-relaxed text-muted-foreground">
                The profile for <span className="text-foreground/80">cotap.id/u/{handle}</span>{" "}
                does not exist, or it has been suspended.
              </p>
              <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
                <Button
                  render={<Link to="/" />}
                  nativeButton={false}
                  className="h-9 rounded-full px-4 text-[11.5px]"
                >
                  Back home
                </Button>
                <Button
                  render={<Link to="/preview" />}
                  nativeButton={false}
                  variant="outline"
                  className="h-9 rounded-full border-white/12 bg-white/[0.02] px-4 text-[11.5px]"
                >
                  Try the preview
                </Button>
              </div>
            </div>
          )}

          {state === "ready" && profile && (
            <>
              <div className="w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#f7f5ef] text-[#15161a] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.95)]">
                <div className="relative px-6 pt-7 pb-6 sm:px-7">
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-40"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 0%, #e7f6cb 0%, transparent 72%)",
                    }}
                  />

                  <div className="relative flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-[-0.03em]">
                      <span className="inline-flex size-4 items-center justify-center rounded-full border border-black/10">
                        <span className="size-1.5 rounded-full bg-[#6d9a2c]" />
                      </span>
                      cotap<span className="font-normal text-black/35">.id</span>
                    </span>
                    {profile.plan !== "basic" && (
                      <span className="rounded-full border border-[#a6cf5e]/50 bg-[#eaf8c9] px-2.5 py-0.5 text-[8.5px] font-semibold tracking-[0.12em] text-[#4b6818] uppercase">
                        {PLAN_LABEL[profile.plan]}
                      </span>
                    )}
                  </div>

                  <div className="relative mt-6 flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="grid size-[78px] place-items-center rounded-full bg-[linear-gradient(140deg,#d8f28c,#8fb84a_58%,#42551f)] text-[24px] font-semibold text-[#1a200c] ring-4 ring-black/5">
                        {initials(profile.name)}
                      </div>
                      <span className="absolute right-0.5 bottom-0.5 size-4 rounded-full border-2 border-[#f7f5ef] bg-[#5c8a2a]" />
                    </div>

                    <h1 className="mt-3.5 max-w-full truncate text-[25px] leading-tight font-semibold tracking-[-0.035em]">
                      {profile.name}
                    </h1>
                    {profile.role && (
                      <p className="mt-1 max-w-full truncate text-[11.5px] text-black/55">
                        {profile.role}
                      </p>
                    )}
                    <span className="mt-2.5 rounded-full bg-black/[0.055] px-3 py-1 text-[9px] font-medium tracking-wide text-black/55">
                      Open to collaborate
                    </span>
                  </div>

                  <div className="relative mt-5">
                    <button
                      type="button"
                      onClick={saveContact}
                      className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-[#15161a] text-[12px] font-medium text-[#f7f5ef] shadow-sm transition-transform active:scale-[0.99]"
                    >
                      {saved ? (
                        <>
                          <Check className="size-3.5" />
                          Contact saved
                        </>
                      ) : (
                        <>
                          <UserPlus className="size-3.5" />
                          Save to contacts
                        </>
                      )}
                    </button>

                    <div className="mt-1.5 flex justify-center gap-1.5">
                      {profile.phone && (
                        <a
                          href={`tel:${profile.phone}`}
                          aria-label="Call"
                          className="flex h-9 w-16 items-center justify-center rounded-lg border border-black/10 bg-white text-black/65 transition-colors hover:text-black"
                        >
                          <Phone className="size-3.5" />
                        </a>
                      )}
                      {profile.email && (
                        <a
                          href={`mailto:${profile.email}`}
                          aria-label="Email"
                          className="flex h-9 w-16 items-center justify-center rounded-lg border border-black/10 bg-white text-black/65 transition-colors hover:text-black"
                        >
                          <Mail className="size-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={share}
                        aria-label="Copy profile link"
                        className="flex h-9 w-16 items-center justify-center gap-1 rounded-lg border border-black/10 bg-white text-[9px] font-medium text-black/55 transition-colors hover:text-black"
                      >
                        {copied ? (
                          <>
                            <Check className="size-3" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Share2 className="size-3" />
                            Share
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="relative mt-5">
                    {profile.links.length ? (
                      <div className="divide-y divide-black/[0.07] overflow-hidden rounded-xl border border-black/[0.08] bg-white">
                        {profile.links.map((link) => {
                          const Icon = linkIcon(link.url)
                          const external = /^https?:/i.test(link.url)
                          return (
                            <a
                              key={`${link.label}-${link.url}`}
                              href={link.url}
                              target={external ? "_blank" : undefined}
                              rel={external ? "noreferrer" : undefined}
                              className="flex items-center gap-2.5 px-3 py-3 transition-colors hover:bg-black/[0.025]"
                            >
                              <span className="grid size-7 place-items-center rounded-lg bg-black/[0.05]">
                                <Icon className="size-3.5 text-black/65" />
                              </span>
                              <span className="flex-1 truncate text-[11px] font-medium text-black/75">
                                {link.label}
                              </span>
                              <ArrowUpRight className="size-3.5 text-black/25" />
                            </a>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-black/10 px-4 py-5 text-center">
                        <p className="text-[10.5px] text-black/45">
                          Links are being added. Save the contact for now.
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="relative mt-4 text-center text-[8px] tracking-[0.16em] text-black/30 uppercase">
                    Powered by CoTap
                  </p>
                </div>
              </div>

              <p className="mt-4 font-mono text-[10px] text-muted-foreground">
                cotap.id/u/{profile.handle}
              </p>
            </>
          )}
        </main>

        <footer className="flex flex-col items-center justify-between gap-2 border-t border-white/6 py-5 text-[10px] text-muted-foreground/70 sm:flex-row">
          <p>One card. One tap. Every connection.</p>
          <div className="flex items-center gap-4">
            <Link to="/portal" className="transition-colors hover:text-foreground">
              Manage this profile
            </Link>
            <Link to="/" className="transition-colors hover:text-foreground">
              cotap.id
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

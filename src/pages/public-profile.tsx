import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { ProfileCard } from "@/components/profile/profile-card"
import { usePageMeta } from "@/components/site/use-page-meta"
import { Button } from "@/components/ui/button"
import {
  DEFAULT_THEME,
  api,
  isLightColor,
  themeFontFamily,
  type PublicProfile,
} from "@/lib/api"

function ProfileSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[420px] animate-pulse overflow-hidden rounded-[2rem] border border-white/10 bg-[#f7f5ef] p-7">
      <div className="mx-auto size-[78px] rounded-full bg-black/10" />
      <div className="mx-auto mt-4 h-6 w-40 rounded bg-black/10" />
      <div className="mx-auto mt-2 h-3 w-28 rounded bg-black/[0.07]" />
      <div className="mt-6 h-10 w-full rounded-xl bg-black/10" />
      <div className="mt-2 flex justify-center gap-1.5">
        <div className="h-9 w-16 rounded-lg bg-black/[0.07]" />
        <div className="h-9 w-16 rounded-lg bg-black/[0.07]" />
        <div className="h-9 w-16 rounded-lg bg-black/[0.07]" />
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

  const theme = profile?.theme ?? DEFAULT_THEME
  const pageLight = isLightColor(theme.page)
  const pageInk = pageLight ? "#15161a" : "#f7f5ef"
  const pageMuted = pageLight ? "rgba(21,22,26,0.6)" : "rgba(247,245,239,0.6)"
  const patternLine = pageLight ? "rgba(21,22,26,0.07)" : "rgba(255,255,255,0.06)"

  const patternStyle =
    theme.pattern === "grid"
      ? {
          backgroundImage: `linear-gradient(to right, ${patternLine} 1px, transparent 1px), linear-gradient(to bottom, ${patternLine} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }
      : theme.pattern === "dots"
        ? {
            backgroundImage: `radial-gradient(${patternLine} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }
        : theme.pattern === "glow"
          ? {
              background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${theme.accent} 18%, transparent), transparent 62%)`,
            }
          : undefined

  return (
    <div
      className="relative min-h-svh overflow-hidden"
      style={{ backgroundColor: theme.page, color: pageInk }}
    >
      <div className="pointer-events-none absolute inset-0" style={patternStyle} />

      <div
        className="site-container relative flex min-h-svh flex-col"
        style={{ fontFamily: themeFontFamily(theme) }}
      >
        <main className="flex flex-1 flex-col items-center justify-center py-16 sm:py-20">
          {state === "loading" && <ProfileSkeleton />}

          {state === "error" && (
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-12 text-center">
              <span className="eyebrow">404</span>
              <h1 className="mt-4 text-2xl font-medium tracking-tight">
                This link has no <span className="serif-accent text-primary">tap.</span>
              </h1>
              <p className="mx-auto mt-2 max-w-xs text-[12px] leading-relaxed text-muted-foreground">
                The profile for{" "}
                <span className="text-foreground/80">cotap.id/u/{handle}</span> does
                not exist, or it has been suspended.
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
              <div className="w-full max-w-[420px]">
                <ProfileCard profile={profile} />
              </div>

              <p
                className="mt-4 font-mono text-[10px]"
                style={{ color: pageMuted }}
              >
                cotap.id/u/{profile.handle}
              </p>
            </>
          )}
        </main>

      </div>
    </div>
  )
}

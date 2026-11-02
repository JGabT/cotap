import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  Check,
  Copy,
  Loader2,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { CardFace } from "@/components/site/card-face"
import { Logo } from "@/components/site/logo"
import { usePageMeta } from "@/components/site/use-page-meta"
import { ClientLogin } from "@/components/portal/client-login"
import { LinksEditor } from "@/components/portal/links-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ApiError,
  PLAN_LABEL,
  api,
  type AdminLink,
  type Plan,
  type UserRecord,
} from "@/lib/api"
import { cn } from "@/lib/utils"

type Detail = { user: UserRecord; links: AdminLink[] }

function planBadgeClass(plan: Plan) {
  if (plan === "pro") return "border-primary/25 bg-primary/10 text-primary"
  if (plan === "team") return "border-white/15 bg-white/10 text-foreground"
  return "border-white/10 bg-white/5 text-muted-foreground"
}

function PortalLoading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <Logo />
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Opening your profile…
      </div>
    </div>
  )
}

function PortalDashboard({ onLoggedOut }: { onLoggedOut: () => void }) {
  const [detail, setDetail] = useState<Detail | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")

  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [role, setRole] = useState("")
  const [phone, setPhone] = useState("")
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(
    null
  )

  const [copied, setCopied] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordBusy, setPasswordBusy] = useState(false)
  const [passwordFeedback, setPasswordFeedback] = useState<{
    text: string
    error: boolean
  } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setLoadError("")
    try {
      const data = await api<Detail>("/api/portal/profile")
      setDetail(data)
      setName(data.user.name)
      setHandle(data.user.handle)
      setRole(data.user.role)
      setPhone(data.user.phone ?? "")
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        onLoggedOut()
        return
      }
      setLoadError("Could not load your profile.")
    } finally {
      setLoading(false)
    }
  }, [onLoggedOut])

  useEffect(() => {
    load()
  }, [load])

  function showFeedback(text: string, isError = false) {
    setFeedback({ text, error: isError })
  }

  async function saveProfile() {
    setSaving(true)
    setFeedback(null)
    try {
      const data = await api<Detail>("/api/portal/profile", {
        method: "PATCH",
        body: JSON.stringify({ name, handle, role, phone }),
      })
      setDetail(data)
      setName(data.user.name)
      setHandle(data.user.handle)
      setRole(data.user.role)
      setPhone(data.user.phone ?? "")
      showFeedback("Profile updated — your public page is live.")
    } catch (requestError) {
      showFeedback(
        requestError instanceof ApiError
          ? requestError.message
          : "Could not save your profile",
        true
      )
    } finally {
      setSaving(false)
    }
  }

  async function copyLink() {
    if (!detail) return
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/u/${detail.user.handle}`
      )
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  async function updatePassword() {
    setPasswordBusy(true)
    setPasswordFeedback(null)
    try {
      await api("/api/auth/password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      setCurrentPassword("")
      setNewPassword("")
      setPasswordFeedback({ text: "Password updated.", error: false })
    } catch (requestError) {
      setPasswordFeedback({
        text:
          requestError instanceof ApiError
            ? requestError.message
            : "Could not update your password",
        error: true,
      })
    } finally {
      setPasswordBusy(false)
    }
  }

  async function logout() {
    try {
      await api("/api/auth/logout", { method: "POST" })
    } finally {
      onLoggedOut()
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Loader2 className="size-5 animate-spin text-primary" />
      </div>
    )
  }

  if (loadError || !detail) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center">
        <Logo />
        <p className="text-[12.5px] text-muted-foreground">{loadError}</p>
        <div className="flex gap-2">
          <Button onClick={load} className="h-9 rounded-lg px-4 text-[12px]">
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={onLoggedOut}
            className="h-9 rounded-lg px-4 text-[12px]"
          >
            Sign out
          </Button>
        </div>
      </div>
    )
  }

  const user = detail.user
  const cardVariant =
    user.plan === "team" ? "wood" : user.plan === "pro" ? "metal" : "pvc"
  const publicUrl = `${window.location.origin}/u/${user.handle}`

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-background/80 backdrop-blur-xl">
        <div className="site-container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="CoTap home">
              <Logo />
            </Link>
            <span className="hidden rounded-full border border-primary/20 bg-primary/[0.07] px-2.5 py-1 text-[9px] font-medium tracking-[0.14em] text-primary uppercase sm:inline-flex">
              Client portal
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              render={
                <a
                  href={`/u/${encodeURIComponent(user.handle)}`}
                  target="_blank"
                  rel="noreferrer"
                />
              }
              nativeButton={false}
              variant="ghost"
              className="h-8 rounded-full px-3 text-[11.5px] text-muted-foreground hover:text-foreground"
            >
              View profile
              <ArrowUpRight data-icon="inline-end" />
            </Button>
            <Button
              variant="outline"
              onClick={logout}
              className="h-8 rounded-full border-white/10 bg-white/[0.03] px-3 text-[11.5px]"
            >
              <LogOut className="size-3" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="site-container py-8 sm:py-10">
        <p className="eyebrow">
          <span className="h-px w-6 bg-primary/70" />
          Client portal
        </p>
        <h1 className="mt-4 max-w-2xl text-[clamp(1.9rem,4vw,2.6rem)] font-medium tracking-[-0.04em]">
          Your profile,{" "}
          <span className="serif-accent text-primary">your rules.</span>
        </h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
          Signed in as <span className="text-foreground/80">{user.email}</span>. Every
          change goes live immediately at{" "}
          <span className="text-foreground/80">cotap.id/u/{user.handle}</span>.
        </p>

        <div className="mt-7 grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                Public profile
              </p>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase",
                  planBadgeClass(user.plan)
                )}
              >
                {PLAN_LABEL[user.plan]}
              </span>
            </div>

            {feedback && (
              <p
                className={cn(
                  "mt-4 rounded-lg border px-3 py-2 text-[11px]",
                  feedback.error
                    ? "border-red-400/20 bg-red-400/10 text-red-300"
                    : "border-primary/20 bg-primary/[0.07] text-primary"
                )}
              >
                {feedback.text}
              </p>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="portal-name" className="text-[10.5px] text-muted-foreground">
                  Name
                </Label>
                <Input
                  id="portal-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-9 rounded-lg border-white/10 bg-background/60 text-[12px]"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="portal-handle" className="text-[10.5px] text-muted-foreground">
                  Username
                </Label>
                <div className="flex h-9 items-center rounded-lg border border-white/10 bg-background/60 px-2.5">
                  <span className="shrink-0 text-[11px] text-muted-foreground">
                    cotap.id/
                  </span>
                  <Input
                    id="portal-handle"
                    value={handle}
                    onChange={(event) => setHandle(event.target.value)}
                    className="h-full min-w-0 border-0 bg-transparent px-0 text-[12px] shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="portal-role" className="text-[10.5px] text-muted-foreground">
                  Role
                </Label>
                <Input
                  id="portal-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  placeholder="e.g. Product Designer"
                  className="h-9 rounded-lg border-white/10 bg-background/60 text-[12px]"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="portal-phone" className="text-[10.5px] text-muted-foreground">
                  Phone
                </Label>
                <Input
                  id="portal-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="h-9 rounded-lg border-white/10 bg-background/60 text-[12px]"
                />
              </div>
              <div className="grid gap-1.5 sm:col-span-2">
                <Label htmlFor="portal-email" className="text-[10.5px] text-muted-foreground">
                  Email · used to sign in
                </Label>
                <Input
                  id="portal-email"
                  value={user.email ?? ""}
                  readOnly
                  className="h-9 rounded-lg border-white/8 bg-white/[0.02] text-[12px] text-muted-foreground"
                />
              </div>
            </div>

            <Button
              onClick={saveProfile}
              disabled={saving}
              className="mt-5 h-9 w-full rounded-lg text-[12px]"
            >
              {saving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Check className="size-3.5" />
              )}
              Save profile
            </Button>

            <div className="my-6 h-px bg-white/8" />

            <LinksEditor
              basePath="/api/portal"
              links={detail.links}
              onChanged={(links) =>
                setDetail((current) => (current ? { ...current, links } : current))
              }
              onFeedback={(text, isError) => showFeedback(text, isError)}
            />

            <div className="my-6 h-px bg-white/8" />

            <p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Password
            </p>
            <p className="mt-1 text-[10.5px] text-muted-foreground">
              Use at least 8 characters. You will stay signed in.
            </p>

            {passwordFeedback && (
              <p
                className={cn(
                  "mt-3 rounded-lg border px-3 py-2 text-[11px]",
                  passwordFeedback.error
                    ? "border-red-400/20 bg-red-400/10 text-red-300"
                    : "border-primary/20 bg-primary/[0.07] text-primary"
                )}
              >
                {passwordFeedback.text}
              </p>
            )}

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Current password"
                autoComplete="current-password"
                aria-label="Current password"
                className="h-9 rounded-lg border-white/10 bg-background/60 text-[12px]"
              />
              <Input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="New password"
                autoComplete="new-password"
                aria-label="New password"
                className="h-9 rounded-lg border-white/10 bg-background/60 text-[12px]"
              />
            </div>
            <Button
              variant="outline"
              onClick={updatePassword}
              disabled={
                passwordBusy || !currentPassword || newPassword.length < 8
              }
              className="mt-2 h-8 rounded-lg border-white/10 bg-white/[0.02] px-3 text-[11px]"
            >
              {passwordBusy && <Loader2 className="size-3 animate-spin" />}
              Update password
            </Button>
          </section>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  Your card
                </span>
                <span className="text-[9px] text-muted-foreground/70">
                  Updates live
                </span>
              </div>

              <div className="mt-4">
                <CardFace
                  variant={cardVariant}
                  name={name || user.name}
                  role={role}
                  handle={handle || user.handle}
                  className="shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]"
                />
              </div>

              <div className="mt-4 rounded-xl border border-white/8 bg-background/40 p-3">
                <p className="text-[9px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  Public link
                </p>
                <p className="mt-1.5 truncate font-mono text-[10.5px] text-foreground/80">
                  {publicUrl}
                </p>
                <div className="mt-2.5 flex gap-1.5">
                  <Button
                    render={
                      <a
                        href={`/u/${encodeURIComponent(user.handle)}`}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                    nativeButton={false}
                    className="h-8 flex-1 rounded-lg text-[10.5px]"
                  >
                    View profile
                    <ArrowUpRight data-icon="inline-end" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={copyLink}
                    className="h-8 rounded-lg border-white/10 bg-white/[0.02] px-2.5 text-[10.5px]"
                  >
                    {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-white/8 bg-background/40 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    Plan
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[8.5px] font-medium uppercase",
                      planBadgeClass(user.plan)
                    )}
                  >
                    {PLAN_LABEL[user.plan]}
                  </span>
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">
                  Your plan and card finish are managed by CoTap. Ask us about
                  moving up to Pro or Teams.
                </p>
                <Button
                  render={
                    <a
                      href={`mailto:hello@cotap.id?subject=${encodeURIComponent(
                        "Upgrade my CoTap plan"
                      )}`}
                    />
                  }
                  nativeButton={false}
                  variant="outline"
                  className="mt-3 h-8 w-full rounded-lg border-white/10 bg-white/[0.02] text-[10.5px]"
                >
                  <Sparkles data-icon="inline-start" />
                  Request an upgrade
                </Button>
              </div>

              <p className="mt-3 flex items-start gap-1.5 text-[9px] leading-relaxed text-muted-foreground/70">
                <ShieldCheck className="mt-0.5 size-3 shrink-0 text-primary/70" />
                Only you can edit this profile. Your password is hashed; sessions
                last 30 days.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-white/6 py-5">
        <div className="site-container flex flex-col items-center justify-between gap-2 text-[10px] text-muted-foreground/70 sm:flex-row">
          <p>Need help?{" "}
            <a
              href="mailto:hello@cotap.id"
              className="text-foreground/80 underline decoration-white/20 underline-offset-2 hover:decoration-primary"
            >
              hello@cotap.id
            </a>
          </p>
          <Link to="/" className="transition-colors hover:text-foreground">
            cotap.id
          </Link>
        </div>
      </footer>
    </div>
  )
}

export function PortalPage() {
  const [auth, setAuth] = useState<"checking" | "out" | "in">("checking")
  const handleLoggedOut = useCallback(() => setAuth("out"), [])

  usePageMeta(
    "Your profile — CoTap",
    "Sign in to manage your CoTap public profile, links and contact details."
  )

  useEffect(() => {
    let active = true
    api<{ user: UserRecord | null }>("/api/auth/me")
      .then((data) => {
        if (active) setAuth(data.user ? "in" : "out")
      })
      .catch(() => {
        if (active) setAuth("out")
      })
    return () => {
      active = false
    }
  }, [])

  if (auth === "checking") return <PortalLoading />
  if (auth === "out") return <ClientLogin onSuccess={() => setAuth("in")} />

  return <PortalDashboard onLoggedOut={handleLoggedOut} />
}

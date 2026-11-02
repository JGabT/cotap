import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  Crown,
  LayoutGrid,
  Link2,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react"

import { AdminLogin } from "@/components/admin/admin-login"
import { UserEditor } from "@/components/admin/user-editor"
import { Logo } from "@/components/site/logo"
import { usePageMeta } from "@/components/site/use-page-meta"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  PLAN_LABEL,
  api,
  initials,
  type AdminUser,
  type Plan,
} from "@/lib/api"
import { cn } from "@/lib/utils"

function planBadgeClass(plan: Plan) {
  if (plan === "pro") return "border-primary/25 bg-primary/10 text-primary"
  if (plan === "team") return "border-white/15 bg-white/10 text-foreground"
  return "border-white/10 bg-white/5 text-muted-foreground"
}

function AdminLoading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4">
      <Logo />
      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        Checking your session…
      </div>
    </div>
  )
}

function AdminDashboard({ onLoggedOut }: { onLoggedOut: () => void }) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const detailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    api<{ users: AdminUser[] }>("/api/admin/users")
      .then((data) => {
        if (!active) return
        setUsers(data.users)
        setLoadError("")
      })
      .catch(() => {
        if (active) setLoadError("Could not load members.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [refreshKey])

  useEffect(() => {
    if (selectedId === null && users.length) {
      setSelectedId(users[0].id)
    }
  }, [selectedId, users])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return users
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.handle.toLowerCase().includes(term)
    )
  }, [query, users])

  const stats = useMemo(
    () => ({
      total: users.length,
      pro: users.filter((user) => user.plan === "pro").length,
      team: users.filter((user) => user.plan === "team").length,
      links: users.reduce((sum, user) => sum + Number(user.links_count ?? 0), 0),
    }),
    [users]
  )

  function selectUser(id: number) {
    setSelectedId(id)
    if (window.matchMedia("(max-width: 1023px)").matches) {
      window.setTimeout(() => {
        detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 60)
    }
  }

  async function logout() {
    try {
      await api("/api/admin/logout", { method: "POST" })
    } finally {
      onLoggedOut()
    }
  }

  return (
    <div className="min-h-svh">
      <header className="sticky top-0 z-30 border-b border-white/8 bg-background/80 backdrop-blur-xl">
        <div className="site-container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" aria-label="CoTap home">
              <Logo />
            </Link>
            <span className="hidden rounded-full border border-primary/20 bg-primary/[0.07] px-2.5 py-1 text-[9px] font-medium tracking-[0.14em] text-primary uppercase sm:inline-flex">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              render={<Link to="/" />}
              nativeButton={false}
              variant="ghost"
              className="h-8 rounded-full px-3 text-[11.5px] text-muted-foreground hover:text-foreground"
            >
              View site
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
          Owner console
        </p>
        <h1 className="mt-4 text-[clamp(1.9rem,4vw,2.6rem)] font-medium tracking-[-0.04em]">
          Everyone on CoTap.
        </h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted-foreground">
          Manage member names, public links and subscriptions. Every change
          invalidates the R2 profile cache and goes live immediately.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: Users, label: "Members", value: stats.total },
            { icon: Crown, label: "Pro", value: stats.pro },
            { icon: ShieldCheck, label: "Teams", value: stats.team },
            { icon: Link2, label: "Links", value: stats.links },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/8 bg-white/[0.025] px-4 py-3.5"
            >
              <div className="flex items-center gap-1.5 text-[9.5px] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                <stat.icon className="size-3 text-primary/70" />
                {stat.label}
              </div>
              <p className="mt-2 text-2xl font-medium tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section className="rounded-2xl border border-white/8 bg-white/[0.02] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[12px] font-medium">Members</p>
                <p className="text-[9.5px] text-muted-foreground">
                  {filtered.length} of {users.length}
                </p>
              </div>
              <Button
                size="icon-sm"
                variant="outline"
                onClick={() => setRefreshKey((key) => key + 1)}
                aria-label="Refresh members"
                className="border-white/10 bg-white/[0.03]"
              >
                <RefreshCw className={cn("size-3", loading && "animate-spin")} />
              </Button>
            </div>

            <div className="relative mt-3">
              <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search name or username…"
                className="h-9 rounded-lg border-white/8 bg-background/50 pl-7 text-[11.5px]"
              />
            </div>

            {loadError && (
              <div className="mt-4 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-[11px] text-red-300">
                {loadError}
              </div>
            )}

            <div className="mt-3 space-y-1">
              {filtered.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => selectUser(user.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-2.5 py-2.5 text-left transition-colors",
                    selectedId === user.id
                      ? "border-primary/25 bg-primary/[0.06]"
                      : "border-transparent hover:border-white/8 hover:bg-white/[0.03]"
                  )}
                >
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(140deg,#d8f28c,#8fb84a_58%,#42551f)] text-[10px] font-semibold text-[#1a200c]">
                    {initials(user.name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[11.5px] font-medium">
                      {user.name}
                    </span>
                    <span className="block truncate text-[9.5px] text-muted-foreground">
                      cotap.id/{user.handle}
                    </span>
                  </span>
                  <span className="hidden text-[9px] text-muted-foreground/70 sm:block">
                    {user.links_count} links
                  </span>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[8.5px] font-medium uppercase",
                      planBadgeClass(user.plan)
                    )}
                  >
                    {PLAN_LABEL[user.plan]}
                  </span>
                </button>
              ))}

              {!filtered.length && !loading && (
                <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 px-4 py-10 text-center">
                  <LayoutGrid className="size-5 text-muted-foreground/60" />
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    No members match that search.
                  </p>
                </div>
              )}

              {loading && !users.length && (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="size-4 animate-spin text-primary" />
                </div>
              )}
            </div>

            <p className="mt-4 border-t border-white/6 pt-3 text-[9px] leading-relaxed text-muted-foreground/70">
              Profiles are stored in D1 and cached in R2. Members created at
              checkout appear here automatically.
            </p>
          </section>

          <div id="admin-detail" ref={detailRef} className="scroll-mt-24">
            {selectedId ? (
              <UserEditor
                key={selectedId}
                userId={selectedId}
                onChanged={() => setRefreshKey((key) => key + 1)}
                onDeleted={() => {
                  setSelectedId(null)
                  setRefreshKey((key) => key + 1)
                }}
              />
            ) : (
              <div className="flex min-h-[24rem] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] p-8 text-center">
                <Users className="size-6 text-muted-foreground/50" />
                <p className="mt-3 text-[12px] font-medium">Select a member</p>
                <p className="mt-1 max-w-[16rem] text-[10.5px] leading-relaxed text-muted-foreground">
                  Pick someone from the list to edit their name, links or
                  subscription.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export function AdminPage() {
  const [auth, setAuth] = useState<"checking" | "out" | "in">("checking")

  usePageMeta(
    "Admin console — CoTap",
    "CoTap admin console for managing members, links and subscriptions."
  )

  useEffect(() => {
    let active = true
    api<{ authenticated: boolean }>("/api/admin/me")
      .then((data) => {
        if (active) setAuth(data.authenticated ? "in" : "out")
      })
      .catch(() => {
        if (active) setAuth("out")
      })
    return () => {
      active = false
    }
  }, [])

  if (auth === "checking") return <AdminLoading />
  if (auth === "out") return <AdminLogin onSuccess={() => setAuth("in")} />

  return <AdminDashboard onLoggedOut={() => setAuth("out")} />
}

import { useCallback, useEffect, useState } from "react"
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  DatabaseZap,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ApiError,
  PLAN_LABEL,
  api,
  initials,
  type AdminLink,
  type Plan,
  type UserRecord,
} from "@/lib/api"
import { cn } from "@/lib/utils"

const plans: Plan[] = ["basic", "pro", "team"]

function planBadgeClass(plan: Plan) {
  if (plan === "pro") return "border-primary/25 bg-primary/10 text-primary"
  if (plan === "team") return "border-white/15 bg-white/10 text-foreground"
  return "border-white/10 bg-white/5 text-muted-foreground"
}

type Detail = { user: UserRecord; links: AdminLink[] }

function LinkRow({
  link,
  userId,
  onRefresh,
  onFeedback,
}: {
  link: AdminLink
  userId: number
  onRefresh: (detail: Detail) => void
  onFeedback: (text: string, error?: boolean) => void
}) {
  const [label, setLabel] = useState(link.label)
  const [url, setUrl] = useState(link.url)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLabel(link.label)
    setUrl(link.url)
  }, [link.label, link.url])

  async function save() {
    setSaving(true)
    try {
      const detail = await api<Detail>(
        `/api/admin/users/${userId}/links/${link.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ label, url }),
        }
      )
      onRefresh(detail)
      onFeedback("Link saved")
    } catch (error) {
      onFeedback(
        error instanceof ApiError ? error.message : "Could not save the link",
        true
      )
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!window.confirm(`Remove the "${link.label}" link?`)) return
    setDeleting(true)
    try {
      const detail = await api<Detail>(
        `/api/admin/users/${userId}/links/${link.id}`,
        { method: "DELETE" }
      )
      onRefresh(detail)
      onFeedback("Link removed")
    } catch (error) {
      onFeedback(
        error instanceof ApiError ? error.message : "Could not remove the link",
        true
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="grid gap-1.5 rounded-xl border border-white/7 bg-background/40 p-2.5 sm:grid-cols-[0.8fr_1.2fr_auto] sm:items-center">
      <Input
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        aria-label={`${link.label} label`}
        className="h-8 rounded-md border-white/8 bg-background/60 text-[11.5px]"
      />
      <Input
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        aria-label={`${link.label} URL`}
        className="h-8 rounded-md border-white/8 bg-background/60 text-[11.5px]"
      />
      <div className="flex items-center gap-1">
        <Button
          size="icon-sm"
          variant="outline"
          onClick={save}
          disabled={saving || deleting || !label || !url}
          aria-label={`Save ${link.label}`}
          className="border-white/10 bg-white/[0.03]"
        >
          {saving ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Check className="size-3" />
          )}
        </Button>
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={remove}
          disabled={saving || deleting}
          aria-label={`Remove ${link.label}`}
          className="text-muted-foreground hover:bg-red-400/10 hover:text-red-300"
        >
          {deleting ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Trash2 className="size-3" />
          )}
        </Button>
      </div>
    </div>
  )
}

export function UserEditor({
  userId,
  onChanged,
  onDeleted,
}: {
  userId: number
  onChanged: () => void
  onDeleted: () => void
}) {
  const [detail, setDetail] = useState<Detail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [name, setName] = useState("")
  const [handle, setHandle] = useState("")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [plan, setPlan] = useState<Plan>("basic")
  const [status, setStatus] = useState<"active" | "suspended">("active")

  const [saving, setSaving] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const [feedback, setFeedback] = useState<{ text: string; error: boolean } | null>(
    null
  )

  const [newLabel, setNewLabel] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [addingLink, setAddingLink] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await api<Detail>(`/api/admin/users/${userId}`)
      setDetail(data)
      setName(data.user.name)
      setHandle(data.user.handle)
      setRole(data.user.role)
      setEmail(data.user.email ?? "")
      setPhone(data.user.phone ?? "")
      setPlan(data.user.plan)
      setStatus(data.user.status)
    } catch {
      setError("Could not load this member.")
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    load()
  }, [load])

  function showFeedback(text: string, isError = false) {
    setFeedback({ text, error: isError })
  }

  function applyDetail(data: Detail) {
    setDetail(data)
    setPlan(data.user.plan)
    onChanged()
  }

  async function saveDetails() {
    setSaving(true)
    setFeedback(null)
    try {
      const data = await api<Detail>(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({
          name,
          handle,
          role,
          email,
          phone,
          plan,
          status,
        }),
      })
      applyDetail(data)
      setName(data.user.name)
      setHandle(data.user.handle)
      setRole(data.user.role)
      setEmail(data.user.email ?? "")
      setPhone(data.user.phone ?? "")
      setStatus(data.user.status)
      showFeedback("Member updated")
    } catch (requestError) {
      showFeedback(
        requestError instanceof ApiError
          ? requestError.message
          : "Could not save changes",
        true
      )
    } finally {
      setSaving(false)
    }
  }

  async function quickUpgrade(nextPlan: Plan) {
    setUpgrading(true)
    try {
      const data = await api<Detail>(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ plan: nextPlan }),
      })
      setDetail(data)
      setPlan(data.user.plan)
      onChanged()
      showFeedback(`Plan changed to ${PLAN_LABEL[nextPlan]}`)
    } catch (requestError) {
      showFeedback(
        requestError instanceof ApiError
          ? requestError.message
          : "Could not change the plan",
        true
      )
    } finally {
      setUpgrading(false)
    }
  }

  async function addLink() {
    if (!newLabel.trim() || !newUrl.trim()) return
    setAddingLink(true)
    try {
      const data = await api<Detail>(`/api/admin/users/${userId}/links`, {
        method: "POST",
        body: JSON.stringify({ label: newLabel, url: newUrl }),
      })
      setDetail(data)
      setNewLabel("")
      setNewUrl("")
      onChanged()
      showFeedback("Link added")
    } catch (requestError) {
      showFeedback(
        requestError instanceof ApiError
          ? requestError.message
          : "Could not add the link",
        true
      )
    } finally {
      setAddingLink(false)
    }
  }

  async function purgeCache() {
    try {
      await api(`/api/admin/users/${userId}/cache`, { method: "DELETE" })
      showFeedback("Profile cache purged — the next visit rebuilds it from D1.")
    } catch (requestError) {
      showFeedback(
        requestError instanceof ApiError
          ? requestError.message
          : "Could not purge the cache",
        true
      )
    }
  }

  async function deleteUser() {
    if (
      !window.confirm(
        `Delete ${detail?.user.name ?? "this member"}? Their profile and links will be removed permanently.`
      )
    ) {
      return
    }
    try {
      await api(`/api/admin/users/${userId}`, { method: "DELETE" })
      onDeleted()
    } catch (requestError) {
      showFeedback(
        requestError instanceof ApiError
          ? requestError.message
          : "Could not delete the member",
        true
      )
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[24rem] items-center justify-center rounded-2xl border border-white/8 bg-white/[0.02]">
        <Loader2 className="size-5 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 text-center">
        <p className="text-[12.5px] text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={load} className="mt-4 h-9 rounded-lg">
          Try again
        </Button>
      </div>
    )
  }

  const user = detail.user

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-[linear-gradient(140deg,#d8f28c,#8fb84a_58%,#42551f)] text-[13px] font-semibold text-[#1a200c]">
            {initials(user.name)}
          </span>
          <div>
            <p className="text-[14px] font-medium">{user.name}</p>
            <p className="text-[10.5px] text-muted-foreground">cotap.id/{user.handle}</p>
          </div>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-[9px] font-medium tracking-[0.1em] uppercase",
            planBadgeClass(user.plan)
          )}
        >
          {PLAN_LABEL[user.plan]}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button
          render={
            <a
              href={`/u/${encodeURIComponent(user.handle)}`}
              target="_blank"
              rel="noreferrer"
            />
          }
          nativeButton={false}
          variant="outline"
          className="h-8 rounded-lg border-white/10 bg-white/[0.03] px-3 text-[11px] hover:bg-white/[0.06]"
        >
          View profile
          <ArrowUpRight data-icon="inline-end" />
        </Button>
        <Button
          variant="outline"
          onClick={purgeCache}
          className="h-8 rounded-lg border-white/10 bg-white/[0.03] px-3 text-[11px] hover:bg-white/[0.06]"
        >
          <DatabaseZap data-icon="inline-start" />
          Purge cache
        </Button>
        {user.plan === "basic" && (
          <Button
            onClick={() => quickUpgrade("pro")}
            disabled={upgrading}
            className="h-8 rounded-lg px-3 text-[11px]"
          >
            {upgrading ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <ArrowUpRight className="size-3" />
            )}
            Upgrade to Pro
          </Button>
        )}
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

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Profile
          </p>
          <span className="text-[9.5px] text-muted-foreground/70">
            {user.status === "suspended" ? "Suspended" : "Active"}
          </span>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label htmlFor="admin-name" className="text-[10.5px] text-muted-foreground">
              Name
            </Label>
            <Input
              id="admin-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-9 rounded-lg border-white/10 bg-background/60 text-[12px]"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="admin-handle" className="text-[10.5px] text-muted-foreground">
              Username
            </Label>
            <div className="flex h-9 items-center rounded-lg border border-white/10 bg-background/60 px-2.5">
              <span className="shrink-0 text-[11px] text-muted-foreground">cotap.id/</span>
              <Input
                id="admin-handle"
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                className="h-full min-w-0 border-0 bg-transparent px-0 text-[12px] shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="admin-role" className="text-[10.5px] text-muted-foreground">
              Role
            </Label>
            <Input
              id="admin-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="h-9 rounded-lg border-white/10 bg-background/60 text-[12px]"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="admin-email" className="text-[10.5px] text-muted-foreground">
              Email
            </Label>
            <Input
              id="admin-email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-9 rounded-lg border-white/10 bg-background/60 text-[12px]"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="admin-phone" className="text-[10.5px] text-muted-foreground">
              Phone
            </Label>
            <Input
              id="admin-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-9 rounded-lg border-white/10 bg-background/60 text-[12px]"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="admin-status" className="text-[10.5px] text-muted-foreground">
              Status
            </Label>
            <select
              id="admin-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value === "suspended" ? "suspended" : "active")
              }
              className="h-9 w-full rounded-lg border border-white/10 bg-background/60 px-2.5 text-[12px] text-foreground outline-none focus:border-ring"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Subscription
        </p>
        <div className="mt-3 grid grid-cols-3 gap-1.5 rounded-lg border border-white/10 bg-background/40 p-1">
          {plans.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPlan(option)}
              className={cn(
                "h-8 rounded-md text-[11px] font-medium transition-colors",
                plan === option
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {PLAN_LABEL[option]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[9.5px] text-muted-foreground/75">
          Changing a plan here takes effect after saving.
        </p>
      </div>

      <div className="mt-5 flex items-center gap-2">
        <Button
          onClick={saveDetails}
          disabled={saving}
          className="h-9 flex-1 rounded-lg text-[12px]"
        >
          {saving ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Save className="size-3.5" />
          )}
          Save changes
        </Button>
      </div>

      <div className="my-6 h-px bg-white/8" />

      <div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Links
          </p>
          <span className="text-[9.5px] text-muted-foreground/70">
            {detail.links.length} total
          </span>
        </div>

        <div className="mt-3 space-y-2">
          {detail.links.map((link) => (
            <LinkRow
              key={link.id}
              link={link}
              userId={userId}
              onRefresh={(next) => {
                setDetail(next)
                onChanged()
              }}
              onFeedback={(text, isError) => showFeedback(text, isError)}
            />
          ))}
          {!detail.links.length && (
            <p className="rounded-lg border border-dashed border-white/10 px-3 py-4 text-center text-[10.5px] text-muted-foreground">
              No links yet. Add the first one below.
            </p>
          )}
        </div>

        <div className="mt-3 grid gap-1.5 sm:grid-cols-[0.8fr_1.2fr_auto]">
          <Input
            value={newLabel}
            onChange={(event) => setNewLabel(event.target.value)}
            placeholder="Label"
            aria-label="New link label"
            className="h-8 rounded-md border-white/8 bg-background/60 text-[11.5px]"
          />
          <Input
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            placeholder="https://example.com"
            aria-label="New link URL"
            className="h-8 rounded-md border-white/8 bg-background/60 text-[11.5px]"
          />
          <Button
            onClick={addLink}
            disabled={addingLink || !newLabel.trim() || !newUrl.trim()}
            size="sm"
            variant="outline"
            className="h-8 rounded-md border-white/10 bg-white/[0.03] text-[11px]"
          >
            {addingLink ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <Plus className="size-3" />
            )}
            Add
          </Button>
        </div>
      </div>

      <div className="my-6 h-px bg-white/8" />

      <div className="flex items-start justify-between gap-4 rounded-xl border border-red-400/15 bg-red-400/[0.04] p-3.5">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-red-300/80" />
          <div>
            <p className="text-[11px] font-medium text-red-200/90">Danger zone</p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">
              Delete this member, their links and their public profile.
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={deleteUser}
          className="h-8 shrink-0 rounded-lg px-2.5 text-[10.5px]"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

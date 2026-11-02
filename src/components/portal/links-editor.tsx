import { useEffect, useState } from "react"
import { Check, Link2, Loader2, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ApiError,
  LINK_SYMBOLS,
  api,
  defaultLinkIcon,
  type AdminLink,
} from "@/lib/api"

type LinksDetail = { links: AdminLink[] }

function LinkRow({
  link,
  basePath,
  onChanged,
  onFeedback,
}: {
  link: AdminLink
  basePath: string
  onChanged: (links: AdminLink[]) => void
  onFeedback: (text: string, error?: boolean) => void
}) {
  const [label, setLabel] = useState(link.label)
  const [url, setUrl] = useState(link.url)
  const [icon, setIcon] = useState(link.icon || defaultLinkIcon(link.url))
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLabel(link.label)
    setUrl(link.url)
    setIcon(link.icon || defaultLinkIcon(link.url))
  }, [link.label, link.url, link.icon])

  async function save() {
    setSaving(true)
    try {
      const data = await api<LinksDetail>(`${basePath}/links/${link.id}`, {
        method: "PATCH",
        body: JSON.stringify({ label, url, icon }),
      })
      onChanged(data.links)
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
      const data = await api<LinksDetail>(`${basePath}/links/${link.id}`, {
        method: "DELETE",
      })
      onChanged(data.links)
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
    <div className="grid gap-1.5 rounded-xl border border-white/7 bg-background/40 p-2.5 sm:grid-cols-[auto_0.8fr_1.2fr_auto] sm:items-center">
      <select
        value={icon}
        onChange={(event) => setIcon(event.target.value)}
        aria-label={`${link.label} symbol`}
        className="h-8 w-14 rounded-md border border-white/8 bg-background/60 text-center text-[14px] text-foreground outline-none focus:border-ring"
      >
        {LINK_SYMBOLS.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
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

export function LinksEditor({
  basePath,
  links,
  onChanged,
  onFeedback,
}: {
  basePath: string
  links: AdminLink[]
  onChanged: (links: AdminLink[]) => void
  onFeedback: (text: string, error?: boolean) => void
}) {
  const [newLabel, setNewLabel] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [newIcon, setNewIcon] = useState("🔗")
  const [adding, setAdding] = useState(false)

  async function addLink() {
    if (!newLabel.trim() || !newUrl.trim()) return
    setAdding(true)
    try {
      const data = await api<LinksDetail>(`${basePath}/links`, {
        method: "POST",
        body: JSON.stringify({ label: newLabel, url: newUrl, icon: newIcon }),
      })
      onChanged(data.links)
      setNewLabel("")
      setNewUrl("")
      setNewIcon("🔗")
      onFeedback("Link added")
    } catch (error) {
      onFeedback(
        error instanceof ApiError ? error.message : "Could not add the link",
        true
      )
    } finally {
      setAdding(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          <Link2 className="size-3 text-primary/70" />
          Links
        </p>
        <span className="text-[9.5px] text-muted-foreground/70">
          {links.length} total
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {links.map((link) => (
          <LinkRow
            key={link.id}
            link={link}
            basePath={basePath}
            onChanged={onChanged}
            onFeedback={onFeedback}
          />
        ))}
        {!links.length && (
          <p className="rounded-lg border border-dashed border-white/10 px-3 py-4 text-center text-[10.5px] text-muted-foreground">
            No links yet. Add the first one below.
          </p>
        )}
      </div>

      <div className="mt-3 grid gap-1.5 sm:grid-cols-[auto_0.8fr_1.2fr_auto]">
        <select
          value={newIcon}
          onChange={(event) => setNewIcon(event.target.value)}
          aria-label="New link symbol"
          className="h-8 w-14 rounded-md border border-white/8 bg-background/60 text-center text-[14px] text-foreground outline-none focus:border-ring"
        >
          {LINK_SYMBOLS.map((symbol) => (
            <option key={symbol} value={symbol}>
              {symbol}
            </option>
          ))}
        </select>
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
          disabled={adding || !newLabel.trim() || !newUrl.trim()}
          size="sm"
          variant="outline"
          className="h-8 rounded-md border-white/10 bg-white/[0.03] text-[11px]"
        >
          {adding ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Plus className="size-3" />
          )}
          Add
        </Button>
      </div>
    </div>
  )
}

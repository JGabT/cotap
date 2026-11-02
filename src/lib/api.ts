export type Plan = "basic" | "pro" | "team"
export type MemberStatus = "active" | "suspended"
export type AvatarKind = "initials" | "icon" | "image"
export type ThemeFont = "sans" | "serif" | "mono"
export type ThemePattern = "none" | "grid" | "glow" | "dots"

export interface ProfileTheme {
  preset: string
  accent: string
  page: string
  card: string
  font: ThemeFont
  pattern: ThemePattern
}

export const DEFAULT_THEME: ProfileTheme = {
  preset: "lime",
  accent: "#c9f45f",
  page: "#0b0c0e",
  card: "#f7f5ef",
  font: "sans",
  pattern: "glow",
}

export const THEME_PRESETS: Array<{ id: string; label: string; theme: ProfileTheme }> = [
  {
    id: "lime",
    label: "Lime",
    theme: { preset: "lime", accent: "#c9f45f", page: "#0b0c0e", card: "#f7f5ef", font: "sans", pattern: "glow" },
  },
  {
    id: "midnight",
    label: "Midnight",
    theme: { preset: "midnight", accent: "#7dd3fc", page: "#050a12", card: "#0f172a", font: "sans", pattern: "grid" },
  },
  {
    id: "sunset",
    label: "Sunset",
    theme: { preset: "sunset", accent: "#ff9d6c", page: "#170b06", card: "#fff4ea", font: "serif", pattern: "glow" },
  },
  {
    id: "ocean",
    label: "Ocean",
    theme: { preset: "ocean", accent: "#5eead4", page: "#031413", card: "#ecfdf8", font: "sans", pattern: "dots" },
  },
  {
    id: "rose",
    label: "Rose",
    theme: { preset: "rose", accent: "#f9a8d4", page: "#170a12", card: "#fff1f7", font: "serif", pattern: "none" },
  },
  {
    id: "mono",
    label: "Mono",
    theme: { preset: "mono", accent: "#e5e5e5", page: "#080808", card: "#f5f5f5", font: "mono", pattern: "grid" },
  },
]

export const LINK_SYMBOLS = ["🔗", "🌐", "💼", "📸", "💻", "✉️", "📞", "📅", "🎨", "🛍️", "🎧", "📄"]

export function isLightColor(hex: string) {
  const value = hex.replace("#", "")
  if (!/^[0-9a-f]{6}$/i.test(value)) return true
  const red = Number.parseInt(value.slice(0, 2), 16)
  const green = Number.parseInt(value.slice(2, 4), 16)
  const blue = Number.parseInt(value.slice(4, 6), 16)
  return (red * 299 + green * 587 + blue * 114) / 1000 > 150
}

export function themeInk(theme: ProfileTheme) {
  return isLightColor(theme.card) ? "#15161a" : "#f7f5ef"
}

export function themeMuted(theme: ProfileTheme) {
  return isLightColor(theme.card) ? "rgba(21,22,26,0.58)" : "rgba(247,245,239,0.62)"
}

export function themeFaint(theme: ProfileTheme) {
  return isLightColor(theme.card) ? "rgba(21,22,26,0.38)" : "rgba(247,245,239,0.42)"
}

export function themeLine(theme: ProfileTheme) {
  return isLightColor(theme.card) ? "rgba(21,22,26,0.10)" : "rgba(247,245,239,0.12)"
}

export function themeSurface(theme: ProfileTheme) {
  return isLightColor(theme.card) ? "rgba(21,22,26,0.035)" : "rgba(247,245,239,0.055)"
}

export function themeFontFamily(theme: ProfileTheme) {
  if (theme.font === "serif") return "var(--font-serif)"
  if (theme.font === "mono") return "ui-monospace, SFMono-Regular, Menlo, monospace"
  return "var(--font-sans)"
}

export function defaultLinkIcon(url: string) {
  const value = url.toLowerCase()
  if (value.includes("linkedin")) return "💼"
  if (value.includes("github")) return "💻"
  if (value.includes("instagram")) return "📸"
  if (value.startsWith("mailto:")) return "✉️"
  if (value.startsWith("tel:")) return "📞"
  if (value.includes("calendly") || value.includes("cal.com")) return "📅"
  if (value.includes("behance") || value.includes("dribbble")) return "🎨"
  if (value.includes("shop") || value.includes("store")) return "🛍️"
  return "🌐"
}

export interface UserRecord {
  id: number
  name: string
  handle: string
  role: string
  bio: string | null
  email: string | null
  phone: string | null
  address: string | null
  plan: Plan
  status: MemberStatus
  avatar_kind: AvatarKind
  avatar_value: string | null
  theme: ProfileTheme | null
  created_at: string
  updated_at: string
}

export interface AdminUser extends UserRecord {
  links_count: number
}

export interface AdminLink {
  id: number
  user_id: number
  label: string
  url: string
  sort_order: number
  visible: number
  icon: string | null
  created_at: string
}

export interface PublicLink {
  label: string
  url: string
  icon?: string | null
}

export interface PublicProfile {
  name: string
  handle: string
  role: string
  bio: string | null
  email: string | null
  phone: string | null
  plan: Plan
  avatar: {
    kind: AvatarKind
    value: string | null
    url: string | null
  }
  theme: ProfileTheme | null
  links: PublicLink[]
  updatedAt: string
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  if (typeof init.body === "string" && !headers.has("content-type")) {
    headers.set("content-type", "application/json")
  }

  const response = await fetch(path, {
    credentials: "include",
    ...init,
    headers,
  })

  const data = (await response.json().catch(() => ({}))) as {
    error?: string
  }

  if (!response.ok) {
    throw new ApiError(response.status, data.error ?? "Something went wrong")
  }

  return data as T
}

export function initials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "?"
  )
}

export const PLAN_LABEL: Record<Plan, string> = {
  basic: "Basic",
  pro: "Pro",
  team: "Teams",
}

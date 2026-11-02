export type Plan = "basic" | "pro" | "team"
export type MemberStatus = "active" | "suspended"

export interface UserRecord {
  id: number
  name: string
  handle: string
  role: string
  email: string | null
  phone: string | null
  address: string | null
  plan: Plan
  status: MemberStatus
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
  created_at: string
}

export interface PublicLink {
  label: string
  url: string
}

export interface PublicProfile {
  name: string
  handle: string
  role: string
  email: string | null
  phone: string | null
  plan: Plan
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
  if (init.body && !headers.has("content-type")) {
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

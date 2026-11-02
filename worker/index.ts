/// <reference types="@cloudflare/workers-types" />

interface Env {
  ASSETS: Fetcher
  DB: D1Database
  CACHE: R2Bucket
  ADMIN_PASSWORD: string
  ADMIN_SESSION_SECRET: string
}

type Plan = "basic" | "pro" | "team"
type Status = "active" | "suspended"

interface UserRow {
  id: number
  name: string
  handle: string
  role: string
  email: string | null
  phone: string | null
  address: string | null
  plan: Plan
  status: Status
  created_at: string
  updated_at: string
}

interface LinkRow {
  id: number
  user_id: number
  label: string
  url: string
  sort_order: number
  visible: number
  created_at: string
}

interface AdminUserRow extends UserRow {
  links_count: number
}

const SESSION_COOKIE = "cotap_admin"
const SESSION_TTL = 60 * 60 * 12
const PROFILE_TTL_MS = 1000 * 60 * 60 * 24
const PLAN_RANK: Record<Plan, number> = { basic: 0, pro: 1, team: 2 }

function json(data: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  })
}

function badRequest(message: string) {
  return json({ error: message }, 400)
}

function unauthorized() {
  return json({ error: "Unauthorized" }, 401)
}

function notFound(message = "Not found") {
  return json({ error: message }, 404)
}

async function readBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T
  } catch {
    return null
  }
}

function sanitizeHandle(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 32)
}

function normalizeUrl(value: unknown) {
  const raw = String(value ?? "").trim()
  if (!raw || raw.length > 500) return null
  if (/^https?:\/\//i.test(raw) || /^mailto:/i.test(raw)) return raw
  if (/^[\w.-]+\.[a-z]{2,}/i.test(raw)) return `https://${raw}`
  return null
}

function normalizeText(value: unknown, max: number) {
  const text = String(value ?? "").trim()
  return text ? text.slice(0, max) : ""
}

function profileKey(handle: string) {
  return `profiles/${handle}.json`
}

async function purgeProfile(env: Env, handle: string) {
  if (!handle) return
  await env.CACHE.delete(profileKey(handle))
}

function parseCookies(header: string | null) {
  const cookies: Record<string, string> = {}
  if (!header) return cookies
  for (const part of header.split(";")) {
    const [name, ...rest] = part.trim().split("=")
    if (!name) continue
    cookies[name] = rest.join("=")
  }
  return cookies
}

function base64Url(bytes: Uint8Array) {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  )
  return base64Url(new Uint8Array(signature))
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let result = 0
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index)
  }
  return result === 0
}

async function createSession(env: Env) {
  const payload = base64Url(
    new TextEncoder().encode(
      JSON.stringify({ sub: "admin", exp: Date.now() + SESSION_TTL * 1000 })
    )
  )
  const signature = await sign(payload, env.ADMIN_SESSION_SECRET)
  return `${payload}.${signature}`
}

async function isAdmin(request: Request, env: Env) {
  if (!env.ADMIN_SESSION_SECRET) return false
  const token = parseCookies(request.headers.get("cookie"))[SESSION_COOKIE]
  if (!token) return false

  const [payload, signature] = token.split(".")
  if (!payload || !signature) return false

  const expected = await sign(payload, env.ADMIN_SESSION_SECRET)
  if (!timingSafeEqual(signature, expected)) return false

  try {
    const data = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as {
      exp?: number
    }
    return typeof data.exp === "number" && data.exp > Date.now()
  } catch {
    return false
  }
}

function sessionCookie(request: Request, token: string) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : ""
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL}${secure}`
}

function clearedCookie(request: Request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : ""
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
}

async function publicProfile(env: Env, handle: string) {
  const key = profileKey(handle)
  const cached = await env.CACHE.get(key)

  if (cached) {
    const age = Date.now() - new Date(cached.uploaded).getTime()
    if (age < PROFILE_TTL_MS) {
      try {
        return {
          profile: await cached.json<Record<string, unknown>>(),
          cache: "HIT" as const,
        }
      } catch {
        await env.CACHE.delete(key)
      }
    }
  }

  const user = await env.DB.prepare(
    "SELECT * FROM users WHERE handle = ? LIMIT 1"
  )
    .bind(handle)
    .first<UserRow>()

  if (!user || user.status !== "active") {
    return { profile: null, cache: "MISS" as const }
  }

  const { results: links } = await env.DB.prepare(
    "SELECT label, url FROM links WHERE user_id = ? AND visible = 1 ORDER BY sort_order, id"
  )
    .bind(user.id)
    .all<{ label: string; url: string }>()

  const profile = {
    name: user.name,
    handle: user.handle,
    role: user.role,
    email: user.email,
    phone: user.phone,
    plan: user.plan,
    links: links.map((link) => ({ label: link.label, url: link.url })),
    updatedAt: user.updated_at,
  }

  await env.CACHE.put(key, JSON.stringify(profile), {
    httpMetadata: { contentType: "application/json" },
    customMetadata: { handle, cachedAt: new Date().toISOString() },
  })

  return { profile, cache: "MISS" as const }
}

async function listUsers(env: Env, query: string) {
  const base = `SELECT u.id, u.name, u.handle, u.role, u.email, u.phone, u.address,
      u.plan, u.status, u.created_at, u.updated_at,
      (SELECT COUNT(*) FROM links l WHERE l.user_id = u.id) AS links_count
    FROM users u`

  if (query) {
    const like = `%${query}%`
    return env.DB.prepare(
      `${base} WHERE u.name LIKE ? OR u.handle LIKE ? ORDER BY u.updated_at DESC, u.id DESC LIMIT 200`
    )
      .bind(like, like)
      .all<AdminUserRow>()
  }

  return env.DB.prepare(
    `${base} ORDER BY u.updated_at DESC, u.id DESC LIMIT 200`
  ).all<AdminUserRow>()
}

async function userDetail(env: Env, id: number) {
  const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?")
    .bind(id)
    .first<UserRow>()

  if (!user) return null

  const { results: links } = await env.DB.prepare(
    "SELECT * FROM links WHERE user_id = ? ORDER BY sort_order, id"
  )
    .bind(id)
    .all<LinkRow>()

  return { user, links }
}

async function updateUser(env: Env, id: number, body: Record<string, unknown>) {
  const existing = await env.DB.prepare("SELECT * FROM users WHERE id = ?")
    .bind(id)
    .first<UserRow>()

  if (!existing) return { error: notFound("User not found") }

  const sets: string[] = []
  const values: unknown[] = []
  let nextHandle = existing.handle

  if (typeof body.name === "string") {
    const name = normalizeText(body.name, 120)
    if (name.length < 2) return { error: badRequest("Name is too short") }
    sets.push("name = ?")
    values.push(name)
  }

  if (typeof body.handle === "string") {
    const handle = sanitizeHandle(body.handle)
    if (handle.length < 2) return { error: badRequest("Username is too short") }
    const conflict = await env.DB.prepare(
      "SELECT id FROM users WHERE handle = ? AND id <> ?"
    )
      .bind(handle, id)
      .first<{ id: number }>()
    if (conflict) return { error: json({ error: "That username is taken" }, 409) }
    nextHandle = handle
    sets.push("handle = ?")
    values.push(handle)
  }

  if (typeof body.role === "string") {
    sets.push("role = ?")
    values.push(normalizeText(body.role, 80))
  }

  if (typeof body.email === "string") {
    sets.push("email = ?")
    values.push(normalizeText(body.email, 160) || null)
  }

  if (typeof body.phone === "string") {
    sets.push("phone = ?")
    values.push(normalizeText(body.phone, 40) || null)
  }

  if (typeof body.address === "string") {
    sets.push("address = ?")
    values.push(normalizeText(body.address, 300) || null)
  }

  if (typeof body.plan === "string") {
    if (!["basic", "pro", "team"].includes(body.plan)) {
      return { error: badRequest("Invalid plan") }
    }
    sets.push("plan = ?")
    values.push(body.plan)
  }

  if (typeof body.status === "string") {
    if (!["active", "suspended"].includes(body.status)) {
      return { error: badRequest("Invalid status") }
    }
    sets.push("status = ?")
    values.push(body.status)
  }

  if (!sets.length) return { error: badRequest("Nothing to update") }

  sets.push("updated_at = datetime('now')")
  await env.DB.prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`)
    .bind(...values, id)
    .run()

  await purgeProfile(env, existing.handle)
  if (nextHandle !== existing.handle) await purgeProfile(env, nextHandle)

  const detail = await userDetail(env, id)
  return { detail }
}

async function handleApi(request: Request, env: Env) {
  const url = new URL(request.url)
  const method = request.method
  const path = url.pathname

  if (path === "/api/admin/login" && method === "POST") {
    if (!env.ADMIN_PASSWORD || !env.ADMIN_SESSION_SECRET) {
      return json({ error: "Admin is not configured" }, 500)
    }
    const body = await readBody<{ password?: string }>(request)
    if (!body?.password || !timingSafeEqual(body.password, env.ADMIN_PASSWORD)) {
      return json({ error: "Incorrect password" }, 401)
    }
    const token = await createSession(env)
    return json({ ok: true }, 200, {
      "set-cookie": sessionCookie(request, token),
    })
  }

  if (path === "/api/admin/logout" && method === "POST") {
    return json({ ok: true }, 200, {
      "set-cookie": clearedCookie(request),
    })
  }

  if (path === "/api/admin/me") {
    return json({ authenticated: await isAdmin(request, env) })
  }

  if (path.startsWith("/api/admin/")) {
    if (!(await isAdmin(request, env))) return unauthorized()

    const segments = path.split("/").filter(Boolean)
    const userId = Number(segments[3])

    if (segments[2] === "users" && segments.length === 3 && method === "GET") {
      const query = normalizeText(url.searchParams.get("q"), 80)
      const { results } = await listUsers(env, query)
      return json({ users: results })
    }

    if (segments[2] === "users" && Number.isFinite(userId) && userId > 0) {
      if (segments.length === 4 && method === "GET") {
        const detail = await userDetail(env, userId)
        return detail ? json(detail) : notFound("User not found")
      }

      if (segments.length === 4 && method === "PATCH") {
        const body = await readBody<Record<string, unknown>>(request)
        if (!body) return badRequest("Invalid JSON")
        const result = await updateUser(env, userId, body)
        if ("error" in result) return result.error
        return json(result.detail)
      }

      if (segments.length === 4 && method === "DELETE") {
        const user = await env.DB.prepare(
          "SELECT handle FROM users WHERE id = ?"
        )
          .bind(userId)
          .first<{ handle: string }>()
        if (!user) return notFound("User not found")
        await env.DB.batch([
          env.DB.prepare("DELETE FROM links WHERE user_id = ?").bind(userId),
          env.DB.prepare("DELETE FROM users WHERE id = ?").bind(userId),
        ])
        await purgeProfile(env, user.handle)
        return json({ ok: true })
      }
    }

    if (
      segments[2] === "users" &&
      Number.isFinite(userId) &&
      segments[4] === "links" &&
      segments.length === 5 &&
      method === "POST"
    ) {
      const body = await readBody<{ label?: string; url?: string }>(request)
      const label = normalizeText(body?.label, 60)
      const linkUrl = normalizeUrl(body?.url)
      if (!label || !linkUrl) return badRequest("A label and a valid URL are required")

      const user = await env.DB.prepare(
        "SELECT id, handle FROM users WHERE id = ?"
      )
        .bind(userId)
        .first<{ id: number; handle: string }>()
      if (!user) return notFound("User not found")

      const max = await env.DB.prepare(
        "SELECT COALESCE(MAX(sort_order), -1) AS max FROM links WHERE user_id = ?"
      )
        .bind(userId)
        .first<{ max: number }>()

      await env.DB.prepare(
        "INSERT INTO links (user_id, label, url, sort_order) VALUES (?, ?, ?, ?)"
      )
        .bind(userId, label, linkUrl, (max?.max ?? -1) + 1)
        .run()

      await purgeProfile(env, user.handle)
      const detail = await userDetail(env, userId)
      return json(detail, 201)
    }

    const linkId = Number(segments[5])
    if (
      segments[2] === "users" &&
      Number.isFinite(userId) &&
      segments[4] === "links" &&
      Number.isFinite(linkId) &&
      segments.length === 6
    ) {
      const user = await env.DB.prepare(
        "SELECT id, handle FROM users WHERE id = ?"
      )
        .bind(userId)
        .first<{ id: number; handle: string }>()
      if (!user) return notFound("User not found")

      if (method === "PATCH") {
        const body = await readBody<Record<string, unknown>>(request)
        if (!body) return badRequest("Invalid JSON")
        const sets: string[] = []
        const values: unknown[] = []

        if (typeof body.label === "string") {
          const label = normalizeText(body.label, 60)
          if (!label) return badRequest("Label is required")
          sets.push("label = ?")
          values.push(label)
        }
        if (typeof body.url === "string") {
          const linkUrl = normalizeUrl(body.url)
          if (!linkUrl) return badRequest("Enter a valid URL")
          sets.push("url = ?")
          values.push(linkUrl)
        }
        if (typeof body.visible === "boolean") {
          sets.push("visible = ?")
          values.push(body.visible ? 1 : 0)
        }
        if (typeof body.sort_order === "number") {
          sets.push("sort_order = ?")
          values.push(body.sort_order)
        }
        if (!sets.length) return badRequest("Nothing to update")

        await env.DB.prepare(
          `UPDATE links SET ${sets.join(", ")} WHERE id = ? AND user_id = ?`
        )
          .bind(...values, linkId, userId)
          .run()

        await purgeProfile(env, user.handle)
        const detail = await userDetail(env, userId)
        return json(detail)
      }

      if (method === "DELETE") {
        await env.DB.prepare("DELETE FROM links WHERE id = ? AND user_id = ?")
          .bind(linkId, userId)
          .run()
        await purgeProfile(env, user.handle)
        const detail = await userDetail(env, userId)
        return json(detail)
      }
    }

    if (
      segments[2] === "users" &&
      Number.isFinite(userId) &&
      segments[4] === "cache" &&
      segments.length === 5 &&
      method === "DELETE"
    ) {
      const user = await env.DB.prepare(
        "SELECT handle FROM users WHERE id = ?"
      )
        .bind(userId)
        .first<{ handle: string }>()
      if (!user) return notFound("User not found")
      await purgeProfile(env, user.handle)
      return json({ ok: true, purged: profileKey(user.handle) })
    }

    return notFound("Admin route not found")
  }

  if (path.startsWith("/api/profiles/") && method === "GET") {
    const handle = sanitizeHandle(decodeURIComponent(path.split("/").pop() ?? ""))
    if (!handle) return badRequest("A username is required")

    const { profile, cache } = await publicProfile(env, handle)
    if (!profile) return notFound("Profile not found")

    return json(profile, 200, { "x-cotap-cache": cache })
  }

  if (path === "/api/orders" && method === "POST") {
    const body = await readBody<{
      name?: string
      handle?: string
      phone?: string
      address?: string
      plan?: string
      delivery?: string
      shipping?: number
      total?: number
      paymentMethod?: string
    }>(request)

    const name = normalizeText(body?.name, 120)
    const handle = sanitizeHandle(body?.handle)
    const phone = normalizeText(body?.phone, 40)
    const address = normalizeText(body?.address, 300)

    if (name.length < 2) return badRequest("Name is required")
    if (handle.length < 2) return badRequest("Username is required")
    if (phone.replace(/\D/g, "").length < 7) return badRequest("A phone number is required")
    if (address.length < 5) return badRequest("An address is required")

    const orderedPlan: Plan =
      body?.plan === "premium" || body?.plan === "pro"
        ? "pro"
        : body?.plan === "team"
          ? "team"
          : "basic"
    const delivery = body?.delivery === "pickup" ? "pickup" : "delivery"
    const shipping = Math.max(0, Number(body?.shipping) || 0)
    const total = Math.max(0, Number(body?.total) || 0)
    const paymentMethod = body?.paymentMethod === "gcash" ? "gcash" : "card"

    const existing = await env.DB.prepare("SELECT * FROM users WHERE handle = ?")
      .bind(handle)
      .first<UserRow>()

    let userId = existing?.id
    let finalPlan: Plan = orderedPlan

    if (existing) {
      finalPlan =
        PLAN_RANK[orderedPlan] > PLAN_RANK[existing.plan]
          ? orderedPlan
          : existing.plan
      await env.DB.prepare(
        `UPDATE users SET name = ?, phone = ?, address = ?, plan = ?,
          updated_at = datetime('now') WHERE id = ?`
      )
        .bind(name, phone, address, finalPlan, existing.id)
        .run()
    } else {
      const inserted = await env.DB.prepare(
        `INSERT INTO users (name, handle, role, phone, address, plan)
         VALUES (?, ?, 'CoTap member', ?, ?, ?) RETURNING id`
      )
        .bind(name, handle, phone, address, orderedPlan)
        .first<{ id: number }>()
      userId = inserted?.id
    }

    if (!userId) return json({ error: "Could not create your profile" }, 500)

    const orderId = `CT-${new Date().getFullYear()}-${crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 6)
      .toUpperCase()}`

    await env.DB.prepare(
      `INSERT INTO orders (id, user_id, name, handle, plan, delivery, shipping, total, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(orderId, userId, name, handle, orderedPlan, delivery, shipping, total, paymentMethod)
      .run()

    await purgeProfile(env, handle)

    return json(
      {
        orderId,
        handle,
        plan: finalPlan,
        profileUrl: `/u/${handle}`,
      },
      201
    )
  }

  return notFound("API route not found")
}

export default {
  async fetch(request: Request, env: Env) {
    try {
      const url = new URL(request.url)
      if (url.pathname.startsWith("/api/")) {
        return await handleApi(request, env)
      }
      return env.ASSETS.fetch(request)
    } catch (error) {
      console.error("Worker error", error)
      return json({ error: "Something went wrong" }, 500)
    }
  },
} satisfies ExportedHandler<Env>

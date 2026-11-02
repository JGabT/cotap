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
  bio: string | null
  email: string | null
  phone: string | null
  address: string | null
  plan: Plan
  status: Status
  avatar_kind: "initials" | "icon" | "image"
  avatar_value: string | null
  theme: string | null
  password_hash: string | null
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
  icon: string | null
  created_at: string
}

interface AdminUserRow extends UserRow {
  links_count: number
}

const ADMIN_COOKIE = "cotap_admin"
const CLIENT_COOKIE = "cotap_client"
const ADMIN_TTL = 60 * 60 * 12
const CLIENT_TTL = 60 * 60 * 24 * 30
const PROFILE_TTL_MS = 1000 * 60 * 60 * 24
const PBKDF2_ITERATIONS = 100_000

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

const THEME_FONTS = ["sans", "serif", "mono"]
const THEME_PATTERNS = ["none", "grid", "glow", "dots"]
const HEX_COLOR = /^#[0-9a-f]{6}$/i

function parseTheme(value: unknown) {
  let raw: unknown = value
  if (typeof raw === "string") {
    try {
      raw = JSON.parse(raw)
    } catch {
      return null
    }
  }
  if (!raw || typeof raw !== "object") return null
  const theme = raw as Record<string, unknown>
  const accent = String(theme.accent ?? "")
  const page = String(theme.page ?? "")
  const card = String(theme.card ?? "")
  const font = String(theme.font ?? "sans")
  const pattern = String(theme.pattern ?? "none")
  if (!HEX_COLOR.test(accent) || !HEX_COLOR.test(page) || !HEX_COLOR.test(card)) {
    return null
  }
  if (!THEME_FONTS.includes(font) || !THEME_PATTERNS.includes(pattern)) {
    return null
  }
  return {
    preset: normalizeText(theme.preset, 24) || "custom",
    accent,
    page,
    card,
    font: font as "sans" | "serif" | "mono",
    pattern: pattern as "none" | "grid" | "glow" | "dots",
  }
}

function normalizeEmail(value: unknown) {
  const email = String(value ?? "").trim().toLowerCase()
  if (!email || email.length > 160) return null
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? email : null
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

function fromBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4)
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256
  )
  return `pbkdf2$${PBKDF2_ITERATIONS}$${base64Url(salt)}$${base64Url(new Uint8Array(bits))}`
}

async function verifyPassword(password: string, stored: string) {
  const [scheme, iterationsRaw, saltRaw, expected] = stored.split("$")
  const iterations = Number(iterationsRaw)
  if (scheme !== "pbkdf2" || !saltRaw || !expected || !Number.isFinite(iterations)) {
    return false
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: fromBase64Url(saltRaw),
      iterations,
      hash: "SHA-256",
    },
    key,
    256
  )
  return timingSafeEqual(base64Url(new Uint8Array(bits)), expected)
}

async function createSession(
  env: Env,
  payload: { sub: "admin" } | { sub: "user"; uid: number },
  ttl: number
) {
  const body = base64Url(
    new TextEncoder().encode(
      JSON.stringify({ ...payload, exp: Date.now() + ttl * 1000 })
    )
  )
  const signature = await sign(body, env.ADMIN_SESSION_SECRET)
  return `${body}.${signature}`
}

async function readSession(
  request: Request,
  env: Env,
  cookieName: string
) {
  if (!env.ADMIN_SESSION_SECRET) return null
  const token = parseCookies(request.headers.get("cookie"))[cookieName]
  if (!token) return null

  const [payload, signature] = token.split(".")
  if (!payload || !signature) return null

  const expected = await sign(payload, env.ADMIN_SESSION_SECRET)
  if (!timingSafeEqual(signature, expected)) return null

  try {
    const data = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    ) as { sub?: string; uid?: number; exp?: number }
    if (typeof data.exp !== "number" || data.exp <= Date.now()) return null
    return data
  } catch {
    return null
  }
}

async function isAdmin(request: Request, env: Env) {
  const session = await readSession(request, env, ADMIN_COOKIE)
  return session?.sub === "admin"
}

async function currentUser(request: Request, env: Env) {
  const session = await readSession(request, env, CLIENT_COOKIE)
  if (session?.sub !== "user" || typeof session.uid !== "number") return null

  const user = await env.DB.prepare("SELECT * FROM users WHERE id = ?")
    .bind(session.uid)
    .first<UserRow>()

  if (!user || user.status !== "active") return null
  return user
}

function publicUser(user: UserRow) {
  return {
    id: user.id,
    name: user.name,
    handle: user.handle,
    role: user.role,
    bio: user.bio,
    email: user.email,
    phone: user.phone,
    address: user.address,
    plan: user.plan,
    status: user.status,
    avatar_kind: user.avatar_kind,
    avatar_value: user.avatar_value,
    theme: parseTheme(user.theme),
    created_at: user.created_at,
    updated_at: user.updated_at,
  }
}

function sessionCookie(
  request: Request,
  name: string,
  token: string,
  ttl: number
) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : ""
  return `${name}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${ttl}${secure}`
}

function clearedCookie(request: Request, name: string) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : ""
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
}

async function publicProfile(env: Env, handle: string) {
  const key = profileKey(handle)
  const cached = await env.CACHE.get(key)

  if (cached) {
    const age = Date.now() - new Date(cached.uploaded).getTime()
    if (age < PROFILE_TTL_MS) {
      try {
        const cachedProfile = await cached.json<Record<string, unknown>>()
        if (cachedProfile.avatar) {
          return { profile: cachedProfile, cache: "HIT" as const }
        }
        await env.CACHE.delete(key)
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
    "SELECT label, url, icon FROM links WHERE user_id = ? AND visible = 1 ORDER BY sort_order, id"
  )
    .bind(user.id)
    .all<{ label: string; url: string; icon: string | null }>()

  const profile = {
    name: user.name,
    handle: user.handle,
    role: user.role,
    bio: user.bio,
    email: user.email,
    phone: user.phone,
    plan: user.plan,
    avatar: {
      kind: user.avatar_kind,
      value: user.avatar_value,
      url:
        user.avatar_kind === "image" && user.avatar_value
          ? `/api/avatars/${user.avatar_value}`
          : null,
    },
    theme: parseTheme(user.theme),
    links: links.map((link) => ({
      label: link.label,
      url: link.url,
      icon: link.icon,
    })),
    updatedAt: user.updated_at,
  }

  await env.CACHE.put(key, JSON.stringify(profile), {
    httpMetadata: { contentType: "application/json" },
    customMetadata: { handle, cachedAt: new Date().toISOString() },
  })

  return { profile, cache: "MISS" as const }
}

async function listUsers(env: Env, query: string) {
  const base = `SELECT u.id, u.name, u.handle, u.role, u.bio, u.email, u.phone, u.address,
      u.plan, u.status, u.avatar_kind, u.avatar_value, u.theme, u.created_at, u.updated_at,
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

  return { user: publicUser(user), links }
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

  if (typeof body.bio === "string") {
    sets.push("bio = ?")
    values.push(normalizeText(body.bio, 160) || null)
  }

  if (typeof body.email === "string") {
    const email = normalizeEmail(body.email)
    if (!email) return { error: badRequest("Enter a valid email") }
    const conflict = await env.DB.prepare(
      "SELECT id FROM users WHERE email = ? AND id <> ?"
    )
      .bind(email, id)
      .first<{ id: number }>()
    if (conflict) {
      return { error: json({ error: "That email is already in use" }, 409) }
    }
    sets.push("email = ?")
    values.push(email)
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
    const token = await createSession(env, { sub: "admin" }, ADMIN_TTL)
    return json({ ok: true }, 200, {
      "set-cookie": sessionCookie(request, ADMIN_COOKIE, token, ADMIN_TTL),
    })
  }

  if (path === "/api/admin/logout" && method === "POST") {
    return json({ ok: true }, 200, {
      "set-cookie": clearedCookie(request, ADMIN_COOKIE),
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
          "SELECT handle, avatar_kind, avatar_value FROM users WHERE id = ?"
        )
          .bind(userId)
          .first<{
            handle: string
            avatar_kind: string
            avatar_value: string | null
          }>()
        if (!user) return notFound("User not found")
        await env.DB.batch([
          env.DB.prepare("DELETE FROM links WHERE user_id = ?").bind(userId),
          env.DB.prepare("DELETE FROM users WHERE id = ?").bind(userId),
        ])
        if (user.avatar_kind === "image" && user.avatar_value) {
          await env.CACHE.delete(`avatars/${user.avatar_value}`)
        }
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
      const body = await readBody<{ label?: string; url?: string; icon?: string }>(request)
      const label = normalizeText(body?.label, 60)
      const linkUrl = normalizeUrl(body?.url)
      const icon = normalizeText(body?.icon, 16) || null
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
        "INSERT INTO links (user_id, label, url, sort_order, icon) VALUES (?, ?, ?, ?, ?)"
      )
        .bind(userId, label, linkUrl, (max?.max ?? -1) + 1, icon)
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
        if (typeof body.icon === "string" || body.icon === null) {
          sets.push("icon = ?")
          values.push(normalizeText(body.icon, 16) || null)
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

  if (path === "/api/auth/login" && method === "POST") {
    const body = await readBody<{ email?: string; password?: string }>(request)
    const email = normalizeEmail(body?.email)
    const password = String(body?.password ?? "")

    if (!email || !password) {
      return json({ error: "Email or password is incorrect" }, 401)
    }

    const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first<UserRow>()

    if (
      !user ||
      !user.password_hash ||
      !(await verifyPassword(password, user.password_hash))
    ) {
      return json({ error: "Email or password is incorrect" }, 401)
    }

    if (user.status !== "active") {
      return json({ error: "This profile is suspended." }, 403)
    }

    const token = await createSession(
      env,
      { sub: "user", uid: user.id },
      CLIENT_TTL
    )

    return json(
      { user: publicUser(user) },
      200,
      {
        "set-cookie": sessionCookie(
          request,
          CLIENT_COOKIE,
          token,
          CLIENT_TTL
        ),
      }
    )
  }

  if (path === "/api/auth/logout" && method === "POST") {
    return json({ ok: true }, 200, {
      "set-cookie": clearedCookie(request, CLIENT_COOKIE),
    })
  }

  if (path === "/api/auth/me") {
    const user = await currentUser(request, env)
    return json({ user: user ? publicUser(user) : null })
  }

  if (path === "/api/auth/password" && method === "POST") {
    const user = await currentUser(request, env)
    if (!user) return unauthorized()

    const body = await readBody<{
      currentPassword?: string
      newPassword?: string
    }>(request)
    const currentPassword = String(body?.currentPassword ?? "")
    const newPassword = String(body?.newPassword ?? "")

    if (
      !user.password_hash ||
      !(await verifyPassword(currentPassword, user.password_hash))
    ) {
      return badRequest("Current password is incorrect")
    }
    if (newPassword.length < 8) {
      return badRequest("New password must be at least 8 characters")
    }

    const passwordHash = await hashPassword(newPassword)
    await env.DB.prepare(
      "UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?"
    )
      .bind(passwordHash, user.id)
      .run()

    return json({ ok: true })
  }

  if (path === "/api/portal/profile") {
    const user = await currentUser(request, env)
    if (!user) return unauthorized()

    if (method === "GET") {
      const detail = await userDetail(env, user.id)
      return detail ? json(detail) : notFound("Profile not found")
    }

    if (method === "PATCH") {
      const body = await readBody<Record<string, unknown>>(request)
      if (!body) return badRequest("Invalid JSON")

      const sets: string[] = []
      const values: unknown[] = []
      let nextHandle = user.handle

      if (typeof body.name === "string") {
        const name = normalizeText(body.name, 120)
        if (name.length < 2) return badRequest("Name is too short")
        sets.push("name = ?")
        values.push(name)
      }

      if (typeof body.handle === "string") {
        const handle = sanitizeHandle(body.handle)
        if (handle.length < 2) return badRequest("Username is too short")
        const conflict = await env.DB.prepare(
          "SELECT id FROM users WHERE handle = ? AND id <> ?"
        )
          .bind(handle, user.id)
          .first<{ id: number }>()
        if (conflict) {
          return json({ error: "That username is already taken" }, 409)
        }
        nextHandle = handle
        sets.push("handle = ?")
        values.push(handle)
      }

      if (typeof body.role === "string") {
        sets.push("role = ?")
        values.push(normalizeText(body.role, 80))
      }

      if (typeof body.bio === "string") {
        sets.push("bio = ?")
        values.push(normalizeText(body.bio, 160) || null)
      }

      if (typeof body.phone === "string") {
        sets.push("phone = ?")
        values.push(normalizeText(body.phone, 40) || null)
      }

      let nextAvatarKind = user.avatar_kind
      let nextAvatarValue = user.avatar_value

      if (typeof body.avatar_kind === "string") {
        const kind = body.avatar_kind
        if (!["initials", "icon", "image"].includes(kind)) {
          return badRequest("Invalid avatar type")
        }

        if (kind === "initials") {
          nextAvatarValue = null
        } else if (kind === "icon") {
          const value = normalizeText(body.avatar_value, 16)
          if (!value) return badRequest("Choose an avatar symbol")
          nextAvatarValue = value
        } else {
          const value = normalizeText(body.avatar_value, 120)
          if (!/^[a-z0-9-]+\.(png|jpe?g|webp)$/i.test(value)) {
            return badRequest("Upload an avatar image first")
          }
          const exists = await env.CACHE.head(`avatars/${value}`)
          if (!exists) return badRequest("Upload an avatar image first")
          nextAvatarValue = value
        }

        nextAvatarKind = kind as "initials" | "icon" | "image"
        sets.push("avatar_kind = ?", "avatar_value = ?")
        values.push(nextAvatarKind, nextAvatarValue)
      }

      if (body.theme !== undefined) {
        const theme = parseTheme(body.theme)
        if (!theme) return badRequest("Invalid theme")
        sets.push("theme = ?")
        values.push(JSON.stringify(theme))
      }

      if (!sets.length) return badRequest("Nothing to update")

      sets.push("updated_at = datetime('now')")
      await env.DB.prepare(
        `UPDATE users SET ${sets.join(", ")} WHERE id = ?`
      )
        .bind(...values, user.id)
        .run()

      if (
        user.avatar_kind === "image" &&
        user.avatar_value &&
        (nextAvatarKind !== "image" || nextAvatarValue !== user.avatar_value)
      ) {
        await env.CACHE.delete(`avatars/${user.avatar_value}`)
      }

      await purgeProfile(env, user.handle)
      if (nextHandle !== user.handle) await purgeProfile(env, nextHandle)

      const detail = await userDetail(env, user.id)
      return json(detail)
    }

    return json({ error: "Method not allowed" }, 405)
  }

  if (path === "/api/portal/links" && method === "POST") {
    const user = await currentUser(request, env)
    if (!user) return unauthorized()

    const body = await readBody<{ label?: string; url?: string; icon?: string }>(request)
    const label = normalizeText(body?.label, 60)
    const linkUrl = normalizeUrl(body?.url)
    const icon = normalizeText(body?.icon, 16) || null
    if (!label || !linkUrl) {
      return badRequest("A label and a valid URL are required")
    }

    const max = await env.DB.prepare(
      "SELECT COALESCE(MAX(sort_order), -1) AS max FROM links WHERE user_id = ?"
    )
      .bind(user.id)
      .first<{ max: number }>()

    await env.DB.prepare(
      "INSERT INTO links (user_id, label, url, sort_order, icon) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(user.id, label, linkUrl, (max?.max ?? -1) + 1, icon)
      .run()

    await purgeProfile(env, user.handle)
    const detail = await userDetail(env, user.id)
    return json(detail, 201)
  }

  if (path.startsWith("/api/portal/links/")) {
    const user = await currentUser(request, env)
    if (!user) return unauthorized()

    const linkId = Number(path.split("/").pop())
    if (!Number.isFinite(linkId)) return badRequest("Invalid link")

    const link = await env.DB.prepare(
      "SELECT id, label, url FROM links WHERE id = ? AND user_id = ?"
    )
      .bind(linkId, user.id)
      .first<{ id: number; label: string; url: string }>()
    if (!link) return notFound("Link not found")

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
      if (typeof body.icon === "string" || body.icon === null) {
        sets.push("icon = ?")
        values.push(normalizeText(body.icon, 16) || null)
      }
      if (!sets.length) return badRequest("Nothing to update")

      await env.DB.prepare(
        `UPDATE links SET ${sets.join(", ")} WHERE id = ? AND user_id = ?`
      )
        .bind(...values, linkId, user.id)
        .run()

      await purgeProfile(env, user.handle)
      const detail = await userDetail(env, user.id)
      return json(detail)
    }

    if (method === "DELETE") {
      await env.DB.prepare("DELETE FROM links WHERE id = ? AND user_id = ?")
        .bind(linkId, user.id)
        .run()

      await purgeProfile(env, user.handle)
      const detail = await userDetail(env, user.id)
      return json(detail)
    }

    return json({ error: "Method not allowed" }, 405)
  }

  if (path.startsWith("/api/avatars/") && method === "GET") {
    const file = decodeURIComponent(path.slice("/api/avatars/".length))
    if (!/^[a-z0-9-]+\.(png|jpe?g|webp)$/i.test(file)) {
      return notFound("Image not found")
    }

    const object = await env.CACHE.get(`avatars/${file}`)
    if (!object) return notFound("Image not found")

    return new Response(object.body, {
      headers: {
        "content-type": object.httpMetadata?.contentType ?? "image/png",
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff",
      },
    })
  }

  if (path === "/api/portal/avatar" && method === "POST") {
    const user = await currentUser(request, env)
    if (!user) return unauthorized()

    let form: FormData
    try {
      form = await request.formData()
    } catch {
      return badRequest("Could not read the image")
    }

    const file = form.get("file")
    if (!file || typeof file === "string") {
      return badRequest("Choose an image to upload")
    }
    if (file.size > 2 * 1024 * 1024) {
      return badRequest("Profile pictures must be under 2 MB")
    }

    const extensions: Record<string, string> = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/webp": "webp",
    }
    const extension = extensions[file.type]
    if (!extension) {
      return badRequest("Use a PNG, JPG or WebP image")
    }

    const key = `${user.id}-${crypto.randomUUID()}.${extension}`
    await env.CACHE.put(`avatars/${key}`, file.stream(), {
      httpMetadata: { contentType: file.type },
    })

    if (user.avatar_kind === "image" && user.avatar_value) {
      await env.CACHE.delete(`avatars/${user.avatar_value}`)
    }

    await env.DB.prepare(
      "UPDATE users SET avatar_kind = 'image', avatar_value = ?, updated_at = datetime('now') WHERE id = ?"
    )
      .bind(key, user.id)
      .run()

    await purgeProfile(env, user.handle)
    const detail = await userDetail(env, user.id)
    return json(detail)
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
      email?: string
      password?: string
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
    const email = normalizeEmail(body?.email)
    const password = String(body?.password ?? "")
    const phone = normalizeText(body?.phone, 40)
    const address = normalizeText(body?.address, 300)

    if (name.length < 2) return badRequest("Name is required")
    if (handle.length < 2) return badRequest("Username is required")
    if (!email) return badRequest("A valid email is required")
    if (password.length < 8) {
      return badRequest("Password must be at least 8 characters")
    }
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

    const existingHandle = await env.DB.prepare(
      "SELECT id FROM users WHERE handle = ?"
    )
      .bind(handle)
      .first<{ id: number }>()
    if (existingHandle) {
      return json(
        { error: "That username is already taken. Try another." },
        409
      )
    }

    const existingEmail = await env.DB.prepare(
      "SELECT id FROM users WHERE email = ?"
    )
      .bind(email)
      .first<{ id: number }>()
    if (existingEmail) {
      return json(
        { error: "That email already has an account. Sign in instead." },
        409
      )
    }

    const passwordHash = await hashPassword(password)
    const inserted = await env.DB.prepare(
      `INSERT INTO users (name, handle, role, email, phone, address, plan, password_hash)
       VALUES (?, ?, 'CoTap member', ?, ?, ?, ?, ?) RETURNING id`
    )
      .bind(name, handle, email, phone, address, orderedPlan, passwordHash)
      .first<{ id: number }>()

    const userId = inserted?.id
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

    const token = await createSession(
      env,
      { sub: "user", uid: userId },
      CLIENT_TTL
    )

    return json(
      {
        orderId,
        handle,
        plan: orderedPlan,
        profileUrl: `/u/${handle}`,
      },
      201,
      {
        "set-cookie": sessionCookie(
          request,
          CLIENT_COOKIE,
          token,
          CLIENT_TTL
        ),
      }
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

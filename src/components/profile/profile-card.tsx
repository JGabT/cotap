import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowUpRight,
  Check,
  Mail,
  Phone,
  Share2,
  UserPlus,
} from "lucide-react"

import { TapMark } from "@/components/site/logo"
import {
  DEFAULT_THEME,
  defaultLinkIcon,
  initials,
  isLightColor,
  themeFaint,
  themeFontFamily,
  themeInk,
  themeLine,
  themeMuted,
  themeSurface,
  type ProfileTheme,
  type PublicProfile,
} from "@/lib/api"

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
  lines.push(`URL:${window.location.origin}/u/${profile.handle}`)
  lines.push("END:VCARD")
  return lines.join("\r\n")
}

export function ProfileAvatar({
  profile,
  theme,
}: {
  profile: PublicProfile
  theme: ProfileTheme
}) {
  const accentInk = isLightColor(theme.accent) ? "#15161a" : "#f7f5ef"
  const avatar = profile.avatar ?? {
    kind: "initials" as const,
    value: null,
    url: null,
  }

  if (avatar.kind === "image" && avatar.url) {
    return (
      <div className="relative">
        <img
          src={avatar.url}
          alt={profile.name}
          className="size-[78px] rounded-full object-cover"
          style={{ boxShadow: `0 0 0 4px ${themeSurface(theme)}` }}
        />
        <span
          className="absolute right-0.5 bottom-0.5 size-4 rounded-full border-2 bg-[#5c8a2a]"
          style={{ borderColor: theme.card }}
        />
      </div>
    )
  }

  if (avatar.kind === "icon" && avatar.value) {
    return (
      <div className="relative">
        <div
          className="grid size-[78px] place-items-center rounded-full text-[32px]"
          style={{
            backgroundColor: theme.accent,
            color: accentInk,
            boxShadow: `0 0 0 4px ${themeSurface(theme)}`,
          }}
        >
          {avatar.value}
        </div>
        <span
          className="absolute right-0.5 bottom-0.5 size-4 rounded-full border-2 bg-[#5c8a2a]"
          style={{ borderColor: theme.card }}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className="grid size-[78px] place-items-center rounded-full text-[24px] font-semibold"
        style={{
          backgroundImage: `linear-gradient(140deg, ${theme.accent}, color-mix(in srgb, ${theme.accent} 55%, #000))`,
          color: accentInk,
          boxShadow: `0 0 0 4px ${themeSurface(theme)}`,
        }}
      >
        {initials(profile.name)}
      </div>
      <span
        className="absolute right-0.5 bottom-0.5 size-4 rounded-full border-2 bg-[#5c8a2a]"
        style={{ borderColor: theme.card }}
      />
    </div>
  )
}

export function ProfileCard({
  profile,
  interactive = true,
}: {
  profile: PublicProfile
  interactive?: boolean
}) {
  const theme = profile.theme ?? DEFAULT_THEME
  const ink = themeInk(theme)
  const muted = themeMuted(theme)
  const faint = themeFaint(theme)
  const line = themeLine(theme)
  const surface = themeSurface(theme)
  const accentInk = isLightColor(theme.accent) ? "#15161a" : "#f7f5ef"

  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  function saveContact() {
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
      await navigator.clipboard.writeText(
        `${window.location.origin}/u/${profile.handle}`
      )
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const saveButton = (
    <>
      {saved ? <Check className="size-3.5" /> : <UserPlus className="size-3.5" />}
      {saved ? "Contact saved" : "Save to contacts"}
    </>
  )

  return (
    <div
      className="overflow-hidden rounded-[2rem] border shadow-[0_50px_100px_-40px_rgba(0,0,0,0.65)]"
      style={{
        backgroundColor: theme.card,
        borderColor: line,
        color: ink,
        fontFamily: themeFontFamily(theme),
      }}
    >
      <div className="relative px-6 pt-7 pb-6 sm:px-7">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, color-mix(in srgb, ${theme.accent} 28%, transparent) 0%, transparent 72%)`,
          }}
        />

        <div className="relative flex items-center justify-between">
          {interactive ? (
            <Link
              to="/"
              aria-label="Go to CoTap"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[-0.03em] no-underline transition-opacity hover:opacity-70"
            >
              <TapMark className="size-4 opacity-80" />
              <span>
                cotap<span className="font-normal opacity-40">.id</span>
              </span>
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[-0.03em]">
              <TapMark className="size-4 opacity-80" />
              <span>
                cotap<span className="font-normal opacity-40">.id</span>
              </span>
            </span>
          )}
          {profile.plan !== "basic" && (
            <span
              className="rounded-full px-2.5 py-0.5 text-[8.5px] font-semibold tracking-[0.12em] uppercase"
              style={{ backgroundColor: theme.accent, color: accentInk }}
            >
              {profile.plan === "pro" ? "Pro" : "Teams"}
            </span>
          )}
        </div>

        <div className="relative mt-6 flex flex-col items-center text-center">
          <ProfileAvatar profile={profile} theme={theme} />

          <h1 className="mt-3.5 max-w-full text-balance break-words text-[clamp(1.3rem,5.5vw,1.56rem)] leading-[1.12] font-semibold tracking-[-0.035em]">
            {profile.name}
          </h1>
          {profile.role && (
            <p
              className="mt-1 max-w-full break-words text-[11.5px] leading-relaxed"
              style={{ color: muted }}
            >
              {profile.role}
            </p>
          )}
          {profile.bio && (
            <p
              className="mt-2.5 max-w-[290px] text-center text-[10.5px] leading-relaxed whitespace-pre-line"
              style={{ color: muted }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        <div className="relative mt-5">
          {interactive ? (
            <button
              type="button"
              onClick={saveContact}
              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl text-[12px] font-medium shadow-sm transition-transform active:scale-[0.99]"
              style={{ backgroundColor: ink, color: theme.card }}
            >
              {saveButton}
            </button>
          ) : (
            <div
              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl text-[12px] font-medium"
              style={{ backgroundColor: ink, color: theme.card }}
            >
              {saveButton}
            </div>
          )}

          <div
            className="mt-1.5 grid gap-1.5"
            style={{
              gridTemplateColumns: `repeat(${
                1 + (profile.phone ? 1 : 0) + (profile.email ? 1 : 0)
              }, minmax(0, 1fr))`,
            }}
          >
            {profile.phone &&
              (interactive ? (
                <a
                  href={`tel:${profile.phone}`}
                  aria-label="Call"
                  className="flex h-10 w-full items-center justify-center rounded-xl border transition-opacity hover:opacity-75"
                  style={{ borderColor: line, backgroundColor: surface, color: ink }}
                >
                  <Phone className="size-3.5" />
                </a>
              ) : (
                <span
                  className="flex h-10 w-full items-center justify-center rounded-xl border"
                  style={{ borderColor: line, backgroundColor: surface, color: ink }}
                >
                  <Phone className="size-3.5" />
                </span>
              ))}
            {profile.email &&
              (interactive ? (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  className="flex h-10 w-full items-center justify-center rounded-xl border transition-opacity hover:opacity-75"
                  style={{ borderColor: line, backgroundColor: surface, color: ink }}
                >
                  <Mail className="size-3.5" />
                </a>
              ) : (
                <span
                  className="flex h-10 w-full items-center justify-center rounded-xl border"
                  style={{ borderColor: line, backgroundColor: surface, color: ink }}
                >
                  <Mail className="size-3.5" />
                </span>
              ))}
            {interactive ? (
              <button
                type="button"
                onClick={share}
                aria-label="Copy profile link"
                className="flex h-10 w-full items-center justify-center gap-1 rounded-xl border text-[9px] font-medium transition-opacity hover:opacity-75"
                style={{ borderColor: line, backgroundColor: surface, color: muted }}
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
            ) : (
              <span
                className="flex h-10 w-full items-center justify-center gap-1 rounded-xl border text-[9px] font-medium"
                style={{ borderColor: line, backgroundColor: surface, color: muted }}
              >
                <Share2 className="size-3" />
                Share
              </span>
            )}
          </div>
        </div>

        <div className="relative mt-5">
          {profile.links.length ? (
            <div
              className="divide-y overflow-hidden rounded-xl border"
              style={{ borderColor: line, backgroundColor: surface }}
            >
              {profile.links.map((link) => {
                const external = /^https?:/i.test(link.url)
                const icon = link.icon || defaultLinkIcon(link.url)
                const content = (
                  <>
                    <span
                      className="grid size-7 place-items-center rounded-lg text-[14px]"
                      style={{ backgroundColor: surface }}
                    >
                      {icon}
                    </span>
                    <span className="flex-1 truncate text-[11px] font-medium">
                      {link.label}
                    </span>
                    <ArrowUpRight className="size-3.5" style={{ color: faint }} />
                  </>
                )

                return interactive ? (
                  <a
                    key={`${link.label}-${link.url}`}
                    href={link.url}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer" : undefined}
                    className="flex items-center gap-2.5 px-3 py-3 transition-opacity hover:opacity-75"
                    style={{ borderColor: line }}
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={`${link.label}-${link.url}`}
                    className="flex items-center gap-2.5 px-3 py-3"
                    style={{ borderColor: line }}
                  >
                    {content}
                  </div>
                )
              })}
            </div>
          ) : (
            <div
              className="rounded-xl border border-dashed px-4 py-5 text-center"
              style={{ borderColor: line }}
            >
              <p className="text-[10.5px]" style={{ color: faint }}>
                No links yet.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

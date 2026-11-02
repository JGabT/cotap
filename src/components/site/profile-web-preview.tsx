import {
  ArrowUpRight,
  Globe,
  Lock,
  Mail,
  Phone,
  UserPlus,
} from "lucide-react"

import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons"
import { TapMark } from "@/components/site/logo"
import { cn } from "@/lib/utils"

export function initialsFromName(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")

  return initials || "YN"
}

export function ProfileWebPreview({
  name,
  role,
  handle,
  className,
}: {
  name: string
  role: string
  handle: string
  className?: string
}) {
  const displayName = name.trim() || "Your Name"
  const displayHandle = handle.trim() || "yourname"
  const initials = initialsFromName(displayName)

  const links = [
    { icon: Globe, label: `${displayHandle}.com`, meta: "Portfolio" },
    { icon: LinkedinIcon, label: `in/${displayHandle}`, meta: "LinkedIn" },
    { icon: GithubIcon, label: displayHandle, meta: "GitHub" },
  ]

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-[#0d0e10] shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)]",
        className
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/6 px-4 py-3">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/10" />
        <span className="size-2 rounded-full bg-white/[0.07]" />
        <div className="mx-auto flex min-w-0 items-center gap-1.5 rounded-md border border-white/6 bg-white/[0.03] px-3 py-1 text-[10px] text-muted-foreground">
          <Lock className="size-2.5 shrink-0" />
          <span className="truncate">
            cotap.id/<span className="text-foreground/85">{displayHandle}</span>
          </span>
        </div>
        <span className="flex w-8 items-center justify-end gap-1 text-[8.5px] tracking-[0.12em] text-primary uppercase">
          <span className="size-1 rounded-full bg-primary" />
          Live
        </span>
      </div>

      <div className="relative bg-[#f7f5ef] px-5 py-7 text-[#15161a] sm:px-8 sm:py-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-44"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, #ecf8d3 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-[360px]">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold tracking-[-0.03em]">
              <TapMark className="size-4 opacity-80" />
              <span>cotap<span className="font-normal text-black/40">.id</span></span>
            </span>
            <span className="rounded-full border border-black/10 px-2 py-0.5 text-[8px] font-medium tracking-[0.14em] text-black/45 uppercase">
              Digital ID
            </span>
          </div>

          <div className="mt-6 flex flex-col items-center text-center">
            <div className="relative">
              <div className="grid size-[74px] place-items-center rounded-full bg-[linear-gradient(140deg,#d8f28c,#8fb84a_58%,#42551f)] text-[23px] font-semibold text-[#1a200c] ring-4 ring-black/5">
                {initials}
              </div>
              <span className="absolute right-0.5 bottom-0.5 size-4 rounded-full border-2 border-[#f7f5ef] bg-[#5c8a2a]" />
            </div>

            <h3 className="mt-3.5 max-w-full truncate text-[25px] leading-tight font-semibold tracking-[-0.035em]">
              {displayName}
            </h3>
            <p className="mt-1 max-w-full truncate text-[11.5px] text-black/55">{role}</p>
            <span className="mt-2.5 rounded-full bg-black/[0.055] px-3 py-1 text-[9px] font-medium tracking-wide text-black/60">
              Open to collaborate
            </span>
          </div>

          <div className="mt-5 space-y-1.5">
            <div className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-[#15161a] text-[12px] font-medium text-[#f7f5ef] shadow-sm">
              <UserPlus className="size-3.5" />
              Save to contacts
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[Phone, Mail, Globe].map((Icon, index) => (
                <div
                  key={index}
                  className="flex h-9 items-center justify-center rounded-lg border border-black/10 bg-white text-black/65"
                >
                  <Icon className="size-3.5" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[9px] text-black/40">
            <span>1,248 profile views</span>
            <span>34 saves</span>
          </div>

          <div className="mt-2.5 divide-y divide-black/[0.07] overflow-hidden rounded-xl border border-black/[0.08] bg-white">
            {links.map(({ icon: Icon, label, meta }) => (
              <div key={meta} className="flex items-center gap-2.5 px-3 py-2.5">
                <span className="grid size-6 place-items-center rounded-md bg-black/[0.055]">
                  <Icon className="size-3 text-black/65" />
                </span>
                <span className="flex-1 truncate text-[10.5px] font-medium text-black/75">
                  {label}
                </span>
                <span className="text-[8.5px] text-black/35">{meta}</span>
                <ArrowUpRight className="size-3 text-black/25" />
              </div>
            ))}
          </div>

          <p className="mt-4 text-center text-[8px] tracking-[0.16em] text-black/30 uppercase">
            Powered by CoTap
          </p>
        </div>
      </div>
    </div>
  )
}

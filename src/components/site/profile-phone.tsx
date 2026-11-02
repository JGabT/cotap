import {
  ArrowUpRight,
  BatteryFull,
  Globe,
  Mail,
  Phone,
  UserPlus,
  Wifi,
} from "lucide-react"

import { GithubIcon, LinkedinIcon } from "@/components/site/brand-icons"
import { TapMark } from "@/components/site/logo"
import { cn } from "@/lib/utils"

const links = [
  { icon: Globe, label: "studio-nara.com", meta: "Portfolio" },
  { icon: LinkedinIcon, label: "in/alexandrap", meta: "LinkedIn" },
  { icon: GithubIcon, label: "alexbuilds", meta: "GitHub" },
]

export function ProfilePhone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-[236px] rounded-[2.7rem] border border-white/15 bg-[#0b0c0e] p-[7px] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)_inset] sm:w-[252px]",
        className
      )}
    >
      <div className="relative overflow-hidden rounded-[2.15rem] bg-[#f7f5ef] text-[#15161a]">
        <div className="absolute top-[7px] left-1/2 z-20 h-[18px] w-[74px] -translate-x-1/2 rounded-full bg-[#0b0c0e]" />

        <div className="flex items-center justify-between px-5 pt-[9px] pb-1 text-[9px] font-semibold tracking-tight text-[#15161a]">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <Wifi className="size-2.5" strokeWidth={2.5} />
            <BatteryFull className="size-3" strokeWidth={2.5} />
          </span>
        </div>

        <div className="px-4 pt-4 pb-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[9.5px] font-medium text-black/55">
              <span className="grid size-4 place-items-center rounded-[5px] bg-[#15161a] text-primary">
                <TapMark className="size-2.5" />
              </span>
              cotap.id/alex
            </span>
            <span className="grid size-6 place-items-center rounded-full border border-black/10 text-black/50">
              <ArrowUpRight className="size-3" />
            </span>
          </div>

          <div className="mt-5 flex flex-col items-center text-center">
            <div className="relative">
              <div className="grid size-[62px] place-items-center rounded-full bg-[linear-gradient(140deg,#d8f28c,#8fb84a_55%,#42551f)] text-[19px] font-semibold text-[#1a200c] ring-4 ring-black/5">
                AP
              </div>
              <span className="absolute right-0 bottom-0 size-3.5 rounded-full border-2 border-[#f7f5ef] bg-[#5c8a2a]" />
            </div>
            <h3 className="mt-3 text-[17px] leading-tight font-semibold tracking-[-0.03em]">
              Alexandra Putri
            </h3>
            <p className="mt-0.5 text-[10px] text-black/55">
              Product Designer · Studio Nara
            </p>
            <span className="mt-2 rounded-full bg-black/[0.055] px-2.5 py-1 text-[8.5px] font-medium tracking-wide text-black/60">
              Open to collaborate
            </span>
          </div>

          <div className="mt-4 space-y-1.5">
            <button className="flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-[#15161a] text-[11px] font-medium text-[#f7f5ef] shadow-sm">
              <UserPlus className="size-3.5" />
              Save to contacts
            </button>
            <div className="grid grid-cols-3 gap-1.5">
              {[Phone, Mail, Globe].map((Icon, index) => (
                <div
                  key={index}
                  className="flex h-8 items-center justify-center rounded-lg border border-black/10 bg-white text-black/65"
                >
                  <Icon className="size-3.5" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[8.5px] text-black/40">
            <span>1,248 profile views</span>
            <span>34 saves</span>
          </div>

          <div className="mt-2 divide-y divide-black/[0.07] overflow-hidden rounded-xl border border-black/[0.08] bg-white">
            {links.map(({ icon: Icon, label, meta }) => (
              <div key={label} className="flex items-center gap-2 px-2.5 py-2">
                <span className="grid size-5 place-items-center rounded-md bg-black/[0.055]">
                  <Icon className="size-3 text-black/65" />
                </span>
                <span className="flex-1 truncate text-[9.5px] font-medium text-black/75">
                  {label}
                </span>
                <span className="text-[8px] text-black/35">{meta}</span>
              </div>
            ))}
          </div>

          <p className="mt-3 text-center text-[7.5px] tracking-[0.14em] text-black/30 uppercase">
            Powered by CoTap
          </p>
        </div>
      </div>
    </div>
  )
}

import { ContactRound, Nfc, QrCode, RefreshCw, ShieldCheck, Zap } from "lucide-react"

const items = [
  { icon: Nfc, label: "Tap to share" },
  { icon: ContactRound, label: "Save to contacts" },
  { icon: QrCode, label: "QR fallback" },
  { icon: RefreshCw, label: "Update anytime" },
  { icon: Zap, label: "No app needed" },
  { icon: ShieldCheck, label: "Your data, yours" },
]

function Group() {
  return (
    <div className="flex shrink-0 items-center">
      {items.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="flex items-center gap-2.5 px-7 text-[10.5px] font-medium tracking-[0.2em] whitespace-nowrap text-muted-foreground uppercase"
        >
          <Icon className="size-3.5 text-primary/70" />
          {label}
          <span className="ml-5 size-1 rounded-full bg-white/15" />
        </span>
      ))}
    </div>
  )
}

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-white/[0.012] py-4">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent sm:w-40" />
      <div className="animate-marquee flex w-max">
        <Group />
        <Group />
      </div>
    </div>
  )
}

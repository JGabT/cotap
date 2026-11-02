import { CardWordmark } from "@/components/site/logo"
import { NfcGlyph, QrCode } from "@/components/site/qr-code"
import { cn } from "@/lib/utils"

export type CardVariant = "pvc" | "wood" | "metal"

const materialClass: Record<CardVariant, string> = {
  pvc: "material-pvc text-[oklch(0.97_0.005_90)]",
  wood: "material-wood",
  metal: "material-metal",
}

export function CardFace({
  name = "Alexandra Putri",
  role = "Product Designer · Studio Nara",
  handle = "alex",
  variant = "pvc",
  className,
}: {
  name?: string
  role?: string
  handle?: string
  variant?: CardVariant
  className?: string
}) {
  return (
    <div
      className={cn(
        "grain relative aspect-[1.586] w-full overflow-hidden rounded-[4.2cqw] @container",
        materialClass[variant],
        variant === "pvc" && "ring-1 ring-white/12",
        className
      )}
    >
      <div className="card-sheen pointer-events-none absolute inset-0" />
      <div
        className={cn(
          "pointer-events-none absolute -top-[30%] -right-[15%] size-[60%] rounded-full blur-2xl",
          variant === "metal" ? "bg-white/25" : "bg-primary/10"
        )}
      />

      <div className="relative flex h-full flex-col justify-between p-[5.6cqw]">
        <div className="flex items-start justify-between">
          <CardWordmark />
          <div className="flex flex-col items-end gap-[1.4cqw]">
            <span className="text-[2.3cqw] font-medium tracking-[0.24em] uppercase opacity-55">
              Digital ID
            </span>
            <NfcGlyph className="size-[4.6cqw] opacity-70" />
          </div>
        </div>

        <div className="flex items-end justify-between gap-[4cqw]">
          <div className="min-w-0">
            <div className="text-[2.4cqw] font-medium tracking-[0.22em] uppercase opacity-50">
              Tap to connect
            </div>
            <div className="mt-[2.2cqw] truncate text-[5.6cqw] leading-none font-medium tracking-[-0.035em]">
              {name}
            </div>
            {role && (
              <div className="mt-[1.6cqw] truncate text-[2.9cqw] opacity-60">{role}</div>
            )}
            <div className="mt-[4.4cqw] flex items-center gap-[1.6cqw] text-[3.1cqw] font-medium">
              <span className="size-[1.1cqw] rounded-full bg-current opacity-80" />
              <span className="truncate">cotap.id/{handle}</span>
            </div>
          </div>

          <div className="shrink-0">
            <div className="rounded-[1.6cqw] bg-white/95 p-[1.1cqw] shadow-lg shadow-black/20">
              <QrCode className="w-[14.5cqw] text-black" />
            </div>
            <div className="mt-[1.3cqw] text-center text-[1.9cqw] tracking-[0.18em] uppercase opacity-45">
              Scan
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

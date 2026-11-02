import { cn } from "@/lib/utils"

export function TapMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5", className)}
    >
      <circle cx="7.5" cy="12" r="2" fill="currentColor" />
      <path
        d="M11.4 8.6a5 5 0 0 1 0 6.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14.7 6a9 9 0 0 1 0 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function Logo({
  className,
  markClassName,
  wordmarkClassName,
}: {
  className?: string
  markClassName?: string
  wordmarkClassName?: string
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid size-8 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-[0_0_30px_-8px_var(--primary)]",
          markClassName
        )}
      >
        <TapMark className="size-[18px]" />
      </span>
      <span
        className={cn(
          "text-[19px] leading-none font-semibold tracking-[-0.045em]",
          wordmarkClassName
        )}
      >
        cotap<span className="font-normal text-muted-foreground">.id</span>
      </span>
    </span>
  )
}

/** Compact mark used inside the tiny card artwork. */
export function CardWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-[1.9cqw]", className)}>
      <TapMark className="size-[5cqw] opacity-85" />
      <span className="text-[4.1cqw] leading-none font-semibold tracking-[-0.04em]">
        cotap<span className="opacity-45">.id</span>
      </span>
    </span>
  )
}

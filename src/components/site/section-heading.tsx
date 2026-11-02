import type { ReactNode } from "react"

import { Reveal } from "@/components/site/reveal"
import { cn } from "@/lib/utils"

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow: string
  title: ReactNode
  description?: ReactNode
  align?: "left" | "center"
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <Reveal>
        <span className="eyebrow">
          <span className="h-px w-6 bg-primary/70" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="max-w-2xl text-[clamp(2rem,4vw,2.9rem)] leading-[1.04] font-medium">
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={150}>
          <p
            className={cn(
              "max-w-xl text-[15px] leading-relaxed text-muted-foreground",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}

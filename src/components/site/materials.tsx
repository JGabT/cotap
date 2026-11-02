import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"

import { CardFace, type CardVariant } from "@/components/site/card-face"
import { SectionHeading } from "@/components/site/section-heading"
import { Reveal } from "@/components/site/reveal"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const materials: Array<{
  value: CardVariant
  label: string
  title: string
  copy: string
  specs: Array<[string, string]>
}> = [
  {
    value: "pvc",
    label: "Matte PVC",
    title: "The everyday essential",
    copy: "Soft-touch matte PVC with a crisp, full-colour print. Light in the pocket, confident in the hand — the card you will carry every day.",
    specs: [
      ["Material", "Matte PVC"],
      ["Chip", "NTAG213"],
      ["Finish", "Soft-touch"],
      ["QR", "Laser-etched"],
    ],
  },
  {
    value: "wood",
    label: "Cherry wood",
    title: "Warm, unmistakable",
    copy: "Real cherry wood veneer, individually laser-engraved. No two grains are alike, so no two cards ever feel the same in hand.",
    specs: [
      ["Material", "Cherry veneer"],
      ["Chip", "NTAG215"],
      ["Finish", "Laser-engraved"],
      ["Grain", "One of a kind"],
    ],
  },
  {
    value: "metal",
    label: "Anodized metal",
    title: "Built for a decade",
    copy: "Aerospace-grade aluminium, anodized and laser-etched. Weighty, precise and quietly impressive — designed to outlast the job title on it.",
    specs: [
      ["Material", "Anodized aluminium"],
      ["Chip", "NTAG215"],
      ["Finish", "Laser-etched"],
      ["Weight", "22 g"],
    ],
  },
]

const highlights = ["Custom print or engraving", "NTAG213 / NTAG215", "Laser-etched QR"]

export function Materials() {
  const [active, setActive] = useState<CardVariant>("pvc")

  return (
    <section id="card" className="relative overflow-hidden py-24 sm:py-28">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="site-container">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="The hardware"
            title={
              <>
                A card worth{" "}
                <span className="serif-accent text-primary">keeping</span>.
              </>
            }
            description="Three finishes, one quiet idea: the object you hand over should feel as considered as the profile it opens."
          />
          <Reveal delay={200}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-muted-foreground">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Tabs
          value={active}
          onValueChange={(value) => setActive(value as CardVariant)}
          className="mt-14 gap-0"
        >
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.02] px-6 py-14 sm:px-10 sm:py-20">
                  <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 40%, oklch(0.66 0.17 255 / 8%), transparent 65%)",
                    }}
                  />
                  <div className="pointer-events-none absolute top-1/2 left-1/2 size-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
                  <div className="pointer-events-none absolute top-1/2 left-1/2 size-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />

                  <div className="relative mx-auto max-w-[480px] transition-transform duration-700 ease-out group-hover:-translate-y-1.5">
                    <div className="absolute -inset-8 -z-10 rounded-full bg-primary/10 opacity-60 blur-3xl" />
                    <div className="-rotate-[4deg] transition-transform duration-700 ease-out group-hover:rotate-0">
                      <CardFace key={active} variant={active} className="animate-in fade-in zoom-in-95 duration-500 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]" />
                    </div>
                  </div>

                  <div className="absolute top-5 left-5 flex items-center gap-1.5 rounded-full border border-white/10 bg-background/60 px-2.5 py-1 text-[9px] tracking-[0.14em] text-muted-foreground uppercase backdrop-blur">
                    <span className="size-1 rounded-full bg-primary" />
                    {active === "pvc" ? "NTAG213" : "NTAG215"} · NFC
                  </div>
                  <div className="absolute right-5 bottom-5 rounded-full border border-white/10 bg-background/60 px-2.5 py-1 text-[9px] tracking-[0.14em] text-muted-foreground uppercase backdrop-blur">
                    85.6 × 54 mm
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  {materials.map((material) => (
                    <button
                      key={material.value}
                      onClick={() => setActive(material.value)}
                      className="group/thumb overflow-hidden rounded-xl border border-white/8 bg-white/[0.02] p-2 text-left transition-all hover:border-white/15 hover:bg-white/[0.04] data-[active=true]:border-primary/40 data-[active=true]:bg-primary/[0.05]"
                      data-active={active === material.value}
                    >
                      <CardFace
                        variant={material.value}
                        name="Alexandra"
                        role=""
                        handle="alex"
                        className="rounded-md"
                      />
                      <span className="mt-2 flex items-center gap-1.5 px-1 pb-0.5 text-[10.5px] font-medium text-muted-foreground group-hover/thumb:text-foreground">
                        <span
                          className="size-1 rounded-full bg-white/20 data-[active=true]:bg-primary"
                          data-active={active === material.value}
                        />
                        {material.label}
                      </span>
                    </button>
                  ))}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <TabsList className="h-9 w-full gap-1 rounded-full border border-white/8 bg-white/[0.025] p-1">
                {materials.map((material) => (
                  <TabsTrigger
                    key={material.value}
                    value={material.value}
                    className="h-full rounded-full text-[11.5px] data-active:bg-white/10 data-active:text-foreground"
                  >
                    {material.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {materials.map((material) => (
                <TabsContent key={material.value} value={material.value} className="pt-7">
                  <h3 className="text-2xl font-medium tracking-tight">{material.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
                    {material.copy}
                  </p>

                  <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-white/8 bg-white/8">
                    {material.specs.map(([label, value]) => (
                      <div key={label} className="bg-[#101113] px-4 py-3.5">
                        <dt className="text-[9px] tracking-[0.16em] text-muted-foreground uppercase">
                          {label}
                        </dt>
                        <dd className="mt-1 text-[12.5px] font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>

                  <Button
                    render={<a href="#claim" />}
                    nativeButton={false}
                    className="mt-7 h-11 w-full rounded-full text-[13.5px]"
                  >
                    Choose {material.label}
                    <ArrowRight data-icon="inline-end" />
                  </Button>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    Free digital profile included · Ships in 3–5 days
                  </p>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </div>
    </section>
  )
}

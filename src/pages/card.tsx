import { useNavigate } from "react-router-dom"

import { CtaBanner } from "@/components/site/cta-banner"
import { Materials } from "@/components/site/materials"
import { usePageMeta } from "@/components/site/use-page-meta"

export function CardPage() {
  const navigate = useNavigate()

  usePageMeta(
    "The CoTap card — Matte PVC, cherry wood, anodized metal.",
    "Three premium finishes with an NFC chip and laser-etched QR. Choose matte PVC, real cherry wood or anodized aluminium with your live profile included."
  )

  return (
    <>
      <h1 className="sr-only">The CoTap card</h1>
      <div className="pt-10 sm:pt-14">
        <Materials
          onOrder={(plan) => navigate("/order", { state: { seed: { plan } } })}
        />
      </div>
      <CtaBanner
        title={
          <>
            Pick the finish. Keep the{" "}
            <span className="serif-accent text-primary">identity.</span>
          </>
        }
        description="Every card carries the same live profile. The only decision is how you want it to feel in their hand."
        primary={{ label: "Compare cards", to: "/pricing" }}
        secondary={{ label: "Order your card", to: "/order" }}
      />
    </>
  )
}

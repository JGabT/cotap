import { useNavigate } from "react-router-dom"

import { CtaBanner } from "@/components/site/cta-banner"
import { Pricing } from "@/components/site/pricing"
import { usePageMeta } from "@/components/site/use-page-meta"

export function PricingPage() {
  const navigate = useNavigate()

  usePageMeta(
    "Pricing — Basic ₱300, Premium ₱800.",
    "One-time pricing in Philippine pesos. Basic ₱300, Premium ₱800, with a free cotap.id profile forever. CoTap for Teams is custom."
  )

  return (
    <>
      <h1 className="sr-only">CoTap pricing</h1>
      <div className="pt-10 sm:pt-14">
        <Pricing
          onOrder={(plan) => navigate("/order", { state: { seed: { plan } } })}
        />
      </div>
      <CtaBanner
        title={
          <>
            No subscription. No{" "}
            <span className="serif-accent text-primary">reprints.</span>
          </>
        }
        description="Pay once for the card. Keep the profile free forever. Upgrade the finish whenever you are ready."
        primary={{ label: "Order your card", to: "/order" }}
        secondary={{ label: "Read the FAQ", to: "/faq" }}
      />
    </>
  )
}

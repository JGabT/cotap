import { CtaBanner } from "@/components/site/cta-banner"
import { Features } from "@/components/site/features"
import { HowItWorks } from "@/components/site/how-it-works"
import { usePageMeta } from "@/components/site/use-page-meta"

export function HowItWorksPage() {
  usePageMeta(
    "How CoTap works — Tap, open, connect.",
    "See how a CoTap card works: tap the NFC card, your live profile opens instantly, and the other person saves your contact. No app required."
  )

  return (
    <>
      <h1 className="sr-only">How CoTap works</h1>
      <div className="pt-10 sm:pt-14">
        <HowItWorks />
        <Features />
      </div>
      <CtaBanner
        title={
          <>
            Three seconds. Then a{" "}
            <span className="serif-accent text-primary">relationship.</span>
          </>
        }
        description="The intro is the easy part. CoTap makes sure everything after it — your details, links and follow-up — stays in reach."
        primary={{ label: "Order your card", to: "/order" }}
        secondary={{ label: "Try it with your name", to: "/preview" }}
      />
    </>
  )
}

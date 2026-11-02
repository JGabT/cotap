import { useNavigate } from "react-router-dom"

import { CtaBanner } from "@/components/site/cta-banner"
import { Preview } from "@/components/site/preview"
import { usePageMeta } from "@/components/site/use-page-meta"

export function PreviewPage() {
  const navigate = useNavigate()

  usePageMeta(
    "Live preview — See your cotap.id profile.",
    "Type your name, pick a role and see your NFC card and cotap.id profile update live. Claim your link and order your card in minutes."
  )

  return (
    <>
      <h1 className="sr-only">Live preview</h1>
      <div className="pt-10 sm:pt-14">
        <Preview
          onOrder={(seed) => navigate("/order", { state: { seed } })}
        />
      </div>
      <CtaBanner
        title={
          <>
            Like what you see?{" "}
            <span className="serif-accent text-primary">Make it real.</span>
          </>
        }
        description="Your profile is free forever. The card is a one-time order — and it is ready when you are."
        primary={{ label: "Order your card", to: "/order" }}
        secondary={{ label: "See pricing", to: "/pricing" }}
      />
    </>
  )
}

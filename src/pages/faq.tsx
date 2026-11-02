import { CtaBanner } from "@/components/site/cta-banner"
import { Faq } from "@/components/site/faq"
import { usePageMeta } from "@/components/site/use-page-meta"

export function FaqPage() {
  usePageMeta(
    "FAQ — CoTap.",
    "Answers about NFC support, updating your profile, contact cards, durability, team orders and shipping for CoTap."
  )

  return (
    <>
      <h1 className="sr-only">Frequently asked questions</h1>
      <div className="pt-10 sm:pt-14">
        <Faq />
      </div>
      <CtaBanner
        eyebrow="Ready when you are"
        title={
          <>
            The best answer is a{" "}
            <span className="serif-accent text-primary">tap.</span>
          </>
        }
        description="Try your name on a card, or order one and see how it feels to never hand out a paper card again."
        primary={{ label: "Order your card", to: "/order" }}
        secondary={{ label: "Try the live preview", to: "/preview" }}
      />
    </>
  )
}

import { CtaBanner } from "@/components/site/cta-banner"
import { Teams } from "@/components/site/teams"
import { usePageMeta } from "@/components/site/use-page-meta"

export function TeamsPage() {
  usePageMeta(
    "CoTap for Teams — One identity for your company.",
    "Give every employee a tap-to-connect card with unified branding, central admin controls and instant provisioning or revocation."
  )

  return (
    <>
      <h1 className="sr-only">CoTap for Teams</h1>
      <div className="pt-10 sm:pt-14">
        <Teams />
      </div>
      <CtaBanner
        eyebrow="For teams"
        title={
          <>
            One tap for every{" "}
            <span className="serif-accent text-primary">teammate.</span>
          </>
        }
        description="Tell us how your team works and we will put together a plan for cards, profiles and admin access."
        primary={{
          label: "Talk to our team",
          to: "mailto:hello@cotap.id?subject=CoTap%20for%20Teams",
        }}
        secondary={{ label: "See card pricing", to: "/pricing" }}
      />
    </>
  )
}

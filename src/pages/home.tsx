import { Hero } from "@/components/site/hero"
import { HomeHighlights } from "@/components/site/home-highlights"
import { Marquee } from "@/components/site/marquee"
import { usePageMeta } from "@/components/site/use-page-meta"

export function HomePage() {
  usePageMeta(
    "CoTap — Your identity, one tap away.",
    "CoTap is a premium NFC business card that opens your live digital profile in one tap. Basic ₱300, Premium ₱800 — no app, no paper, no reprints."
  )

  return (
    <>
      <Hero />
      <Marquee />
      <HomeHighlights />
    </>
  )
}

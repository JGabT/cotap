import { ArrowUpRight } from "lucide-react"

import { Reveal } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    q: "Do I need an app to use CoTap?",
    a: "No. The NFC chip in your card is read natively by iPhones and Android phones. Tapping opens your profile in the browser — no download, no sign-up, no pairing for the person receiving it.",
  },
  {
    q: "Which phones support NFC?",
    a: "Every iPhone from the 7 onwards and most Android phones released in the last seven years. For older devices, the laser-etched QR code on the back of the card opens the exact same profile.",
  },
  {
    q: "Can I change my details after the card is printed?",
    a: "Yes — that is the point. Your card only holds the link to your profile. Update your role, number, links or photo from your CoTap dashboard and every card you have ever shared shows the new details instantly.",
  },
  {
    q: "What exactly gets saved to someone's contacts?",
    a: "A standard .vcf contact card with your name, role, company, phone, email and profile photo. It works with the native address book on iOS and Android, so nothing extra is needed on their side.",
  },
  {
    q: "How durable are the cards?",
    a: "Each card is built around a sealed NTAG chip, so there is no battery and nothing to charge. The matte PVC is everyday-proof, the cherry wood is sealed against moisture, and the anodized metal is made to outlast the job title printed on it.",
  },
  {
    q: "Can I order CoTap for my whole team?",
    a: "Absolutely. Teams get a central admin dashboard, unified branding, bulk pricing and the ability to provision or revoke employee profiles in seconds — useful for onboarding, rebranding and offboarding alike.",
  },
  {
    q: "How long does shipping take?",
    a: "Orders ship within 3–5 working days across the Philippines. Team orders are scheduled with your account manager, and international shipping is available on request.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="relative py-24 sm:py-28">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="site-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="FAQ"
            title={
              <>
                Worth a{" "}
                <span className="serif-accent text-primary">second</span> tap.
              </>
            }
            description="Everything you might want to know before your first CoTap."
          />

          <Reveal delay={220}>
            <div className="mt-8 rounded-2xl border border-white/8 bg-white/[0.025] p-5">
              <p className="text-[12px] font-medium">Still curious?</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-muted-foreground">
                Ask us anything — a real human replies within one working day.
              </p>
              <a
                href="mailto:hello@cotap.id"
                className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-primary transition-opacity hover:opacity-80"
              >
                hello@cotap.id
                <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <Accordion className="border-t border-white/8">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q} className="border-b border-white/8">
                <AccordionTrigger className="py-5 text-[14px] leading-snug font-normal hover:no-underline hover:text-primary data-open:text-primary **:data-[slot=accordion-trigger-icon]:text-muted-foreground">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-[13px] leading-relaxed text-muted-foreground">
                  <p className="max-w-xl pr-6">{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}

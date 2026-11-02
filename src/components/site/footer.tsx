import { ArrowUpRight, Mail } from "lucide-react"

import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/site/brand-icons"

import { Logo } from "@/components/site/logo"
import { Separator } from "@/components/ui/separator"

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how" },
      { label: "The card", href: "#card" },
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "For teams", href: "#teams" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "mailto:hello@cotap.id" },
      { label: "Reserve a card", href: "#claim" },
    ],
  },
]

const currentYear = new Date().getFullYear()

const socials = [
  { label: "Instagram", icon: InstagramIcon, href: "https://instagram.com/cotap.id" },
  { label: "LinkedIn", icon: LinkedinIcon, href: "https://linkedin.com/company/cotap" },
  { label: "GitHub", icon: GithubIcon, href: "https://github.com/cotap" },
  { label: "Email", icon: Mail, href: "mailto:hello@cotap.id" },
]

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/8 pt-14 pb-8">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[19rem] text-[12.5px] leading-relaxed text-muted-foreground">
              One card that carries your identity, your work and your next
              introduction. Tap, connect, collaborate.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="grid size-8 place-items-center rounded-full border border-white/8 bg-white/[0.02] text-muted-foreground transition-colors hover:border-white/15 hover:text-foreground"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground/70 uppercase">
                {column.title}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[12.5px] text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground/70 uppercase">
              Your link
            </p>
            <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.025] p-3">
              <p className="font-mono text-[11px] text-muted-foreground">
                cotap.id/<span className="text-foreground">yourname</span>
              </p>
              <a
                href="#claim"
                className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-medium text-primary hover:opacity-80"
              >
                Claim it now
                <ArrowUpRight className="size-3" />
              </a>
            </div>
            <p className="mt-4 text-[10.5px] leading-relaxed text-muted-foreground/70">
              Made in the Philippines.
              <br />
              Built for introductions everywhere.
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-white/8" />

        <div className="flex flex-col items-start justify-between gap-3 text-[10.5px] text-muted-foreground/70 sm:flex-row sm:items-center">
          <p>© {currentYear} CoTap. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#top" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#top" className="transition-colors hover:text-foreground">
              Terms
            </a>
            <a href="#top" className="transition-colors hover:text-foreground">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

import { Link } from "react-router-dom"
import { ArrowUpRight, Mail } from "lucide-react"

import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/site/brand-icons"
import { Logo } from "@/components/site/logo"
import { Separator } from "@/components/ui/separator"

const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", to: "/how-it-works" },
      { label: "Live preview", to: "/preview" },
      { label: "The card", to: "/card" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "For teams", to: "/teams" },
      { label: "FAQ", to: "/faq" },
      { label: "Contact", to: "mailto:hello@cotap.id" },
      { label: "Order a card", to: "/order" },
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

function isExternal(to: string) {
  return to.startsWith("mailto:") || to.startsWith("http")
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/8 pt-14 pb-8">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" aria-label="CoTap home">
              <Logo />
            </Link>
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
                    {isExternal(link.to) ? (
                      <a
                        href={link.to}
                        className="text-[12.5px] text-foreground/70 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-[12.5px] text-foreground/70 transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    )}
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
              <Link
                to="/preview"
                className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-medium text-primary hover:opacity-80"
              >
                Claim it now
                <ArrowUpRight className="size-3" />
              </Link>
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
            <Link to="/faq" className="transition-colors hover:text-foreground">
              FAQ
            </Link>
            <a
              href="mailto:hello@cotap.id"
              className="transition-colors hover:text-foreground"
            >
              Contact
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="transition-colors hover:text-foreground"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

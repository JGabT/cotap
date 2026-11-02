import { useEffect, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { ArrowRight, Menu } from "lucide-react"

import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navLinks = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/preview", label: "Live preview" },
  { to: "/card", label: "The card" },
  { to: "/teams", label: "For teams" },
  { to: "/pricing", label: "Pricing" },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-white/8 bg-background/75 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <div className="site-container flex h-16 items-center justify-between gap-6 sm:h-[72px]">
        <Link to="/" className="shrink-0" aria-label="CoTap home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "rounded-full px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                  isActive
                    ? "bg-white/[0.06] text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            render={<Link to="/order" />}
            nativeButton={false}
            className="hidden h-9 rounded-full px-4 sm:inline-flex"
          >
            Get your CoTap
            <ArrowRight data-icon="inline-end" />
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="rounded-full border-white/10 bg-white/[0.03] lg:hidden"
                  aria-label="Open menu"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent side="right" className="w-[86%] border-white/10 bg-[#111214] sm:max-w-sm">
              <SheetHeader className="px-5 pt-6">
                <SheetTitle>
                  <Link to="/" onClick={() => setOpen(false)}>
                    <Logo />
                  </Link>
                </SheetTitle>
                <SheetDescription className="sr-only">
                  CoTap site navigation
                </SheetDescription>
              </SheetHeader>

              <nav className="mt-2 flex flex-col px-3">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center justify-between rounded-xl px-3 py-3.5 text-[15px] font-medium transition-colors",
                        isActive
                          ? "bg-white/[0.06] text-foreground"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )
                    }
                  >
                    {link.label}
                    <ArrowRight className="size-4 opacity-40" />
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto p-5">
                <Button
                  render={<Link to="/order" onClick={() => setOpen(false)} />}
                  nativeButton={false}
                  className="h-11 w-full rounded-xl text-[15px]"
                >
                  Get your CoTap
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  No app. No subscription. Just tap.
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

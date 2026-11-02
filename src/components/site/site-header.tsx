import { useEffect, useState } from "react"
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
  { href: "#how", label: "How it works" },
  { href: "#preview", label: "Live preview" },
  { href: "#card", label: "The card" },
  { href: "#features", label: "Features" },
  { href: "#teams", label: "For teams" },
  { href: "#pricing", label: "Pricing" },
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
        <a href="#top" className="shrink-0" aria-label="CoTap home">
          <Logo />
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            render={<a href="#order" />}
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
                  <Logo />
                </SheetTitle>
                <SheetDescription className="sr-only">
                  CoTap site navigation
                </SheetDescription>
              </SheetHeader>

              <nav className="mt-2 flex flex-col px-3">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-3 py-3.5 text-[15px] font-medium text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {link.label}
                    <ArrowRight className="size-4 opacity-40" />
                  </a>
                ))}
              </nav>

              <div className="mt-auto p-5">
                <Button
                  render={<a href="#order" onClick={() => setOpen(false)} />}
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

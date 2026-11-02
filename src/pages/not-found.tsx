import { Link } from "react-router-dom"

import { usePageMeta } from "@/components/site/use-page-meta"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  usePageMeta(
    "Page not found — CoTap",
    "This page does not exist. Head back to CoTap or try the live preview."
  )

  return (
    <section className="site-container flex min-h-[76svh] flex-col items-center justify-center pt-28 pb-16 text-center">
      <span className="eyebrow">404</span>
      <h1 className="mt-5 max-w-xl text-[clamp(2.4rem,6vw,4rem)] leading-[1.02] font-medium">
        This link has no{" "}
        <span className="serif-accent text-primary">tap.</span>
      </h1>
      <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
        The page you were looking for does not exist — but your next introduction
        still does.
      </p>
      <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
        <Button
          render={<Link to="/" />}
          nativeButton={false}
          className="h-10 rounded-full px-5 text-[12.5px]"
        >
          Back home
        </Button>
        <Button
          render={<Link to="/preview" />}
          nativeButton={false}
          variant="outline"
          className="h-10 rounded-full border-white/12 bg-white/[0.02] px-5 text-[12.5px] hover:bg-white/[0.06]"
        >
          Try the live preview
        </Button>
      </div>
    </section>
  )
}

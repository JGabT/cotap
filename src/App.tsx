import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import { Loader2 } from "lucide-react"

import { ScrollToTop } from "@/components/site/scroll-to-top"
import { SiteLayout } from "@/components/site/site-layout"
import { CardPage } from "@/pages/card"
import { FaqPage } from "@/pages/faq"
import { HomePage } from "@/pages/home"
import { HowItWorksPage } from "@/pages/how-it-works"
import { NotFoundPage } from "@/pages/not-found"
import { OrderPage } from "@/pages/order"
import { PreviewPage } from "@/pages/preview"
import { PricingPage } from "@/pages/pricing"
import { TeamsPage } from "@/pages/teams"

const AdminPage = lazy(() =>
  import("@/pages/admin").then((module) => ({ default: module.AdminPage }))
)
const PublicProfilePage = lazy(() =>
  import("@/pages/public-profile").then((module) => ({
    default: module.PublicProfilePage,
  }))
)

function PageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <Loader2 className="size-5 animate-spin text-primary" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
        <Route path="admin" element={<AdminPage />} />
        <Route path="u/:handle" element={<PublicProfilePage />} />
        <Route element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="preview" element={<PreviewPage />} />
          <Route path="card" element={<CardPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="order" element={<OrderPage />} />
          <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  )
}

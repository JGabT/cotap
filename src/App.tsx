import { Route, Routes } from "react-router-dom"

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

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
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
    </>
  )
}

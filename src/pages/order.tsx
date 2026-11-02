import { useLocation } from "react-router-dom"

import { Order, type OrderSeed } from "@/components/site/order"
import { usePageMeta } from "@/components/site/use-page-meta"

export function OrderPage() {
  const location = useLocation()
  const seed = (location.state as { seed?: OrderSeed } | null)?.seed ?? null

  usePageMeta(
    "Order your CoTap — Basic ₱300, Premium ₱800.",
    "Order your CoTap card: enter your details, choose delivery or pickup, and complete the demo checkout. Basic ₱300, Premium ₱800."
  )

  return (
    <>
      <h1 className="sr-only">Order your CoTap</h1>
      <div className="pt-10 sm:pt-14">
        <Order seed={seed} />
      </div>
    </>
  )
}

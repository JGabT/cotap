import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
  Package,
  Sparkles,
  Store,
  Wallet,
} from "lucide-react"

import { CardFace } from "@/components/site/card-face"
import { QrCode } from "@/components/site/qr-code"
import { Reveal } from "@/components/site/reveal"
import { SectionHeading } from "@/components/site/section-heading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ApiError, api } from "@/lib/api"
import { cn } from "@/lib/utils"

export type OrderPlan = "basic" | "premium"
export type OrderSeed = {
  plan?: OrderPlan
  name?: string
  handle?: string
}

const PLANS = {
  basic: { name: "Basic", price: 300, material: "Matte PVC", variant: "pvc" as const },
  premium: { name: "Premium", price: 800, material: "Anodized metal", variant: "metal" as const },
}

const DELIVERY_FEE = 80
const STEPS = ["Details", "Delivery", "Payment"]

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24)
}

function cleanHandle(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "")
    .slice(0, 24)
}

function peso(value: number) {
  return `₱${value.toLocaleString("en-PH")}`
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim()
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function Order({ seed }: { seed?: OrderSeed | null }) {
  const [step, setStep] = useState(0)
  const [placed, setPlaced] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [profileUrl, setProfileUrl] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const [plan, setPlan] = useState<OrderPlan>("basic")
  const [name, setName] = useState("")
  const [customHandle, setCustomHandle] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [address, setAddress] = useState("")
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("delivery")

  const [payment, setPayment] = useState<"card" | "gcash">("card")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [cardName, setCardName] = useState("")

  useEffect(() => {
    if (!seed) return

    if (seed.plan) setPlan(seed.plan)
    if (seed.name !== undefined) setName(seed.name)
    if (seed.handle !== undefined) setCustomHandle(seed.handle)
    setStep(0)
    setPlaced(false)
  }, [seed])

  const autoHandle = slugify(name)
  const handle = customHandle || autoHandle
  const displayHandle = handle || "yourname"
  const planInfo = PLANS[plan]
  const shipping = delivery === "delivery" ? DELIVERY_FEE : 0
  const total = planInfo.price + shipping

  const detailsValid =
    name.trim().length >= 2 &&
    handle.length >= 2 &&
    phone.replace(/\D/g, "").length >= 7 &&
    address.trim().length >= 5 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) &&
    password.length >= 8

  const paymentValid =
    payment === "gcash" ||
    (cardNumber.replace(/\s/g, "").length >= 12 &&
      expiry.length === 5 &&
      cvc.length >= 3 &&
      cardName.trim().length >= 2)

  function next() {
    setStep((current) => Math.min(current + 1, 2))
  }

  function back() {
    setStep((current) => Math.max(current - 1, 0))
  }

  async function pay() {
    if (!paymentValid || submitting) return
    setSubmitting(true)
    setSubmitError("")
    try {
      const result = await api<{ orderId: string; profileUrl: string }>(
        "/api/orders",
        {
          method: "POST",
          body: JSON.stringify({
            name,
            handle: displayHandle,
            email,
            password,
            phone,
            address,
            plan,
            delivery,
            shipping,
            total,
            paymentMethod: payment,
          }),
        }
      )
      setOrderId(result.orderId)
      setProfileUrl(result.profileUrl)
      setPlaced(true)
    } catch (requestError) {
      setSubmitError(
        requestError instanceof ApiError
          ? requestError.message
          : "Could not place your order. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  function startOver() {
    setPlaced(false)
    setStep(0)
    setCardNumber("")
    setExpiry("")
    setCvc("")
    setCardName("")
    setOrderId("")
    setProfileUrl("")
    setSubmitError("")
  }

  return (
    <section id="order" className="relative overflow-hidden py-24 sm:py-28">
      <div className="hairline absolute inset-x-0 top-0" />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[30rem] w-[58rem] max-w-none -translate-x-1/2 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.885 0.176 124 / 8%), transparent 64%)",
        }}
      />

      <div className="site-container">
        <SectionHeading
          eyebrow="Checkout"
          title={
            <>
              From your name to{" "}
              <span className="serif-accent text-primary">their doorstep.</span>
            </>
          }
          description="Three quick steps. Tell us where it goes, choose delivery or pickup, and confirm. This is a demo checkout — nothing will be charged."
          align="center"
          className="mx-auto"
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <Reveal>
            <Card className="gap-0 rounded-3xl bg-white/[0.025] p-5 ring-1 ring-white/8 sm:p-7">
              {!placed && (
                <div className="flex items-center gap-2">
                  {STEPS.map((label, index) => {
                    const done = step > index
                    const active = step === index
                    return (
                      <div key={label} className="flex min-w-0 flex-1 items-center gap-2">
                        <span
                          className={cn(
                            "grid size-6 shrink-0 place-items-center rounded-full border text-[10px] font-semibold transition-colors",
                            done
                              ? "border-primary bg-primary text-primary-foreground"
                              : active
                                ? "border-primary/50 bg-primary/10 text-primary"
                                : "border-white/10 bg-white/[0.03] text-muted-foreground"
                          )}
                        >
                          {done ? <Check className="size-3" /> : index + 1}
                        </span>
                        <span
                          className={cn(
                            "hidden text-[10.5px] font-medium sm:block",
                            active || done ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {label}
                        </span>
                        {index < STEPS.length - 1 && (
                          <span
                            className={cn(
                              "h-px min-w-2 flex-1",
                              done ? "bg-primary/40" : "bg-white/10"
                            )}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {placed ? (
                <div className="pt-8 pb-2 text-center" aria-live="polite">
                  <span className="mx-auto grid size-14 place-items-center rounded-full bg-primary/12 text-primary">
                    <CheckCircle2 className="size-7" />
                  </span>
                  <h3 className="mt-4 text-2xl font-medium tracking-tight">Order confirmed</h3>
                  <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
                    Thanks{name ? `, ${name.trim().split(/\s+/)[0]}` : ""}. Your{" "}
                    {planInfo.name.toLowerCase()} card is being prepared and your profile at{" "}
                    <span className="text-foreground/85">cotap.id/{displayHandle}</span> is live.
                  </p>

                  <div className="mx-auto mt-6 max-w-sm rounded-xl border border-white/8 bg-background/40 p-4 text-left text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Order</span>
                      <span className="font-medium">{orderId}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-muted-foreground">Total paid</span>
                      <span className="font-medium">{peso(total)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">
                        {delivery === "delivery" ? "Delivery" : "Pickup"}
                      </span>
                      <span className="truncate text-right text-foreground/80">
                        {delivery === "delivery" ? address : "Details by SMS"}
                      </span>
                    </div>
                  </div>

                  <div className="mx-auto mt-6 flex max-w-sm flex-col gap-2 sm:flex-row">
                    <Button
                      render={<Link to="/portal" />}
                      nativeButton={false}
                      className="h-10 flex-1 rounded-lg text-[12.5px]"
                    >
                      Manage your profile
                      <ArrowUpRight data-icon="inline-end" />
                    </Button>
                    <Button
                      render={<Link to={profileUrl || `/u/${displayHandle}`} />}
                      nativeButton={false}
                      variant="outline"
                      className="h-10 flex-1 rounded-lg border-white/12 bg-white/[0.02] text-[12.5px] hover:bg-white/[0.06]"
                    >
                      View live profile
                    </Button>
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-3 text-[10.5px] text-muted-foreground">
                    <Link
                      to="/preview"
                      className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-foreground"
                    >
                      Back to preview
                    </Link>
                    <span className="size-0.5 rounded-full bg-white/20" />
                    <button
                      type="button"
                      onClick={startOver}
                      className="underline decoration-white/20 underline-offset-4 transition-colors hover:text-foreground"
                    >
                      Place another order
                    </button>
                  </div>

                  <p className="mt-4 text-[10px] text-muted-foreground">
                    Demo payment · No card was charged. Your profile and login are ready.
                  </p>
                </div>
              ) : (
                <>
                  {step === 0 && (
                    <div className="mt-7">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-medium">Your details</h3>
                        <span className="text-[10px] text-muted-foreground">Step 1 of 3</span>
                      </div>

                      <div className="mt-5 space-y-4">
                        <div className="grid gap-1.5">
                          <Label htmlFor="order-name" className="text-[11px] text-muted-foreground">
                            Full name
                          </Label>
                          <Input
                            id="order-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="e.g. Maria Santos"
                            autoComplete="name"
                            className="h-10 rounded-lg border-white/10 bg-background/60 text-[13px]"
                          />
                        </div>

                        <div className="grid gap-1.5">
                          <div className="flex items-baseline justify-between">
                            <Label
                              htmlFor="order-handle"
                              className="text-[11px] text-muted-foreground"
                            >
                              Username
                            </Label>
                            <span className="text-[9px] tracking-wide text-muted-foreground/70 uppercase">
                              Auto-selected
                            </span>
                          </div>
                          <div className="flex h-10 items-center rounded-lg border border-white/10 bg-background/60 px-3">
                            <span className="shrink-0 text-[13px] text-muted-foreground">
                              cotap.id/
                            </span>
                            <Input
                              id="order-handle"
                              value={handle}
                              onChange={(event) =>
                                setCustomHandle(cleanHandle(event.target.value))
                              }
                              placeholder="yourname"
                              autoComplete="off"
                              spellCheck={false}
                              className="h-full min-w-0 border-0 bg-transparent px-0.5 text-[13px] shadow-none focus-visible:ring-0"
                            />
                            <button
                              type="button"
                              onClick={() => setCustomHandle("")}
                              title="Auto-select from your name"
                              className="ml-1 inline-flex shrink-0 items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-[9.5px] font-medium text-primary transition-colors hover:bg-primary/20"
                            >
                              <Sparkles className="size-2.5" />
                              Auto
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="grid gap-1.5">
                            <Label
                              htmlFor="order-phone"
                              className="text-[11px] text-muted-foreground"
                            >
                              Phone number
                            </Label>
                            <Input
                              id="order-phone"
                              type="tel"
                              value={phone}
                              onChange={(event) => setPhone(event.target.value)}
                              placeholder="+63 917 000 0000"
                              autoComplete="tel"
                              className="h-10 rounded-lg border-white/10 bg-background/60 text-[13px]"
                            />
                          </div>

                          <div className="grid gap-1.5">
                            <Label
                              htmlFor="order-email"
                              className="text-[11px] text-muted-foreground"
                            >
                              Email · your login
                            </Label>
                            <Input
                              id="order-email"
                              type="email"
                              value={email}
                              onChange={(event) => setEmail(event.target.value)}
                              placeholder="you@company.com"
                              autoComplete="email"
                              className="h-10 rounded-lg border-white/10 bg-background/60 text-[13px]"
                            />
                          </div>
                        </div>

                        <div className="grid gap-1.5">
                          <div className="flex items-baseline justify-between">
                            <Label
                              htmlFor="order-password"
                              className="text-[11px] text-muted-foreground"
                            >
                              Create a password
                            </Label>
                            <span className="text-[9px] text-muted-foreground/70">
                              8+ characters
                            </span>
                          </div>
                          <div className="relative">
                            <Input
                              id="order-password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(event) => setPassword(event.target.value)}
                              placeholder="••••••••"
                              autoComplete="new-password"
                              className="h-10 rounded-lg border-white/10 bg-background/60 pr-9 text-[13px]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((current) => !current)}
                              aria-label={showPassword ? "Hide password" : "Show password"}
                              className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {showPassword ? (
                                <EyeOff className="size-3.5" />
                              ) : (
                                <Eye className="size-3.5" />
                              )}
                            </button>
                          </div>
                          <p className="text-[9.5px] leading-relaxed text-muted-foreground/75">
                            Use this to sign in and edit your profile at cotap.id/portal.
                          </p>
                        </div>

                        <div className="grid gap-1.5">
                          <span className="text-[11px] text-muted-foreground">Card</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            {(["basic", "premium"] as const).map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => setPlan(option)}
                                aria-pressed={plan === option}
                                className={cn(
                                  "rounded-lg border px-2.5 py-1.5 text-left transition-colors",
                                  plan === option
                                    ? "border-primary/50 bg-primary/[0.08]"
                                    : "border-white/10 bg-background/40 hover:bg-white/[0.04]"
                                )}
                              >
                                <span className="flex items-baseline justify-between gap-1 text-[10.5px] font-medium">
                                  {PLANS[option].name}
                                  <span className="text-[9.5px] text-muted-foreground">
                                    {peso(PLANS[option].price)}
                                  </span>
                                </span>
                                <span className="mt-0.5 block text-[8.5px] text-muted-foreground">
                                  {PLANS[option].material}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid gap-1.5">
                          <Label
                            htmlFor="order-address"
                            className="text-[11px] text-muted-foreground"
                          >
                            Address
                          </Label>
                          <Textarea
                            id="order-address"
                            value={address}
                            onChange={(event) => setAddress(event.target.value)}
                            placeholder="House / unit, street, barangay, city, province, ZIP"
                            autoComplete="street-address"
                            className="min-h-[62px] resize-none rounded-lg border-white/10 bg-background/60 text-[13px]"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={next}
                        disabled={!detailsValid}
                        className="mt-6 h-10 w-full rounded-lg text-[12.5px]"
                      >
                        Continue to delivery
                        <ArrowRight data-icon="inline-end" />
                      </Button>
                      <p className="mt-2.5 text-center text-[10px] text-muted-foreground/75">
                        {detailsValid
                          ? "Your card preview updates as you type."
                          : "Add your details, email and password (8+) to continue."}
                      </p>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="mt-7">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-medium">How should we get it to you?</h3>
                        <span className="text-[10px] text-muted-foreground">Step 2 of 3</span>
                      </div>

                      <div className="mt-5 grid gap-2.5">
                        <label
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50",
                            delivery === "delivery"
                              ? "border-primary/45 bg-primary/[0.06]"
                              : "border-white/8 bg-background/40 hover:bg-white/[0.03]"
                          )}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            value="delivery"
                            checked={delivery === "delivery"}
                            onChange={() => setDelivery("delivery")}
                            className="sr-only"
                          />
                          <span
                            className={cn(
                              "grid size-9 shrink-0 place-items-center rounded-lg",
                              delivery === "delivery"
                                ? "bg-primary/15 text-primary"
                                : "bg-white/5 text-muted-foreground"
                            )}
                          >
                            <Package className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="text-[12.5px] font-medium">Delivery</span>
                              <span className="text-[11.5px] font-medium text-foreground/80">
                                +{peso(DELIVERY_FEE)}
                              </span>
                            </span>
                            <span className="mt-1 block text-[10.5px] leading-relaxed text-muted-foreground">
                              Door-to-door nationwide, 3–5 working days.
                            </span>
                          </span>
                        </label>

                        <label
                          className={cn(
                            "flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring/50",
                            delivery === "pickup"
                              ? "border-primary/45 bg-primary/[0.06]"
                              : "border-white/8 bg-background/40 hover:bg-white/[0.03]"
                          )}
                        >
                          <input
                            type="radio"
                            name="delivery"
                            value="pickup"
                            checked={delivery === "pickup"}
                            onChange={() => setDelivery("pickup")}
                            className="sr-only"
                          />
                          <span
                            className={cn(
                              "grid size-9 shrink-0 place-items-center rounded-lg",
                              delivery === "pickup"
                                ? "bg-primary/15 text-primary"
                                : "bg-white/5 text-muted-foreground"
                            )}
                          >
                            <Store className="size-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="text-[12.5px] font-medium">Pickup</span>
                              <span className="text-[11.5px] font-medium text-primary">Free</span>
                            </span>
                            <span className="mt-1 block text-[10.5px] leading-relaxed text-muted-foreground">
                              Collect from our studio. We will text you the address and schedule.
                            </span>
                          </span>
                        </label>
                      </div>

                      <div className="mt-4 flex items-start gap-2 rounded-lg border border-white/7 bg-background/40 px-3 py-2.5 text-[10.5px] leading-relaxed text-muted-foreground">
                        <MapPin className="mt-0.5 size-3.5 shrink-0 text-primary/75" />
                        <span className="min-w-0">
                          {delivery === "delivery" ? (
                            <>
                              Delivering to{" "}
                              <span className="text-foreground/80">{address || "your address"}</span>.
                            </>
                          ) : (
                            <>Pickup is free — your details are kept for the receipt.</>
                          )}
                          <button
                            type="button"
                            onClick={() => setStep(0)}
                            className="ml-1 text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
                          >
                            Edit
                          </button>
                        </span>
                      </div>

                      <div className="mt-6 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={back}
                          className="h-10 rounded-lg border-white/12 bg-white/[0.02] px-3 text-[12.5px] hover:bg-white/[0.06]"
                        >
                          <ArrowLeft data-icon="inline-start" />
                          Back
                        </Button>
                        <Button onClick={next} className="h-10 flex-1 rounded-lg text-[12.5px]">
                          Continue to payment
                          <ArrowRight data-icon="inline-end" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="mt-7">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-medium">Payment</h3>
                        <span className="text-[10px] text-muted-foreground">Step 3 of 3</span>
                      </div>

                      <div className="mt-4 flex items-center justify-between rounded-lg border border-white/7 bg-background/40 px-3 py-2 text-[11px]">
                        <span className="text-muted-foreground">
                          {planInfo.name} card · {delivery === "delivery" ? "Delivery" : "Pickup"}
                        </span>
                        <span className="font-medium">{peso(total)}</span>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-1.5 rounded-lg border border-white/10 bg-background/40 p-1">
                        <button
                          type="button"
                          onClick={() => setPayment("card")}
                          aria-pressed={payment === "card"}
                          className={cn(
                            "flex h-8 items-center justify-center gap-1.5 rounded-md text-[11px] font-medium transition-colors",
                            payment === "card"
                              ? "bg-white/10 text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <CreditCard className="size-3.5" />
                          Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setPayment("gcash")}
                          aria-pressed={payment === "gcash"}
                          className={cn(
                            "flex h-8 items-center justify-center gap-1.5 rounded-md text-[11px] font-medium transition-colors",
                            payment === "gcash"
                              ? "bg-white/10 text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <Wallet className="size-3.5" />
                          GCash
                        </button>
                      </div>

                      {payment === "card" ? (
                        <div className="mt-4 space-y-3">
                          <div className="grid gap-1.5">
                            <Label
                              htmlFor="card-number"
                              className="text-[11px] text-muted-foreground"
                            >
                              Card number
                            </Label>
                            <Input
                              id="card-number"
                              value={cardNumber}
                              onChange={(event) =>
                                setCardNumber(formatCardNumber(event.target.value))
                              }
                              placeholder="4242 4242 4242 4242"
                              inputMode="numeric"
                              autoComplete="off"
                              className="h-10 rounded-lg border-white/10 bg-background/60 font-mono text-[12.5px] tracking-wide"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-1.5">
                              <Label
                                htmlFor="card-expiry"
                                className="text-[11px] text-muted-foreground"
                              >
                                Expiry
                              </Label>
                              <Input
                                id="card-expiry"
                                value={expiry}
                                onChange={(event) => setExpiry(formatExpiry(event.target.value))}
                                placeholder="MM/YY"
                                inputMode="numeric"
                                autoComplete="off"
                                className="h-10 rounded-lg border-white/10 bg-background/60 font-mono text-[12.5px]"
                              />
                            </div>
                            <div className="grid gap-1.5">
                              <Label
                                htmlFor="card-cvc"
                                className="text-[11px] text-muted-foreground"
                              >
                                CVC
                              </Label>
                              <Input
                                id="card-cvc"
                                value={cvc}
                                onChange={(event) =>
                                  setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))
                                }
                                placeholder="123"
                                inputMode="numeric"
                                autoComplete="off"
                                className="h-10 rounded-lg border-white/10 bg-background/60 font-mono text-[12.5px]"
                              />
                            </div>
                          </div>
                          <div className="grid gap-1.5">
                            <Label
                              htmlFor="card-name"
                              className="text-[11px] text-muted-foreground"
                            >
                              Name on card
                            </Label>
                            <Input
                              id="card-name"
                              value={cardName}
                              onChange={(event) => setCardName(event.target.value)}
                              placeholder="Maria Santos"
                              autoComplete="off"
                              className="h-10 rounded-lg border-white/10 bg-background/60 text-[13px]"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 rounded-xl border border-white/8 bg-white/[0.02] p-4 text-center">
                          <div className="mx-auto w-fit rounded-lg bg-white p-2">
                            <QrCode className="size-20 text-black" />
                          </div>
                          <p className="mt-3 text-[11.5px] font-medium">Scan with the GCash app</p>
                          <p className="mt-1 text-[10px] text-muted-foreground">
                            Or send to 0917 000 0000 · CoTap
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex items-start gap-2 rounded-lg border border-white/7 bg-background/40 px-3 py-2.5 text-[10px] leading-relaxed text-muted-foreground">
                        <ChevronRight className="mt-0.5 size-3 shrink-0 text-primary/75" />
                        Demo checkout — no card is charged and no GCash request is sent.
                      </div>

                      {submitError && (
                        <div className="mt-3 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-[10.5px] text-red-300">
                          <p>{submitError}</p>
                          <button
                            type="button"
                            onClick={() => setStep(0)}
                            className="mt-1 underline decoration-red-300/30 underline-offset-2 hover:text-red-200"
                          >
                            Edit your details
                          </button>
                        </div>
                      )}

                      <div className="mt-5 flex gap-2">
                        <Button
                          variant="outline"
                          onClick={back}
                          disabled={submitting}
                          className="h-10 rounded-lg border-white/12 bg-white/[0.02] px-3 text-[12.5px] hover:bg-white/[0.06]"
                        >
                          <ArrowLeft data-icon="inline-start" />
                          Back
                        </Button>
                        <Button
                          onClick={pay}
                          disabled={!paymentValid || submitting}
                          className="h-10 flex-1 rounded-lg text-[12.5px]"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="size-3.5 animate-spin" />
                              Processing…
                            </>
                          ) : (
                            <>
                              Pay {peso(total)}
                              <ArrowRight data-icon="inline-end" />
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </Reveal>

          <Reveal delay={100}>
            <div className="lg:sticky lg:top-24">
              <div className="rounded-3xl border border-white/8 bg-white/[0.02] p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    Your card preview
                  </span>
                  <Badge
                    variant="outline"
                    className="h-5 rounded-full border-primary/25 bg-primary/[0.07] px-2.5 text-[9px] text-primary uppercase"
                  >
                    {planInfo.name}
                  </Badge>
                </div>

                <div className="mt-4">
                  <CardFace
                    variant={planInfo.variant}
                    name={name || "Your Name"}
                    role=""
                    handle={displayHandle}
                    className="shadow-[0_30px_60px_-25px_rgba(0,0,0,0.9)]"
                  />
                </div>

                <div className="mt-5 space-y-2 text-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{planInfo.material} card</span>
                    <span>{peso(planInfo.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {delivery === "delivery" ? "Delivery fee" : "Pickup"}
                    </span>
                    <span>{shipping ? peso(shipping) : "Free"}</span>
                  </div>
                  <Separator className="my-1 bg-white/8" />
                  <div className="flex items-center justify-between text-[13px] font-medium">
                    <span>Total</span>
                    <span>{peso(total)}</span>
                  </div>
                </div>

                <p className="mt-4 text-[10px] leading-relaxed text-muted-foreground">
                  Includes a free cotap.id/{displayHandle} profile, unlimited edits and
                  your contact card for as long as you keep it.
                </p>

                {placed && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/[0.07] px-3 py-2 text-[10.5px] text-primary">
                    <CheckCircle2 className="size-3.5" />
                    Order {orderId} confirmed
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-center gap-4 text-[9.5px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Check className="size-3 text-primary" />
                  Free profile
                </span>
                <span className="flex items-center gap-1">
                  <Check className="size-3 text-primary" />
                  Ships in 3–5 days
                </span>
                <span className="flex items-center gap-1">
                  <Check className="size-3 text-primary" />
                  Demo checkout
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

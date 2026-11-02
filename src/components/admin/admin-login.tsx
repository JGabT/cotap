import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from "lucide-react"

import { Logo } from "@/components/site/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ApiError, api } from "@/lib/api"

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      })
      onSuccess()
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Could not sign in. Try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-5 py-16">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div
        className="pointer-events-none absolute top-0 left-1/2 h-[36rem] w-[54rem] max-w-none -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.885 0.176 124 / 9%), transparent 64%)",
        }}
      />

      <Link
        to="/"
        className="relative mb-8 inline-flex items-center gap-2 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to cotap.id
      </Link>

      <div className="glass-panel relative w-full max-w-sm rounded-2xl p-6 sm:p-7">
        <Logo />
        <h1 className="mt-7 text-2xl font-medium tracking-tight">Admin access</h1>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted-foreground">
          Manage every CoTap member, their links and their plan.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="admin-password" className="text-[11px] text-muted-foreground">
              Admin password
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-password"
                type={show ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter admin password"
                autoComplete="current-password"
                autoFocus
                className="h-10 rounded-lg border-white/10 bg-background/60 pr-9 pl-8 text-[13px]"
              />
              <button
                type="button"
                onClick={() => setShow((current) => !current)}
                aria-label={show ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              >
                {show ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-[11px] text-red-300">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading || !password}
            className="h-10 w-full rounded-lg text-[12.5px]"
          >
            {loading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <p className="mt-4 text-center text-[10px] text-muted-foreground/75">
          Sessions last 12 hours. Only the site owner has access.
        </p>
      </div>
    </div>
  )
}

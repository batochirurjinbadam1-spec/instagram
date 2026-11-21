"use client"

import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.9 17.9A10.4 10.4 0 0 1 12 19c-6.4 0-10-7-10-7a18 18 0 0 1 4.1-5M9.9 5.2A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-2.2 3.2" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    <path d="m3 3 18 18" />
  </svg>
)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const login = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }
    router.push("/instagram_page")
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-black text-white">
      {/* slow side-to-side pan so the whole wide cover photo scrolls into view */}
      <style>{`
        @keyframes cover-pan {
          from { object-position: 0% 50%; }
          to   { object-position: 100% 50%; }
        }
      `}</style>

      {/* soft background glows */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />

      {/* full-screen cover photo, slanted (parallelogram) right edge — desktop only */}
      <div
        className="sticky top-0 z-0 hidden h-screen w-[62%] shrink-0 lg:block"
        style={{ clipPath: "polygon(0 0, 100% 0, 86% 100%, 0 100%)" }}
      >
        <img
          src="/cover.png"
          alt="instagram cover photo"
          className="h-full w-full object-cover"
          style={{ animation: "cover-pan 24s ease-in-out infinite alternate" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      </div>

      {/* login side (scrolls if the screen is short) */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 lg:-ml-[6%]">
        {/* login card */}
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-neutral-900/80 p-8 shadow-xl shadow-fuchsia-500/10 backdrop-blur-xl"
        >
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <img
              src="/instagram-logo.png"
              alt="instagram logo"
              className="h-16 w-16 drop-shadow-md"
            />
            <h1 className="bg-gradient-to-r from-indigo-400 via-fuchsia-500 to-orange-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              Instagram
            </h1>
            <p className="text-sm text-neutral-400">
              Log in to see photos and videos from your friends.
            </p>
          </div>

          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl border-white/10 bg-neutral-800 text-white placeholder:text-neutral-500 focus-visible:ring-fuchsia-500"
            />

            {/* password + eye button */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 rounded-xl border-white/10 bg-neutral-800 pr-11 text-white placeholder:text-neutral-500 focus-visible:ring-fuchsia-500"
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-white"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-orange-500 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            <div className="flex items-center gap-3 py-1">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs font-medium uppercase text-neutral-500">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/sign_up_page")}
              className="h-11 w-full rounded-xl border-white/20 bg-transparent text-base font-semibold text-fuchsia-300 transition hover:bg-white/10 hover:text-fuchsia-200 active:scale-[0.98]"
            >
              Create User
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
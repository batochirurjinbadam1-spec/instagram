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
    <path d="M17.94 17.94A10.4 10.4 0 0 1 12 19c-6.4 0-10-7-10-7a18.5 18.5 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.7 9.7 0 0 1 12 4c6.4 0 10 7 10 7a18.6 18.6 0 0 1-2.16 3.19" />
    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <path d="m2 2 20 20" />
  </svg>
)

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const signup = async () => {
    setError("")

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (authError || !authData?.user) {
      setError(authError?.message ?? "Could not create account.")
      return
    }

    const { error: insertError } = await supabase
      .from("user_table")
      .insert({ id: authData.user.id, username: username })

    if (insertError) {
      setError(insertError.message)
      return
    }

    router.push("/login_page")
  }

  const inputClass =
    "h-11 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-neutral-500 focus-visible:ring-fuchsia-500"

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

      {/* signup side (scrolls if the screen is short) */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 lg:-ml-[6%]">
        {/* signup card */}
        <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-neutral-900/80 p-8 shadow-xl shadow-fuchsia-500/10 backdrop-blur-xl">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <img
              src="/instagram-logo.png"
              alt="instagram logo"
              className="h-16 w-16 drop-shadow-md"
            />
            <h1 className="bg-gradient-to-r from-indigo-400 via-fuchsia-500 to-orange-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
              Create your account
            </h1>
            <p className="text-sm text-neutral-400">
              Sign up to share photos and videos with your friends.
            </p>
          </div>

          <div className="space-y-3">
            <Input
              type="email"
              placeholder="Email"
              className={inputClass}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* password with eye button */}
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`${inputClass} pr-11`}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-white"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            <Input
              placeholder="Username"
              className={inputClass}
              onChange={(e) => setUsername(e.target.value)}
            />

            {error && <p className="text-center text-sm text-red-400">{error}</p>}

            <Button
              onClick={signup}
              className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-orange-500 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:opacity-90 active:scale-[0.98]"
            >
              Create User
            </Button>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-500">
            By signing up, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
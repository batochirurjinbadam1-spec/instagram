"use client"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex min-h-dvh w-full flex-col bg-[#0b0e14] text-white md:flex-row md:items-center md:justify-center md:gap-10 md:px-10">
      {/* Image side: scales to any screen size */}
      <div className="flex min-h-0 flex-1 items-center justify-center px-4 pt-6 md:max-w-2xl md:pt-0">
        <img
          src="/image.png"
          alt="Instagram stories collage"
          className="max-h-[48dvh] w-full object-contain md:max-h-[80dvh]"
        />
      </div>

      {/* Content side */}
      <div className="flex flex-col items-center px-6 pb-8 pt-4 md:max-w-sm md:flex-1 md:pb-0 md:pt-0">
        {/* Logo + title */}
        <div className="flex items-center gap-2">
          <img
            src="/instagram-logo.png"
            alt="Instagram logo"
            className="h-9 w-9 object-contain"
          />
          <h1 className="bg-gradient-to-r from-[#feda75] via-[#d62976] to-[#4f5bd5] bg-clip-text text-3xl font-bold tracking-tight text-transparent">
            Instagram
          </h1>
        </div>

        <p className="mt-3 max-w-xs text-center text-sm text-neutral-400 md:text-base">
          Share your moments, follow your friends and see what they are up to.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex w-full flex-col gap-3">
          <button
            onClick={() => router.push("/login_page")}
            className="w-full rounded-xl bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] py-3 text-base font-semibold shadow-lg shadow-pink-500/20 transition hover:brightness-110 active:scale-95"
          >
            Log in
          </button>
          <button
            onClick={() => router.push("/sign_up_page")}
            className="w-full rounded-xl border border-white/25 py-3 text-base font-semibold transition hover:bg-white/10 active:scale-95"
          >
            Create new account
          </button>
        </div>

        <p className="mt-5 text-xs text-neutral-500">© Instagram</p>
      </div>
    </div>
  )
}
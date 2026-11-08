"use client"

import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function signuppage(){
    const router= useRouter()
    const [email,setEmail]= useState("")
    const [username,setUsername]= useState("")
    const [userId,setUserid]= useState("")
    const [password,setPassword]= useState("")
  const signup = async () => {
    const response = await supabase.auth?.signUp({
      email: email,
      password: password,
    })
console.log("usr",response)



    const {data,error}= await supabase.from("user_table")
    .insert({id:response.data.user.id,username:username})
router.push("/login_page")
  }


    return(
        <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-fuchsia-50 via-white to-orange-50">
          {/* slow side-to-side pan so the whole wide cover photo scrolls into view */}
          <style>{`
            @keyframes cover-pan {
              from { object-position: 0% 50%; }
              to   { object-position: 100% 50%; }
            }
          `}</style>

          {/* soft background glows */}
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />
          <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-fuchsia-300/30 blur-3xl" />

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
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent" />
          </div>

          {/* signup side (scrolls if the screen is short) */}
          <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 lg:-ml-[6%]">
            {/* signup card */}
            <div className="w-full max-w-sm rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl shadow-fuchsia-500/10 backdrop-blur-xl">
              <div className="mb-6 flex flex-col items-center gap-3 text-center">
                <img
                  src="/instagram-logo.png"
                  alt="instagram logo"
                  className="h-16 w-16 drop-shadow-md"
                />
                <h1 className="bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-orange-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                  Create your account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Sign up to share photos and videos with your friends.
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email"
                  className="h-11 rounded-xl bg-neutral-50 focus-visible:ring-fuchsia-500"
                  onChange={(e)=>setEmail(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  className="h-11 rounded-xl bg-neutral-50 focus-visible:ring-fuchsia-500"
                  onChange={(e)=>setPassword(e.target.value)}
                />
                <Input
                  placeholder="Username"
                  className="h-11 rounded-xl bg-neutral-50 focus-visible:ring-fuchsia-500"
                  onChange={(e)=>setUsername(e.target.value)}
                />
                <Button
                  onClick={signup}
                  className="h-11 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-orange-500 text-base font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:opacity-90 active:scale-[0.98]"
                >
                  Create User
                </Button>
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                By signing up, you agree to our Terms and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
    )
}
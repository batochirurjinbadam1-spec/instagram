"use client"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const HomeIcon = ({ active }) => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
    <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <path d="M12 8v8M8 12h8" />
  </svg>
)

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="5.5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
)

export default function Home() {
  const router = useRouter()
  const [picture,setPicture]=useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [active, setActive] = useState("home")

  useEffect(() => {
    async function fetchUser() {
      // get the logged-in user's id safely (works only in the browser)
      const { data: authData } = await supabase.auth.getUser()
      const id = authData?.user?.id
      if (!id) return

      const { data, error } = await supabase
        .from("user_table")
        .select("*")
        .eq("id", id)
        .single()

                const { data: downlaondData, error: downloadError } = await supabase
            .storage
            .from('story_image')
            .download("*")
            setPicture(downlaondData)
            console.log("dowl",downlaondData)
      if (!error) setUserInfo(data)
    }
    fetchUser()
  }, [])

  const navBtn = (key) =>
    `flex h-12 w-12 items-center justify-center rounded-full transition active:scale-90 ${
      active === key ? "text-black" : "text-neutral-500 hover:text-black"
    }`

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white text-black">
      {/* Top bar: logo + title centered */}
      <header className="sticky top-0 z-10 flex h-14 items-center justify-center gap-2 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <LogoIcon />
        <h1 className="text-xl font-semibold tracking-tight">Instagram</h1>
      </header>

      {/* Empty content area */}
      <main className="flex-1 pb-20" />
{picture?.map((pictures)=>{
return(
    <div>
        
        </div>
)

})}
      {/* Bottom navbar */}
      <nav className="fixed bottom-0 left-1/2 z-10 flex h-16 w-full max-w-md -translate-x-1/2 items-center justify-around border-t border-neutral-200 bg-white/90 backdrop-blur">
        <button aria-label="Home" className={navBtn("home")} onClick={() => setActive("home")}>
          <HomeIcon active={active === "home"} />
        </button>

        <button aria-label="Search" className={navBtn("search")} onClick={() => setActive("search")}>
          <SearchIcon />
        </button>

        <button
          aria-label="Create Story"
          className={navBtn("create")}
          onClick={() => router.push("/creating_story_page")}
        >
          <PlusIcon />
        </button>

        <button aria-label="Profile" className={navBtn("profile")} onClick={() => setActive("profile")}>
          <img
            src="/profile.png"
            alt={userInfo?.username ?? "profile"}
            className={`h-8 w-8 rounded-full object-cover ring-2 ${
              active === "profile" ? "ring-black" : "ring-transparent"
            }`}
          />
        </button>
      </nav>
    </div>
  )
}
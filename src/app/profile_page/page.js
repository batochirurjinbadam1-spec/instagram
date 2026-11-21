"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Grid3x3, ImageIcon, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase/client"

function ProfileSkeleton() {
  return (
    <div className="animate-pulse p-6">
      <div className="flex items-center gap-8">
        <div className="h-24 w-24 rounded-full bg-muted sm:h-36 sm:w-36" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="h-4 w-64 rounded bg-muted" />
          <div className="h-4 w-48 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square bg-muted" />
        ))}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const[ file, setFile]= useState(null)
  const router = useRouter()
  const [username, setUsername]= useState("")
  const [password, setPassword]= useState("")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchDiv,setSearchDiv]= useState(false)
  useEffect(() => {
    let cancelled = false

    async function fetchProfile() {
      try {
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !authUser) {
          router.replace("/login")
          return
        }

        const { data, error: dbError } = await supabase
          .from("user_table")
          .select("*, posts(*)")
          .eq("id", authUser.id)
          .single()

        if (dbError) throw dbError
        if (!cancelled) setUser(data)
      } catch (err) {
        if (!cancelled) setError(err.message ?? "Something went wrong")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProfile()
    return () => {
      cancelled = true
    }
  }, [router])

  const posts = user?.posts ?? []
  const stats = [
    { label: "posts", value: posts.length },
    { label: "followers", value: user?.followers_count ?? 0 },
    { label: "following", value: user?.following_count ?? 0 },
  ]
  function handlegotologin(){
    localStorage.removeItem("sb-unzctofvqctackhokxid-auth-token")
    router.push("/login_page")
  }

  function handleEditProfile(){
  setSearchDiv(!searchDiv)
  }
  async function handleChangeFile(e){
    console.log(e.target.files[0])
    setFile(e.target.file)
    const response= await supabase.storage
    .from("profile_image")
    .upload(`images/${e.target.files[0].name}`,e.target.files[0])
  }
  return (
    <div className="min-h-screen bg-background relative">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/instagram_page")}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <img src="/instagram-logo.png" alt="Instagram logo" className="h-6 w-6" />
        <h1 className="text-lg font-semibold tracking-tight">instagram</h1>
      </header>

      <main className="mx-auto max-w-3xl">
        {loading ? (
          <ProfileSkeleton />
        ) : error || !user ? (
          <p className="p-10 text-center text-red-500">
            {error ?? "Profile not found"}
          </p>
        ) : (
          <>
            {/* Profile info */}
            <section className="flex flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:items-start sm:gap-12 z-5">
              {/* Avatar with story-style gradient ring */}
              <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px]">
                <div className="rounded-full bg-background p-1">
                  <Avatar className="h-24 w-24 sm:h-36 sm:w-36">
                    <AvatarImage
                      src={user.profile_picture || "/profile.png"}
                      alt={user.username}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-3xl">
                      {user.username?.[0]?.toUpperCase() ?? "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
              </div>

              <div className="flex-1 space-y-4 text-center sm:text-left">
                <div className="flex flex-col items-center gap-3 sm:flex-row">
                  <h2 className="text-xl font-light">{user.username}</h2>
                  <Button variant="secondary" size="sm" onClick={handleEditProfile}>
                    Edit profile
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handlegotologin}>
                    Log out
                  </Button>
                </div>

                <ul className="flex justify-center gap-8 sm:justify-start">
                  {stats.map(({ label, value }) => (
                    <li key={label}>
                      <span className="font-semibold">{value}</span>{" "}
                      <span className="text-muted-foreground">{label}</span>
                    </li>
                  ))}
                </ul>

                {user.bio ? (
                  <p className="whitespace-pre-line text-sm">{user.bio}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No bio yet</p>
                )}
              </div>
            </section>

            <Separator />

            {/* Tab */}
            <div className="flex justify-center">
              <div className="-mt-px flex items-center gap-2 border-t border-foreground px-6 py-3 text-xs font-semibold tracking-widest">
                <Grid3x3 className="h-4 w-4" />
                POSTS
              </div>
              {/* Edit profile */ }
              {searchDiv&&
              <div className="absolute bg-green-100 w-full h-screen z-10 flex flex-center"> 
              <h1>Edit Profile</h1>
              <input placeholder="Username" onChange={(e)=>setPassword(e.target.value)}/>
              <input placeholder="bio" onChange={(e)=>setPassword(e.target.value)}/>
              <input type="file" onChange={(e)=>handleChangeFile(e)}/> 
              {/* <button onClick={handlePushnewAbout}>Done</button>*/}</div>} 
            </div>

            {/* Posts */}
            {posts.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
                <div className="rounded-full border-2 border-current p-4">
                  <Camera className="h-8 w-8" />
                </div>
                <p className="text-lg font-light">No posts yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="group relative aspect-square overflow-hidden bg-muted"
                  >
                    {post.image_url ? (
                      <img
                        src={post.image_url}
                        alt={post.caption || "Post"}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                    {post.caption && (
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-3 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="line-clamp-2">{post.caption}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
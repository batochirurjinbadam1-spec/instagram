"use client"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { formatDistanceToNowStrict } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import { Home, Search, PlusSquare, Heart, MessageCircle, Send, Bookmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

// helpers: tolerate slightly different column names in your tables
const userKey = (u) => u?.userid ?? u?.id
const postOwner = (p) => p?.userid ?? p?.user_id
const userAvatar = (u) => u?.profile?.picture ?? u?.profile_picture ?? u?.avatar_url ?? "/profile.png"

export default function HomePage() {
  const router = useRouter()
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [currentId, setCurrentId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState("home")
  const [liked, setLiked] = useState({})
  const [saved, setSaved] = useState({})

  useEffect(() => {
    async function load() {
      // who is logged in
      const { data: authData } = await supabase.auth.getUser()
      setCurrentId(authData?.user?.id ?? null)

      // posts + users
      const [{ data: postData, error: postError }, { data: userData, error: userError }] =
        await Promise.all([
          supabase.from("posts").select("*"),
          supabase.from("user_table").select("*"),
        ])

      if (postError) console.log("posts error:", postError.message)
      if (userError) console.log("user_table error:", userError.message)

      // newest first (only if posts have a created_at column)
      const sorted = [...(postData ?? [])].sort((a, b) =>
        a.created_at && b.created_at ? new Date(b.created_at) - new Date(a.created_at) : 0
      )

      setPosts(sorted)
      setUsers(userData ?? [])
      setLoading(false)
    }
    load()
  }, [])

  // quick lookup: user id -> user row
  const userById = useMemo(() => {
    const map = {}
    users.forEach((u) => (map[userKey(u)] = u))
    return map
  }, [users])

  const me = userById[currentId]
  const suggestions = users.filter((u) => userKey(u) !== currentId).slice(0, 5)

  const navItems = [
    { key: "home", label: "Home", icon: Home, onClick: () => setActive("home") },
    { key: "search", label: "Search", icon: Search, onClick: () => setActive("search") },
    { key: "create", label: "Create", icon: PlusSquare, onClick: () => router.push("/creating_story_page") },
  ]
function handleComment(post) {
  if (!post?.id) return;
  router.push(`/comment_page/${post.id}`);
}

  return (
    <div className="flex min-h-screen bg-muted/30 text-foreground">
      {/* ===== Left sidebar (desktop / tablet) ===== */}
      <aside className="sticky top-0 hidden h-screen w-20 shrink-0 flex-col border-r bg-background px-3 py-6 md:flex xl:w-64 xl:px-5">
        <div className="mb-8 flex items-center gap-3 px-3">
          <img src="/instagram-logo.png" alt="instagram logo" className="h-8 w-8" />
          <span className="hidden text-2xl font-semibold tracking-tight xl:block">Instagram</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ key, label, icon: Icon, onClick }) => (
            <Button
              key={key}
              variant={active === key ? "secondary" : "ghost"}
              onClick={onClick}
              className="h-12 justify-center gap-4 rounded-xl text-base transition-colors xl:justify-start"
            >
              <Icon className="h-6 w-6" strokeWidth={active === key ? 2.5 : 1.8} />
              <span className={`hidden xl:block ${active === key ? "font-semibold" : "font-normal"}`}>
                {label}
              </span>
            </Button>
          ))}

          <Button
            variant={active === "profile" ? "secondary" : "ghost"}
            onClick={() => router.push("/profile_page")}
            className="h-12 justify-center gap-4 rounded-xl text-base transition-colors xl:justify-start"
          >
            <Avatar className="h-6 w-6">
              <AvatarImage src={userAvatar(me)} alt="profile" className="object-cover" />
              <AvatarFallback>{me?.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
            </Avatar>
            <span className="hidden font-normal xl:block">Profile</span>
          </Button>
        </nav>
      </aside>

      {/* ===== Center feed ===== */}
      <main className="flex flex-1 flex-col items-center">
        {/* mobile top bar */}
        <header className="sticky top-0 z-20 flex w-full items-center gap-2 border-b bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <img src="/instagram-logo.png" alt="instagram logo" className="h-7 w-7" />
          <span className="text-xl font-semibold tracking-tight">Instagram</span>
        </header>

        <div className="w-full max-w-[470px] space-y-5 px-3 pb-24 pt-6 md:pb-10 md:pt-8">
          {loading &&
            [1, 2].map((n) => (
              <Card key={n} className="overflow-hidden rounded-2xl border-0 shadow-sm">
                <div className="flex items-center gap-3 p-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="aspect-square w-full rounded-none" />
                <div className="space-y-2 p-4">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </Card>
            ))}

          {!loading && posts.length === 0 && (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-background py-24 text-center shadow-sm">
              <div className="rounded-full border-2 border-foreground/70 p-4">
                <PlusSquare className="h-8 w-8" />
              </div>
              <p className="text-xl font-semibold">No posts yet</p>
              <p className="text-sm text-muted-foreground">Share your first photo to get started.</p>
              <Button className="mt-2 rounded-full px-6" onClick={() => router.push("/creating_story_page")}>
                Create post
              </Button>
            </div>
          )}

          {posts.map((post, index) => {
            const owner = userById[postOwner(post)]
            const id = post.id ?? index
            return (
              <Card key={id} className="overflow-hidden rounded-2xl border-0 bg-background shadow-sm">
                {/* post header */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                    <Avatar className="h-9 w-9 border-2 border-background">
                      <AvatarImage src={userAvatar(owner)} alt="avatar" className="object-cover" />
                      <AvatarFallback>{owner?.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-1 flex-col leading-tight">
                    <span className="text-sm font-semibold">{owner?.username ?? "User"}</span>
                    <span className="text-xs text-muted-foreground">
                      {post.created_at && formatDistanceToNowStrict(post.created_at, { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* image */}
                <img
                  src={post.image_url}
                  alt={post.caption ?? "post"}
                  className="max-h-[600px] w-full bg-muted object-cover"
                  loading="lazy"
                />

                {/* actions */}
                <div className="flex items-center gap-1 px-2 pt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full transition-transform active:scale-90"
                    onClick={() => setLiked((l) => ({ ...l, [id]: !l[id] }))}
                  >
                    <Heart className={`h-6 w-6 ${liked[id] ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={()=>handleComment(post)}>
                    <MessageCircle className="h-6 w-6" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Send className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto rounded-full transition-transform active:scale-90"
                    onClick={() => setSaved((s) => ({ ...s, [id]: !s[id] }))}
                  >
                    <Bookmark className={`h-6 w-6 ${saved[id] ? "fill-foreground" : ""}`} />
                  </Button>
                </div>

                {/* caption */}
                {post.caption && (
                  <p className="px-4 pb-4 pt-1 text-sm leading-relaxed">
                    <span className="mr-2 font-semibold">{owner?.username ?? "user"}</span>
                    {post.caption}
                  </p>
                )}
              </Card>
            )
          })}
        </div>
      </main>

      {/* ===== Right panel ===== */}
      <aside className="sticky top-0 hidden h-screen w-80 shrink-0 px-6 py-8 xl:block">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={userAvatar(me)} alt="me" className="object-cover" />
            <AvatarFallback>{me?.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <p className="text-sm font-semibold">{me?.username ?? "Your account"}</p>
            <p className="text-xs text-muted-foreground">Welcome back</p>
          </div>
        </div>

        <Separator className="my-6" />

        <p className="mb-4 text-sm font-semibold text-muted-foreground">Suggested for you</p>
        <div className="space-y-4">
          {suggestions.length === 0 && <p className="text-sm text-muted-foreground">No suggestions yet.</p>}
          {suggestions.map((u) => (
            <div key={userKey(u)} className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar(u)} alt="avatar" className="object-cover" />
                <AvatarFallback>{u?.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate text-sm font-semibold">{u?.username}</span>
              <Button variant="link" size="sm" className="px-0 text-blue-500 hover:text-blue-700">
                Follow
              </Button>
            </div>
          ))}
        </div>
      </aside>

      {/* ===== Bottom nav (mobile) ===== */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex items-center justify-around border-t bg-background/90 py-2 backdrop-blur md:hidden">
        {navItems.map(({ key, label, icon: Icon, onClick }) => (
          <Button key={key} variant="ghost" size="icon" onClick={onClick} aria-label={label}>
            <Icon className="h-6 w-6" strokeWidth={active === key ? 2.5 : 1.8} />
          </Button>
        ))}
        <Button variant="ghost" size="icon" onClick={() => router.push("/profile_page")} aria-label="Profile">
          <Avatar className="h-6 w-6">
            <AvatarImage src={userAvatar(me)} alt="profile" className="object-cover" />
            <AvatarFallback>{me?.username?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
          </Avatar>
        </Button>
      </nav>
    </div>
  )
}
"use client"

import { supabase } from "@/lib/supabase/client"
import { Textarea } from "@/components/ui/textarea"
import { AwardIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15 5-7 7 7 7" />
  </svg>
)

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="m21 16-5-5L6 20" />
  </svg>
)

export default function CreatingStoryPage() {
    const [caption,setCaption]= useState("")
  const router = useRouter()
  const inputRef = useRef(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")

  // release the preview url when it changes / page closes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  function handleFile(e) {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.type.startsWith("image/")) {
      setError("Please choose an image file.")
      return
    }
    setError("")
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  function discard() {
    setFile(null)
    setPreview(null)
    setError("")
    if (inputRef.current) inputRef.current.value = ""
  }

  async function shareStory() {
    if (!file) return
    setUploading(true)
    setError("")
    
    // unique name so same-named files never overwrite each other
    const path = `images/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from("story_image")
      .upload(path, file)

    setUploading(false)

    if (uploadError) {
      setError(uploadError.message)
      return
    }
     
    const { data } = supabase.storage.from("story_image").getPublicUrl(path)
    console.log("story url:", data.publicUrl)

    router.push("/instagram_page")
    const response = await supabase.from("posts")
    .insert({image_url:data.publicUrl,caption:caption,})
  }
function handleCaption(e){
    setCaption(e)
}
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      {/* Top bar */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-8">
        <button
          onClick={() => router.push("/instagram_page")}
          className="flex items-center gap-1 rounded-full border border-black px-4 py-1.5 text-sm font-semibold transition hover:bg-black hover:text-white active:scale-95"
        >
          <BackIcon />
          Back
        </button>

        <div className="flex items-center gap-2">
          <img src="/instagram-logo.png" alt="instagram logo" className="h-8 w-8" />
          <span className="text-lg font-semibold tracking-tight">Instagram</span>
        </div>

        {/* spacer keeps the logo centered */}
        <div className="w-[88px]" />
      </header>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {/* Landscape layout: preview on the left, actions on the right */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-stretch gap-6 px-4 py-6 sm:px-8 lg:flex-row lg:items-center lg:gap-10">
        {/* Landscape (16:9) preview area */}
        <div className="flex-1">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
            {preview ? (
              <div className="flex h-full w-full items-center justify-center bg-black">
                <img src={preview} alt="story preview" className="h-full w-full object-contain" />
              </div>
            ) : (
              <button
                onClick={() => inputRef.current?.click()}
                className="flex h-full w-full flex-col items-center justify-center gap-3 text-neutral-400 transition hover:bg-neutral-50 hover:text-black"
              >
                <ImageIcon />
                <span className="text-sm font-medium">Click to choose a photo</span>
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-4 lg:w-80">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create story</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {file ? file.name : "Pick a landscape photo to share with your followers."}
            </p>
          </div>

          {!file ? (
            <button
              onClick={() => inputRef.current?.click()}
              className="rounded-xl bg-black py-3 text-base font-semibold text-white transition hover:bg-neutral-800 active:scale-95"
            >
              Select from device
            </button>
          ) : (
            <div className="flex flex-col gap-3">
                <Textarea placeholder="Description"  max={100} type={caption} onChange={(e)=>handleCaption(e.target.value)} />
              <button
                onClick={shareStory}
                disabled={uploading}
                className="rounded-xl bg-black py-3 text-base font-semibold text-white transition hover:bg-neutral-800 active:scale-95 disabled:opacity-50"
              >
                {uploading ? "Sharing..." : "Share to story"}
              </button>
              <button
                onClick={discard}
                disabled={uploading}
                className="rounded-xl border border-black py-3 text-base font-semibold transition hover:bg-neutral-100 active:scale-95 disabled:opacity-50"
              >
                Choose another
              </button>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </main>
    </div>
  )
}
"use client"

import { supabase } from "@/lib/supabase/client"
import { useState } from "react"

export default function creating_story_page() {
    const [file, setFile] = useState("")
    async function handleFile(e) {
        console.log("file", e.target.files[0])
        setFile(e.target.files);

        const { data, error } = await supabase
            .storage
            .from("story_image")
            .upload(`images/${e.target.files[0].name}`, e.target.files[0])
        const { data: downlaondData, error: downloadError } = await supabase
            .storage
            .from('story_image')
            .download(`images/${e.target.files[0].name}`)
        console.log(downlaondData)
        if (downloadError) {
            console.log("error", downlaondData)
        }
    }
    return (
        <div>
            <input type="file" onChange={(e) => handleFile(e)} />

        </div>
    )

}

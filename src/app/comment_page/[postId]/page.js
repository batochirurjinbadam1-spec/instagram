"use client";

import { supabase } from "@/lib/supabase/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyComponent() {
    const [content,setContent]= useState("")
    const [aboutcom,setAboutcom]= useState([])
  const params = useParams();
  const [postId,setPostId]= useState(params.postId)
  async function handlePushComments(){
    const {data ,error}= await supabase
    .from("comments")
    .insert({content:content, post_id:params.postId })
  }
  useEffect(()=>{
    async function fetchComments() {
        const {data,error}= await supabase .from("comments")
        .select("*,user_table(*)")
        .single()
        setAboutcom(data)
     
    }
    fetchComments()
  },[])
  return <div>
    <div><h1>Comments</h1></div>
    <div>
    <input placeholder="content" value={content} onChange={(e)=>setContent(e.target.value)}/>
    <button onClick={handlePushComments}>Done</button> {aboutcom.map((about)=>{
        return(
            <div>
{about.username}
            </div>
        )
    })}</div>
    </div>;
}

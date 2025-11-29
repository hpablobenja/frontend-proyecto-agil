// import { redirect } from "next/navigation";
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"


export default function Home() {
  // redirect("auth");
  const router = useRouter()
  
  useEffect(() => {
    router.push("/auth/login")
  }, [router])
}

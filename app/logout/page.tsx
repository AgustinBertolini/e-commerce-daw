"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { logoutUser } from "@/lib/auth"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logoutUser()
        router.push("/login")
      } catch (error) {
        console.error("Error during logout:", error)
        // En caso de error, igualmente redirigir al login
        router.push("/login")
      }
    }

    performLogout()
  }, [router])

  return (
    <div className="container mx-auto py-12 text-center">
      <p>Cerrando sesión...</p>
    </div>
  )
}

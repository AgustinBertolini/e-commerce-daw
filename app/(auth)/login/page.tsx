"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginUser, isAccountLocked, getRemainingLockoutTime } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const expired = searchParams.get("expired")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const [success, setSuccess] = useState(
    registered === "true"
      ? "¡Registro exitoso! Ahora puedes iniciar sesión."
      : expired === "true"
        ? "Tu sesión ha expirado. Por favor inicia sesión nuevamente."
        : "",
  )

  // Verificar si la cuenta está bloqueada y actualizar el contador
  useEffect(() => {
    const checkLockStatus = () => {
      const locked = isAccountLocked()
      setIsLocked(locked)

      if (locked) {
        setRemainingTime(getRemainingLockoutTime())
      }
    }

    checkLockStatus()

    // Actualizar el contador cada segundo si está bloqueado
    const interval = setInterval(() => {
      if (isAccountLocked()) {
        setRemainingTime(getRemainingLockoutTime())
      } else {
        setIsLocked(false)
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [error]) // Actualizar cuando cambia el error (después de un intento fallido)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Verificar si la cuenta está bloqueada
    if (isLocked) {
      setError(`Cuenta bloqueada temporalmente. Intente nuevamente en ${remainingTime} segundos.`)
      return
    }

    // Validaciones
    if (!email || !password) {
      setError("Todos los campos son obligatorios")
      return
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo electrónico válido")
      return
    }

    try {
      setLoading(true)
      await loginUser(email, password)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Credenciales inválidas. Por favor intenta nuevamente.")

      // Verificar si la cuenta se bloqueó después del intento
      if (isAccountLocked()) {
        setIsLocked(true)
        setRemainingTime(getRemainingLockoutTime())
      }

      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md space-y-8 p-8">
      <div className="text-center">
        <Image src="/placeholder.svg?height=80&width=200" alt="Logo" width={200} height={80} className="mx-auto" />
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Iniciar sesión</h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {isLocked && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-800">
            Cuenta bloqueada temporalmente. Podrás intentar nuevamente en {remainingTime} segundos.
          </AlertDescription>
        </Alert>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              disabled={isLocked || loading}
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLocked || loading}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLocked || loading}>
          {loading ? "Iniciando sesión..." : isLocked ? `Bloqueado (${remainingTime}s)` : "Iniciar sesión"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="font-medium text-yellow-600 hover:text-yellow-500">
              Registrarse
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

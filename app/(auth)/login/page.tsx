"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import api from "@/lib/api";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const expired = searchParams.get("expired");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(
    registered === "true"
      ? "¡Registro exitoso! Ahora puedes iniciar sesión."
      : expired === "true"
      ? "Tu sesión ha expirado. Por favor inicia sesión nuevamente."
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const lockout = Cookies.get("login_lockout_until");
    if (lockout) {
      setLockoutUntil(Number(lockout));
    }
  }, []);

  useEffect(() => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      const timeout = setInterval(() => {
        if (Date.now() >= lockoutUntil) {
          setLockoutUntil(null);
          setFailedAttempts(0);
          Cookies.remove("login_lockout_until");
        }
      }, 1000);
      return () => clearInterval(timeout);
    }
  }, [lockoutUntil]);

  const isLocked = isClient && lockoutUntil && Date.now() < lockoutUntil;
  const remainingTime = isLocked
    ? Math.ceil((lockoutUntil! - Date.now()) / 1000)
    : 0;

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isLocked) {
      setError(
        `Cuenta bloqueada temporalmente. Intente nuevamente en ${remainingTime} segundos.`
      );
      return;
    }

    // Validaciones
    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo electrónico válido");
      return;
    }

    try {
      setLoading(true);
      // Login con api.login.post
      const data = await api.login.post({ email, password });
      if (data && data.token) {
        Cookies.set("token", data.token, { path: "/" });
        if (data.userId) {
          Cookies.set("userId", data.userId, { path: "/" });
        }
        setFailedAttempts(0);
        setLockoutUntil(null);
        Cookies.remove("login_lockout_until");
        router.push("/");
      } else {
        throw new Error(
          data?.message ||
            "Credenciales inválidas. Por favor intenta nuevamente."
        );
      }
    } catch (err: any) {
      setFailedAttempts((prev) => {
        const next = prev + 1;
        if (next >= 3) {
          const until = Date.now() + 30000;
          setLockoutUntil(until);
          Cookies.set("login_lockout_until", String(until), { path: "/" });
        }
        return next;
      });
      setError(
        err.message || "Credenciales inválidas. Por favor intenta nuevamente."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Evita renderizar hasta que esté en cliente para prevenir hydration mismatch
  if (!isClient) return null;

  return (
    <div className="w-full max-w-md space-y-8 p-8">
      <div className="flex flex-col items-center text-center">
        <Image
          src="/mercado-clone-logo.jpg"
          alt="Logo MercadoClone"
          width={300}
          height={300}
          className="border rounded-2xl"
        />
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
          Iniciar sesión
        </h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {isLocked && (
        <Alert className="bg-yellow-50 border-yellow-200">
          <AlertDescription className="text-yellow-800">
            Cuenta bloqueada temporalmente. Podrás intentar nuevamente en{" "}
            {remainingTime} segundos.
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
          {loading
            ? "Iniciando sesión..."
            : isLocked
            ? `Bloqueado (${remainingTime}s)`
            : "Iniciar sesión"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="font-medium text-yellow-600 hover:text-yellow-500"
            >
              Registrarse
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}

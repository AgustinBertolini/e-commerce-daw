"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getUserProfile, updateUserProfile } from "@/lib/user"
import type { UserProfile } from "@/types"

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const userProfile = await getUserProfile()
        setProfile(userProfile)
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    try {
      setSaving(true)
      await updateUserProfile(profile)
      setMessage({ type: "success", text: "Perfil actualizado correctamente" })
    } catch (error) {
      console.error("Error updating profile:", error)
      setMessage({ type: "error", text: "Error al actualizar el perfil" })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return

    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value,
    })
  }

  if (loading) {
    return <div className="container mx-auto py-12 text-center">Cargando perfil...</div>
  }

  if (!profile) {
    return <div className="container mx-auto py-12 text-center">No se pudo cargar el perfil</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <Tabs defaultValue="personal">
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Información Personal</TabsTrigger>
          <TabsTrigger value="address">Direcciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleProfileUpdate}>
              {message.text && (
                <div
                  className={`p-4 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {message.text}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" name="name" value={profile.name || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" name="lastName" value={profile.lastName || ""} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" name="email" type="email" value={profile.email} disabled />
                  <p className="text-sm text-gray-500 mt-1">El correo electrónico no se puede cambiar</p>
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" name="phone" value={profile.phone || ""} onChange={handleInputChange} />
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="address">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Mis Direcciones</h2>

            {profile.addresses && profile.addresses.length > 0 ? (
              <div className="space-y-4">
                {profile.addresses.map((address, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <p className="font-medium">{address.street}</p>
                    <p className="text-gray-600">
                      {address.city}, {address.postalCode}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-500">
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No tienes direcciones guardadas</p>
            )}

            <Button className="mt-4">Agregar Nueva Dirección</Button>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Cambiar Contraseña</h2>

            <form className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input id="confirmPassword" type="password" />
              </div>

              <Button type="submit">Cambiar Contraseña</Button>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

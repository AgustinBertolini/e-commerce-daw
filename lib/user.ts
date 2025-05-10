import type { UserProfile } from "@/types"
import { getCurrentUser } from "./auth"

export async function getUserProfile(): Promise<UserProfile> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Usuario no autenticado")
  }

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 400))

  return Promise.resolve(user)
}

export async function updateUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Usuario no autenticado")
  }

  // Actualizar campos
  const updatedUser: UserProfile = {
    ...user,
    name: profileData.name !== undefined ? profileData.name : user.name,
    lastName: profileData.lastName !== undefined ? profileData.lastName : user.lastName,
    phone: profileData.phone !== undefined ? profileData.phone : user.phone,
    // No permitir cambiar email o password aquí
  }

  // En una aplicación real, aquí se enviaría al backend

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 600))

  return Promise.resolve(updatedUser)
}

import type { UserProfile } from "@/types";
import api from "@/lib/api";
import { getCurrentUserId } from "./auth";
import Cookies from "js-cookie";

export async function getUserProfile(): Promise<any> {
  const userId = Cookies.get("userId");
  if (!userId) {
    throw new Error("Usuario no autenticado");
  }
  return getUserById(userId);
}

export async function updateUserProfile(
  profileData: Partial<UserProfile>
): Promise<UserProfile> {
  const user = await getCurrentUserId();

  if (!user) {
    throw new Error("Usuario no autenticado");
  }

  // Enviar los datos modificados del usuario a api.usuarios.update.
  const updated = await api.usuarios.update(user, profileData);

  return updated;
}

export async function getUserById(userId: string) {
  return api.usuarios.getById(userId);
}

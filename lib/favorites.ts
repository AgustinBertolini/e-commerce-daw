import api from "@/lib/api";
import Cookies from "js-cookie";

export async function getFavorites() {
  const userId = Cookies.get("userId");
  if (!userId) throw new Error("Usuario no autenticado");
  // Trae todos los favoritos del usuario desde la API
  const favoritos = await api.favoritos.getAll();
  // Filtra por usuario actual (si el endpoint no lo hace ya)
  return favoritos;
}

export async function addFavorite(productId: string) {
  const userId = Cookies.get("userId");
  if (!userId) throw new Error("Usuario no autenticado");
  return api.favoritos.create({ producto: productId, usuario: userId });
}

export async function removeFavorite(favoriteId: string) {
  return api.favoritos.delete(favoriteId);
}

export async function isFavorite(productId: string) {
  const favoritos = await getFavorites();

  return favoritos.some((fav: any) => fav.producto._id === productId);
}

export async function removeFavoriteByProduct(productId: string) {
  const favoritos = await getFavorites();
  const fav = favoritos.find((f: any) => f.producto._id === productId);
  if (!fav) throw new Error("Favorito no encontrado");
  return removeFavorite(fav._id);
}

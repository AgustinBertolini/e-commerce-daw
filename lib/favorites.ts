import type { Product } from "@/types"
import { getProductById } from "./products"

// Favoritos de ejemplo
let favoriteIds: string[] = ["2", "4", "7"]

export async function getFavorites(): Promise<Product[]> {
  const favorites: Product[] = []

  for (const id of favoriteIds) {
    const product = await getProductById(id)
    if (product) {
      favorites.push(product)
    }
  }

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 400))

  return Promise.resolve(favorites)
}

export async function addFavorite(productId: string): Promise<void> {
  // Verificar si el producto existe
  const product = await getProductById(productId)
  if (!product) {
    throw new Error("Producto no encontrado")
  }

  // Verificar si ya está en favoritos
  if (!favoriteIds.includes(productId)) {
    favoriteIds.push(productId)
  }

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Promise.resolve()
}

export async function removeFavorite(productId: string): Promise<void> {
  favoriteIds = favoriteIds.filter((id) => id !== productId)

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 200))

  return Promise.resolve()
}

export async function isFavorite(productId: string): Promise<boolean> {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 100))

  return Promise.resolve(favoriteIds.includes(productId))
}

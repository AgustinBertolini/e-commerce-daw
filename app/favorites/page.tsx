"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/product-card"
import { getFavorites, removeFavorite } from "@/lib/favorites"
import type { Product } from "@/types"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favs = await getFavorites()
        setFavorites(favs)
      } catch (error) {
        console.error("Error loading favorites:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [])

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await removeFavorite(productId)
      setFavorites(favorites.filter((product) => product.id !== productId))
    } catch (error) {
      console.error("Error removing favorite:", error)
    }
  }

  if (loading) {
    return <div className="container mx-auto py-12 text-center">Cargando favoritos...</div>
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No tienes productos favoritos</h1>
        <p className="mb-6">Agrega productos a tus favoritos para verlos aquí</p>
        <Link href="/products">
          <Button>Ver productos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Favoritos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {favorites.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isFavorite={true}
            onRemoveFavorite={() => handleRemoveFavorite(product.id)}
          />
        ))}
      </div>
    </div>
  )
}

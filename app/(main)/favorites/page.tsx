"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { getFavorites, removeFavorite } from "@/lib/favorites";
import type { Product } from "@/types";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favs = await getFavorites();
        setFavorites(favs);
        console.log("Favorites loaded:", favs);
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };
    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await removeFavorite(productId);
      setFavorites(favorites.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        Cargando favoritos...
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">
          No tienes productos favoritos
        </h1>
        <p className="mb-6">
          Agrega productos a tus favoritos para verlos aquí
        </p>
        <Link href="/products">
          <Button>Ver productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Favoritos</h1>
      {favorites.length === 0 ? (
        <div className="text-center text-gray-500">
          No tienes productos favoritos.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="bg-white rounded-lg shadow p-4 flex flex-col"
            >
              <ProductCard
                product={{
                  _id: fav.producto._id,
                  name: fav.producto.nombre,
                  description: fav.producto.descripcion,
                  precio: fav.producto.precio,
                  stock: fav.producto.stock,
                  category: fav.producto.categoria,
                  gender: fav.producto.genero,
                  image: fav.producto.imagen,
                  userId: fav.producto.usuario,
                  createdAt: fav.producto.fechaCreacion,
                }}
                isFavorite={true}
                onRemoveFavorite={() => handleRemoveFavorite(fav._id)}
              />
              <div className="mt-2 text-xs text-gray-500">
                Agregado:{" "}
                {fav.fechaCreacion
                  ? new Date(fav.fechaCreacion).toLocaleDateString()
                  : "-"}
              </div>
              <Button
                onClick={() => handleRemoveFavorite(fav._id)}
                variant="destructive"
                className="mt-2"
              >
                Eliminar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

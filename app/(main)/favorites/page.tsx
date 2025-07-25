"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";
import { getFavorites, removeFavorite } from "@/lib/favorites";
import type { Product } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const favs = await getFavorites();
        favs.sort((a, b) => {
          const dateA = new Date(a.fechaCreacion).getTime();
          const dateB = new Date(b.fechaCreacion).getTime();
          return dateB - dateA;
        });
        setFavorites(favs);
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
    return <LoadingSpinner message="Cargando favoritos..." />;
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col hover:shadow-2xl transition-shadow duration-200 border border-gray-100 relative group"
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
                  imagenBase64: fav.producto?.imagenBase64,
                  userId: fav.producto.usuario,
                  createdAt: fav.producto.fechaCreacion,
                }}
                isFavorite={true}
                onRemoveFavorite={() => handleRemoveFavorite(fav._id)}
              />
              <div className="flex items-center justify-between mt-3 text-xs text-gray-500 px-1">
                <span>
                  Agregado:{" "}
                  {fav.fechaCreacion
                    ? new Date(fav.fechaCreacion).toLocaleDateString("es-AR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "-"}
                </span>
                <Button
                  onClick={() => handleRemoveFavorite(fav._id)}
                  variant="ghost"
                  size="icon"
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  aria-label="Eliminar de favoritos"
                >
                  <span className="sr-only">Eliminar</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

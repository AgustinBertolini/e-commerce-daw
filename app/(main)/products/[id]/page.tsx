"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { getProductById } from "@/lib/products";
import { isFavorite, addFavorite, removeFavorite } from "@/lib/favorites";
import AddToCartForm from "@/components/add-to-cart-form";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const productData = await getProductById(params.id);
        setProduct(productData);

        // Verificar si está en favoritos
        if (productData) {
          const favStatus = await isFavorite(productData.id);
          setIsFav(favStatus);
        }
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  const handleToggleFavorite = async () => {
    if (!product) return;

    try {
      if (isFav) {
        await removeFavorite(product.id);
        setIsFav(false);
      } else {
        await addFavorite(product.id);
        setIsFav(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        Cargando producto...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <Image
            src={product.image || "/placeholder.svg?height=400&width=400"}
            alt={product.name}
            width={400}
            height={400}
            className="rounded-lg object-cover"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-2xl font-bold text-yellow-600">
            ${product.price.toFixed(2)}
          </p>

          <div className="border-t border-b py-4 my-4">
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div className="space-y-2">
            <p>
              <span className="font-semibold">Categoría:</span>{" "}
              {product.category}
            </p>
            {product.gender && (
              <p>
                <span className="font-semibold">Género:</span> {product.gender}
              </p>
            )}
            <p>
              <span className="font-semibold">Disponible:</span>{" "}
              {product.stock > 0 ? "En stock" : "Agotado"}
            </p>
          </div>

          <AddToCartForm product={product} />

          <Button
            variant="outline"
            className={`w-full mt-4 ${isFav ? "text-red-500" : ""}`}
            onClick={handleToggleFavorite}
          >
            <Heart
              className="mr-2 h-4 w-4"
              fill={isFav ? "currentColor" : "none"}
            />
            {isFav ? "Quitar de Favoritos" : "Agregar a Favoritos"}
          </Button>
        </div>
      </div>
    </div>
  );
}

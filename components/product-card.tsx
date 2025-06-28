"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types";
import {
  addFavorite,
  removeFavoriteByProduct,
  isFavorite,
} from "@/lib/favorites";
import { useCartStore } from "@/lib/cart-store";

interface ProductCardProps {
  product: Product;
  isFavorite?: boolean;
  onRemoveFavorite?: () => void;
}

export default function ProductCard({
  product,
  isFavorite: initialIsFavorite,
  onRemoveFavorite,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showQuantity, setShowQuantity] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFav, setIsFav] = useState(initialIsFavorite || false);

  // Verificar si el producto está en favoritos al cargar SOLO en cliente
  useEffect(() => {
    let ignore = false;
    const checkFavorite = async () => {
      if (initialIsFavorite === undefined) {
        const result = await isFavorite(product._id);
        if (!ignore) setIsFav(result);
      }
    };
    if (typeof window !== "undefined") {
      checkFavorite();
    }
    return () => {
      ignore = true;
    };
  }, [initialIsFavorite, product._id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock <= 0) return;

    try {
      setIsAddingToCart(true);
      useCartStore.getState().addToCart(product, quantity); // Pasar la cantidad seleccionada
      setAddedToCart(true);
      setTimeout(() => {
        setAddedToCart(false);
        setShowQuantity(false);
      }, 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFav) {
        await removeFavoriteByProduct(product._id);
        setIsFav(false);
        if (onRemoveFavorite) onRemoveFavorite();
      } else {
        await addFavorite(product._id);
        setIsFav(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };
  console.log(product);
  return (
    <Card className="overflow-hidden">
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-square  overflow-hidden">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.nombre || product.name}
            fill
            className="object-fit transition-transform hover:scale-125"
          />
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <Badge variant="outline" className="bg-white">
                Agotado
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4 mt-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-medium line-clamp-1 hover:text-yellow-600">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500">
          {product.categoria?.nombre || product.category?.nombre}
        </p>
        <p className="font-bold text-lg mt-1">
          ${product.precio.toLocaleString("es-AR")}
        </p>
        {product.stock > 0 ? (
          <p className="text-sm text-gray-500">
            Stock disponible:{" "}
            <span className="font-medium">{product.stock}</span>
          </p>
        ) : (
          <p className="text-sm text-gray-500">Sin stock</p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        {showQuantity && product.stock > 0 ? (
          <div className="w-full space-y-2">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="h-8 mx-1 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                size="sm"
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock <= 0}
              >
                {isAddingToCart
                  ? "Agregando..."
                  : addedToCart
                  ? "¡Agregado!"
                  : `Agregar ${quantity > 1 ? `(${quantity})` : ""}`}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowQuantity(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full gap-2 items-center">
            <Button
              className="flex-1"
              size="sm"
              disabled={product.stock <= 0}
              onClick={() => setShowQuantity(true)}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Agregar
            </Button>
            <Button
              variant={"ghost"}
              aria-label={isFav ? "Quitar de favoritos" : "Agregar a favoritos"}
              onClick={handleToggleFavorite}
              disabled={isFav === undefined}
              size="icon"
              className="ml-2"
            >
              <Heart
                className={isFav ? "text-red-500" : "text-gray-400"}
                fill={isFav ? "#ef4444" : "none"}
                stroke={isFav ? "#ef4444" : "currentColor"}
              />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

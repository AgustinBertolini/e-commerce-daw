"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import { addToCart } from "@/lib/cart";

interface AddToCartFormProps {
  product: Product;
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value);
     if (value > product.stock) return;
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (product.stock <= 0) return;

    try {
      setLoading(true);
      if (typeof window !== "undefined") {
        const { useCartStore } = require("@/lib/cart-store");
        useCartStore.getState().addToCart(product, quantity);
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={decreaseQuantity}
          disabled={quantity <= 1 || product.stock <= 0}
        >
          -
        </Button>
        <Input
          type="number"
          min="1"
          max={product.stock}
          value={quantity}
          onChange={handleQuantityChange}
          className="w-16 mx-2 text-center"
          disabled={product.stock <= 0}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={increaseQuantity}
          disabled={product.stock <= 0 || quantity >= product.stock}
        >
          +
        </Button>
      </div>

      <Button
        className="w-full"
        onClick={handleAddToCart}
        disabled={loading || product.stock <= 0}
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {loading
          ? "Agregando..."
          : success
          ? "¡Agregado al carrito!"
          : "Agregar al Carrito"}
      </Button>

      {product.stock <= 0 && (
        <p className="text-red-500 text-sm">Producto agotado</p>
      )}
    </div>
  );
}

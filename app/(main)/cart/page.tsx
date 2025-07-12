"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CartPage() {
  const {
    items,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore();
  const cartItems = items;
  const loading = false; // Zustand es síncrono, así que no hay loading salvo que quieras simularlo

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.precio * item.quantity,
      0
    );
  };

  if (loading) {
    return <LoadingSpinner message="Cargando carrito..." />;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="mb-6">
          ¿No sabes qué comprar? ¡Miles de productos te esperan!
        </p>
        <Link href="/products">
          <Button>Ver productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-xl font-semibold">Productos</h2>
            </div>
            <div className="divide-y">
              {cartItems.map((item) => (
                <div
                  key={item.product._id}
                  className="p-4 flex flex-col sm:flex-row items-center gap-4"
                >
                  <div className="w-24 h-24 flex-shrink-0">
                    <Image
                      src={
                        item.product.imagenBase64 ||
                        "/placeholder.svg?height=96&width=96"
                      }
                      alt={item.product.nombre}
                      width={96}
                      height={96}
                      className="rounded object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.product.nombre}</h3>
                    <p className="text-gray-600 text-sm">
                      ${item.product.precio.toLocaleString("es-AR")} c/u
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => decreaseQuantity(item.product._id)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = Number.parseInt(e.target.value) || 1;
                        if (val > item.product.stock) return;
                        if (val > 0) {
                          // Ajusta cantidad manualmente
                          const diff = val - item.quantity;
                          if (diff > 0) {
                            for (let i = 0; i < diff; i++)
                              increaseQuantity(item.product._id);
                          } else if (diff < 0) {
                            for (let i = 0; i < Math.abs(diff); i++)
                              decreaseQuantity(item.product._id);
                          }
                        }
                      }}
                      className="w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => increaseQuantity(item.product._id)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </Button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-medium">
                      $
                      {(item.product.precio * item.quantity).toLocaleString(
                        "es-AR"
                      )}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 mt-1"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Resumen de compra</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotal().toLocaleString("es-AR")}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="border-t pt-2 mt-2 font-bold text-lg flex justify-between">
                <span>Total</span>
                <span>${calculateTotal().toLocaleString("es-AR")}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button className="w-full">Finalizar Compra</Button>
            </Link>
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={clearCart}
            >
              Vaciar Carrito
            </Button>
            <Link href="/products">
              <Button variant="outline" className="w-full mt-2">
                Seguir Comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

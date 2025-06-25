"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const cartItems = useCartStore((state) => state.items);

  // No loading ni purchase, solo mockup con el store
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">
          No hay productos en tu compra
        </h1>
        <Link href="/products">
          <Button>Ver productos</Button>
        </Link>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.precio * item.quantity,
    0
  );
  const total = subtotal; // Envío gratis
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-2">¡Compra Exitosa!</h1>
        <p className="text-gray-600 mb-6">
          Tu pedido ha sido procesado correctamente. Gracias por tu compra.
        </p>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="font-medium">
            Número de orden: <span className="text-yellow-600">demo</span>
          </p>
          <p className="text-sm text-gray-600">
            Fecha:{" "}
            {new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Estado: <span className="font-medium">En procesamiento</span>
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <p className="font-medium">Resumen de compra:</p>
          <div className="text-sm">
            <div className="flex justify-between font-medium border-b pb-2">
              <span>Productos ({totalItems})</span>
              <span>${subtotal.toLocaleString("es-AR")}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${total.toLocaleString("es-AR")}</span>
            </div>
          </div>
          <div className="mt-4">
            <ul className="divide-y">
              {cartItems.map((item) => (
                <li
                  key={item.product._id}
                  className="flex items-center justify-between py-2"
                >
                  <span>
                    {item.product.nombre || item.product.name} x {item.quantity}
                  </span>
                  <span>
                    $
                    {(item.product.precio * item.quantity).toLocaleString(
                      "es-AR"
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/purchases">
            <Button variant="outline">Ver mis compras</Button>
          </Link>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

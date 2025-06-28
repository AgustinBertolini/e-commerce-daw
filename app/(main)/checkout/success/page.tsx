"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import api from "@/lib/api";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [purchase, setPurchase] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const fetchPurchase = async () => {
      try {
        const compra = await api.compras.getById(orderId);

        setPurchase(compra);
      } catch (error) {
        setPurchase(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPurchase();
  }, [orderId]);

  if (!orderId) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No se encontró la orden</h1>
        <Link href="/products">
          <Button>Ver productos</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Cargando compra...</h1>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No se encontró la compra</h1>
        <Link href="/products">
          <Button>Ver productos</Button>
        </Link>
      </div>
    );
  }

  // Adaptar a la estructura real del backend
  const productos = purchase.productos || [];
  const subtotal = productos.reduce(
    (sum: number, item: any) =>
      sum + (item.producto?.precio ?? 0) * (item.cantidad ?? 1),
    0
  );
  const total = purchase.total ?? subtotal;
  const totalItems = productos.reduce(
    (sum: number, item: any) => sum + (item.cantidad ?? 1),
    0
  );

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
            Número de orden:{" "}
            <span className="text-yellow-600">
              {purchase.id || purchase._id || orderId}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Fecha:{" "}
            {purchase.fechaCreacion
              ? new Date(purchase.fechaCreacion).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-"}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Estado:{" "}
            <span className="font-medium">
              {purchase.status || "En procesamiento"}
            </span>
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
              <span>
                {purchase.shipping === 0
                  ? "Gratis"
                  : `${purchase.shipping?.toLocaleString("es-AR") ?? "-"}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${total.toLocaleString("es-AR")}</span>
            </div>
          </div>
          <div className="mt-4">
            <ul className="divide-y">
              {purchase.items?.map((item: any) => (
                <li
                  key={item.productId || item.producto || item.id}
                  className="flex items-center justify-between py-2"
                >
                  <span>
                    {(item.name ||
                      item.nombre ||
                      (item.product &&
                        (item.product.name || item.product.nombre)) ||
                      "Producto") +
                      " x " +
                      (item.quantity ?? item.cantidad ?? 1)}
                  </span>
                  <span>
                    $
                    {(
                      (item.price ??
                        item.precio ??
                        ((item.product &&
                          (item.product.price ?? item.product.precio)) ||
                          0)) * (item.quantity ?? item.cantidad ?? 1)
                    ).toLocaleString("es-AR")}
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

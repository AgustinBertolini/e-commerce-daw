"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import type { Purchase } from "@/types";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const purchaseHistory = await api.compras.getAll();
        setPurchases(purchaseHistory);
      } catch (error) {
        console.error("Error loading purchases:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPurchases();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString || Date.now());
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pendiente":
        return <Badge variant="success">Completado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Solo mostrar el spinner mientras loading es true o el componente no está montado
  if (loading || !mounted) {
    return <LoadingSpinner message="Cargando compras..." />;
  }

  if (!purchases || purchases.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">
          No tienes compras realizadas
        </h1>
        <p className="mb-6">
          Realiza tu primera compra para ver el historial aquí
        </p>
        <Link href="/products">
          <Button>Ver productos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Mis Compras</h1>
      <div className="space-y-4">
        {purchases.map((purchase) => {
          // Adaptar a la estructura real del backend
          const productos = purchase.productos || [];
          const subtotal = productos.reduce(
            (sum, item) =>
              sum + (item.producto?.precio ?? 0) * (item.cantidad ?? 1),
            0
          );
          return (
            <div
              key={purchase._id || purchase.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <p className="font-medium">
                    {formatDate(purchase.fechaCreacion || purchase.date)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(purchase.estado || purchase.status)}
                  <span className="font-bold">
                    ${purchase.total?.toLocaleString("es-AR") ?? "-"}
                  </span>
                </div>
              </div>
              <Accordion type="single" collapsible>
                <AccordionItem value={String(purchase._id || purchase.id)}>
                  <AccordionTrigger className="px-4">
                    Ver detalles de la compra
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-4 pb-4 space-y-4">
                      <div className="divide-y">
                        {productos.length === 0 ? (
                          <div className="py-3 text-center text-gray-500">
                            No hay productos en esta compra
                          </div>
                        ) : (
                          productos.map((item: any) => (
                            <div
                              key={item._id}
                              className="py-3 flex items-center gap-3"
                            >
                              <div className="w-16 h-16 flex-shrink-0">
                                <Image
                                  src={
                                    item.producto?.image ||
                                    "/placeholder.svg?height=64&width=64"
                                  }
                                  alt={item.producto?.nombre || "Producto"}
                                  width={64}
                                  height={64}
                                  className="rounded object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex-grow">
                                <Link href={`/products/${item.producto?._id}`}>
                                  <p className="font-medium hover:text-yellow-600">
                                    {item.producto?.nombre || "Producto"}
                                  </p>
                                </Link>
                                <p className="text-sm text-gray-500">
                                  Cantidad: {item.cantidad ?? 1}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">
                                  $
                                  {(
                                    item.producto?.precio ??
                                    0 * (item.cantidad ?? 1)
                                  ).toLocaleString("es-AR")}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>${subtotal.toLocaleString("es-AR")}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Envío</span>
                          <span>
                            ${(purchase.envio ?? 0).toLocaleString("es-AR")}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold mt-2">
                          <span>Total</span>
                          <span>
                            ${purchase.total?.toLocaleString("es-AR") ?? "-"}
                          </span>
                        </div>
                      </div>
                      {purchase.estado === "completed" && (
                        <Button variant="outline" size="sm">
                          Comprar de nuevo
                        </Button>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
import { getPurchases } from "@/lib/purchases";
import type { Purchase } from "@/types";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        const purchaseHistory = await getPurchases();
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
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completado</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500">Procesando</Badge>;
      case "shipped":
        return <Badge className="bg-blue-500">Enviado</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center">
        Cargando compras...
      </div>
    );
  }

  if (purchases.length === 0) {
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
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <p className="text-sm text-gray-500">Orden #{purchase.id}</p>
                <p className="font-medium">{formatDate(purchase.date)}</p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(purchase.status)}
                <span className="font-bold">${purchase.total.toFixed(2)}</span>
              </div>
            </div>

            <Accordion type="single" collapsible>
              <AccordionItem value={purchase.id}>
                <AccordionTrigger className="px-4">
                  Ver detalles de la compra
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-4 pb-4 space-y-4">
                    <div className="divide-y">
                      {purchase.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-3 flex items-center gap-3"
                        >
                          <div className="w-16 h-16 flex-shrink-0">
                            <Image
                              src={
                                item.image ||
                                "/placeholder.svg?height=64&width=64"
                              }
                              alt={item.name}
                              width={64}
                              height={64}
                              className="rounded object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-grow">
                            <Link href={`/products/${item.productId}`}>
                              <p className="font-medium hover:text-yellow-600">
                                {item.name}
                              </p>
                            </Link>
                            <p className="text-sm text-gray-500">
                              Cantidad: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              ${(item.precio * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${purchase.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Envío</span>
                        <span>${purchase.shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold mt-2">
                        <span>Total</span>
                        <span>${purchase.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {purchase.status === "completed" && (
                      <Button variant="outline" size="sm">
                        Comprar de nuevo
                      </Button>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  );
}

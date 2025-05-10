"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { getPurchaseById } from "@/lib/purchases"
import type { Purchase } from "@/types"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [purchase, setPurchase] = useState<Purchase | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPurchase = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      try {
        const purchaseData = await getPurchaseById(orderId)
        setPurchase(purchaseData)
      } catch (error) {
        console.error("Error loading purchase:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPurchase()
  }, [orderId])

  if (loading) {
    return <div className="container mx-auto py-12 text-center">Cargando...</div>
  }

  if (!orderId || !purchase) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Información de compra no disponible</h1>
        <p className="mb-6">No pudimos encontrar la información de tu compra</p>
        <Link href="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 max-w-2xl">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-2">¡Compra Exitosa!</h1>
        <p className="text-gray-600 mb-6">Tu pedido ha sido procesado correctamente. Gracias por tu compra.</p>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="font-medium">
            Número de orden: <span className="text-yellow-600">{purchase.id}</span>
          </p>
          <p className="text-sm text-gray-600">
            Fecha:{" "}
            {new Date(purchase.date).toLocaleDateString("es-ES", {
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
              <span>Productos ({purchase.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
              <span>${purchase.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>${purchase.total.toFixed(2)}</span>
            </div>
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
  )
}

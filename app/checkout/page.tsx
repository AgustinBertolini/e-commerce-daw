"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCart } from "@/lib/cart"
import type { CartItem } from "@/types"
import { processPayment } from "@/lib/payment"

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState("mercadopago")
  const [processingPayment, setProcessingPayment] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cart = await getCart()
        setCartItems(cart)
      } catch (error) {
        console.error("Error loading cart:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [])

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handlePayment = async () => {
    try {
      setError("")
      setProcessingPayment(true)
      const result = await processPayment(cartItems, paymentMethod)

      // Redirigir a la página de confirmación de compra
      router.push(`/checkout/success?orderId=${result.orderId}`)
    } catch (error) {
      console.error("Error processing payment:", error)
      setError("Hubo un error al procesar el pago. Por favor intenta nuevamente.")
    } finally {
      setProcessingPayment(false)
    }
  }

  if (loading) {
    return <div className="container mx-auto py-12 text-center">Cargando...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">No hay productos en tu carrito</h1>
        <Button onClick={() => (window.location.href = "/products")}>Ver productos</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Finalizar Compra</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Información de Envío</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Nombre</Label>
                <Input id="firstName" placeholder="Tu nombre" />
              </div>
              <div>
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" placeholder="Tu apellido" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" placeholder="Calle y número" />
              </div>
              <div>
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" placeholder="Ciudad" />
              </div>
              <div>
                <Label htmlFor="postalCode">Código Postal</Label>
                <Input id="postalCode" placeholder="Código postal" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" placeholder="Tu número de teléfono" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Método de Pago</h2>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 p-2 rounded border mb-2">
                <RadioGroupItem value="mercadopago" id="mercadopago" />
                <Label htmlFor="mercadopago" className="flex items-center">
                  <Image
                    src="/placeholder.svg?height=30&width=100"
                    alt="MercadoPago"
                    width={100}
                    height={30}
                    className="ml-2"
                  />
                  <span className="ml-2">MercadoPago</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Resumen de compra</h2>

            <div className="max-h-60 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 py-2 border-b">
                  <div className="w-12 h-12 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg?height=48&width=48"}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="rounded object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="border-t pt-2 mt-2 font-bold text-lg flex justify-between">
                <span>Total</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full" onClick={handlePayment} disabled={processingPayment}>
              {processingPayment ? "Procesando..." : "Pagar con MercadoPago"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

import type { CartItem } from "@/types"
import { clearCart } from "./cart"
import { savePurchase } from "./purchases"

export async function processPayment(
  items: CartItem[],
  paymentMethod: string,
): Promise<{ success: boolean; orderId: string }> {
  // Verificar que hay items
  if (items.length === 0) {
    throw new Error("No hay productos en el carrito")
  }

  // Calcular total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Simular procesamiento de pago
  // En una aplicación real, aquí se integraría con MercadoPago u otro proveedor

  // Simular retraso de red (procesamiento de pago)
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Generar ID de orden
  const orderId = `ORD-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`

  // Guardar la compra en el historial del usuario
  await savePurchase({
    id: orderId,
    date: new Date().toISOString(),
    status: "processing",
    items: items.map((item) => ({
      id: item.id,
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    subtotal: total,
    shipping: 0,
    total: total,
  })

  // Limpiar carrito después de pago exitoso
  await clearCart()

  return Promise.resolve({
    success: true,
    orderId,
  })
}

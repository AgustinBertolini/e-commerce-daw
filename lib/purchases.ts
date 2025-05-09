// Simulación de compras para fines de demostración
// En una aplicación real, esto se conectaría a un backend o base de datos

import type { Purchase } from "@/types"

// Compras de ejemplo
const samplePurchases: Purchase[] = [
  {
    id: "ORD-001",
    date: "2023-05-15T10:30:00Z",
    status: "completed",
    items: [
      {
        id: "1",
        productId: "1",
        name: "Smartphone XYZ",
        price: 599.99,
        quantity: 1,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: "3",
        productId: "3",
        name: "Camiseta Casual",
        price: 24.99,
        quantity: 2,
        image: "/placeholder.svg?height=64&width=64",
      },
    ],
    subtotal: 649.97,
    shipping: 0,
    total: 649.97,
  },
  {
    id: "ORD-002",
    date: "2023-06-20T14:45:00Z",
    status: "shipped",
    items: [
      {
        id: "5",
        productId: "5",
        name: "Auriculares Inalámbricos",
        price: 149.99,
        quantity: 1,
        image: "/placeholder.svg?height=64&width=64",
      },
    ],
    subtotal: 149.99,
    shipping: 0,
    total: 149.99,
  },
  {
    id: "ORD-003",
    date: "2023-07-05T09:15:00Z",
    status: "processing",
    items: [
      {
        id: "2",
        productId: "2",
        name: "Laptop Pro",
        price: 1299.99,
        quantity: 1,
        image: "/placeholder.svg?height=64&width=64",
      },
      {
        id: "8",
        productId: "8",
        name: "Reloj Inteligente",
        price: 199.99,
        quantity: 1,
        image: "/placeholder.svg?height=64&width=64",
      },
    ],
    subtotal: 1499.98,
    shipping: 0,
    total: 1499.98,
  },
]

export async function getPurchases(): Promise<Purchase[]> {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500))

  return Promise.resolve([...samplePurchases])
}

export async function getPurchaseById(id: string): Promise<Purchase | null> {
  const purchase = samplePurchases.find((p) => p.id === id) || null

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Promise.resolve(purchase)
}

// Nueva función para guardar una compra
export async function savePurchase(purchase: Purchase): Promise<Purchase> {
  // Agregar la compra al inicio del array para que aparezca primero en el historial
  samplePurchases.unshift(purchase)

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 400))

  return Promise.resolve(purchase)
}

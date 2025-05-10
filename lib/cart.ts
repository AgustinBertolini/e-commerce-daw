import type { CartItem } from "@/types"
import { getProductById } from "./products"

// Carrito de ejemplo
let cartItems: CartItem[] = []

export async function getCart(): Promise<CartItem[]> {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Promise.resolve([...cartItems])
}

export async function addToCart(productId: string, quantity: number): Promise<void> {
  // Verificar si el producto existe
  const product = await getProductById(productId)
  if (!product) {
    throw new Error("Producto no encontrado")
  }

  // Verificar stock
  if (product.stock < quantity) {
    throw new Error("No hay suficiente stock disponible")
  }

  // Verificar si el producto ya está en el carrito
  const existingItemIndex = cartItems.findIndex((item) => item.id === productId)

  if (existingItemIndex !== -1) {
    // Actualizar cantidad
    cartItems[existingItemIndex].quantity += quantity
  } else {
    // Agregar nuevo item
    cartItems.push({
      id: productId,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
    })
  }

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 400))

  return Promise.resolve()
}

export async function updateCartItem(itemId: string, quantity: number): Promise<void> {
  const itemIndex = cartItems.findIndex((item) => item.id === itemId)

  if (itemIndex === -1) {
    throw new Error("Item no encontrado en el carrito")
  }

  // Verificar stock
  const product = await getProductById(itemId)
  if (!product || product.stock < quantity) {
    throw new Error("No hay suficiente stock disponible")
  }

  cartItems[itemIndex].quantity = quantity

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Promise.resolve()
}

export async function removeCartItem(itemId: string): Promise<void> {
  cartItems = cartItems.filter((item) => item.id !== itemId)

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 200))

  return Promise.resolve()
}

export async function clearCart(): Promise<void> {
  cartItems = []

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 200))

  return Promise.resolve()
}
// Inicializar con algunos items para demostración
;(async () => {
  try {
    const product1 = await getProductById("1")
    const product2 = await getProductById("3")

    if (product1 && product2) {
      cartItems = [
        {
          id: product1.id,
          name: product1.name,
          price: product1.price,
          quantity: 1,
          image: product1.image,
        },
        {
          id: product2.id,
          name: product2.name,
          price: product2.price,
          quantity: 2,
          image: product2.image,
        },
      ]
    }
  } catch (error) {
    console.error("Error initializing cart:", error)
  }
})()

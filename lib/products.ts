// Simulación de productos para fines de demostración
// En una aplicación real, esto se conectaría a un backend o base de datos

import type { Product } from "@/types"

// Datos de ejemplo
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Smartphone XYZ",
    description: "El último smartphone con características avanzadas y pantalla de alta resolución.",
    price: 599.99,
    stock: 50,
    category: "electronics",
    image: "/placeholder.svg?height=300&width=300",
    userId: "1",
  },
  {
    id: "2",
    name: "Laptop Pro",
    description: "Potente laptop para profesionales y gamers con procesador de última generación.",
    price: 1299.99,
    stock: 20,
    category: "electronics",
    image: "/placeholder.svg?height=300&width=300",
    userId: "1",
  },
  {
    id: "3",
    name: "Camiseta Casual",
    description: "Camiseta de algodón de alta calidad, perfecta para el uso diario.",
    price: 24.99,
    stock: 100,
    category: "clothing",
    gender: "unisex",
    image: "/placeholder.svg?height=300&width=300",
    userId: "1",
  },
  {
    id: "4",
    name: "Zapatillas Deportivas",
    description: "Zapatillas cómodas y duraderas para actividades deportivas.",
    price: 89.99,
    stock: 30,
    category: "sports",
    gender: "unisex",
    image: "/placeholder.svg?height=300&width=300",
    userId: "1",
  },
  {
    id: "5",
    name: "Auriculares Inalámbricos",
    description: "Auriculares con cancelación de ruido y larga duración de batería.",
    price: 149.99,
    stock: 40,
    category: "electronics",
    image: "/placeholder.svg?height=300&width=300",
    userId: "1",
  },
  {
    id: "6",
    name: "Libro de Cocina",
    description: "Recetas fáciles y deliciosas para toda la familia.",
    price: 34.99,
    stock: 25,
    category: "books",
    image: "/placeholder.svg?height=300&width=300",
    userId: "1",
  },
  {
    id: "7",
    name: "Set de Sartenes",
    description: "Juego de sartenes antiadherentes de alta calidad.",
    price: 79.99,
    stock: 15,
    category: "home",
    image: "/placeholder.svg?height=300&width=300",
    userId: "1",
  },
  {
    id: "8",
    name: "Reloj Inteligente",
    description: "Monitorea tu actividad física y recibe notificaciones en tu muñeca.",
    price: 199.99,
    stock: 35,
    category: "electronics",
    image: "/placeholder.svg?height=300&width=300",
    userId: "1",
  },
]

// Clonar productos para tener más datos
for (let i = 9; i <= 20; i++) {
  const original = sampleProducts[Math.floor(Math.random() * 8)]
  sampleProducts.push({
    ...original,
    id: i.toString(),
    name: `${original.name} ${i}`,
    price: Math.round(original.price * (0.8 + Math.random() * 0.4) * 100) / 100,
    stock: Math.floor(Math.random() * 50) + 1,
  })
}

// Funciones para manipular productos
export async function getAllProducts(): Promise<Product[]> {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500))

  return Promise.resolve([...sampleProducts])
}

export async function getRecentProducts(limit = 4): Promise<Product[]> {
  // Simular productos recientes (últimos agregados)
  const recent = [...sampleProducts].sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id)).slice(0, limit)

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Promise.resolve(recent)
}

export async function getRandomProducts(limit = 10): Promise<Product[]> {
  // Mezclar productos y tomar los primeros 'limit'
  const shuffled = [...sampleProducts].sort(() => 0.5 - Math.random()).slice(0, limit)

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Promise.resolve(shuffled)
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = sampleProducts.find((p) => p.id === id) || null

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 200))

  return Promise.resolve(product)
}

export async function getUserProducts(userId = "1"): Promise<Product[]> {
  const products = sampleProducts.filter((p) => p.userId === userId)

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 400))

  return Promise.resolve(products)
}

export async function createProduct(productData: any): Promise<Product> {
  const newProduct: Product = {
    id: (sampleProducts.length + 1).toString(),
    name: productData.name,
    description: productData.description,
    price: productData.price,
    stock: productData.stock,
    category: productData.category,
    gender: productData.gender || undefined,
    image: productData.image || undefined,
    userId: "1", // Usuario actual
  }

  sampleProducts.push(newProduct)

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 600))

  return Promise.resolve(newProduct)
}

export async function updateProduct(productData: any): Promise<Product> {
  const index = sampleProducts.findIndex((p) => p.id === productData.id)

  if (index === -1) {
    throw new Error("Producto no encontrado")
  }

  const updatedProduct: Product = {
    ...sampleProducts[index],
    name: productData.name,
    description: productData.description,
    price: productData.price,
    stock: productData.stock,
    category: productData.category,
    gender: productData.gender || undefined,
    image: productData.image || undefined,
  }

  sampleProducts[index] = updatedProduct

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 600))

  return Promise.resolve(updatedProduct)
}

export async function deleteProduct(id: string): Promise<void> {
  const index = sampleProducts.findIndex((p) => p.id === id)

  if (index === -1) {
    throw new Error("Producto no encontrado")
  }

  sampleProducts.splice(index, 1)

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 400))

  return Promise.resolve()
}

// Nueva función para buscar productos
export async function searchProducts(query: string): Promise<Product[]> {
  if (!query) {
    return getAllProducts()
  }

  const normalizedQuery = query.toLowerCase().trim()

  const results = sampleProducts.filter((product) => {
    return (
      product.name.toLowerCase().includes(normalizedQuery) ||
      product.description.toLowerCase().includes(normalizedQuery) ||
      product.category.toLowerCase().includes(normalizedQuery) ||
      (product.gender && product.gender.toLowerCase().includes(normalizedQuery))
    )
  })

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 400))

  return Promise.resolve(results)
}

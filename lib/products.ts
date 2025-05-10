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
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2942&auto=format&fit=crop",
    userId: "1",
    createdAt: "2023-05-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Laptop Pro",
    description: "Potente laptop para profesionales y gamers con procesador de última generación.",
    price: 1299.99,
    stock: 20,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop",
    userId: "1",
    createdAt: "2023-06-20T14:45:00Z",
  },
  {
    id: "3",
    name: "Camiseta Casual",
    description: "Camiseta de algodón de alta calidad, perfecta para el uso diario.",
    price: 24.99,
    stock: 100,
    category: "clothing",
    gender: "unisex",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2880&auto=format&fit=crop",
    userId: "1",
    createdAt: "2023-07-05T09:15:00Z",
  },
  {
    id: "4",
    name: "Zapatillas Deportivas",
    description: "Zapatillas cómodas y duraderas para actividades deportivas.",
    price: 89.99,
    stock: 30,
    category: "sports",
    gender: "unisex",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2940&auto=format&fit=crop",
    userId: "1",
    createdAt: "2023-08-10T16:20:00Z",
  },
  {
    id: "5",
    name: "Auriculares Inalámbricos",
    description: "Auriculares con cancelación de ruido y larga duración de batería.",
    price: 149.99,
    stock: 0,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2940&auto=format&fit=crop",
    userId: "1",
    createdAt: "2023-09-15T11:30:00Z",
  },
  {
    id: "6",
    name: "Cien años de soledad",
    description: "Obra maestra de Gabriel García Márquez que narra la historia de la familia Buendía.",
    price: 34.99,
    stock: 25,
    category: "books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2874&auto=format&fit=crop",
    userId: "1",
    createdAt: "2023-10-20T13:45:00Z",
  },
  {
    id: "7",
    name: "Set de Sartenes",
    description: "Juego de sartenes antiadherentes de alta calidad.",
    price: 79.99,
    stock: 15,
    category: "home",
    image: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=2787&auto=format&fit=crop",
    userId: "1",
    createdAt: "2023-11-25T15:10:00Z",
  },
  {
    id: "8",
    name: "Reloj Inteligente",
    description: "Monitorea tu actividad física y recibe notificaciones en tu muñeca.",
    price: 199.99,
    stock: 0,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2944&auto=format&fit=crop",
    userId: "1",
    createdAt: "2023-12-30T09:20:00Z",
  },
  {
    id: "9",
    name: "El Principito",
    description: "Novela corta del escritor francés Antoine de Saint-Exupéry.",
    price: 19.99,
    stock: 40,
    category: "books",
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2788&auto=format&fit=crop",
    userId: "1",
    createdAt: "2024-01-05T10:15:00Z",
  },
  {
    id: "10",
    name: "1984",
    description: "Novela distópica de George Orwell que explora temas de totalitarismo y vigilancia.",
    price: 24.99,
    stock: 30,
    category: "books",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2798&auto=format&fit=crop",
    userId: "1",
    createdAt: "2024-01-10T14:30:00Z",
  },
  {
    id: "11",
    name: "Don Quijote de la Mancha",
    description: "Obra cumbre de Miguel de Cervantes, considerada la primera novela moderna.",
    price: 29.99,
    stock: 20,
    category: "books",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop",
    userId: "1",
    createdAt: "2024-01-15T16:45:00Z",
  },
  {
    id: "12",
    name: "Televisor 4K",
    description: "Televisor de alta definición con tecnología Smart TV.",
    price: 799.99,
    stock: 0,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=2940&auto=format&fit=crop",
    userId: "1",
    createdAt: "2024-01-20T11:20:00Z",
  },
  {
    id: "13",
    name: "Cámara Digital",
    description: "Cámara profesional con múltiples funciones y alta calidad de imagen.",
    price: 649.99,
    stock: 0,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2938&auto=format&fit=crop",
    userId: "1",
    createdAt: "2024-01-25T13:10:00Z",
  },
  {
    id: "14",
    name: "Crimen y castigo",
    description: "Novela de Fiódor Dostoyevski que explora la psicología del crimen.",
    price: 27.99,
    stock: 15,
    category: "books",
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=2876&auto=format&fit=crop",
    userId: "1",
    createdAt: "2024-01-30T15:30:00Z",
  },
  {
    id: "15",
    name: "Orgullo y prejuicio",
    description: "Novela romántica de Jane Austen sobre las relaciones sociales en la Inglaterra del siglo XIX.",
    price: 22.99,
    stock: 25,
    category: "books",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2874&auto=format&fit=crop",
    userId: "1",
    createdAt: "2024-02-05T09:45:00Z",
  },
  {
    id: "16",
    name: "Consola de Videojuegos",
    description: "La última consola con gráficos de alta definición y juegos exclusivos.",
    price: 499.99,
    stock: 0,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?q=80&w=2952&auto=format&fit=crop",
    userId: "1",
    createdAt: "2024-02-10T14:20:00Z",
  },
]

// Funciones para manipular productos
export async function getAllProducts(): Promise<Product[]> {
  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 500))

  return Promise.resolve([...sampleProducts])
}

export async function getRecentProducts(limit = 4): Promise<Product[]> {
  // Ordenar productos por fecha de creación (más recientes primero)
  const recent = [...sampleProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Promise.resolve(recent)
}

export async function getRandomProducts(limit = 10): Promise<Product[]> {
  // Ordenar productos por fecha de creación (más recientes primero)
  const recent = [...sampleProducts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)

  // Simular retraso de red
  await new Promise((resolve) => setTimeout(resolve, 300))

  return Promise.resolve(recent)
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
    image: productData.image || getRandomImageForCategory(productData.category),
    userId: "1", // Usuario actual
    createdAt: new Date().toISOString(),
  }

  sampleProducts.unshift(newProduct) // Agregar al inicio para que aparezca como reciente

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
    image: productData.image || sampleProducts[index].image,
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

// Función para obtener una imagen aleatoria según la categoría
function getRandomImageForCategory(category: string): string {
  const categoryImages: Record<string, string[]> = {
    electronics: [
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=2787&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2801&auto=format&fit=crop",
    ],
    clothing: [
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2940&auto=format&fit=crop",
    ],
    home: [
      "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=2787&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2940&auto=format&fit=crop",
    ],
    books: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2874&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=2798&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2940&auto=format&fit=crop",
    ],
    sports: [
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2835&auto=format&fit=crop",
    ],
    toys: [
      "https://images.unsplash.com/photo-1558060370-d644479cb6f7?q=80&w=2942&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=2940&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516627145497-ae6968895b40?q=80&w=2940&auto=format&fit=crop",
    ],
  }

  const defaultImages = [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2799&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?q=80&w=2940&auto=format&fit=crop",
  ]

  const images = categoryImages[category] || defaultImages
  return images[Math.floor(Math.random() * images.length)]
}

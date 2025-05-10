export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  gender?: string
  image?: string
  userId: string
  createdAt: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface PurchaseItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Purchase {
  id: string
  date: string
  status: "processing" | "shipped" | "completed" | "cancelled"
  items: PurchaseItem[]
  subtotal: number
  shipping: number
  total: number
}

export interface Address {
  street: string
  city: string
  postalCode: string
}

export interface UserProfile {
  id: string
  email: string
  name?: string
  lastName?: string
  phone?: string
  addresses?: Address[]
}

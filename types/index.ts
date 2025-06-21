export interface Product {
  _id: string;
  name: string;
  description: string;
  precio: number;
  stock: number;
  category: {
    _id: string;
    nombre: string;
    activo: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
  };
  gender?: {
    _id: string;
    nombre: string;
    fechaCreacion: string;
    fechaActualizacion: string;
  };
  image?: string;
  userId: string;
  createdAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  precio: number;
  quantity: number;
  image?: string;
}

export interface PurchaseItem {
  id: string;
  productId: string;
  name: string;
  precio: number;
  quantity: number;
  image?: string;
}

export interface Purchase {
  id: string;
  date: string;
  status: "processing" | "shipped" | "completed" | "cancelled";
  items: PurchaseItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  lastName?: string;
  phone?: string;
  addresses?: Address[];
  fechaActualizacion?: string;
}

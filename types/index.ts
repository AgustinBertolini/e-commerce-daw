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

// Tipos adaptados a la respuesta real del backend
export interface PurchaseProduct {
  _id: string;
  producto: {
    _id: string;
    nombre: string;
    precio: number;
    image?: string;
    // ...otros campos relevantes
  };
  cantidad: number;
}

export interface Purchase {
  _id: string;
  usuario: {
    _id: string;
    nombre: string;
    apellido: string;
    email: string;
    // ...otros campos relevantes
  };
  total: number;
  envio: number;
  estado: string;
  productos: PurchaseProduct[];
  fechaCreacion: string;
  fechaActualizacion: string;
  // ...otros campos si es necesario
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

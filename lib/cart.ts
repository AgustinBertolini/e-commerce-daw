import api from "@/lib/api";
import type { CartItem } from "@/types";

export async function getCart(): Promise<CartItem[]> {
  // Implementar lógica real si tienes carrito en backend
  return [];
}

export async function addToCart(
  productId: string,
  quantity: number
): Promise<void> {
  // Implementar lógica real si tienes carrito en backend
  return;
}

export async function removeFromCart(productId: string): Promise<void> {
  // Implementar lógica real si tienes carrito en backend
  return;
}

export async function clearCart(): Promise<void> {
  // Implementar lógica real si tienes carrito en backend
  return;
}

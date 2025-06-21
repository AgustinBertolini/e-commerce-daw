import api from "@/lib/api";
import type { CartItem } from "@/types";

export async function processPayment(
  items: CartItem[],
  paymentMethod: string
): Promise<{ success: boolean; orderId: string }> {
  // Aquí deberías llamar a tu endpoint de pago real si existe
  // Por ahora simula éxito
  return { success: true, orderId: "ORD-FAKE" };
}

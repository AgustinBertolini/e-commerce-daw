import api from "@/lib/api";
import type { Purchase } from "@/types";

export async function getPurchases(): Promise<Purchase[]> {
  return api.compras.getAll();
}

export async function getPurchaseById(id: string): Promise<Purchase | null> {
  try {
    return await api.compras.getById(id);
  } catch {
    return null;
  }
}

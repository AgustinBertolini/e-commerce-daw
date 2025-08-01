import { create } from "zustand";
import type { Product } from "@/types";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find(
        (item) => item.product._id === product._id
      );
      const currentQty = existing ? existing.quantity : 0;
      const newQty = currentQty + quantity;
      // No permitir agregar más que el stock disponible
      if (newQty > product.stock) {
        // Opcional: podrías mostrar un toast aquí
        return { items: state.items };
      }
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: newQty }
              : item
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    });
  },
  removeFromCart: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.product._id !== productId),
    }));
  },
  increaseQuantity: (productId) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    }));
  },
  decreaseQuantity: (productId) => {
    set((state) => ({
      items: state.items
        .map((item) =>
          item.product._id === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0),
    }));
  },
  clearCart: () => set({ items: [] }),
}));

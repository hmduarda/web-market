import { create } from "zustand";
import api from "@/lib/api";

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface CartItem {
  productId: CartProduct;
  quantity: number;
  unitPrice: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/cart");
      set({ items: data.items || [] });
    } catch {
      set({ items: [] });
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    await api.post("/cart/items", { productId, quantity });
    await get().fetchCart();
  },

  updateQuantity: async (productId, quantity) => {
    await api.put(`/cart/items/${productId}`, { quantity });
    await get().fetchCart();
  },

  removeItem: async (productId) => {
    await api.delete(`/cart/items/${productId}`);
    await get().fetchCart();
  },

  clearCart: async () => {
    await api.delete("/cart");
    set({ items: [] });
  },

  checkout: async () => {
    await api.post("/orders/checkout");
    set({ items: [] });
  },
}));

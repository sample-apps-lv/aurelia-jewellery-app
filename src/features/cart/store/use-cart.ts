import { create } from "zustand";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size?: string) => void;
  updateQty: (productId: string, qty: number, size?: string) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

const STORAGE_KEY = "aurelia-cart";

const load = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const persist = (items: CartItem[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
};

export const useCart = create<CartState>((set, get) => ({
  items: load(),
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  addItem: (item) =>
    set((s) => {
      const existing = s.items.find(
        (i) => i.productId === item.productId && i.size === item.size,
      );
      const items = existing
        ? s.items.map((i) =>
            i === existing ? { ...i, quantity: i.quantity + item.quantity } : i,
          )
        : [...s.items, item];
      persist(items);
      return { items, isOpen: true };
    }),
  removeItem: (productId, size) =>
    set((s) => {
      const items = s.items.filter(
        (i) => !(i.productId === productId && i.size === size),
      );
      persist(items);
      return { items };
    }),
  updateQty: (productId, qty, size) =>
    set((s) => {
      const items = s.items
        .map((i) =>
          i.productId === productId && i.size === size
            ? { ...i, quantity: Math.max(1, qty) }
            : i,
        );
      persist(items);
      return { items };
    }),
  clear: () => {
    persist([]);
    set({ items: [] });
  },
  subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
  count: () => get().items.reduce((s, i) => s + i.quantity, 0),
}));

import { create } from "zustand";

interface WishlistState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

const KEY = "aurelia-wishlist";
const load = () => {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
};
const persist = (ids: string[]) => {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(ids));
};

export const useWishlist = create<WishlistState>((set, get) => ({
  ids: load(),
  toggle: (id) =>
    set((s) => {
      const ids = s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id];
      persist(ids);
      return { ids };
    }),
  has: (id) => get().ids.includes(id),
}));

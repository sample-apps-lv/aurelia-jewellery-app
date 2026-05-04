import { useQuery } from "@tanstack/react-query";
import { isMock } from "@/lib/fetch-api";
import { PRODUCTS } from "../data/mock-products";
import type { Product } from "@/types/product";

const fetchProducts = async (): Promise<Product[]> => {
  if (isMock()) return Promise.resolve(PRODUCTS);
  const res = await fetch("/api/products");
  return res.json();
};

export const useProducts = () =>
  useQuery({ queryKey: ["products"], queryFn: fetchProducts });

const fetchProduct = async (slug: string): Promise<Product | undefined> => {
  if (isMock()) return PRODUCTS.find((p) => p.slug === slug);
  const res = await fetch(`/api/products/${slug}`);
  return res.json();
};

export const useProduct = (slug: string) =>
  useQuery({ queryKey: ["product", slug], queryFn: () => fetchProduct(slug), enabled: !!slug });

import { useQuery } from "@tanstack/react-query";
import { isMock } from "@/lib/fetch-api";
import { PRODUCTS } from "../data/mock-products";
import type { Product } from "@/types/product";
import { getAllProducts } from "@/lib/shopify";

const fetchProducts = async (): Promise<Product[]> => {
  if (isMock() && !import.meta.env.VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    return Promise.resolve(PRODUCTS);
  }
  return getAllProducts();
};

export const useProducts = () =>
  useQuery({ queryKey: ["products"], queryFn: fetchProducts });

const fetchProduct = async (slug: string): Promise<Product | undefined> => {
  const allProducts = await fetchProducts();
  return allProducts.find((p) => p.slug === slug);
};

export const useProduct = (slug: string) =>
  useQuery({ queryKey: ["product", slug], queryFn: () => fetchProduct(slug), enabled: !!slug });

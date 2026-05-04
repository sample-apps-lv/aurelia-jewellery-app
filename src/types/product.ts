export type Material = "Gold" | "Silver" | "Platinum" | "Rose Gold";
export type Gemstone = "Diamond" | "Ruby" | "Emerald" | "Sapphire" | "None";
export type Category = "rings" | "necklaces" | "earrings" | "bracelets" | "bridal";
export type Occasion = "Everyday" | "Bridal" | "Gifting" | "Statement";

export interface Product {
  id: string;
  slug: string;
  title: string;
  category: Category;
  price: number; // cents
  images: string[];
  material: Material;
  gemstone: Gemstone;
  occasion: Occasion;
  isBestseller?: boolean;
  isNew?: boolean;
  carat?: number;
  cut?: string;
  clarity?: string;
  description: string;
  rating: number;
  reviewCount: number;
  sizes?: string[];
  stock: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  body: string;
}

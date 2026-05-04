import type { Product, Review } from "@/types/product";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";
import p4 from "@/assets/p4.jpg";
import p5 from "@/assets/p5.jpg";
import p6 from "@/assets/p6.jpg";

export const PRODUCTS: Product[] = [
  {
    id: "1", slug: "celeste-solitaire-ring", title: "Celeste Solitaire Ring",
    category: "rings", price: 489000, images: [p1, p2],
    material: "Gold", gemstone: "Diamond", occasion: "Bridal",
    isBestseller: true, isNew: false, carat: 1.2, cut: "Brilliant", clarity: "VVS1",
    description: "A timeless solitaire featuring a brilliant-cut diamond set in 18k yellow gold. Hand-finished by master artisans.",
    rating: 4.9, reviewCount: 128, sizes: ["5", "6", "7", "8"], stock: 4,
  },
  {
    id: "2", slug: "lumiere-pendant", title: "Lumière Pendant",
    category: "necklaces", price: 129000, images: [p2, p1],
    material: "Gold", gemstone: "Diamond", occasion: "Everyday",
    isBestseller: true, carat: 0.25, cut: "Round", clarity: "VS1",
    description: "A whisper of light. Delicate gold chain with a single brilliant-cut diamond pendant.",
    rating: 4.8, reviewCount: 86, stock: 12,
  },
  {
    id: "3", slug: "estelle-stud-earrings", title: "Estelle Stud Earrings",
    category: "earrings", price: 219000, images: [p3, p1],
    material: "Platinum", gemstone: "Diamond", occasion: "Everyday",
    isBestseller: true, carat: 0.5, cut: "Round", clarity: "VVS2",
    description: "Classic four-prong diamond studs in polished platinum. Effortless every day.",
    rating: 5.0, reviewCount: 204, stock: 8,
  },
  {
    id: "4", slug: "aurelia-tennis-bracelet", title: "Aurelia Tennis Bracelet",
    category: "bracelets", price: 689000, images: [p4, p2],
    material: "Gold", gemstone: "Diamond", occasion: "Statement",
    isBestseller: true, carat: 3.0, cut: "Round", clarity: "VS1",
    description: "An unbroken line of brilliance. Forty-two diamonds set in 18k gold.",
    rating: 4.9, reviewCount: 47, stock: 3,
  },
  {
    id: "5", slug: "verdant-emerald-ring", title: "Verdant Emerald Ring",
    category: "rings", price: 359000, images: [p5, p1],
    material: "Gold", gemstone: "Emerald", occasion: "Statement",
    isNew: true, carat: 2.1, cut: "Emerald", clarity: "VS",
    description: "A vivid Colombian emerald cradled in 18k gold. Bold, regal, unforgettable.",
    rating: 4.7, reviewCount: 31, sizes: ["5", "6", "7", "8"], stock: 2,
  },
  {
    id: "6", slug: "scarlet-ruby-pendant", title: "Scarlet Ruby Pendant",
    category: "necklaces", price: 279000, images: [p6, p2],
    material: "Rose Gold", gemstone: "Ruby", occasion: "Gifting",
    isNew: true, carat: 1.4, cut: "Pear", clarity: "VS",
    description: "A pear-cut ruby set in warm rose gold. A modern heirloom.",
    rating: 4.8, reviewCount: 22, stock: 6,
  },
];

export const REVIEWS: Review[] = [
  { id: "r1", author: "Eleanor V.", rating: 5, date: "2 weeks ago", body: "Absolutely breathtaking. Even more beautiful in person. Packaging felt like a gift in itself." },
  { id: "r2", author: "Marcus L.", rating: 5, date: "1 month ago", body: "Bought this for our anniversary. The craftsmanship is impeccable." },
  { id: "r3", author: "Sophia R.", rating: 4, date: "2 months ago", body: "Stunning piece. The fit was perfect and it sparkles in any light." },
];

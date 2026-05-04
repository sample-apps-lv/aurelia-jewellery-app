import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/features/cart/store/use-cart";
import { useWishlist } from "@/features/wishlist/store/use-wishlist";
import { cn } from "@/lib/utils";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCart((s) => s.addItem);
  const toggle = useWishlist((s) => s.toggle);
  const inWishlist = useWishlist((s) => s.has(product.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative overflow-hidden bg-secondary aspect-[4/5]">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
          )}
          {product.isNew && (
            <span className="absolute top-3 left-3 text-[10px] tracking-luxe bg-background/90 px-2 py-1">New</span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-background transition"
            aria-label="Wishlist"
          >
            <Heart className={cn("h-4 w-4", inWishlist && "fill-gold text-gold")} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem({
                productId: product.id,
                title: product.title,
                image: product.images[0],
                price: product.price,
                quantity: 1,
                size: product.sizes?.[0],
              });
            }}
            className="absolute bottom-0 inset-x-0 bg-noir text-cream py-3 text-xs tracking-luxe translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
          </button>
        </div>
        <div className="pt-4 space-y-1">
          <h3 className="font-serif text-lg leading-tight">{product.title}</h3>
          <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </motion.div>
  );
}

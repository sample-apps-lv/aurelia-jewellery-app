import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/features/cart/store/use-cart";
import { useWishlist } from "@/features/wishlist/store/use-wishlist";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const addItem = useCart((s) => s.addItem);
  const toggle = useWishlist((s) => s.toggle);
  const inWishlist = useWishlist((s) => s.has(product.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group bg-white border border-transparent hover:border-border hover:shadow-lg transition-all"
    >
      <Link to="/product/$slug" params={{ slug: product.slug }} className="block">
        <div className="relative overflow-hidden aspect-[4/5] bg-slate-50">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {product.isNew && (
            <Badge className="absolute top-3 left-3 bg-destructive text-white border-none rounded-sm px-2 text-[10px]">NEW</Badge>
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.preventDefault();
                toggle(product.id);
              }}
              className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:text-gold transition"
            >
              <Heart className={cn("h-4 w-4", inWishlist && "fill-gold text-gold")} />
            </button>
            <button
              className="h-8 w-8 rounded-full bg-white shadow-md flex items-center justify-center hover:text-gold transition"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          <div className="absolute bottom-0 inset-x-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform bg-white/90 backdrop-blur-sm">
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
              className="w-full bg-primary text-white py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="text-[10px] font-bold text-muted-foreground">4.8 (120)</span>
          </div>
          <h3 className="text-sm font-semibold truncate text-foreground group-hover:text-primary transition-colors">
            {product.title}
          </h3>
          {/* <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price * 1.2)}</span>
          </div> */}
          <p className="text-[10px] font-bold text-gold mt-2 uppercase tracking-tighter flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-gold rounded-full" /> Try at Home Available
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

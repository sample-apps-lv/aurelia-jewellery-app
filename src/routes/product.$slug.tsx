import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import { useProduct } from "@/features/catalog/api/use-products";
import { REVIEWS } from "@/features/catalog/data/mock-products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/features/cart/store/use-cart";
import { useWishlist } from "@/features/wishlist/store/use-wishlist";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Aurelia` },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="pt-40 text-center px-6">
      <h1 className="font-serif text-4xl">Piece not found</h1>
      <Link to="/catalog/rings" className="text-xs tracking-luxe text-gold mt-6 inline-block border-b border-gold pb-1">
        Browse the Collection
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useProduct(slug);
  const [activeImg, setActiveImg] = useState(0);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [zoom, setZoom] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const addItem = useCart((s) => s.addItem);
  const toggle = useWishlist((s) => s.toggle);
  const inWishlist = useWishlist((s) => product ? s.has(product.id) : false);

  if (isLoading) return <div className="pt-40 text-center text-muted-foreground">Loading…</div>;
  if (!product) throw notFound();

  const handleAdd = () => {
    if (product.sizes && !size) {
      toast.error("Please select a size.");
      return;
    }
    addItem({
      productId: product.id,
      title: product.title,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      size,
    });
    toast.success("Added to your bag.");
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="space-y-4">
          <div
            className="relative aspect-square bg-secondary overflow-hidden cursor-zoom-in"
            onMouseEnter={() => setZoom(true)}
            onMouseLeave={() => setZoom(false)}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
          >
            <img
              src={product.images[activeImg]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-300"
              style={zoom ? { transform: "scale(1.8)", transformOrigin: `${pos.x}% ${pos.y}%` } : {}}
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "aspect-square bg-secondary overflow-hidden border transition",
                  activeImg === i ? "border-gold" : "border-transparent",
                )}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs tracking-luxe text-gold mb-4">{product.material} · {product.gemstone}</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-4">{product.title}</h1>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn("h-4 w-4", i < Math.round(product.rating) ? "fill-gold text-gold" : "text-muted-foreground")} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
          </div>
          <p className="text-2xl font-light mb-8">{formatPrice(product.price)}</p>
          <p className="text-muted-foreground leading-relaxed mb-8">{product.description}</p>

          {product.sizes && (
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-xs tracking-luxe">Size</label>
                <button className="text-xs tracking-luxe text-gold hover:underline">Size Guide</button>
              </div>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger className="rounded-none h-12">
                  <SelectValue placeholder="Select your size" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((s) => (
                    <SelectItem key={s} value={s}>Size {s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAdd}
              className="flex-1 bg-noir text-cream py-4 text-xs tracking-luxe hover:bg-foreground transition flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" /> Add to Bag
            </button>
            <button
              onClick={() => toggle(product.id)}
              className="h-[52px] w-[52px] border border-border flex items-center justify-center hover:border-gold transition"
              aria-label="Wishlist"
            >
              <Heart className={cn("h-5 w-5", inWishlist && "fill-gold text-gold")} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center mb-8 py-6 border-y border-border">
            <div className="space-y-1"><Truck className="h-4 w-4 mx-auto text-gold" /><p className="text-[10px] tracking-luxe">Free Shipping</p></div>
            <div className="space-y-1"><RotateCcw className="h-4 w-4 mx-auto text-gold" /><p className="text-[10px] tracking-luxe">30-Day Returns</p></div>
            <div className="space-y-1"><ShieldCheck className="h-4 w-4 mx-auto text-gold" /><p className="text-[10px] tracking-luxe">Lifetime Warranty</p></div>
          </div>

          <Accordion type="multiple" defaultValue={["details"]} className="border-t border-border">
            <AccordionItem value="details">
              <AccordionTrigger className="text-xs tracking-luxe">Details</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Hand-finished in our Paris atelier. Each piece is signed and numbered.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="specs">
              <AccordionTrigger className="text-xs tracking-luxe">Specifications</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground space-y-2">
                {product.carat && <p>Carat: {product.carat}</p>}
                {product.cut && <p>Cut: {product.cut}</p>}
                {product.clarity && <p>Clarity: {product.clarity}</p>}
                <p>Material: {product.material}</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care">
              <AccordionTrigger className="text-xs tracking-luxe">Care Instructions</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                Store in the velvet pouch provided. Clean gently with a soft, lint-free cloth. Avoid contact with perfume and chlorine.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </motion.div>
      </div>

      {/* Reviews */}
      <section className="max-w-4xl mx-auto px-6 lg:px-10 mt-28">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-12">What our clients say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {REVIEWS.map((r) => (
            <div key={r.id} className="border border-border p-6 space-y-3">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-gold text-gold" : "text-muted-foreground")} />
                ))}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground italic">"{r.body}"</p>
              <p className="text-xs tracking-luxe pt-2 border-t border-border">{r.author} · {r.date}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

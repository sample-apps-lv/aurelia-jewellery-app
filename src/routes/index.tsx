import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import catBridal from "@/assets/cat-bridal.jpg";
import catEveryday from "@/assets/cat-everyday.jpg";
import catStatement from "@/assets/cat-statement.jpg";
import { useProducts } from "@/features/catalog/api/use-products";
import { ProductCard } from "@/features/catalog/components/product-card";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelia — Timeless Fine Jewelry" },
      { name: "description", content: "Discover Aurelia: handcrafted gold and diamond jewelry, made for the moments that endure." },
      { property: "og:title", content: "Aurelia — Timeless Fine Jewelry" },
    ],
  }),
  component: Index,
});

const COLLECTIONS = [
  { title: "The Bridal Collection", caption: "Vows in Light", image: catBridal, to: "/catalog/bridal" },
  { title: "Everyday Elegance", caption: "Worn Daily, Treasured Always", image: catEveryday, to: "/catalog/necklaces" },
  { title: "Statement Pieces", caption: "Bold by Design", image: catStatement, to: "/catalog/earrings" },
];

function Index() {
  const { data: products = [] } = useProducts();
  const bestsellers = products.filter((p) => p.isBestseller);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen min-h-[700px] -mt-20 flex items-center justify-center text-cream overflow-hidden">
        <img src={hero} alt="" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-b from-noir/60 via-noir/30 to-noir/80" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-6 max-w-3xl"
        >
          <p className="text-xs tracking-luxe text-gold mb-6">Autumn / Winter Collection</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] mb-6">
            Light, <em className="italic text-gold-gradient">Eternal</em>.
          </h1>
          <p className="text-base md:text-lg text-cream/80 max-w-xl mx-auto mb-10 font-light">
            Handcrafted in our Paris atelier. Designed for the moments that outlast time.
          </p>
          <Link
            to="/catalog/rings"
            className="inline-flex items-center gap-3 bg-gold text-noir px-8 py-4 text-xs tracking-luxe hover:bg-gold-light transition-all hover:gap-5"
          >
            Shop the Collection <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-cream/60 text-[10px] tracking-luxe"
        >
          Scroll
        </motion.div>
      </section>

      {/* Brand strip */}
      <section className="py-20 px-6 lg:px-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-luxe text-gold mb-4">Maison Aurelia</p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight">
            Three generations of artisans, one enduring philosophy: jewelry should be felt before it is seen.
          </h2>
        </motion.div>
      </section>

      {/* Collections grid */}
      <section className="px-6 lg:px-10 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {COLLECTIONS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <Link to={c.to} className="group block relative overflow-hidden aspect-[3/4]">
                <img src={c.image} alt={c.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-noir/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-cream">
                  <p className="text-xs tracking-luxe text-gold mb-2">{c.caption}</p>
                  <h3 className="font-serif text-2xl md:text-3xl">{c.title}</h3>
                  <span className="inline-block mt-3 text-xs tracking-luxe border-b border-cream/40 pb-1 group-hover:border-gold group-hover:text-gold transition">
                    Explore
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="px-6 lg:px-10 max-w-7xl mx-auto mt-32">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-luxe text-gold mb-3">Loved by All</p>
            <h2 className="font-serif text-4xl md:text-5xl">Bestsellers</h2>
          </div>
          <Link to="/catalog/rings" className="text-xs tracking-luxe hover:text-gold border-b border-foreground hover:border-gold pb-1 hidden md:inline-block">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {bestsellers.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Editorial quote */}
      <section className="mt-32 py-32 bg-noir text-cream text-center px-6">
        <motion.blockquote
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 1.2 }}
          className="max-w-3xl mx-auto font-serif text-3xl md:text-5xl italic leading-tight"
        >
          "A piece of Aurelia is never simply worn — it is <span className="text-gold-gradient not-italic">inherited</span>."
        </motion.blockquote>
        <p className="mt-8 text-xs tracking-luxe text-cream/60">— Vogue Paris</p>
      </section>
    </>
  );
}
